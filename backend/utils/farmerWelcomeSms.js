const { sendSMS } = require('./smsService');

const firstName = (name) => {
    const trimmed = (name || 'Grower').trim();
    return trimmed.split(/\s+/)[0] || 'Grower';
};

/** AgriLync grower ID (LYG-…) — same as on the farmer ID card */
const resolveGrowerId = (farmer) => {
    if (farmer?.id && String(farmer.id).trim()) return String(farmer.id).trim();
    if (farmer?.ghanaCardNumber) {
        const card = String(farmer.ghanaCardNumber).trim().toUpperCase();
        return card.startsWith('LYG-') ? card : `LYG-${card}`;
    }
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
 * Build a polite welcome SMS for new growers (agent-led or self-registration).
 */
exports.buildFarmerWelcomeSms = ({ farmer, agent, onboardingSource = 'agent' }) => {
    const name = firstName(farmer?.name);
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
            `Hello ${name}, welcome to AgriLync!` +
            `${growerIdLine} Your grower profile is now active.` +
            ` Field Agent: ${agentLabel}.${contactLine}` +
            ` Thank you for farming with us.`
        );
    }

    return (
        `Hello ${name}, welcome to AgriLync!` +
        `${growerIdLine} Thank you for registering.` +
        ` Your profile is received and pending verification.` +
        ` We will SMS you once it is approved. Thank you.`
    );
};

exports.resolveGrowerId = resolveGrowerId;

/**
 * Send welcome SMS after successful onboarding (non-blocking for API handlers).
 */
exports.sendFarmerWelcomeSms = async (farmer, options = {}) => {
    if (!farmer?.contact) {
        return { success: false, skipped: true, reason: 'no_phone' };
    }

    const onboardingSource =
        options.onboardingSource || farmer.onboardingSource || 'agent';

    const message = exports.buildFarmerWelcomeSms({
        farmer,
        agent: options.agent,
        onboardingSource,
    });

    return sendSMS(farmer.contact, message);
};
