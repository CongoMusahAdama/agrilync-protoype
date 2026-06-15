const Match = require('../models/Match');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');
const {
    notifySuperAdmins,
    notifyStaffAgent,
    notifyAgentSupervisorIfAny,
    staffSms,
} = require('../utils/staffNotifications');
const { agentIdsMatch, farmerAccessibleToAgent, requestAgentId } = require('../utils/agentAuth');

async function findMatchByParam(param) {
    if (mongoose.Types.ObjectId.isValid(param)) {
        const byId = await Match.findById(param);
        if (byId) return byId;
    }
    return Match.findOne({ id: param });
}

async function applyMatchDecision(match, { approved, agentName }) {
    const previousApproval = match.approvalStatus;
    const farmerName = match.farmer?.name || 'grower';

    if (approved) {
        match.approvalStatus = 'approved';
        match.status = 'Active';
        match.documents = { ...(match.documents || {}), agentApproval: true };
        match.timeline = match.timeline || [];
        match.timeline.push({
            action: 'Agent approved match',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            type: 'match',
        });
    } else {
        match.approvalStatus = 'declined';
        match.status = 'Flagged';
        match.timeline = match.timeline || [];
        match.timeline.push({
            action: 'Agent rejected match',
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            type: 'issue',
        });
    }

    await match.save();
    await match.populate('farmer', 'name region district community');

    if (match.approvalStatus !== previousApproval) {
        const approvedLabel = approved ? 'approved' : 'rejected';
        await notifySuperAdmins({
            title: approved ? 'Match Approved' : 'Match Rejected',
            message: `${agentName} ${approvedLabel} match ${match.id} for ${farmerName}.`,
            smsBody: staffSms(`${agentName} ${approvedLabel} match ${match.id} for grower ${farmerName}.`),
            type: 'match',
            priority: approved ? 'medium' : 'high',
            senderName: agentName,
        });
        await notifyStaffAgent({
            agentId: match.agent,
            title: approved ? 'Match Approved' : 'Match Rejected',
            message: `Match ${match.id} for ${farmerName} was ${approvedLabel}.`,
            smsBody: staffSms(`Match ${match.id} for grower ${farmerName} was ${approvedLabel} on your account.`),
            type: 'match',
            priority: 'medium',
            senderName: 'AgriLync',
        });
    }

    return match;
}

// @route   GET api/matches
exports.getMatches = async (req, res) => {
    try {
        const agentId = requestAgentId(req);
        const matches = await Match.find({ agent: agentId })
            .populate('farmer', 'name region district community landSize productionStage verified')
            .sort({ createdAt: -1 });
        res.json(matches);
    } catch (err) {
        console.error('getMatches error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   POST api/matches
exports.createMatch = async (req, res) => {
    const { farmerId, investor, farmType, value, investmentType, category } = req.body;

    try {
        const farmer = await require('../models/Farmer').findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        const agentId = requestAgentId(req);
        if (!farmerAccessibleToAgent(farmer, agentId)) {
            return res.status(401).json({ msg: 'Not authorized: Farmer is outside your operational jurisdiction' });
        }

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
                type: 'match',
            }],
            agent: agentId,
        });

        const match = await newMatch.save();
        await match.populate('farmer', 'name region district community');

        await Activity.create({
            agent: agentId,
            type: 'info',
            title: 'New Investment Match',
            description: `Matched farmer to ${investor} (${category})`,
        });

        const agentName = req.agent.name || 'Field Agent';
        const farmerName = match.farmer?.name || farmer.name;

        await notifySuperAdmins({
            title: 'New Investor Match',
            message: `${agentName} matched ${farmerName} with ${investor} (${category}).`,
            smsBody: staffSms(
                `${agentName} created match ${id} linking grower ${farmerName} to ${investor}. Value: ${value || 'N/A'}.`
            ),
            type: 'match',
            priority: 'medium',
            senderName: agentName,
        });

        await notifyAgentSupervisorIfAny(agentId, {
            title: 'New Investor Match',
            message: `${agentName} matched ${farmerName} with ${investor}.`,
            smsBody: staffSms(`Your agent ${agentName} created match ${id} for grower ${farmerName} with ${investor}.`),
            type: 'match',
            priority: 'medium',
            senderName: agentName,
        });

        await notifyStaffAgent({
            agentId,
            title: 'Match Submitted',
            message: `Match ${id} for ${farmerName} with ${investor} is pending approval.`,
            smsBody: staffSms(`Match ${id} for grower ${farmerName} with ${investor} was submitted successfully.`),
            type: 'match',
            priority: 'medium',
            senderName: 'AgriLync',
        });

        res.json(match);
    } catch (err) {
        console.error('createMatch error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   POST api/matches/:id/approve
exports.approveMatch = async (req, res) => {
    try {
        const match = await findMatchByParam(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        const agentId = requestAgentId(req);
        if (!agentIdsMatch(match.agent, agentId)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updated = await applyMatchDecision(match, {
            approved: true,
            agentName: req.agent.name || 'Field Agent',
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('approveMatch error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   POST api/matches/:id/reject
exports.rejectMatch = async (req, res) => {
    try {
        const match = await findMatchByParam(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        const agentId = requestAgentId(req);
        if (!agentIdsMatch(match.agent, agentId)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updated = await applyMatchDecision(match, {
            approved: false,
            agentName: req.agent.name || 'Field Agent',
        });
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('rejectMatch error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   PUT api/matches/:id
exports.updateMatch = async (req, res) => {
    const { status, approvalStatus, notes, documents } = req.body;

    try {
        const match = await findMatchByParam(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        const agentId = requestAgentId(req);
        if (!agentIdsMatch(match.agent, agentId)) {
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
                smsBody: staffSms(`${agentName} ${approved ? 'approved' : 'rejected'} match ${match.id} for grower ${farmerName}.`),
                type: 'match',
                priority: approved ? 'medium' : 'high',
                senderName: agentName,
            });
            await notifyStaffAgent({
                agentId: match.agent,
                title: approved ? 'Match Approved' : 'Match Rejected',
                message: `Match ${match.id} for ${farmerName} was ${approved ? 'approved' : 'rejected'}.`,
                smsBody: staffSms(`Match ${match.id} for grower ${farmerName} was ${approved ? 'approved' : 'rejected'} on your account.`),
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
        console.error('updateMatch error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
