const Match = require('../models/Match');
const Activity = require('../models/Activity');
const {
    notifySuperAdmins,
    notifyStaffAgent,
    notifyAgentSupervisorIfAny,
    staffSms,
} = require('../utils/staffNotifications');

// @route   GET api/matches
// @desc    Get all matches for current agent
exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find({ agent: req.agent.id })
            .populate('farmer', 'name region district community landSize productionStage verified')
            .sort({ createdAt: -1 });
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/matches
// @desc    Create a new match (Apply for opportunity)
exports.createMatch = async (req, res) => {
    const { farmerId, investor, farmType, value, investmentType, category } = req.body;

    try {
        // Verify farmer belongs to agent (Enforces Regional Operational Area)
        const farmer = await require('../models/Farmer').findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        if (farmer.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized: Farmer is outside your operational jurisdiction' });
        }

        // Generate simple ID
        const count = await Match.countDocuments();
        const id = `M-${100 + count + 1}`;

        const newMatch = new Match({
            id,
            investor,
            farmer: farmerId,
            farmType: farmType || farmer.farmType || 'Crop',
            value,
            investmentType,
            category: category || 'General',
            matchDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'Pending Approval',
            approvalStatus: 'pending',
            progress: 0,
            timeline: [{
                action: 'Match Created',
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                type: 'match'
            }],
            agent: req.agent.id
        });

        const match = await newMatch.save();

        // Populate farmer details for frontend
        await match.populate('farmer', 'name region district community');

        // Log Activity
        await Activity.create({
            agent: req.agent.id,
            type: 'info',
            title: 'New Investment Match',
            description: `Matched farmer to ${investor} (${category})`
        });

        const agentName = req.agent.name || 'Field Agent';
        const farmerName = match.farmer?.name || farmer.name;

        await notifySuperAdmins({
            title: 'New Investor Match',
            message: `${agentName} matched ${farmerName} with ${investor} (${category}).`,
            smsBody: staffSms(
                `${agentName} created match ${id} linking grower ${farmerName} to ${investor}. ` +
                    `Value: ${value || 'N/A'}. Review in admin dashboard.`
            ),
            type: 'match',
            priority: 'medium',
            senderName: agentName,
        });

        await notifyAgentSupervisorIfAny(req.agent.id, {
            title: 'New Investor Match',
            message: `${agentName} matched ${farmerName} with ${investor}.`,
            smsBody: staffSms(
                `Your agent ${agentName} created match ${id} for grower ${farmerName} with ${investor}.`
            ),
            type: 'match',
            priority: 'medium',
            senderName: agentName,
        });

        await notifyStaffAgent({
            agentId: req.agent.id,
            title: 'Match Submitted',
            message: `Match ${id} for ${farmerName} with ${investor} is pending approval.`,
            smsBody: staffSms(`Match ${id} for grower ${farmerName} with ${investor} was submitted successfully.`),
            type: 'match',
            priority: 'medium',
            senderName: 'AgriLync',
        });

        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/matches/:id
// @desc    Update match status or approval
exports.updateMatch = async (req, res) => {
    const { status, approvalStatus, notes, documents } = req.body;

    try {
        let match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        if (match.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const previousApproval = match.approvalStatus;
        const previousStatus = match.status;

        if (status) match.status = status;
        if (approvalStatus) match.approvalStatus = approvalStatus;
        if (notes) match.notes = notes;
        if (documents) {
            match.documents = { ...match.documents, ...documents };
        }

        await match.save();
        await match.populate('farmer', 'name');

        const agentName = req.agent.name || 'Field Agent';
        const farmerName = match.farmer?.name || 'grower';

        if (approvalStatus && approvalStatus !== previousApproval) {
            const approved = approvalStatus === 'approved';
            await notifySuperAdmins({
                title: approved ? 'Match Approved' : 'Match Rejected',
                message: `${agentName} ${approved ? 'approved' : 'rejected'} match ${match.id} for ${farmerName}.`,
                smsBody: staffSms(
                    `${agentName} ${approved ? 'approved' : 'rejected'} match ${match.id} for grower ${farmerName}.`
                ),
                type: 'match',
                priority: approved ? 'medium' : 'high',
                senderName: agentName,
            });
            await notifyStaffAgent({
                agentId: match.agent,
                title: approved ? 'Match Approved' : 'Match Rejected',
                message: `Match ${match.id} for ${farmerName} was ${approved ? 'approved' : 'rejected'}.`,
                smsBody: staffSms(
                    `Match ${match.id} for grower ${farmerName} was ${approved ? 'approved' : 'rejected'} on your account.`
                ),
                type: 'match',
                priority: 'medium',
                senderName: 'AgriLync',
            });
        }

        if (status && status !== previousStatus && ['Active', 'Completed', 'Cancelled'].includes(status)) {
            await notifyAgentSupervisorIfAny(match.agent, {
                title: `Match ${status}`,
                message: `Match ${match.id} for ${farmerName} is now ${status}.`,
                smsBody: staffSms(`Match ${match.id} for grower ${farmerName} is now ${status}.`),
                type: 'match',
                priority: 'medium',
                senderName: agentName,
            });
        }

        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
