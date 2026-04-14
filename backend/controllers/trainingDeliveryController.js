const TrainingDelivery = require('../models/TrainingDelivery');
const Activity = require('../models/Activity');

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

        res.status(201).json({ success: true, data: populated });
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

        // Log activity
        if (updates.status === 'completed') {
            try {
                await Activity.create({
                    agent: req.agent._id || req.agent.id,
                    type: 'training',
                    title: `Training delivered: ${delivery.moduleTitle}`,
                    description: `Session marked complete · ${delivery.farmers?.length || 0} farmer(s)`
                });
            } catch (actErr) { /* non-fatal */ }
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

        const Farmer = require('../models/Farmer');
        let farmers = [];
        if (delivery.farmers && delivery.farmers.length > 0) {
            farmers = await Farmer.find({ _id: { $in: delivery.farmers } }, 'name contact id');
        }

        const dateStr = new Date(delivery.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const agentName = req.agent.name || 'AgriLync Agent';

        const smsMessage = customMessage || 
            `Hello! This is ${agentName} from AgriLync. ` +
            `A training session for ${delivery.moduleTitle} has been scheduled for ${dateStr} at ${delivery.deliveryTime}. ` +
            `${delivery.venue ? 'Venue: ' + delivery.venue + '. ' : ''}Please try to attend!`;

        const recipients = farmers
            .filter(f => f.contact && String(f.contact).trim() !== '' && String(f.contact).toLowerCase() !== 'null')
            .map(f => ({ 
                name: f.name, 
                phone: String(f.contact).replace(/[\s\-\(\)]/g, '') 
            }));

        let broadcastResult = { succeeded: 0 };
        if (recipients.length > 0) {
            const smsService = require('../utils/smsService');
            broadcastResult = await smsService.sendBulkSMS(recipients, smsMessage);
        }

        const noPhoneWarning = farmers.length > 0 && recipients.length === 0
            ? 'Note: No growers in this session have a valid phone number.' : null;

        await TrainingDelivery.findByIdAndUpdate(id, {
            smsSent: true,
            smsSentAt: new Date()
        });

        try {
            await Activity.create({
                agent: req.agent._id || req.agent.id,
                type: 'event',
                title: 'Training notification sent',
                description: broadcastResult.succeeded > 0
                    ? `SMS sent to ${broadcastResult.succeeded}/${recipients.length} grower(s) for ${delivery.moduleTitle}`
                    : `Notification prepared for ${delivery.moduleTitle}. ${noPhoneWarning || ''}`
            });
        } catch (e) { /* non-fatal */ }

        res.json({
            success: true,
            message: broadcastResult.succeeded > 0 ? `SMS queued for ${broadcastResult.succeeded} grower(s)` : 'Session marked — no valid phone numbers found.',
            warning: noPhoneWarning || undefined
        });

    } catch (err) {
        console.error('sendSMSNotification error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to send SMS notification', error: err.message });
    }
};
