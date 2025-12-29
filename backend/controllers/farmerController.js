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
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/farmers
// @desc    Add a new farmer
exports.addFarmer = async (req, res) => {
    const {
        name, region, district, community, farmType, contact, gender, dob,
        language, otherLanguage, email, farmSize, yearsOfExperience,
        landOwnershipStatus, cropsGrown, livestockType, fieldNotes, password, idCardFront, idCardBack,
        investmentInterest, preferredInvestmentType, estimatedCapitalNeed, hasPreviousInvestment, investmentReadinessScore
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
            idCardFront,
            idCardBack,
            fieldNotes,
            investmentInterest,
            preferredInvestmentType,
            estimatedCapitalNeed,
            hasPreviousInvestment,
            investmentReadinessScore,
            agent: req.agent.id,
            status: 'active', // Agent-onboarded farmers are active by default
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        const farmer = await newFarmer.save();
        res.json(farmer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/farmers/queue/pending
// @desc    Get all pending farmers in the agent's region
exports.getPendingFarmersByRegion = async (req, res) => {
    try {
        const farmers = await Farmer.find({
            status: 'pending',
            region: req.agent.region
        }).select('-idCardFront -idCardBack -password');
        res.json(farmers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/farmers/:id
// @desc    Update farmer status (Verification)
exports.updateFarmer = async (req, res) => {
    const {
        status, investmentStatus, agentId,
        name, contact, gender, dob, language, otherLanguage, email,
        region, district, community, farmType, farmSize, yearsOfExperience,
        landOwnershipStatus, cropsGrown, livestockType, fieldNotes,
        investmentInterest, preferredInvestmentType, estimatedCapitalNeed,
        hasPreviousInvestment, investmentReadinessScore
    } = req.body;

    try {
        let farmer = await Farmer.findById(req.params.id);
        if (!farmer) return res.status(404).json({ msg: 'Farmer not found' });

        // If it's a verification (status -> active), assign the current agent if none
        if (status === 'active' && !farmer.agent) {
            farmer.agent = req.agent.id;
        } else if (farmer.agent && farmer.agent.toString() !== req.agent.id) {
            // For existing farmers, still ensure agent ownership unless verifying a pending one
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) farmer.status = status;
        if (investmentStatus) farmer.investmentStatus = investmentStatus;
        if (agentId) farmer.agent = agentId;

        // General fields update
        if (name) farmer.name = name;
        if (contact) farmer.contact = contact;
        if (gender) farmer.gender = gender;
        if (dob) farmer.dob = dob;
        if (language) farmer.language = language;
        if (otherLanguage) farmer.otherLanguage = otherLanguage;
        if (email) farmer.email = email;
        if (region) farmer.region = region;
        if (district) farmer.district = district;
        if (community) farmer.community = community;
        if (farmType) farmer.farmType = farmType;
        if (farmSize) farmer.farmSize = farmSize;
        if (yearsOfExperience) farmer.yearsOfExperience = yearsOfExperience;
        if (landOwnershipStatus) farmer.landOwnershipStatus = landOwnershipStatus;
        if (cropsGrown) farmer.cropsGrown = cropsGrown;
        if (livestockType) farmer.livestockType = livestockType;
        if (fieldNotes) farmer.fieldNotes = fieldNotes;

        // Investment fields update
        if (investmentInterest) farmer.investmentInterest = investmentInterest;
        if (preferredInvestmentType) farmer.preferredInvestmentType = preferredInvestmentType;
        if (estimatedCapitalNeed !== undefined) farmer.estimatedCapitalNeed = estimatedCapitalNeed;
        if (hasPreviousInvestment !== undefined) farmer.hasPreviousInvestment = hasPreviousInvestment;
        if (investmentReadinessScore !== undefined) farmer.investmentReadinessScore = investmentReadinessScore;

        farmer.lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await farmer.save();

        // If verified, create a success notification for the agent
        if (status === 'active') {
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
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
