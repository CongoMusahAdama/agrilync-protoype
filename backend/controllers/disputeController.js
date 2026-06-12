const Dispute = require('../models/Dispute');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');
const {
    notifySuperAdmins,
    notifyStaffAgent,
    notifyAgentSupervisorIfAny,
    staffSms,
    truncateSms,
} = require('../utils/staffNotifications');

// @route   GET api/disputes
// @desc    Get all disputes for current agent
exports.getDisputes = async (req, res) => {
    try {
        // Populate farmer details for the UI
        const disputes = await Dispute.find({ agent: req.agent.id })
            .populate('farmer', 'name region district community contact lyncId');
        res.json(disputes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/disputes
// @desc    Create a new dispute
exports.createDispute = async (req, res) => {
    const { id, farmerId, investor, type, severity, region, description } = req.body;

    try {
        // Enforce Regional/Operational Area Security
        const farmer = await require('../models/Farmer').findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        if (farmer.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized: Farmer is outside your operational jurisdiction' });
        }

        const newDispute = new Dispute({
            id,
            farmer: farmerId,
            investor,
            agent: req.agent.id,
            type,
            severity,
            region: region || farmer.region, // Fallback to farmer's region
            description,
            dateLogged: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'Pending',
            timeline: [{
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                action: 'Dispute created by Agent',
                user: req.agent.name || 'Agent'
            }]
        });

        const dispute = await newDispute.save();

        // Populate for return
        await dispute.populate('farmer', 'name');

        // Log Activity
        await Activity.create({
            agent: req.agent.id,
            type: 'dispute',
            title: `Dispute Logged: ${id}`,
            description: `${type} (${severity})`
        });

        const agentName = req.agent.name || 'Field Agent';
        const farmerName = dispute.farmer?.name || farmer.name;
        const alertMessage = `${agentName} logged dispute ${id} for ${farmerName} (${severity} · ${type}).`;

        await notifySuperAdmins({
            title: 'New Dispute Logged',
            message: alertMessage,
            smsBody: staffSms(
                `${agentName} logged dispute ${id} for grower ${farmerName} (${severity}). ` +
                    `${truncateSms(description, 80)}. Review in Escalations.`
            ),
            priority: severity === 'High' ? 'high' : 'medium',
            senderName: agentName,
        });

        await notifyAgentSupervisorIfAny(req.agent.id, {
            title: 'Agent Logged Dispute',
            message: alertMessage,
            smsBody: staffSms(
                `Your agent ${agentName} logged dispute ${id} for grower ${farmerName} (${severity}).`
            ),
            type: 'dispute',
            priority: severity === 'High' ? 'high' : 'medium',
            senderName: agentName,
        });

        await notifyStaffAgent({
            agentId: req.agent.id,
            title: 'Dispute Submitted',
            message: `Dispute ${id} for ${farmerName} was submitted and is pending review.`,
            smsBody: staffSms(
                `Your dispute ${id} for grower ${farmerName} was submitted. Admins have been alerted.`
            ),
            type: 'dispute',
            priority: 'medium',
            senderName: 'AgriLync',
        });

        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/disputes/:id
// @desc    Update dispute status or timeline
exports.updateDispute = async (req, res) => {
    const { status, action, resolution, notes } = req.body;

    try {
        let dispute;

        // Try to find by MongoDB _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            dispute = await Dispute.findById(req.params.id);
        }

        // If not found by _id, try to find by the custom 'id' field (e.g., DIST-123456)
        if (!dispute) {
            dispute = await Dispute.findOne({ id: req.params.id });
        }

        if (!dispute) {
            return res.status(404).json({ msg: 'Dispute not found' });
        }

        // Verify ownership (agent who logged it)
        if (dispute.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized: You can only update disputes you logged' });
        }

        const previousStatus = dispute.status;

        if (status) dispute.status = status;
        if (resolution) dispute.resolution = resolution;

        if (notes) {
            const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            const prefix = `[${dateStr}] `;
            dispute.notes = (dispute.notes ? dispute.notes + "\n" : "") + prefix + notes;
        }

        // Add to timeline if an action is specified
        if (action) {
            dispute.timeline.push({
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                action: action,
                user: req.agent.name || 'Agent'
            });
        }

        await dispute.save();

        await dispute.populate('farmer', 'name region');

        const agentName = req.agent.name || 'Field Agent';
        const farmerName = dispute.farmer?.name || 'grower';

        if (status === 'Escalated' && previousStatus !== 'Escalated') {
            await notifySuperAdmins({
                title: 'Dispute Escalated',
                message: `${agentName} escalated dispute ${dispute.id} for ${farmerName}.`,
                smsBody: staffSms(
                    `${agentName} escalated dispute ${dispute.id} for ${farmerName}. ` +
                        `Review urgently in Escalations.`
                ),
                priority: 'high',
                senderName: agentName,
            });
            await notifyAgentSupervisorIfAny(dispute.agent, {
                title: 'Dispute Escalated',
                message: `${agentName} escalated dispute ${dispute.id} for ${farmerName}.`,
                smsBody: staffSms(
                    `Agent ${agentName} escalated dispute ${dispute.id} for grower ${farmerName}.`
                ),
                type: 'dispute',
                priority: 'high',
                senderName: agentName,
            });
        }

        if (status === 'Resolved' && previousStatus !== 'Resolved') {
            await notifyAgentSupervisorIfAny(dispute.agent, {
                title: 'Dispute Resolved',
                message: `Dispute ${dispute.id} for ${farmerName} was marked resolved.`,
                smsBody: staffSms(`Dispute ${dispute.id} for grower ${farmerName} was marked resolved by ${agentName}.`),
                type: 'dispute',
                priority: 'medium',
                senderName: agentName,
            });
        }

        res.json(dispute);
    } catch (err) {
        console.error('[DISPUTE_UPDATE] Error:', err.message);
        res.status(500).send('Server error');
    }
};
