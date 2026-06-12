const TrainingDelivery = require('../models/TrainingDelivery');
const Activity = require('../models/Activity');
const { sendTrainingSessionSms } = require('../utils/visitSms');
const {
    notifySuperAdmins,
    notifyAgentSupervisorIfAny,
    staffSms,
    truncateSms,
} = require('../utils/staffNotifications');

// ─────────────────────────────────────────────────────────────
// GET /api/training-deliveries
// Returns all training deliveries for the authenticated agent
// ─────────────────────────────────────────────────────────────
exports.getDeliveries = async (req, res) => {
    try {
        const agentId = req.agent._id || req.agent.id;
        const { status, moduleId, limit = 50, page = 1 } = req.query;

        const filter = { agent: agentId };
        if (status) filter.status = status;
        if (moduleId) filter.moduleId = moduleId;

        const skip = (Number(page) - 1) * Number(limit);

        const [deliveries, total] = await Promise.all([
            TrainingDelivery.find(filter)
                .populate('farmers', 'name id contact community region')
                .sort({ deliveryDate: -1 })
                .skip(skip)
                .limit(Number(limit)),
            TrainingDelivery.countDocuments(filter)
        ]);

        res.json({ success: true, data: deliveries, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
        console.error('getDeliveries error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch training deliveries' });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/training-deliveries
// Schedule a new training delivery session
// ─────────────────────────────────────────────────────────────
exports.createDelivery = async (req, res) => {
    try {
        const agentId = req.agent._id || req.agent.id;
        const {
            moduleId, moduleTitle, moduleSubtitle,
            deliveryDate, deliveryTime,
            mode, venue, community, language,
            farmerIds, notes
        } = req.body;

        // Validate required fields
        if (!moduleId || !moduleTitle) return res.status(400).json({ success: false, message: 'Module is required' });
        if (!deliveryDate) return res.status(400).json({ success: false, message: 'Delivery date is required' });
        if (!mode) return res.status(400).json({ success: false, message: 'Delivery mode is required' });
        if (!farmerIds || !Array.isArray(farmerIds) || farmerIds.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one farmer is required' });
        }

        const delivery = await TrainingDelivery.create({
            agent: agentId,
            moduleId,
            moduleTitle,
            moduleSubtitle,
            deliveryDate: new Date(deliveryDate),
            deliveryTime: deliveryTime || '09:00',
            mode,
            venue,
            community,
            language,
            farmers: farmerIds,
            notes,
            status: 'scheduled'
        });

        // Log activity (non-fatal)
        try {
            await Activity.create({
                agent: agentId,
                type: 'training',
                title: `Training session scheduled: ${moduleTitle}`,
                description: `${farmerIds.length} farmer(s) · ${mode}${venue ? ' · ' + venue : ''}`
            });
        } catch (actErr) {
            console.error('Activity log failed (non-fatal):', actErr.message);
        }

        const populated = await TrainingDelivery.findById(delivery._id)
            .populate('farmers', 'name id contact community region');

        let smsResult = { sent: false, succeeded: 0, message: 'SMS not attempted' };
        try {
            smsResult = await sendTrainingSessionSms(delivery, req.agent);
            if (smsResult.sent) {
                await TrainingDelivery.findByIdAndUpdate(delivery._id, {
                    smsSent: true,
                    smsSentAt: new Date(),
                });
                populated.smsSent = true;
            }
        } catch (smsErr) {
            console.error('createDelivery SMS failed (non-fatal):', smsErr.message);
            smsResult = { sent: false, succeeded: 0, message: smsErr.message };
        }

        const agentName = req.agent?.name || 'Field Agent';
        const deliveryDateLabel = new Date(deliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        const staffMessage =
            `${agentName} scheduled training "${moduleTitle}" on ${deliveryDateLabel} ` +
            `for ${farmerIds.length} grower(s) (${mode}).`;

        await notifyAgentSupervisorIfAny(agentId, {
            title: 'Training Scheduled',
            message: staffMessage,
            smsBody: staffSms(`${staffMessage} Venue: ${truncateSms(venue || community, 50) || 'TBC'}.`),
            type: 'training',
            priority: 'medium',
            senderName: agentName,
        });

        await notifySuperAdmins({
            title: 'Training Session Scheduled',
            message: staffMessage,
            smsBody: staffSms(staffMessage),
            type: 'training',
            priority: 'low',
            senderName: agentName,
        });

        res.status(201).json({
            success: true,
            data: populated,
            sms: {
                sent: smsResult.sent,
                recipientCount: smsResult.succeeded || 0,
                message: smsResult.message,
            },
        });
    } catch (err) {
        console.error('createDelivery error:', err.message);
        res.status(500).json({ success: false, message: err.message || 'Failed to create training delivery' });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/training-deliveries/:id
// Get a single delivery with full farmer details
// ─────────────────────────────────────────────────────────────
exports.getDelivery = async (req, res) => {
    try {
        const agentId = String(req.agent._id || req.agent.id);
        const delivery = await TrainingDelivery.findById(req.params.id)
            .populate('farmers', 'name id contact community region farmType');

        if (!delivery) return res.status(404).json({ success: false, message: 'Training delivery not found' });
        if (String(delivery.agent) !== agentId) return res.status(401).json({ success: false, message: 'Not authorized' });

        res.json({ success: true, data: delivery });
    } catch (err) {
        console.error('getDelivery error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch training delivery' });
    }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/training-deliveries/:id
// Update status (complete / cancel) or add completion notes
// ─────────────────────────────────────────────────────────────
exports.updateDelivery = async (req, res) => {
    try {
        const agentId = String(req.agent._id || req.agent.id);
        const delivery = await TrainingDelivery.findById(req.params.id);

        if (!delivery) return res.status(404).json({ success: false, message: 'Training delivery not found' });
        if (String(delivery.agent) !== agentId) return res.status(401).json({ success: false, message: 'Not authorized' });

        const allowed = ['status', 'completionNotes', 'farmersAttended', 'notes', 'venue', 'community', 'deliveryTime', 'language', 'deliveryDate', 'mode', 'farmers'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        // Auto-set completedAt when marking complete
        if (updates.status === 'completed' && !delivery.completedAt) {
            updates.completedAt = new Date();
        }

        const updated = await TrainingDelivery.findByIdAndUpdate(
            req.params.id, updates, { new: true }
        ).populate('farmers', 'name id contact community region');

        if (updates.status === 'completed') {
            try {
                await Activity.create({
                    agent: req.agent._id || req.agent.id,
                    type: 'training',
                    title: `Training delivered: ${delivery.moduleTitle}`,
                    description: `Session marked complete · ${delivery.farmers?.length || 0} farmer(s)`
                });
            } catch (actErr) { /* non-fatal */ }

            const agentName = req.agent?.name || 'Field Agent';
            const completeMessage = `${agentName} completed training "${delivery.moduleTitle}".`;
            await notifyAgentSupervisorIfAny(agentId, {
                title: 'Training Completed',
                message: completeMessage,
                smsBody: staffSms(completeMessage),
                type: 'training',
                priority: 'medium',
                senderName: agentName,
            });
            await notifySuperAdmins({
                title: 'Training Completed',
                message: completeMessage,
                smsBody: staffSms(completeMessage),
                type: 'training',
                priority: 'low',
                senderName: agentName,
            });
        }

        if (updates.status === 'cancelled') {
            const agentName = req.agent?.name || 'Field Agent';
            const cancelMessage = `${agentName} cancelled training "${delivery.moduleTitle}".`;
            await notifyAgentSupervisorIfAny(agentId, {
                title: 'Training Cancelled',
                message: cancelMessage,
                smsBody: staffSms(cancelMessage),
                type: 'training',
                priority: 'medium',
                senderName: agentName,
            });
        }

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('updateDelivery error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update training delivery' });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/training-deliveries/:id  (cancel only)
// ─────────────────────────────────────────────────────────────
exports.deleteDelivery = async (req, res) => {
    try {
        const agentId = String(req.agent._id || req.agent.id);
        const delivery = await TrainingDelivery.findById(req.params.id);

        if (!delivery) return res.status(404).json({ success: false, message: 'Training delivery not found' });
        if (String(delivery.agent) !== agentId) return res.status(401).json({ success: false, message: 'Not authorized' });

        await TrainingDelivery.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
        res.json({ success: true, message: 'Training delivery cancelled' });
    } catch (err) {
        console.error('deleteDelivery error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to cancel training delivery' });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/training-deliveries/:id/send-sms
// Send SMS notification to farmers
// ─────────────────────────────────────────────────────────────
exports.sendSMSNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { customMessage } = req.body;
        const agentId = String(req.agent._id || req.agent.id);
        const mongoose = require('mongoose');

        if (req.agent && req.agent.isMock) {
            return res.json({ success: true, message: 'Mock SMS sent successfully' });
        }

        // Validate ID format before DB lookup
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`[TRAINING SMS] Invalid ID: ${id}. Using simulated response.`);
            return res.json({ success: true, message: 'Simulation Finalized: Notifications marked as dispatched for this trial session.' });
        }

        const delivery = await TrainingDelivery.findById(id);
        if (!delivery) return res.status(404).json({ success: false, message: 'Training delivery not found' });
        if (String(delivery.agent) !== agentId) return res.status(401).json({ success: false, message: 'Not authorized' });

        const smsResult = await sendTrainingSessionSms(delivery, req.agent, { customMessage });
        const noPhoneWarning = !smsResult.sent && smsResult.total > 0
            ? 'Note: No growers in this session have a valid phone number.'
            : null;

        if (smsResult.sent) {
            await TrainingDelivery.findByIdAndUpdate(id, {
                smsSent: true,
                smsSentAt: new Date(),
            });
        }

        try {
            await Activity.create({
                agent: req.agent._id || req.agent.id,
                type: 'event',
                title: 'Bulk SMS — training session',
                description: smsResult.sent
                    ? `mNotify bulk SMS sent to ${smsResult.succeeded}/${smsResult.total} grower(s) for ${delivery.moduleTitle}`
                    : `Bulk SMS prepared for ${delivery.moduleTitle}. ${noPhoneWarning || smsResult.message || ''}`,
            });
        } catch (e) { /* non-fatal */ }

        res.json({
            success: true,
            message: smsResult.sent
                ? `SMS queued for ${smsResult.succeeded} grower(s)`
                : (smsResult.message || 'Session marked — no valid phone numbers found.'),
            warning: noPhoneWarning || undefined,
            data: { recipientCount: smsResult.succeeded || 0 },
        });

    } catch (err) {
        console.error('sendSMSNotification error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to send SMS notification', error: err.message });
    }
};
