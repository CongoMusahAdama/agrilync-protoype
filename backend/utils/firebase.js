/**
 * firebase.js — STUB
 * 
 * Push notifications via Firebase have been replaced by Resend (email).
 * This stub preserves the import API so existing callers don't break.
 * 
 * To re-enable Firebase push notifications in future, restore the 
 * firebase-admin initialization here.
 */

const { sendEmail } = require('./notificationService');

/**
 * sendPushNotification — now sends an email via Resend instead of FCM push.
 * @param {string} tokenOrEmail - FCM token (ignored) or email address
 * @param {{ title: string, body: string, email?: string }} payload
 */
const sendPushNotification = async (tokenOrEmail, payload) => {
    const recipientEmail = payload?.email || (tokenOrEmail?.includes('@') ? tokenOrEmail : null);

    if (!recipientEmail) {
        console.log(`[PUSH STUB] No email available. Notification logged: ${payload?.title}`);
        return;
    }

    try {
        await sendEmail({
            to: recipientEmail,
            template: 'generic',
            data: {
                title: payload.title || 'AgriLync Notification',
                message: payload.body || '',
                recipientName: payload.recipientName || ''
            }
        });
    } catch (err) {
        console.error('[PUSH STUB → RESEND] Email delivery failed:', err.message);
    }
};

module.exports = {
    admin: null, // Firebase admin no longer active
    sendPushNotification
};
