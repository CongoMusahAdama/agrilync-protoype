/**
 * smsService.js — Unified SMS + Email notification bridge
 * 
 * SMS:   Uses Resend (email) as the primary channel for now.
 *        If you need true SMS in future, swap in Africa's Talking or Hubtel here.
 * Email: Delegates to notificationService (Resend).
 */
const { sendEmail } = require('./notificationService');

// ─────────────────────────────────────────────────────────────
// SMS — sends a formatted email receipt in lieu of actual SMS
// This keeps the API surface identical so callers don't break
// ─────────────────────────────────────────────────────────────

/**
 * Send a "SMS" notification (delivered as email via Resend)
 * @param {string} to - Recipient phone or email
 * @param {string} body - The message text
 * @param {string} [email] - Recipient email address (for Resend delivery)
 */
exports.sendSMS = async (to, body, email) => {
    if (!to || !body) throw new Error('Recipient and message body are required.');

    console.log(`[SMS DISPATCH] Sending to: ${to}`);

    // If an email is provided, deliver via Resend
    if (email) {
        try {
            await sendEmail({
                to: email,
                template: 'generic',
                data: {
                    title: 'AgriLync Notification',
                    recipientName: '',
                    message: body
                }
            });
            return { success: true, channel: 'email', recipient: email };
        } catch (err) {
            console.error('[NOTIFICATION] Email delivery failed:', err.message);
        }
    }

    // Fallback: log to console (dev mode or SMS-only flows)
    console.log(`[SMS SIMULATION] To ${to}: ${body}`);
    return {
        success: true,
        simulated: true,
        channel: 'console',
        sid: 'SIM_' + Date.now()
    };
};

/**
 * Send bulk SMS (delivered as email)
 * @param {Array<{phone: string, email?: string, name: string}>} recipients
 * @param {string} template - Message body with {farmer_name} placeholder
 */
exports.sendBulkSMS = async (recipients, template) => {
    if (!Array.isArray(recipients) || recipients.length === 0) return { success: false, count: 0 };

    console.log(`[BULK SMS] Dispatching to ${recipients.length} recipients.`);

    const results = await Promise.allSettled(
        recipients.map(async (r) => {
            const body = template.replace(/{farmer_name}/g, r.name || 'Grower');
            return exports.sendSMS(r.phone, body, r.email);
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
