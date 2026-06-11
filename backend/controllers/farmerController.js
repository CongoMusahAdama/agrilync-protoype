const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Agent = require('../models/Agent');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { uploadDataUrl } = require('../utils/cloudinary');
const dashboardService = require('../services/dashboardService');
const {
    buildFarmerOnboardingFields,
    ensurePrimaryFarm,
    normalizeRegion,
} = require('../utils/farmerOnboarding');
const { sendFarmerWelcomeSms } = require('../utils/farmerWelcomeSms');
const {
    findNearestVerificationAgent,
    buildPendingQueueQuery,
    agentCanVerifyFarmer,
} = require('../utils/agentAssignment');

const resolveAgentId = (agent) => agent?._id || agent?.id || null;

// @route   GET api/farmers
// @desc    Get all farmers for current agent (with pagination)
exports.getFarmers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const mongoose = require('mongoose');
        const agentId = req.agent._id || req.agent.id;
        const region = req.agent.region || '';
        
        // Normalize region for searching (e.g. "Ashanti" matches "Ashanti Region")
        const regionRegex = new RegExp(region.replace(' Region', '').trim(), 'i');

        const query = { 
            $or: [
                { agent: agentId },
                { region: { $regex: regionRegex } },
                { agent: mongoose.isValidObjectId(agentId) ? new mongoose.Types.ObjectId(agentId) : agentId }
            ]
        };

        const [farmers, total] = await Promise.all([
            Farmer.find(query)
                .select('name id status region district community farmType contact createdAt ghanaCardNumber profilePicture investmentStatus')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Farmer.countDocuments(query)
        ]);

        console.log(`[GET_FARMERS] Agent: ${agentId}, Region: ${region}, Found: ${farmers.length}/${total}`);

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
        const agentId = resolveAgentId(req.agent);
        const isAssignedAgent = farmer.agent && agentId && farmer.agent.toString() === agentId.toString();
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
// @desc    Lync Grower self-onboarding (pending verification)
exports.registerFarmerPublic = async (req, res) => {
    try {
        const ghanaCardNumber = req.body.ghanaCardNumber?.trim().toUpperCase();
        if (ghanaCardNumber) {
            const ghaRegex = /^GHA-\d{9}-\d$/;
            if (!ghaRegex.test(ghanaCardNumber)) {
                return res.status(400).json({ msg: 'Invalid Ghana Card number format. Use GHA-XXXXXXXXX-X' });
            }
            const existingGha = await Farmer.findOne({ ghanaCardNumber });
            if (existingGha) {
                return res.status(400).json({
                    msg: `Ghana Card already registered for ${existingGha.name}. Contact your field agent if this is an error.`,
                });
            }
        }

        if (req.body.dob) {
            const dobDate = new Date(req.body.dob);
            if (Number.isNaN(dobDate.getTime()) || dobDate > new Date()) {
                return res.status(400).json({ msg: 'Invalid Date of Birth' });
            }
        }

        const onboardingFields = buildFarmerOnboardingFields(req.body, { onboardingSource: 'self' });
        const normalizedRegion = onboardingFields.region || normalizeRegion(req.body.region);

        if (!onboardingFields.name || !onboardingFields.contact || !normalizedRegion) {
            return res.status(400).json({ msg: 'Name, phone number, and region are required.' });
        }
        if (!onboardingFields.district || !onboardingFields.community) {
            return res.status(400).json({ msg: 'District and community are required.' });
        }
        if (!onboardingFields.farmType) {
            return res.status(400).json({ msg: 'Farm type is required.' });
        }

        const s3ProfilePicture = req.body.profilePicture
            ? await uploadDataUrl(req.body.profilePicture, 'farmers/profiles')
            : undefined;
        const s3IdCardFront = req.body.idCardFront
            ? await uploadDataUrl(req.body.idCardFront, 'farmers/ids')
            : undefined;
        const s3IdCardBack = req.body.idCardBack
            ? await uploadDataUrl(req.body.idCardBack, 'farmers/ids')
            : undefined;

        const draftFarmer = {
            ...onboardingFields,
            region: normalizedRegion,
            ghanaCardNumber,
        };
        const nearestAgent = await findNearestVerificationAgent(draftFarmer);

        const newFarmer = new Farmer({
            ...onboardingFields,
            password: req.body.password,
            profilePicture: s3ProfilePicture,
            idCardFront: s3IdCardFront,
            idCardBack: s3IdCardBack,
            region: normalizedRegion,
            ghanaCardNumber,
            status: 'pending',
            verificationAgent: nearestAgent?._id || undefined,
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        });

        const farmer = await newFarmer.save();

        if (nearestAgent?._id) {
            await Notification.create({
                title: 'New Grower Verification Req.',
                time: 'Just now',
                type: 'verification',
                priority: 'high',
                agent: nearestAgent._id,
                read: false,
            });
        }

        sendFarmerWelcomeSms(farmer, { onboardingSource: 'self' }).catch((err) =>
            console.error('Welcome SMS failed:', err.message)
        );

        res.json({
            success: true,
            farmerId: farmer._id,
            lyncId: farmer.id,
            verificationAgent: nearestAgent
                ? { name: nearestAgent.name, agentId: nearestAgent.agentId }
                : null,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'A grower with this Ghana Card or ID already exists.' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('registerFarmerPublic error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

// @route   POST api/farmers/auth/login
// @desc    Lync Grower login (phone or email + password)
exports.growerLogin = async (req, res) => {
    const { email, password } = req.body;
    const identifier = String(email || '').trim();

    if (!identifier || !password) {
        return res.status(400).json({ msg: 'Phone/email and password are required' });
    }

    try {
        const farmer = await Farmer.findOne({
            $or: [{ email: identifier }, { contact: identifier }],
        });

        if (!farmer) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (farmer.status === 'inactive') {
            return res.status(403).json({
                msg: 'This account is inactive. Please contact your AgriLync field agent.',
            });
        }

        const isMatch = await farmer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const jwt = require('jsonwebtoken');
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'Server auth is not configured.' });
        }

        const token = jwt.sign(
            { farmer: { id: farmer._id.toString() }, accountType: 'grower' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '8h' }
        );

        res.json({
            token,
            accountType: 'grower',
            farmer: {
                id: farmer._id.toString(),
                lyncId: farmer.id,
                name: farmer.name,
                status: farmer.status,
                region: farmer.region,
                district: farmer.district,
                community: farmer.community,
                contact: farmer.contact,
                email: farmer.email,
                profilePicture: farmer.profilePicture,
            },
        });
    } catch (err) {
        console.error('growerLogin error:', err.message);
        res.status(500).json({ msg: 'Server error. Please try again.' });
    }
};

// @route   POST api/farmers
// @desc    Add a new farmer
exports.addFarmer = async (req, res) => {
    let createdFarmerId = null;
    try {
        const agentId = resolveAgentId(req.agent);
        if (!agentId) {
            return res.status(401).json({ msg: 'Agent session is invalid. Please log out and sign in again.' });
        }

        const onboardingFields = buildFarmerOnboardingFields(
            { ...req.body, onboardingAgentId: req.body.onboardingAgentId || req.agent?.agentId },
            { onboardingSource: 'agent' }
        );
        const ghanaCardNumber = req.body.ghanaCardNumber?.trim().toUpperCase();
        const { profilePicture, idCardFront, idCardBack } = req.body;

        if (ghanaCardNumber) {
            const regex = /^GHA-\d{9}-\d$/;
            if (!regex.test(ghanaCardNumber)) {
                return res.status(400).json({ msg: 'Invalid Ghana Card number format. Use GHA-XXXXXXXXX-X' });
            }
        }

        if (req.body.dob) {
            const dobDate = new Date(req.body.dob);
            if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
                return res.status(400).json({ msg: 'Invalid Date of Birth' });
            }
        }

        let generatedHash = '';
        if (idCardFront) {
            const crypto = require('crypto');
            generatedHash = crypto.createHash('md5').update(idCardFront).digest('hex');
        }

        const flags = [];

        if (ghanaCardNumber) {
            const existingGha = await Farmer.findOne({ ghanaCardNumber });
            if (existingGha) {
                if (!existingGha.flags.includes('Duplicate Ghana Card Attempted')) {
                    existingGha.flags.push('Duplicate Ghana Card Attempted');
                    await existingGha.save();
                }
                return res.status(400).json({
                    msg: `Ghana Card already registered for ${existingGha.name}. Check Grower Directory or use a different card.`,
                });
            }
        }

        if (generatedHash) {
            const existingImg = await Farmer.findOne({ imageHash: generatedHash });
            if (existingImg) {
                flags.push('Reused Image Hash Detected');
            }
        }

        // Upload images to Cloudinary if present
        const s3ProfilePicture = profilePicture ? await uploadDataUrl(profilePicture, 'farmers/profiles') : undefined;
        const s3IdCardFront = idCardFront ? await uploadDataUrl(idCardFront, 'farmers/ids') : undefined;
        const s3IdCardBack = idCardBack ? await uploadDataUrl(idCardBack, 'farmers/ids') : undefined;

        const newFarmer = new Farmer({
            ...onboardingFields,
            profilePicture: s3ProfilePicture,
            idCardFront: s3IdCardFront,
            idCardBack: s3IdCardBack,
            ghanaCardNumber,
            imageHash: generatedHash,
            flags,
            agent: agentId,
            status: 'active',
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        });

        const farmer = await newFarmer.save();
        createdFarmerId = farmer._id;

        await ensurePrimaryFarm(farmer, agentId);

        await Activity.create({
            agent: agentId,
            type: 'verification',
            title: `Onboarded ${farmer.name}`,
            description: `New farmer added in ${farmer.community || 'their community'}`,
        });

        dashboardService.invalidateCache(agentId);

        sendFarmerWelcomeSms(farmer, { onboardingSource: 'agent', agent: req.agent }).catch((err) =>
            console.error('Welcome SMS failed:', err.message)
        );

        res.status(201).json(farmer);
    } catch (err) {
        if (createdFarmerId) {
            await Farm.deleteMany({ farmer: createdFarmerId }).catch(() => {});
            await Farmer.deleteOne({ _id: createdFarmerId }).catch(() => {});
            console.error('addFarmer rolled back partial farmer:', createdFarmerId.toString());
        }
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Ghana Card already exists in the system' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('addFarmer error:', err.message);
        res.status(500).json({ msg: err.message || 'Server error during farmer onboarding' });
    }
};

// @route   GET api/farmers/queue/pending
// @desc    Get all pending farmers in the agent's region
exports.getPendingFarmersByRegion = async (req, res) => {
    try {
        const farmers = await Farmer.find(buildPendingQueueQuery(req.agent))
            .select('-idCardFront -idCardBack -password')
            .sort({ createdAt: -1 })
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

        const agentId = req.agent._id || req.agent.id;
        const isAssignedAgent = farmer.agent && farmer.agent.toString() === agentId.toString();
        const canVerify = agentCanVerifyFarmer(req.agent, farmer);

        if (!isAssignedAgent && !canVerify) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this farmer profile' });
        }

        if (canVerify && farmer.status === 'pending' && updateData.status === 'active') {
            farmer.agent = agentId;
            if (!farmer.verificationAgent) {
                farmer.verificationAgent = agentId;
            }
        }

        // Explicitly allowed fields for update
        const mergedBody = { ...farmer.toObject(), ...updateData };
        const structuredFields = buildFarmerOnboardingFields(mergedBody, {
            onboardingSource: farmer.onboardingSource || updateData.onboardingSource || 'agent',
        });

        const allowedScalars = [
            'name', 'region', 'district', 'community', 'farmType', 'contact', 'gender',
            'dob', 'language', 'otherLanguage', 'email', 'farmSize', 'yearsOfExperience',
            'landOwnershipStatus', 'cropsGrown', 'cropsGrownOther', 'livestockType',
            'fieldNotes', 'investmentInterest', 'status',
            'preferredInvestmentType', 'estimatedCapitalNeed', 'hasPreviousInvestment',
            'currentStage', 'stageDetails', 'ghanaCardNumber', 'verificationConfirmed', 'onboardingAgentId',
            'investmentReadinessScore', 'profileCompleteness',
        ];

        for (const key of allowedScalars) {
            if (structuredFields[key] !== undefined) {
                farmer[key] = typeof structuredFields[key] === 'string'
                    ? structuredFields[key].trim()
                    : structuredFields[key];
            } else if (updateData[key] !== undefined) {
                farmer[key] = typeof updateData[key] === 'string' ? updateData[key].trim() : updateData[key];
            }
        }

        if (updateData.cropList !== undefined) farmer.cropList = structuredFields.cropList;
        if (updateData.livestockInventory !== undefined) {
            farmer.livestockInventory = structuredFields.livestockInventory;
            farmer.livestockType = structuredFields.livestockType;
        }
        if (updateData.trainingModules !== undefined) farmer.trainingModules = structuredFields.trainingModules;
        if (updateData.farmLocation !== undefined || updateData.farmLatitude != null) {
            farmer.farmLocation = structuredFields.farmLocation;
            farmer.gpsLocation = structuredFields.gpsLocation;
        }

        for (const imageKey of ['profilePicture', 'idCardFront', 'idCardBack']) {
            if (updateData[imageKey] !== undefined) {
                if (typeof updateData[imageKey] === 'string' && updateData[imageKey].startsWith('data:')) {
                    const folder = imageKey === 'profilePicture' ? 'farmers/profiles' : 'farmers/ids';
                    farmer[imageKey] = await uploadDataUrl(updateData[imageKey], folder);
                } else {
                    farmer[imageKey] = updateData[imageKey];
                }
            }
        }

        farmer.profileCompleteness = structuredFields.profileCompleteness;
        farmer.lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await farmer.save();

        if (farmer.status === 'active' && farmer.agent) {
            await ensurePrimaryFarm(farmer, farmer.agent);
        }

        // Notification logic
        if (updateData.status === 'active' && canVerify) {
            await Notification.create({
                title: `Grower ${farmer.name} Verified`,
                time: 'Just now',
                type: 'verification',
                priority: 'medium',
                agent: agentId,
                read: false
            });

            sendFarmerWelcomeSms(farmer, { onboardingSource: 'agent', agent: req.agent }).catch((err) =>
                console.error('Verification welcome SMS failed:', err.message)
            );
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

// @route   GET api/farmers/flagged
// @desc    Get all flagged farmers (admin view)
exports.getFlaggedFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find({ 'flags.0': { $exists: true } })
            .select('-password -idCardFront -idCardBack')
            .populate('agent', 'name email region')
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, total: farmers.length, data: farmers });
    } catch (err) {
        console.error('getFlaggedFarmers error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/farmers/:id/resolve-flag
// @desc    Resolve (clear) a specific flag from a farmer record
// @route   POST api/farmers/bulk-sms
// @desc    Send bulk SMS to selected farmers via mNotify
exports.sendBulkSms = async (req, res) => {
    const { farmerIds, message } = req.body;

    if (!message?.trim()) {
        return res.status(400).json({ success: false, message: 'Message text is required.' });
    }
    if (!Array.isArray(farmerIds) || farmerIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Select at least one farmer.' });
    }

    try {
        const { dispatchBulkGrowerSms } = require('../utils/bulkGrowerSms');
        const agentId = req.agent._id || req.agent.id;

        const result = await dispatchBulkGrowerSms({
            farmerIds,
            agentId,
            message: message.trim(),
            agentName: req.agent.name || 'AgriLync Agent',
            requireAgentOwnership: true,
        });

        Activity.create({
            agent: agentId,
            type: 'event',
            title: 'Bulk SMS broadcast',
            description: result.sent
                ? `mNotify queued SMS for ${result.succeeded}/${result.total} grower(s).`
                : `Bulk SMS attempted — ${result.message}`,
        }).catch((err) => console.error('Bulk SMS activity log failed:', err.message));

        if (!result.sent && result.total === 0 && !result.success) {
            const status = result.message?.includes('matching growers') ? 403 : 400;
            return res.status(status).json({ success: false, message: result.message, data: result.data });
        }

        if (!result.sent && result.total > 0) {
            return res.json({
                success: false,
                message: result.message,
                data: { total: result.total, succeeded: 0, failed: result.failed },
            });
        }

        if (!result.sent) {
            const hint = result.simulated
                ? 'mNotify API key is not configured on the server.'
                : 'Check farmer phone numbers and mNotify account balance.';
            return res.status(502).json({
                success: false,
                message: `SMS could not be delivered. ${hint}`,
                data: result.data,
            });
        }

        return res.json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (err) {
        console.error('sendBulkSms error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send bulk SMS. Please try again.',
            error: err.message,
        });
    }
};

exports.resolveFlag = async (req, res) => {
    try {
        const { flag } = req.body;
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer not found' });
        }

        if (flag) {
            farmer.flags = farmer.flags.filter(f => f !== flag);
        } else {
            farmer.flags = []; // Clear all flags if none specified
        }

        await farmer.save();
        res.json({ success: true, message: 'Flag resolved', flags: farmer.flags });
    } catch (err) {
        console.error('resolveFlag error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
