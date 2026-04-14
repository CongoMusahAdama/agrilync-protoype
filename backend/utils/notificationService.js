const { Resend } = require('resend');

// ─────────────────────────────────────────────────────────────
// Initialize Resend
// ─────────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AgriLync <notifications@agrilync.com>';

let resend = null;
if (RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
    console.log('[RESEND] Email client initialized.');
} else {
    console.warn('[RESEND] API key missing in .env (RESEND_API_KEY). Emails will be logged to console only.');
}

// ─────────────────────────────────────────────────────────────
// Email Templates
// ─────────────────────────────────────────────────────────────
const emailTemplates = {
    /**
     * Welcome email for a newly onboarded farmer
     */
    farmerWelcome: ({ farmerName, agentName, farmerId }) => ({
        subject: `Welcome to AgriLync, ${farmerName}!`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
            <div style="background: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync</h1>
                <p style="color: #a7f3d0; margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">Farm Intelligence Platform</p>
            </div>
            <h2 style="color: #002f37; margin: 0 0 12px;">Welcome, ${farmerName}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">You've been successfully registered on AgriLync by <strong>${agentName}</strong>. Your Grower ID is:</p>
            <div style="background: #ecfdf5; border: 2px dashed #065f46; padding: 16px; border-radius: 10px; text-align: center; margin: 16px 0;">
                <p style="font-size: 22px; font-weight: bold; color: #065f46; letter-spacing: 4px; margin: 0;">${farmerId}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">You can now be matched with investors and access a range of agricultural support services.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana · <a href="https://agrilync.com" style="color: #065f46;">agrilync.com</a></p>
        </div>`
    }),

    /**
     * Dispute update notification (for agents and farmers)
     */
    disputeUpdate: ({ recipientName, disputeId, status, notes }) => ({
        subject: `Dispute #${disputeId} Update — ${status}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
            <div style="background: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync</h1>
            </div>
            <h2 style="color: #002f37;">Dispute Status Update</h2>
            <p style="color: #4b5563;">Hello <strong>${recipientName}</strong>, your dispute <strong>#${disputeId}</strong> has been updated.</p>
            <div style="background: #ecfdf5; padding: 16px; border-left: 4px solid #065f46; border-radius: 6px; margin: 16px 0;">
                <p style="margin: 0; color: #065f46; font-weight: bold; text-transform: uppercase; font-size: 13px;">New Status: ${status}</p>
                ${notes ? `<p style="margin: 8px 0 0; color: #374151;">${notes}</p>` : ''}
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana</p>
        </div>`
    }),

    /**
     * Generic notification (fallback)
     */
    generic: ({ title, message, recipientName }) => ({
        subject: title,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
            <div style="background: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync</h1>
            </div>
            <h2 style="color: #002f37;">${title}</h2>
            ${recipientName ? `<p style="color: #4b5563;">Hello <strong>${recipientName}</strong>,</p>` : ''}
            <p style="color: #4b5563; line-height: 1.6;">${message}</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana</p>
        </div>`
    }),

    /**
     * Password / OTP reset
     */
    otp: ({ recipientName, otp, expiresIn }) => ({
        subject: 'Your AgriLync Verification Code',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
            <div style="background: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync</h1>
            </div>
            <h2 style="color: #002f37;">Verification Code</h2>
            <p style="color: #4b5563;">Hi <strong>${recipientName}</strong>, use the code below to verify your identity:</p>
            <div style="background: #065f46; padding: 20px; border-radius: 12px; text-align: center; margin: 16px 0;">
                <p style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; margin: 0;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">This code expires in <strong>${expiresIn || '10 minutes'}</strong>. Do not share it with anyone.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana</p>
        </div>`
    }),

    /**
     * Field visit scheduled notification
     */
    visitScheduled: ({ farmerName, agentName, visitDate, visitTime, notes }) => ({
        subject: `Field Visit Scheduled — ${visitDate}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
            <div style="background: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync</h1>
            </div>
            <h2 style="color: #002f37;">📅 Visit Scheduled</h2>
            <p style="color: #4b5563;">Hello <strong>${farmerName}</strong>, your AgriLync agent <strong>${agentName}</strong> has scheduled a field visit.</p>
            <div style="background: #ecfdf5; border: 1px solid #6ee7b7; padding: 16px; border-radius: 10px; margin: 16px 0;">
                <p style="margin: 0; font-weight: bold; color: #065f46;">📅 Date: ${visitDate}</p>
                ${visitTime ? `<p style="margin: 6px 0 0; color: #374151;">⏰ Time: ${visitTime}</p>` : ''}
                ${notes ? `<p style="margin: 6px 0 0; color: #374151;">📝 Notes: ${notes}</p>` : ''}
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana</p>
        </div>`
    }),

    /**
     * Task Due Reminder (for agents)
     */
    taskReminder: ({ agentName, taskTitle, dueDate, location, priority }) => ({
        subject: `⏰ Reminder: Task "${taskTitle}" is due soon!`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fffcf0; padding: 32px; border-radius: 16px; border: 1px solid #fef3c7;">
            <div style="background: #92400e; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌱 AgriLync Alerts</h1>
            </div>
            <h2 style="color: #92400e; margin: 0 0 12px;">⏰ Upcoming Task Reminder</h2>
            <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${agentName}</strong>, you have a task that is reaching its deadline:</p>
            <div style="background: white; border: 1px solid #fde68a; padding: 20px; border-radius: 12px; margin: 16px 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 10px; color: #1f2937; font-size: 18px;">${taskTitle}</h3>
                <p style="margin: 6px 0; color: #4b5563; font-size: 14px;">📅 <strong>Due:</strong> ${dueDate}</p>
                ${location ? `<p style="margin: 6px 0; color: #4b5563; font-size: 14px;">📍 <strong>Location:</strong> ${location}</p>` : ''}
                <p style="margin: 6px 0; color: #92400e; font-size: 12px; font-weight: bold; text-transform: uppercase;">🔥 Priority: ${priority}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">Please ensure all necessary materials are prepared for this field mission.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© AgriLync · Ghana</p>
        </div>`
    })
};

