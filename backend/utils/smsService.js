/**
 * smsService.js — mNotify SMS Integration
 * 
 * SMS: Uses mNotify exclusively for critical alerts to rural farmers and agent MFA.
 */
const axios = require('axios');

/** Normalize Ghana numbers for mNotify (e.g. 024… → 23324…) */
const normalizePhone = (phone) => {
    if (!phone) return '';
    let digits = String(phone).replace(/[\s\-().+]/g, '');
    if (digits.startsWith('0')) digits = `233${digits.slice(1)}`;
    else if (!digits.startsWith('233')) digits = `233${digits}`;
    return digits;
};

/**
 * Send a pure SMS notification using mNotify
 * @param {string} to - Recipient phone number
 * @param {string} body - The message text
 */
exports.sendSMS = async (to, body) => {
    if (!to || !body) throw new Error('Recipient phone and message body are required.');

    const MNOTIFY_API_KEY = process.env.MNOTIFY_API_KEY;
    const SENDER_ID = process.env.MNOTIFY_SENDER_ID || 'AgriLync';
    const recipient = normalizePhone(to);

    if (!recipient || recipient.length < 12) {
        return { success: false, error: 'Invalid phone number' };
    }

    // Fallback if API key is missing
    if (!MNOTIFY_API_KEY) {
        console.warn(`[mNotify SIMULATION] To ${recipient} (Sender: ${SENDER_ID}): ${body} (API key missing in .env)`);
        return {
            success: true,
            simulated: true,
            channel: 'console',
            sid: 'SIM_' + Date.now()
        };
    }

    try {
        console.log(`[mNotify] Dispatching SMS to: ${recipient}`);
        const response = await axios.post(`https://api.mnotify.com/api/sms/quick?key=${MNOTIFY_API_KEY}`, {
            recipient: [recipient],
            sender: SENDER_ID,
            message: body,
            is_schedule: false,
            schedule_date: ''
        });

        if (response.data?.code === '2000') {
             console.log(`[mNotify] Delivery Successful to ${to}`);
             return { success: true, channel: 'mnotify', data: response.data };
        } else {
             console.error(`[mNotify] API Error: ${response.data?.message || 'Unknown Error'}`);
             return { success: false, error: response.data?.message };
        }

    } catch (err) {
        console.error('[mNotify] Network/API Error:', err.response?.data || err.message);
        return { success: false, error: err.message };
    }
};

/**
 * Send bulk SMS using mNotify
 * @param {Array<{phone: string, name: string}>} recipients
 * @param {string} template - Message body with {farmer_name} placeholder
 */
exports.sendBulkSMS = async (recipients, template, options = {}) => {
    if (!Array.isArray(recipients) || recipients.length === 0) {
        return { success: false, total: 0, succeeded: 0, failed: 0 };
    }

    const agentName = options.agentName || 'AgriLync Agent';
    console.log(`[mNotify BULK] Dispatching to ${recipients.length} recipients via mNotify.`);

    const results = await Promise.allSettled(
        recipients.map(async (r) => {
            const body = String(template)
                .replace(/{farmer_name}/g, r.name || 'Grower')
                .replace(/{agent_name}/g, agentName);
            return exports.sendSMS(r.phone, body);
        })
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled' && r.value?.success).length;
    const simulated = results.some(
        (r) => r.status === 'fulfilled' && r.value?.simulated
    );

    return {
        success: succeeded > 0,
        total: recipients.length,
        succeeded,
        failed: recipients.length - succeeded,
        simulated,
        channel: 'mnotify',
    };
};

exports.normalizePhone = normalizePhone;
