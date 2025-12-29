const Farm = require('../models/Farm');

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
    const { id, name, farmer, location, crop, status, lastVisit, nextVisit, reportStatus } = req.body;

    try {
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
            agent: req.agent.id
        });

        const farm = await newFarm.save();
        res.json(farm);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/farms/:id
// @desc    Update farm status or next visit
exports.updateFarm = async (req, res) => {
    const { status, nextVisit, reportStatus } = req.body;

    try {
        let farm = await Farm.findById(req.params.id);
        if (!farm) return res.status(404).json({ msg: 'Farm not found' });

        if (farm.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) farm.status = status;
        if (nextVisit) farm.nextVisit = nextVisit;
        if (reportStatus) farm.reportStatus = reportStatus;

        await farm.save();
        res.json(farm);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