// ─────────────────────────────────────────────────────────────
// Core send function
// ─────────────────────────────────────────────────────────────

/**
 * Send an email using Resend
 * @param {Object} opts
 * @param {string} opts.to - Recipient email address
 * @param {string} opts.template - Template name (e.g. 'farmerWelcome', 'generic')
 * @param {Object} opts.data - Data to pass into the template
 */
exports.sendEmail = async ({ to, template = 'generic', data = {} }) => {
    if (!to) throw new Error('[RESEND] Recipient email (to) is required.');

    const tmpl = emailTemplates[template];
    if (!tmpl) throw new Error(`[RESEND] Unknown template: "${template}"`);

    const { subject, html } = tmpl(data);

    if (!resend) {
        // Dev/simulation fallback
        console.log(`\n[EMAIL SIMULATION] ─────────────────────────`);
        console.log(`  To:      ${to}`);
        console.log(`  Subject: ${subject}`);
        console.log(`  Template: ${template}`);
        console.log(`─────────────────────────────────────────────\n`);
        return { success: true, simulated: true, id: 'sim_' + Date.now() };
    }

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html
        });
        console.log(`[RESEND] Email sent → ${to} (id: ${result.data?.id})`);
        return { success: true, id: result.data?.id };
    } catch (err) {
        console.error('[RESEND] Email failed:', err.message);
        throw err;
    }
};

/**
 * Send bulk emails in parallel (max 10 at a time to avoid rate limits)
 * @param {Array<{email: string, data: Object}>} recipients
 * @param {string} template
 */
exports.sendBulkEmail = async (recipients, template) => {
    if (!Array.isArray(recipients) || recipients.length === 0) return { success: false, count: 0 };

    console.log(`[RESEND BULK] Sending ${recipients.length} emails using template: ${template}`);

    // Process in batches of 10
    const batchSize = 10;
    const results = [];
    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
            batch.map(r => exports.sendEmail({ to: r.email, template, data: r.data }))
        );
        results.push(...batchResults);
    }

    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    return { success: succeeded > 0, total: recipients.length, succeeded, failed: recipients.length - succeeded };
};
