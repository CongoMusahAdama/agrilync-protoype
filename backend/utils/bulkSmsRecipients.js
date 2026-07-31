const Farmer = require('../models/Farmer');
const Agent = require('../models/Agent');
const Subscriber = require('../models/Subscriber');
const WebinarRegistrant = require('../models/WebinarRegistrant');
const { normalizePhone } = require('./smsService');

const VALID_GROUPS = ['all', 'farmers', 'agents', 'investors', 'growers', 'webinar'];
const VALID_CHANNELS = ['sms', 'email', 'both'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hasValidPhone = (phone) => {
    const normalized = normalizePhone(phone);
    return normalized.length >= 12;
};

const hasValidEmail = (email) => EMAIL_REGEX.test(String(email || '').trim().toLowerCase());

const toRecipient = (record) => ({
    id: String(record._id || record.id),
    name: record.name || record.fullName || 'Friend',
    phone: normalizePhone(record.phone || record.contact || record.phoneNumber || ''),
    email: String(record.email || '').trim().toLowerCase(),
    type: record.type || 'farmer',
    meta: record.meta || {},
});

const dedupeRecipients = (recipients) => {
    const seen = new Set();
    return recipients.filter((r) => {
        const key = r.id || `${r.email}|${r.phone}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const dedupeByPhone = (recipients) => {
    const seen = new Set();
    return recipients.filter((r) => {
        if (!hasValidPhone(r.phone) || seen.has(r.phone)) return false;
        seen.add(r.phone);
        return true;
    });
};

const dedupeByEmail = (recipients) => {
    const seen = new Set();
    return recipients.filter((r) => {
        if (!hasValidEmail(r.email) || seen.has(r.email)) return false;
        seen.add(r.email);
        return true;
    });
};

const filterByChannel = (recipients, channel = 'both') => {
    if (channel === 'sms') return recipients.filter((r) => hasValidPhone(r.phone));
    if (channel === 'email') return recipients.filter((r) => hasValidEmail(r.email));
    return recipients.filter((r) => hasValidPhone(r.phone) || hasValidEmail(r.email));
};

const countReachable = (recipients) => ({
    sms: recipients.filter((r) => hasValidPhone(r.phone)).length,
    email: recipients.filter((r) => hasValidEmail(r.email)).length,
    total: dedupeRecipients(recipients).length,
});

async function fetchFarmers() {
    const farmers = await Farmer.find({
        $or: [
            { contact: { $exists: true, $nin: [null, '', 'null'] } },
            { email: { $exists: true, $nin: [null, ''] } },
        ],
    })
        .select('name contact email')
        .lean();

    return farmers.map((f) => toRecipient({ ...f, phone: f.contact, type: 'farmer' }));
}

async function fetchAgents() {
    const agents = await Agent.find({
        $or: [
            { contact: { $exists: true, $nin: [null, '', 'null'] } },
            { email: { $exists: true, $nin: [null, ''] } },
        ],
        role: { $in: ['agent', 'supervisor'] },
        status: 'active',
    })
        .select('name contact email')
        .lean();

    return agents.map((a) => toRecipient({ ...a, phone: a.contact, type: 'agent' }));
}

async function fetchGrowers() {
    return fetchFarmers().then((rows) => rows.map((r) => ({ ...r, type: 'grower' })));
}

async function fetchSubscribers() {
    const subscribers = await Subscriber.find({
        phone: { $exists: true, $nin: [null, ''] },
    })
        .select('name email phone source')
        .lean();

    return subscribers
        .filter((s) => hasValidPhone(s.phone))
        .map((s) =>
            toRecipient({
                ...s,
                name: s.name?.trim() || s.email?.split('@')[0] || 'Subscriber',
                type: 'subscriber',
            })
        );
}

async function fetchInvestors() {
    return fetchSubscribers();
}

async function fetchWebinarRegistrants(webinarId) {
    const query = webinarId ? { webinarId: Number(webinarId) } : {};
    const registrants = await WebinarRegistrant.find(query)
        .sort({ createdAt: -1 })
        .lean();

    return registrants.map((r) =>
        toRecipient({
            ...r,
            type: 'webinar',
            meta: {
                event: r.webinarTitle,
                date: r.createdAt,
            },
        })
    );
}

async function resolveRecipientsByGroup(group, options = {}) {
    const normalizedGroup = VALID_GROUPS.includes(group) ? group : 'webinar';
    const channel = VALID_CHANNELS.includes(options.channel) ? options.channel : 'both';

    let recipients = [];

    if (normalizedGroup === 'farmers') recipients = await fetchFarmers();
    else if (normalizedGroup === 'agents') recipients = await fetchAgents();
    else if (normalizedGroup === 'growers') recipients = await fetchGrowers();
    else if (normalizedGroup === 'investors') recipients = await fetchInvestors();
    else if (normalizedGroup === 'webinar') recipients = await fetchWebinarRegistrants(options.webinarId);
    else {
        const [farmers, agents, webinar] = await Promise.all([
            fetchFarmers(),
            fetchAgents(),
            fetchWebinarRegistrants(options.webinarId),
        ]);
        recipients = dedupeRecipients([...farmers, ...agents, ...webinar]);
    }

    recipients = filterByChannel(dedupeRecipients(recipients), channel);

    // Every bulk SMS also reaches newsletter subscribers with a valid phone
    if (channel === 'sms' && options.includeSubscribers !== false) {
        const subscribers = await fetchSubscribers();
        recipients = dedupeByPhone([...recipients, ...subscribers]);
    }

    return recipients;
}

async function getGroupCounts() {
    const groups = ['all', 'farmers', 'agents', 'growers', 'investors', 'webinar'];
    const counts = {};
    const subscribers = await fetchSubscribers();
    counts.subscribers = subscribers.length;

    await Promise.all(
        groups.map(async (group) => {
            const recipients = await resolveRecipientsByGroup(group, { channel: 'sms' });
            counts[group] = recipients.length;
        })
    );

    return counts;
}

module.exports = {
    VALID_GROUPS,
    VALID_CHANNELS,
    resolveRecipientsByGroup,
    getGroupCounts,
    fetchWebinarRegistrants,
    fetchSubscribers,
    dedupeRecipients,
    dedupeByPhone,
    dedupeByEmail,
    filterByChannel,
    toRecipient,
    hasValidPhone,
    hasValidEmail,
    countReachable,
};
