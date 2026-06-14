const mongoose = require('mongoose');
const Farm = require('../models/Farm');
const Farmer = require('../models/Farmer');

// @route   GET api/farms
// @desc    Get all farms for current agent
exports.getFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ agent: req.agent.id }).populate('farmer', 'name');
        res.json(farms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/farms
// @desc    Add a new farm
exports.addFarm = async (req, res) => {
    let { id, name, farmer, location, crop, status, lastVisit, nextVisit, reportStatus, currentStage, stageDetails } = req.body;

    try {
        // Auto-generate ID if not provided (F-XXXX)
        if (!id) {
            id = `F-${Math.floor(1000 + Math.random() * 9000)}`;
            // Optional: Check if duplicate exists, but for prototype random is usually fine 
            // or we could use a counter. For now random is better than erroring.
        }

        const newFarm = new Farm({
            id,
            name,
            farmer,
            location,
            crop,
            status,
            lastVisit,
            nextVisit,
            reportStatus,
            currentStage,
            stageDetails,
            agent: req.agent.id
        });

        const farm = await newFarm.save();
        res.json(farm);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Resolve MongoDB farm document from route param (_id or legacy F-XXXX id)
async function findFarmByParam(id) {
    if (!id || id === 'undefined') return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const byId = await Farm.findById(id);
        if (byId) return byId;
    }
    return Farm.findOne({ id: String(id) });
}

function agentIdsMatch(storedAgentId, requestAgentId) {
    if (!storedAgentId || !requestAgentId) return false;
    return String(storedAgentId) === String(requestAgentId);
}

// @route   PUT api/farms/:id
// @desc    Update farm status or next visit
exports.updateFarm = async (req, res) => {
    const { status, nextVisit, reportStatus, currentStage, stageDetails } = req.body;

    try {
        let farm = await findFarmByParam(req.params.id);
        if (!farm) return res.status(404).json({ msg: 'Farm not found' });

        const requestAgentId = req.agent._id || req.agent.id;
        let authorized = agentIdsMatch(farm.agent, requestAgentId);

        if (!authorized && farm.farmer) {
            const farmer = await Farmer.findById(farm.farmer).select('agent').lean();
            authorized = agentIdsMatch(farmer?.agent, requestAgentId);
        }

        if (!authorized) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) farm.status = status;
        if (nextVisit) farm.nextVisit = nextVisit;
        if (reportStatus) farm.reportStatus = reportStatus;
        if (currentStage) farm.currentStage = currentStage;
        if (stageDetails) farm.stageDetails = stageDetails;

        await farm.save();

        // Keep grower profile in sync when journey stage changes
        if (currentStage && farm.farmer) {
            await Farmer.findByIdAndUpdate(farm.farmer, { currentStage });
        }

        res.json(farm);
    } catch (err) {
        console.error('updateFarm error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
