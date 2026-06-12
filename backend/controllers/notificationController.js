const Notification  = require('../models/Notification');
const Activity      = require('../models/Activity');
const Agent         = require('../models/Agent');
const { sendEmail, sendPush, buildEmailHTML } = require('../services/notificationService');
const { sendSmsSafe, staffSms, smsEnabledForAgent } = require('../utils/staffNotifications');

// ─── In-App: Get all notifications for current agent ─────────────────────────

// @route   GET /api/notifications
// @access  Agent (auth)
exports.getNotifications = async (req, res) => {
    try {
        if (req.agent.isMock) return res.json([]);

        const notifications = await Notification
            .find({ agent: req.agent.id })
            .sort({ createdAt: -1 })
            .lean();

        res.json(notifications);
    } catch (err) {
        console.error('getNotifications error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── In-App: Mark notification as read ────────────────────────────────────────

// @route   PUT /api/notifications/:id
// @access  Agent (auth)
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification)
            return res.status(404).json({ success: false, message: 'Notification not found' });

        if (notification.agent.toString() !== req.agent.id)
            return res.status(401).json({ success: false, message: 'Not authorized' });

        notification.read = true;
        await notification.save();
        res.json({ success: true, data: notification });
    } catch (err) {
        console.error('markAsRead error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── In-App: Mark ALL notifications as read ───────────────────────────────────

// @route   PUT /api/notifications/mark-all-read
// @access  Agent (auth)
exports.markAllAsRead = async (req, res) => {
    try {
        if (req.agent.isMock) return res.json({ success: true, count: 0 });

        const result = await Notification.updateMany(
            { agent: req.agent.id, read: false },
            { read: true }
        );
        res.json({ success: true, count: result.modifiedCount });
    } catch (err) {
        console.error('markAllAsRead error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── Admin: Send notification to one or many agents ──────────────────────────

/**
 * POST /api/notifications/send
 *
 * Body:
 *  {
 *    agentIds:  string[]  — array of agent ObjectId strings
 *                          (pass ["all"] to target every active agent)
 *    title:     string
 *    message:   string
 *    type:      'training'|'report'|'alert'|'verification'|'message'|'dispute'|'match'|'event'
 *    priority:  'high'|'medium'|'low'
 *    channels:  { sms?: boolean, email?: boolean, push?: boolean }
 *               (optional — defaults to each agent's own preferences)
 *  }
 *
 * @access  Supervisor / Super-admin only
 */
exports.sendNotification = async (req, res) => {
    try {
        const {
            agentIds  = [],
            title,
            message,
            type      = 'message',
            priority  = 'medium',
            channels  = {}             // channel overrides from the caller
        } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'title and message are required' });
        }

        // Resolve target agents
        let agents;
        if (agentIds.includes('all')) {
            agents = await Agent.find({ status: 'active' }).lean();
        } else {
            agents = await Agent.find({ _id: { $in: agentIds } }).lean();
        }

        if (!agents.length) {
            return res.status(404).json({ success: false, message: 'No matching agents found' });
        }

        const senderRole = req.agent.role;
        const senderName = req.agent.name;

        const results = await Promise.allSettled(
            agents.map(agent => _dispatchToAgent(agent, {
                title, message, type, priority, senderRole, senderName, channels
            }))
        );

        const summary = {
            total:   agents.length,
            success: results.filter(r => r.status === 'fulfilled').length,
            failed:  results.filter(r => r.status === 'rejected').length
        };

        res.status(200).json({ success: true, summary });
    } catch (err) {
        console.error('sendNotification error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── Internal dispatcher (used for programmatic notifications) ────────────────

/**
 * Dispatch a notification to a single agent across all enabled channels.
 *
 * @param {string} agentId  - MongoDB ObjectId string
 * @param {object} payload  - { title, message, type, priority, senderRole, senderName }
 * @param {object} [channelOverrides] - { sms?, email?, push? } booleans
 */
exports.dispatchNotification = async (agentId, payload, channelOverrides = {}) => {
    try {
        const agent = await Agent.findById(agentId).lean();
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        await _dispatchToAgent(agent, { ...payload, channels: channelOverrides });
    } catch (err) {
        console.error('dispatchNotification error:', err.message);
    }
};

// ─── Private helper ────────────────────────────────────────────────────────────

async function _dispatchToAgent(agent, { title, message, type, priority, senderRole, senderName, channels = {} }) {
    const prefs = agent.notificationPreferences || {};

    // Resolve whether each channel is on — caller override wins, then agent pref, then default true
    const useEmail = channels.email !== undefined ? channels.email : prefs.email !== false;
    const usePush  = channels.push  !== undefined ? channels.push  : prefs.push  !== false;
    const useSms   = channels.sms   !== undefined ? channels.sms   : prefs.sms   !== false;

    // 1. Always persist to DB (in-app notification)
    await Notification.create({
        agent: agent._id,
        title,
        message,
        type,
        priority,
        senderRole: senderRole || 'supervisor',
        senderName: senderName || 'Management',
        time: 'Just now'
    });

    // 2. Email (Resend)
    if (useEmail && agent.email) {
        const html = buildEmailHTML(title, message, priority);
        await sendEmail(agent.email, `AgriLync: ${title}`, html);
    }

    // 3. Push (Firebase FCM)
    if (usePush && agent.fcmToken) {
        await sendPush(agent.fcmToken, title, message, { type, priority });
    }

    // 4. SMS (mNotify)
    if (useSms && agent.contact && smsEnabledForAgent(agent)) {
        await sendSmsSafe(agent.contact, staffSms(`${title}. ${message}`));
    }
}

// ─── Activity helpers (unchanged) ─────────────────────────────────────────────

// @route   GET /api/activities
// @access  Agent (auth)
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity
            .find({ agent: req.agent.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        res.json(activities);
    } catch (err) {
        console.error('getActivities error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Helper: create in-app notification (internal use only)
exports.createNotification = async (agentId, data) => {
    try {
        await Notification.create({ ...data, agent: agentId });
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

// Helper: create activity (internal use only)
exports.createActivity = async (agentId, data) => {
    try {
        await Activity.create({ ...data, agent: agentId });
    } catch (err) {
        console.error('Error creating activity:', err);
    }
};
