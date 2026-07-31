const SmsCampaign = require('../models/SmsCampaign');
const { sendBulkSMS, normalizePhone } = require('../utils/smsService');
const {
    resolveRecipientsByGroup,
    getGroupCounts,
    dedupeByPhone,
    hasValidPhone,
    fetchSubscribers,
} = require('../utils/bulkSmsRecipients');

const GROUP_LABELS = {
    all: 'All Platform Users',
    farmers: 'Registered Farmers',
    agents: 'Field Agents',
    investors: 'Investors',
    growers: 'Lync Growers',
    webinar: 'Webinar Registrants',
};

const personalizeMessage = (template, recipient, extras = {}) => {
    const eventName = extras.event || recipient.meta?.event || 'AgriLync Webinar';
    const eventDate = extras.date || recipient.meta?.date || '';
    const formattedDate = eventDate
        ? new Date(eventDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : extras.dateLabel || 'soon';

    return String(template)
        .replace(/{name}/g, recipient.name || 'Friend')
        .replace(/{farmer_name}/g, recipient.name || 'Grower')
        .replace(/{agent_name}/g, extras.agentName || 'AgriLync')
        .replace(/{date}/g, formattedDate)
        .replace(/{link}/g, extras.link || process.env.WEBINAR_JOIN_LINK || 'https://agrilync.com/blog#upcoming-webinars')
        .replace(/{event}/g, eventName);
};

// @route   GET /api/sms/recipients
exports.getRecipients = async (req, res) => {
    try {
        const group = req.query.group || 'webinar';
        const recipients = await resolveRecipientsByGroup(group, {
            webinarId: req.query.webinarId,
            channel: 'sms',
        });

        res.json(recipients.slice(0, 500));
    } catch (err) {
        console.error('getRecipients error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load recipients.' });
    }
};

// @route   GET /api/sms/group-counts
exports.getGroupCounts = async (_req, res) => {
    try {
        const counts = await getGroupCounts();
        res.json(counts);
    } catch (err) {
        console.error('getGroupCounts error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load group counts.' });
    }
};

// @route   GET /api/sms/campaigns
exports.getCampaigns = async (_req, res) => {
    try {
        const campaigns = await SmsCampaign.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        res.json(
            campaigns.map((c) => ({
                id: String(c._id),
                title: c.title,
                message: c.message,
                recipients: c.recipients,
                sent: c.sent,
                failed: c.failed,
                status: c.status,
                createdAt: c.createdAt,
                group: GROUP_LABELS[c.group] || c.group,
            }))
        );
    } catch (err) {
        console.error('getCampaigns error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load campaigns.' });
    }
};

// @route   POST /api/sms/bulk
exports.sendBulkCampaign = async (req, res) => {
    const { title, message, group = 'webinar', phones = [], event, date, link } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({ success: false, message: 'Campaign title is required.' });
    }
    if (!message?.trim()) {
        return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    try {
        let recipients = [];

        const customPhones = (Array.isArray(phones) ? phones : [])
            .map((p) => normalizePhone(String(p).trim()))
            .filter((p) => p.length >= 12);

        if (customPhones.length > 0) {
            recipients = dedupeByPhone(
                customPhones.map((phone, index) => ({
                    id: `custom-${index}`,
                    name: 'Friend',
                    phone,
                    type: group,
                    meta: {},
                }))
            );
            if (group !== 'investors') {
                const subscribers = await fetchSubscribers();
                recipients = dedupeByPhone([...recipients, ...subscribers]);
            }
        } else {
            recipients = await resolveRecipientsByGroup(group, { channel: 'sms' });
        }

        const smsRecipients = recipients.filter((r) => hasValidPhone(r.phone));

        if (!smsRecipients.length) {
            return res.status(400).json({
                success: false,
                message:
                    group === 'webinar'
                        ? 'No webinar registrants with valid phone numbers found. Ask registrants to include a phone number when signing up.'
                        : 'No recipients with valid phone numbers found for this group.',
            });
        }

        const extras = {
            event,
            date,
            link,
            agentName: req.agent?.name || 'AgriLync',
        };

        const personalizedSms = smsRecipients.map((r) => ({
            phone: r.phone,
            name: r.name,
            body: personalizeMessage(message.trim(), r, extras),
        }));

        const broadcastResult = await sendBulkSMS(personalizedSms, message.trim(), {
            agentName: extras.agentName,
            usePrebuiltBody: true,
        });

        const sent = broadcastResult.succeeded || 0;
        const failed = broadcastResult.failed ?? smsRecipients.length - sent;
        const status = sent === 0 ? 'failed' : failed > 0 ? 'partial' : 'sent';

        const campaign = await SmsCampaign.create({
            title: title.trim(),
            message: message.trim(),
            group,
            channel: 'sms',
            recipients: smsRecipients.length,
            sent,
            smsSent: sent,
            emailSent: 0,
            failed,
            status,
            createdBy: req.agent?._id || req.agent?.id,
        });

        if (sent === 0 && !broadcastResult.simulated) {
            return res.status(502).json({
                success: false,
                message: 'SMS could not be delivered. Check mNotify configuration and recipient phone numbers.',
                campaign: {
                    id: String(campaign._id),
                    recipients: smsRecipients.length,
                    sent,
                    failed,
                    status,
                },
            });
        }

        return res.json({
            success: true,
            message: broadcastResult.simulated
                ? `Simulated SMS to ${sent} recipient(s) via mNotify (API key missing on server).`
                : `Campaign sent to ${sent} of ${smsRecipients.length} recipient(s) via mNotify.`,
            campaign: {
                id: String(campaign._id),
                title: campaign.title,
                message: campaign.message,
                recipients: campaign.recipients,
                sent: campaign.sent,
                failed: campaign.failed,
                status: campaign.status,
                createdAt: campaign.createdAt,
                group: GROUP_LABELS[group] || group,
            },
            data: broadcastResult,
        });
    } catch (err) {
        console.error('sendBulkCampaign error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send bulk SMS. Please try again.',
        });
    }
};
