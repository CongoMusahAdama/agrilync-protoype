const Dispute = require('../models/Dispute');
const Activity = require('../models/Activity');

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
        let dispute = await Dispute.findById(req.params.id);
        if (!dispute) return res.status(404).json({ msg: 'Dispute not found' });

        if (dispute.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) dispute.status = status;
        if (resolution) dispute.resolution = resolution;
        if (notes) dispute.notes = notes;

        if (action) {
            dispute.timeline.push({
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                action: action,
                user: req.agent.name || 'Agent'
            });
        }

        await dispute.save();
        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
