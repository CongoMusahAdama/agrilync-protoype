const Farmer = require('../models/Farmer');
const Agent = require('../models/Agent');
const Notification = require('../models/Notification');

// @route   GET api/farmers
// @desc    Get all farmers for current agent
exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find({ agent: req.agent.id }).select('-idCardFront -idCardBack -password');
        res.json(farmers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/farmers/public/register
// @desc    Solo farmer self-onboarding (pending verification)
exports.registerFarmerPublic = async (req, res) => {
    const {
        name, region, district, community, farmType, contact, gender, dob,
        language, otherLanguage, email, farmSize, yearsOfExperience,
        landOwnershipStatus, cropsGrown, livestockType, password
    } = req.body;

    try {
        const newFarmer = new Farmer({
            name,
            password,
            region,
            district,
            community,
            farmType,
            contact,
            gender,
            dob,
            language,
            otherLanguage,
            email,
            farmSize,
            yearsOfExperience,
            landOwnershipStatus,
            cropsGrown,
            livestockType,
            status: 'pending', // Self-onboarded farmers must be verified
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        const farmer = await newFarmer.save();

        // NOTIFICATION SYSTEM: Notify all agents in the farmer's region
        const regionalAgents = await Agent.find({ region });

        if (regionalAgents.length > 0) {
            const notifications = regionalAgents.map(agent => ({
                title: 'New Grower Verification Req.',
                time: 'Just now',
                type: 'verification',
                priority: 'medium',
                agent: agent._id,
                read: false
            }));
            await Notification.insertMany(notifications);
        }

        res.json({ success: true, farmerId: farmer._id });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('registerFarmerPublic error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

// @route   POST api/farmers
// @desc    Add a new farmer
exports.addFarmer = async (req, res) => {
    try {
        const farmerData = { ...req.body };

        // Trim string fields
        Object.keys(farmerData).forEach(key => {
            if (typeof farmerData[key] === 'string') {
                farmerData[key] = farmerData[key].trim();
            }
        });

        const newFarmer = new Farmer({
            ...farmerData,
            agent: req.agent.id,
            status: 'active', // Agent-onboarded farmers are active by default
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        const farmer = await newFarmer.save();
        res.status(201).json(farmer);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('addFarmer error:', err.message);
        res.status(500).json({ msg: 'Server error during farmer onboarding' });
    }
};

// @route   GET api/farmers/queue/pending
// @desc    Get all pending farmers in the agent's region
exports.getPendingFarmersByRegion = async (req, res) => {
    try {
        const farmers = await Farmer.find({
            status: 'pending',
            region: req.agent.region
        })
            .select('-idCardFront -idCardBack -password')
            .lean();

        res.json(farmers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/farmers/:id
// @desc    Update farmer status (Verification)
exports.updateFarmer = async (req, res) => {
    const updateData = { ...req.body };

    try {
        let farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer not found' });
        }

        // Security check: Only assigned agent or regional agent (for verification) can update
        const isAssignedAgent = farmer.agent && farmer.agent.toString() === req.agent.id;
        const isVerifyingRegional = farmer.status === 'pending' && farmer.region === req.agent.region;

        if (!isAssignedAgent && !isVerifyingRegional) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this farmer profile' });
        }

        // If verifying a pending farmer, assign IT to the current agent
        if (isVerifyingRegional && updateData.status === 'active') {
            farmer.agent = req.agent.id;
        }

        // Update fields if provided
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                farmer[key] = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
            }
        });

        farmer.lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await farmer.save();

        // Notification logic
        if (updateData.status === 'active' && isVerifyingRegional) {
            await Notification.create({
                title: `Grower ${farmer.name} Verified`,
                time: 'Just now',
                type: 'verification',
                priority: 'medium',
                agent: req.agent.id,
                read: false
            });
        }

        res.json(farmer);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('updateFarmer error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
