const { dispatchBulkGrowerSms } = require('./bulkGrowerSms');

const { isValidGrowerSystemId } = require('./generateGrowerId');

/** AgriLync grower ID (LYG-########) — same as on the farmer ID card; never Ghana Card. */
const resolveGrowerId = (farmer) => {
    const id = farmer?.id ? String(farmer.id).trim().toUpperCase() : '';
    if (id && isValidGrowerSystemId(id)) return id;
    if (id && id.startsWith('LYG-') && !id.includes('GHA')) return id;
    return '';
};

/** Local Ghana display format (0XX…) for farmers to call their agent */
const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    let digits = String(phone).replace(/[\s\-().+]/g, '');
    if (digits.startsWith('233') && digits.length >= 12) digits = `0${digits.slice(3)}`;
    return digits;
};

/**
 * Build welcome SMS (bulk template — uses {farmer_name} / {agent_name} placeholders).
 */
exports.buildFarmerWelcomeSms = ({ farmer, agent, onboardingSource = 'agent' }) => {
    const growerId = resolveGrowerId(farmer);
    const growerIdLine = growerId ? ` Your Grower ID is ${growerId}.` : '';

    if (onboardingSource === 'agent' && agent) {
        const agentName = (agent.name || 'your field agent').trim();
        const agentPhone = formatPhoneDisplay(agent.contact);
        const agentId = agent.agentId || farmer?.onboardingAgentId;
        const agentLabel = agentId ? `${agentName} (${agentId})` : agentName;
        const contactLine = agentPhone
            ? ` Call or WhatsApp ${agentPhone} if you need help.`
            : ' Your agent will be in touch with you soon.';

        return (
            `Hello {farmer_name}, welcome to AgriLync!` +
            `${growerIdLine} Your grower profile is now active.` +
            ` Field Agent: ${agentLabel}.${contactLine}` +
            ` Thank you for farming with us.`
        );
    }

    return (
        `Hello {farmer_name}, welcome to AgriLync!` +
        `${growerIdLine} Thank you for registering.` +
        ` Your profile is received and pending verification.` +
        ` We will SMS you once it is approved. Thank you.`
    );
};

exports.resolveGrowerId = resolveGrowerId;

/**
 * Send welcome SMS via the shared mNotify bulk pipeline after onboarding.
 */
exports.sendFarmerWelcomeSms = async (farmer, options = {}) => {
    const contact = farmer?.contact ? String(farmer.contact).trim() : '';
    if (!contact || contact.toLowerCase() === 'null') {
        console.warn('[Welcome SMS] Skipped — no phone on grower record:', farmer?._id?.toString?.() || farmer?._id);
        return {
            success: false,
            sent: false,
            skipped: true,
            reason: 'no_phone',
            message: 'Grower has no valid phone number on file.',
            succeeded: 0,
        };
    }

    const onboardingSource =
        options.onboardingSource || farmer.onboardingSource || 'agent';

    const message = exports.buildFarmerWelcomeSms({
        farmer,
        agent: options.agent,
        onboardingSource,
    });

    const agentId = options.agent?._id || options.agent?.id || farmer?.agent;

    const result = await dispatchBulkGrowerSms({
        farmerIds: farmer._id ? [farmer._id] : [],
        farmers: [{ name: farmer.name, contact, _id: farmer._id }],
        agentId,
        message,
        agentName: options.agent?.name || 'AgriLync Agent',
        requireAgentOwnership: false,
    });

    if (!result.sent) {
        console.error(
            '[Welcome SMS] Delivery failed:',
            result.message,
            '| grower:',
            farmer?._id?.toString?.(),
            '| phone:',
            contact
        );
    } else {
        console.log(
            `[Welcome SMS] mNotify bulk SMS queued for ${farmer.name} (${result.succeeded}/${result.total})`
        );
    }

    return {
        ...result,
        skipped: false,
    };
};
