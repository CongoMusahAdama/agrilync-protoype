/**
 * smsService.js — mNotify SMS Integration
 * 
 * SMS: Uses mNotify exclusively for critical alerts to rural farmers and agent MFA.
 */
const axios = require('axios');

/**
 * Send a pure SMS notification using mNotify
 * @param {string} to - Recipient phone number
 * @param {string} body - The message text
 */
exports.sendSMS = async (to, body) => {
    if (!to || !body) throw new Error('Recipient phone and message body are required.');

    const MNOTIFY_API_KEY = process.env.MNOTIFY_API_KEY;
    const SENDER_ID = process.env.MNOTIFY_SENDER_ID || 'AgriLync';

    // Fallback if API key is missing
    if (!MNOTIFY_API_KEY) {
        console.warn(`[mNotify SIMULATION] To ${to} (Sender: ${SENDER_ID}): ${body} (API key missing in .env)`);
        return {
            success: true,
            simulated: true,
            channel: 'console',
            sid: 'SIM_' + Date.now()
        };
    }

    try {
        console.log(`[mNotify] Dispatching SMS to: ${to}`);
        const response = await axios.post(`https://api.mnotify.com/api/sms/quick?key=${MNOTIFY_API_KEY}`, {
            recipient: [to],
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
exports.sendBulkSMS = async (recipients, template) => {
    if (!Array.isArray(recipients) || recipients.length === 0) return { success: false, count: 0 };

    console.log(`[mNotify BULK] Dispatching to ${recipients.length} recipients.`);

    const results = await Promise.allSettled(
        recipients.map(async (r) => {
            const body = template.replace(/{farmer_name}/g, r.name || 'Grower');
            return exports.sendSMS(r.phone, body);
        })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    return {
        success: succeeded > 0,
        total: recipients.length,
        succeeded,
        failed: recipients.length - succeeded
    };
};
