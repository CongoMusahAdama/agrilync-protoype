const Farmer = require('../models/Farmer');
const Agent = require('../models/Agent');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { uploadBase64ToS3 } = require('../utils/s3');

// @route   GET api/farmers
// @desc    Get all farmers for current agent (with pagination)
exports.getFarmers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [farmers, total] = await Promise.all([
            Farmer.find({ agent: req.agent.id })
                .select('-idCardFront -idCardBack -password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Farmer.countDocuments({ agent: req.agent.id })
        ]);

        res.json({
            success: true,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: farmers
        });
    } catch (err) {
        console.error('getFarmers error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/farmers/:id
// @desc    Get a single farmer by ID (includes Ghana card images for editing)
exports.getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id).select('-password');
        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer not found' });
        }

        // Security check: Only assigned agent can view full farmer data
        const isAssignedAgent = farmer.agent && farmer.agent.toString() === req.agent.id;
        if (!isAssignedAgent) {
            return res.status(401).json({ success: false, message: 'Not authorized to view this farmer profile' });
        }

        res.json(farmer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/farmers/public/register
// @desc    Solo farmer self-onboarding (pending verification)
exports.registerFarmerPublic = async (req, res) => {
    try {
        const {
            name, region, district, community, farmType, contact, gender, dob,
            language, otherLanguage, email, farmSize, yearsOfExperience,
            landOwnershipStatus, cropsGrown, livestockType, password,
            profilePicture, idCardFront, idCardBack
        } = req.body;

        // Upload images to S3 if present
        const s3ProfilePicture = await uploadBase64ToS3(req.body.profilePicture, 'farmers/profiles');
        const s3IdCardFront = await uploadBase64ToS3(req.body.idCardFront, 'farmers/ids');
        const s3IdCardBack = await uploadBase64ToS3(req.body.idCardBack, 'farmers/ids');

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
            profilePicture: s3ProfilePicture,
            idCardFront: s3IdCardFront,
            idCardBack: s3IdCardBack,
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
        const {
            name, region, district, community, farmType, contact, gender,
            dob, language, otherLanguage, email, farmSize, yearsOfExperience,
            landOwnershipStatus, cropsGrown, livestockType, profilePicture,
            idCardFront, idCardBack, fieldNotes, investmentInterest,
            preferredInvestmentType, estimatedCapitalNeed, hasPreviousInvestment
        } = req.body;

        // Upload images to S3 if present
        const s3ProfilePicture = await uploadBase64ToS3(profilePicture, 'farmers/profiles');
        const s3IdCardFront = await uploadBase64ToS3(idCardFront, 'farmers/ids');
        const s3IdCardBack = await uploadBase64ToS3(idCardBack, 'farmers/ids');

        const newFarmer = new Farmer({
            name, region, district, community, farmType, contact, gender,
            dob, language, otherLanguage, email, farmSize, yearsOfExperience,
            landOwnershipStatus, cropsGrown, livestockType,
            profilePicture: s3ProfilePicture,
            idCardFront: s3IdCardFront,
            idCardBack: s3IdCardBack,
            fieldNotes, investmentInterest,
            preferredInvestmentType, estimatedCapitalNeed, hasPreviousInvestment,
            agent: req.agent.id,
            status: 'active', // Agent-onboarded farmers are active by default
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        const farmer = await newFarmer.save();

        // Log Activity
        await Activity.create({
            agent: req.agent.id,
            type: 'verification',
            title: `Onboarded ${farmer.name}`,
            description: `New farmer added in ${farmer.community || 'their community'}`
        });

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

        // Explicitly allowed fields for update
        const allowedUpdates = [
            'name', 'region', 'district', 'community', 'farmType', 'contact', 'gender',
            'dob', 'language', 'otherLanguage', 'email', 'farmSize', 'yearsOfExperience',
            'landOwnershipStatus', 'cropsGrown', 'livestockType', 'profilePicture',
            'idCardFront', 'idCardBack', 'fieldNotes', 'investmentInterest', 'status',
            'preferredInvestmentType', 'estimatedCapitalNeed', 'hasPreviousInvestment',
            'currentStage', 'stageDetails'
        ];

        // Update fields if provided and allowed
        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                // If it's a Base64 image, upload to S3 first
                if (['profilePicture', 'idCardFront', 'idCardBack'].includes(key) &&
                    typeof updateData[key] === 'string' &&
                    updateData[key].startsWith('data:')) {

                    const folder = key === 'profilePicture' ? 'farmers/profiles' : 'farmers/ids';
                    farmer[key] = await uploadBase64ToS3(updateData[key], folder);
                } else {
                    farmer[key] = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
                }
            }
        }

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
