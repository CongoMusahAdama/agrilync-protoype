const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

// @route   GET api/notifications
// @desc    Get all notifications for current agent
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ agent: req.agent.id }).sort({ createdAt: -1 }).lean();
        res.json(notifications);
    } catch (err) {
        console.error('getNotifications error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/notifications/:id
// @desc    Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

        if (notification.agent.toString() !== req.agent.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();
        res.json({ success: true, data: notification });
    } catch (err) {
        console.error('markAsRead error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/activities
// @desc    Get activity timeline for current agent
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ agent: req.agent.id }).sort({ createdAt: -1 }).limit(20).lean();
        res.json(activities);
    } catch (err) {
        console.error('getActivities error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Helper function to create notification (internal use)
exports.createNotification = async (agentId, data) => {
    try {
        const notification = new Notification({
            ...data,
            agent: agentId
        });
        await notification.save();
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

// Helper function to create activity (internal use)
exports.createActivity = async (agentId, data) => {
    try {
        const activity = new Activity({
            ...data,
            agent: agentId
        });
        await activity.save();
    } catch (err) {
        console.error('Error creating activity:', err);
    }
};
