const Consultation = require('../models/Consultation');
const Activity = require('../models/Activity');

// @route   GET api/consultations
// @desc    Get all consultation requests for agent
exports.getConsultations = async (req, res) => {
    try {
        if (req.agent && req.agent.isMock) {
            return res.json([
                {
                    id: 'c1',
                    farmer: 'Felix Kwabena',
                    purpose: 'Post-harvest cocoa storage advice',
                    region: 'Ashanti Region',
                    date: 'Oct 24, 2026',
                    time: '10:30 AM',
                    mode: 'In-Person',
                    status: 'Pending'
                },
                {
                    id: 'c2',
                    farmer: 'Dora Antwi',
                    purpose: 'Maize fertilization schedule sync',
                    region: 'Ashanti Region',
                    date: 'Oct 25, 2026',
                    time: '02:00 PM',
                    mode: 'Virtual',
                    status: 'Pending'
                }
            ]);
        }

        const agentId = req.agent._id || req.agent.id;
        const consultations = await Consultation.find({ agent: agentId }).sort({ createdAt: -1 });
        res.json(consultations);
    } catch (err) {
        console.error('getConsultations error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/consultations/:id/:action
// @desc    Accept, decline or reschedule a consultation
exports.handleConsultationAction = async (req, res) => {
    const { id, action } = req.params;

    try {
        if (req.agent && req.agent.isMock) {
            console.log(`[MOCK REQ] ${action} consultation:`, id);
            return res.json({ success: true, message: `Consultation ${action}ed successfully` });
        }

        const consultation = await Consultation.findById(id);
        if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found' });

        const agentId = req.agent._id || req.agent.id;
        if (consultation.agent.toString() !== agentId.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const statusMap = {
            'accept': 'Confirmed',
            'decline': 'Declined',
            'reschedule': 'Reschedule Requested'
        };

        if (statusMap[action]) {
            consultation.status = statusMap[action];
            await consultation.save();

            // Log activity
            try {
                await Activity.create({
                    agent: agentId,
                    type: 'event',
                    title: `Consultation ${action}ed`,
                    description: `${consultation.purpose} for ${consultation.farmer}`
                });
            } catch (aErr) {}

            return res.json({ success: true, message: `Consultation ${action}ed successfully` });
        }

        res.status(400).json({ success: false, message: 'Invalid action' });
    } catch (err) {
        console.error('handleConsultationAction error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
