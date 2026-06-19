/**
 * notificationService.js
 *
 * Unified notification delivery layer for AgriLync.
 *
 *  Channels supported:
 *   1. Email — Resend
 *   2. Push  — Firebase Cloud Messaging (FCM) via firebase-admin
 *
 * Each function logs success/failure silently so a single channel
 * failure never blocks the others.
 */

require('dotenv').config();

// ─── Resend (Email) ───────────────────────────────────────────────────────────
let resendClient = null;

function getResendClient() {
    if (resendClient) return resendClient;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[NotificationService] Resend API key missing — Email disabled.');
        return null;
    }

    const { Resend } = require('resend');
    resendClient = new Resend(apiKey);
    return resendClient;
}

/**
 * Send an email via Resend.
 * @param {string} to       - Recipient email address
 * @param {string} subject  - Email subject line
 * @param {string} html     - HTML email body
 * @param {string} [text]   - Plain-text fallback (defaults to subject if omitted)
 * @returns {Promise<{success:boolean, id?:string, error?:string}>}
 */
async function sendEmail(to, subject, html, text = '') {
    const client = getResendClient();
    if (!client) return { success: false, error: 'Resend not configured' };
    if (!to)     return { success: false, error: 'No email address provided' };

    try {
        const result = await client.emails.send({
            from:    process.env.RESEND_FROM_EMAIL || 'Agrilync Nexus <notifications@agrilync.com>',
            to,
            subject,
            html,
            text: text || subject
        });
        console.log(`[Email] ✓ Sent to ${to} — ID: ${result.id}`);
        return { success: true, id: result.id };
    } catch (err) {
        console.error(`[Email] ✗ Failed to ${to}:`, err.message);
        return { success: false, error: err.message };
    }
}

// ─── Firebase Admin (Push) ────────────────────────────────────────────────────
let firebaseAdmin = null;

function getFirebaseAdmin() {
    if (firebaseAdmin) return firebaseAdmin;

    try {
        const admin        = require('firebase-admin');
        const serviceAccount = require('../config/firebase-service-account.json');

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }

        firebaseAdmin = admin;
        return firebaseAdmin;
    } catch (err) {
        console.warn('[NotificationService] Firebase Admin init failed — Push disabled:', err.message);
        return null;
    }
}

/**
 * Send a push notification via Firebase Cloud Messaging (FCM).
 * @param {string} fcmToken - Device registration token
 * @param {string} title    - Notification title
 * @param {string} body     - Notification body text
 * @param {object} [data]   - Optional key-value data payload (all values become strings)
 * @returns {Promise<{success:boolean, messageId?:string, error?:string}>}
 */
async function sendPush(fcmToken, title, body, data = {}) {
    const admin = getFirebaseAdmin();
    if (!admin)    return { success: false, error: 'Firebase not configured' };
    if (!fcmToken) return { success: false, error: 'No FCM token provided' };

    // FCM requires all data values to be strings
    const stringifiedData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
    );

    try {
        const messageId = await admin.messaging().send({
            token: fcmToken,
            notification: { title, body },
            data: stringifiedData,
            android: {
                priority: 'high',
                notification: { sound: 'default', channelId: 'agrilync_alerts' }
            },
            apns: {
                payload: { aps: { sound: 'default', badge: 1 } }
            }
        });
        console.log(`[Push] ✓ Sent — messageId: ${messageId}`);
        return { success: true, messageId };
    } catch (err) {
        console.error('[Push] ✗ Failed:', err.message);
        return { success: false, error: err.message };
    }
}

// ─── Branded Email Template ───────────────────────────────────────────────────

/**
 * Build a branded AgriLync transactional email HTML.
 * @param {string} title    - Heading text inside the email
 * @param {string} message  - Body paragraph content
 * @param {string} priority - 'high' | 'medium' | 'low'
 */
function buildEmailHTML(title, message, priority = 'medium') {
    const priorityColors = {
        high:   '#ef4444',
        medium: '#f59e0b',
        low:    '#22c55e'
    };
    const badgeColor = priorityColors[priority] || priorityColors.medium;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#134e2a 0%,#1a6b38 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">AgriLync</h1>
              <p style="margin:4px 0 0;color:#a7f3d0;font-size:13px;">Field Agent Platform</p>
            </td>
          </tr>

          <!-- Priority Badge -->
          <tr>
            <td style="padding:24px 40px 0;text-align:center;">
              <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 14px;border-radius:999px;">${priority} priority</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#134e2a;font-size:20px;font-weight:600;">${title}</h2>
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;">${message}</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                 style="display:inline-block;background:#134e2a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;">
                Open AgriLync Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                You're receiving this because you're a registered AgriLync field agent.<br/>
                &copy; ${new Date().getFullYear()} AgriLync &middot; All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
    sendEmail,
    sendPush,
    buildEmailHTML
};
