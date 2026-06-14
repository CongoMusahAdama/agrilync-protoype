const FieldVisit = require('../models/FieldVisit');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');
const {
    notifyAgentSupervisorIfAny,
    notifySuperAdmins,
    staffSms,
    truncateSms,
} = require('../utils/staffNotifications');
const { agentIdsMatch, farmerAccessibleToAgent } = require('../utils/agentAuth');

function requestAgentId(req) {
    return req.agent._id || req.agent.id;
}

function normalizeVisitStatus(status) {
    if (!status) return 'Completed';
    const value = String(status).trim();
    if (/follow-up/i.test(value)) return 'Follow-up Required';
    return 'Completed';
}

// @route   GET api/field-visits
// @desc    Get all field visits for current agent
exports.getFieldVisits = async (req, res) => {
    try {
        if (req.agent.isMock) {
            return res.json([]);
        }
        const agentId = requestAgentId(req);
        const visits = await FieldVisit.find({ agent: agentId })
            .populate('farmer', 'name contact region district community lyncId id')
            .sort({ date: -1, time: -1 });
        res.json(visits);
    } catch (err) {
        console.error('getFieldVisits error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   POST api/field-visits
// @desc    Log a new field visit
exports.logFieldVisit = async (req, res) => {
    const { farmerId, date, time, hoursSpent, purpose, notes, visitImages, challenges, status } = req.body;

    try {
        if (!farmerId) {
            return res.status(400).json({ msg: 'Grower is required.' });
        }

        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Grower not found.' });
        }

        const agentId = requestAgentId(req);
        if (!farmerAccessibleToAgent(farmer, agentId)) {
            return res.status(401).json({ msg: 'Not authorized to log visits for this grower.' });
        }

        if (!farmer.agent) {
            await Farmer.findByIdAndUpdate(farmerId, { agent: agentId });
        }

        const parsedHours = Number(hoursSpent);
        if (!Number.isFinite(parsedHours) || parsedHours < 0.1 || parsedHours > 24) {
            return res.status(400).json({ msg: 'Hours spent must be between 0.1 and 24.' });
        }

        const visitDate = date ? new Date(date) : new Date();
        if (Number.isNaN(visitDate.getTime())) {
            return res.status(400).json({ msg: 'Invalid visit date.' });
        }

        const newVisit = new FieldVisit({
            agent: agentId,
            farmer: farmerId,
            date: visitDate,
            time: time || '09:00',
            hoursSpent: parsedHours,
            purpose: purpose || 'Field visit',
            notes: notes || '',
            visitImages: Array.isArray(visitImages) ? visitImages.slice(0, 6) : [],
            challenges: challenges || '',
            status: normalizeVisitStatus(status),
        });

        const visit = await newVisit.save();

        await Farmer.findByIdAndUpdate(farmerId, { lastVisit: visitDate });

        await Activity.create({
            agent: agentId,
            type: 'report',
            title: `Visited ${farmer.name}`,
            description: `${purpose || 'Field Visit'} - ${parsedHours}hrs`,
        });

        const populatedVisit = await FieldVisit.findById(visit._id)
            .populate('farmer', 'name contact region district community id');

        const agentName = req.agent?.name || 'Field Agent';
        const visitMessage = `${agentName} logged a field visit to ${farmer.name} (${purpose || 'Field visit'}).`;
        await notifyAgentSupervisorIfAny(agentId, {
            title: 'Field Visit Logged',
            message: visitMessage,
            smsBody: staffSms(`${visitMessage} Notes: ${truncateSms(notes, 60) || 'None'}.`),
            type: 'report',
            priority: 'low',
            senderName: agentName,
        });
        await notifySuperAdmins({
            title: 'Field Visit Logged',
            message: visitMessage,
            smsBody: staffSms(visitMessage),
            type: 'report',
            priority: 'low',
            senderName: agentName,
        });

        res.json(populatedVisit);
    } catch (err) {
        console.error('logFieldVisit error:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};

// @route   DELETE api/field-visits/:id
// @desc    Delete a field visit
exports.deleteFieldVisit = async (req, res) => {
    try {
        const visit = await FieldVisit.findById(req.params.id);
        if (!visit) return res.status(404).json({ msg: 'Visit not found' });

        const agentId = requestAgentId(req);
        if (!agentIdsMatch(visit.agent, agentId)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await visit.deleteOne();
        res.json({ msg: 'Visit removed' });
    } catch (err) {
        console.error('deleteFieldVisit error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @route   PUT api/field-visits/:id
// @desc    Update a field visit
exports.updateFieldVisit = async (req, res) => {
    const { date, time, hoursSpent, purpose, notes, visitImages, challenges, status } = req.body;

    try {
        let visit = await FieldVisit.findById(req.params.id);
        if (!visit) return res.status(404).json({ msg: 'Visit not found' });

        const agentId = requestAgentId(req);
        if (!agentIdsMatch(visit.agent, agentId)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const parsedHours = hoursSpent != null ? Number(hoursSpent) : visit.hoursSpent;
        if (!Number.isFinite(parsedHours) || parsedHours < 0.1 || parsedHours > 24) {
            return res.status(400).json({ msg: 'Hours spent must be between 0.1 and 24.' });
        }

        const visitDate = date ? new Date(date) : visit.date;
        if (Number.isNaN(new Date(visitDate).getTime())) {
            return res.status(400).json({ msg: 'Invalid visit date.' });
        }

        const visitFields = {
            date: visitDate,
            time: time || visit.time,
            hoursSpent: parsedHours,
            purpose: purpose || visit.purpose,
            notes: notes ?? visit.notes,
            visitImages: Array.isArray(visitImages) ? visitImages.slice(0, 6) : visit.visitImages,
            challenges: challenges ?? visit.challenges,
            status: status ? normalizeVisitStatus(status) : visit.status,
        };

        visit = await FieldVisit.findByIdAndUpdate(
            req.params.id,
            { $set: visitFields },
            { new: true, runValidators: true }
        ).populate('farmer', 'name contact region district community id');

        if (date) {
            await Farmer.findByIdAndUpdate(visit.farmer._id, { lastVisit: visitDate });
        }

        res.json(visit);
    } catch (err) {
        console.error('updateFieldVisit error:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: err.message || 'Server error' });
    }
};
