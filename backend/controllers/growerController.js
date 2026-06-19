const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Match = require('../models/Match');
const Agent = require('../models/Agent');
const FieldVisit = require('../models/FieldVisit');
const Media = require('../models/Media');
const { buildFarmerOnboardingFields } = require('../utils/farmerOnboarding');
const { notifyStaffAgent } = require('../utils/staffNotifications');
const { uploadDataUrl } = require('../utils/cloudinary');
const { issueDigitalCardIfNeeded } = require('../utils/generateGrowerCard');
const { buildFarmProfilePayload, findAndConfirmActivity } = require('../utils/farmProfileHelpers');

/** Grower-facing queries — exclude agent-only KYC / COCOBOD fields */
const GROWER_FARMER_SELECT =
    '-password -idCardFront -idCardBack -cocoaCardPhoto -cocoaFarmerId -cocoaCardConsentAt -cocoaCardVerifiedAt -imageHash';

function formatGrowerProfile(farmer) {
    const doc = farmer.toObject ? farmer.toObject() : farmer;
    return {
        id: String(doc._id),
        lyncId: doc.id,
        name: doc.name,
        status: doc.status,
        region: doc.region,
        district: doc.district,
        community: doc.community,
        contact: doc.contact,
        email: doc.email,
        gender: doc.gender,
        dob: doc.dob,
        language: doc.language,
        otherLanguage: doc.otherLanguage,
        ghanaCardNumber: doc.ghanaCardNumber,
        farmType: doc.farmType,
        farmSize: doc.farmSize,
        yearsOfExperience: doc.yearsOfExperience,
        landOwnershipStatus: doc.landOwnershipStatus,
        cropList: doc.cropList || [],
        cropsGrown: doc.cropsGrown,
        cropsGrownOther: doc.cropsGrownOther,
        livestockType: doc.livestockType,
        livestockInventory: doc.livestockInventory || [],
        farmLocation: doc.farmLocation,
        gpsLocation: doc.gpsLocation,
        profilePicture: doc.profilePicture,
        idCardFront: doc.idCardFront,
        idCardBack: doc.idCardBack,
        fieldNotes: doc.fieldNotes,
        investmentInterest: doc.investmentInterest,
        preferredInvestmentType: doc.preferredInvestmentType,
        estimatedCapitalNeed: doc.estimatedCapitalNeed,
        hasPreviousInvestment: doc.hasPreviousInvestment,
        investmentReadinessScore: doc.investmentReadinessScore,
        trainingModules: doc.trainingModules || [],
        verificationConfirmed: doc.verificationConfirmed,
        onboardingAgentId: doc.onboardingAgentId,
        onboardingSource: doc.onboardingSource,
        currentStage: doc.currentStage || 'planning',
        investmentStatus: doc.investmentStatus,
        profileCompleteness: doc.profileCompleteness ?? 0,
        digitalCardNumber: doc.digitalCardNumber || null,
        digitalCardIssuedAt: doc.digitalCardIssuedAt || null,
        digitalCardGenerated: Boolean(doc.digitalCardGenerated),
        investorBio: doc.investorBio || '',
        growerStageNotes: doc.growerStageNotes
            ? Object.fromEntries(
                  doc.growerStageNotes instanceof Map
                      ? doc.growerStageNotes.entries()
                      : Object.entries(doc.growerStageNotes)
              )
            : {},
        stageDetails: doc.stageDetails
            ? Object.fromEntries(
                  doc.stageDetails instanceof Map
                      ? [...doc.stageDetails.entries()].map(([k, v]) => [k, v])
                      : Object.entries(doc.stageDetails)
              )
            : {},
        lastVisit: doc.lastVisit,
    };
}

function formatFarmSummary(farm) {
    const doc = farm.toObject ? farm.toObject() : farm;
    return {
        id: String(doc._id),
        farmCode: doc.id,
        name: doc.name,
        crop: doc.crop,
        location: doc.location,
        status: doc.status,
        currentStage: doc.currentStage,
        lastVisit: doc.lastVisit,
        nextVisit: doc.nextVisit,
    };
}

// GET /api/grower/me
exports.getMe = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmerId).select(GROWER_FARMER_SELECT);
        if (!farmer) return res.status(404).json({ msg: 'Grower not found' });

        let agent = null;
        const agentRef = farmer.agent || (farmer.status === 'pending' ? farmer.verificationAgent : null);
        if (agentRef) {
            const agentDoc = await Agent.findById(agentRef)
                .select('name contact email agentId region district')
                .lean();
            if (agentDoc) {
                agent = {
                    id: String(agentDoc._id),
                    name: agentDoc.name,
                    contact: agentDoc.contact,
                    email: agentDoc.email,
                    agentId: agentDoc.agentId,
                    region: agentDoc.region,
                    district: agentDoc.district,
                };
            }
        }

        res.json({
            grower: formatGrowerProfile(farmer),
            assignedAgent: agent,
        });
    } catch (err) {
        console.error('grower getMe error:', err.message);
        res.status(500).json({ msg: 'Could not load grower profile' });
    }
};

// PUT /api/grower/me — grower self-service edit; sets pending for agent re-approval when was active
exports.updateMe = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmerId);
        if (!farmer) return res.status(404).json({ msg: 'Grower not found' });

        const wasActive = farmer.status === 'active';
        const mergedBody = { ...farmer.toObject(), ...req.body };
        const structuredFields = buildFarmerOnboardingFields(mergedBody, {
            onboardingSource: farmer.onboardingSource || 'self',
        });

        const allowedScalars = [
            'name', 'district', 'community', 'farmType', 'contact', 'gender',
            'dob', 'language', 'otherLanguage', 'email', 'farmSize', 'yearsOfExperience',
            'landOwnershipStatus', 'cropsGrown', 'cropsGrownOther', 'livestockType',
            'fieldNotes', 'investmentInterest',
            'preferredInvestmentType', 'estimatedCapitalNeed', 'hasPreviousInvestment',
        ];

        for (const key of allowedScalars) {
            if (structuredFields[key] !== undefined) {
                farmer[key] = typeof structuredFields[key] === 'string'
                    ? structuredFields[key].trim()
                    : structuredFields[key];
            } else if (req.body[key] !== undefined) {
                farmer[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
            }
        }

        if (req.body.cropList !== undefined) {
            farmer.cropList = structuredFields.cropList;
            farmer.cropsGrown = structuredFields.cropsGrown;
        }
        if (req.body.livestockInventory !== undefined) {
            farmer.livestockInventory = structuredFields.livestockInventory;
            farmer.livestockType = structuredFields.livestockType;
        }
        if (req.body.farmLocation !== undefined || req.body.farmLatitude != null) {
            farmer.farmLocation = structuredFields.farmLocation;
            farmer.gpsLocation = structuredFields.gpsLocation;
        }

        farmer.profileCompleteness = structuredFields.profileCompleteness;
        farmer.lastUpdated = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        if (wasActive) {
            farmer.status = 'pending';
            farmer.verificationConfirmed = false;
        }

        await farmer.save();

        const notifyAgentId = farmer.verificationAgent || farmer.agent;
        if (notifyAgentId) {
            try {
                await notifyStaffAgent({
                    agentId: notifyAgentId,
                    title: wasActive ? 'Grower profile updated' : 'Grower profile saved',
                    message: `${farmer.name} updated their profile${wasActive ? ' — please review and approve again' : ''}.`,
                    smsBody:
                        `AgriLync: Grower ${farmer.name} (${farmer.id || 'pending ID'}) updated their profile.` +
                        (wasActive ? ' Please review in your agent dashboard.' : ''),
                    type: 'verification',
                    priority: wasActive ? 'high' : 'medium',
                    senderName: 'AgriLync',
                });
            } catch (notifyErr) {
                console.error('grower updateMe notify error:', notifyErr.message);
            }
        }

        res.json({
            grower: formatGrowerProfile(farmer),
            pendingReview: farmer.status === 'pending',
            message: wasActive
                ? 'Profile saved. Your field agent will review your changes.'
                : 'Profile saved.',
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('grower updateMe error:', err.message);
        res.status(500).json({ msg: 'Could not update profile' });
    }
};

// GET /api/grower/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const farmerId = req.farmerId;
        const [farmer, farms, matches] = await Promise.all([
            Farmer.findById(farmerId).select(GROWER_FARMER_SELECT).lean(),
            Farm.find({ farmer: farmerId }).sort({ updatedAt: -1 }).lean(),
            Match.find({ farmer: farmerId }).sort({ updatedAt: -1 }).lean(),
        ]);

        if (!farmer) return res.status(404).json({ msg: 'Grower not found' });

        const activeMatches = matches.filter((m) =>
            ['Active', 'Pending Funding', 'Pending Approval'].includes(m.status)
        );

        res.json({
            grower: formatGrowerProfile(farmer),
            stats: {
                totalFarms: farms.length,
                activeCrops: farms.filter((f) => f.status !== 'needs-attention').length,
                investorMatches: matches.length,
                activeInvestorMatches: activeMatches.length,
                trainingSessions: 0,
                totalEarnings: 0,
                currentStage: farmer.currentStage || 'planning',
            },
            farms: farms.map(formatFarmSummary),
            recentMatches: matches.slice(0, 5).map((m) => ({
                id: m.id,
                investor: m.investor,
                status: m.status,
                value: m.value,
                farmType: m.farmType,
            })),
        });
    } catch (err) {
        console.error('grower getDashboard error:', err.message);
        res.status(500).json({ msg: 'Could not load dashboard' });
    }
};

// GET /api/grower/me/id-card — grower's own Lync digital ID card (issued on first view when active)
exports.getMyIdCard = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmerId)
            .select(`${GROWER_FARMER_SELECT}`)
            .populate('agent', 'name agentId');

        if (!farmer) return res.status(404).json({ success: false, message: 'Grower not found' });

        if (farmer.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Your Lync Grower ID card is available after your profile is verified (active).',
            });
        }

        const hadCard = Boolean(farmer.digitalCardNumber);
        await issueDigitalCardIfNeeded(farmer);
        if (!hadCard && farmer.digitalCardNumber) {
            await farmer.save();
        }

        const payload = farmer.toObject ? farmer.toObject() : farmer;
        res.json({
            success: true,
            farmer: {
                ...payload,
                dob: payload.dob || null,
                yearsOfExperience: payload.yearsOfExperience ?? null,
            },
        });
    } catch (err) {
        console.error('grower getMyIdCard error:', err.message);
        res.status(500).json({ success: false, message: 'Could not load ID card' });
    }
};

// GET /api/grower/farm-profile — read-only farm visibility hub
exports.getFarmProfile = async (req, res) => {
    try {
        const farmerId = req.farmerId;
        const [farmer, farms, visits, media] = await Promise.all([
            Farmer.findById(farmerId).select(GROWER_FARMER_SELECT),
            Farm.find({ farmer: farmerId }).sort({ updatedAt: -1 }).lean(),
            FieldVisit.find({ farmer: farmerId })
                .sort({ date: -1 })
                .limit(10)
                .populate('agent', 'name agentId')
                .lean(),
            Media.find({ farmer: farmerId, type: { $in: ['Photo', 'Harvest'] } })
                .sort({ createdAt: -1 })
                .limit(12)
                .lean(),
        ]);

        if (!farmer) return res.status(404).json({ msg: 'Grower not found' });

        const profile = buildFarmProfilePayload({ farmer, farms, visits, media });

        res.json({
            grower: formatGrowerProfile(farmer),
            ...profile,
        });
    } catch (err) {
        console.error('grower getFarmProfile error:', err.message);
        res.status(500).json({ msg: 'Could not load farm profile' });
    }
};

// POST /api/grower/activities/confirm — farmer taps Yes / Not yet
exports.confirmActivity = async (req, res) => {
    try {
        const { farmId, activityId, response } = req.body;
        if (!farmId || !activityId || !['yes', 'not_yet'].includes(response)) {
            return res.status(400).json({ msg: 'farmId, activityId, and response (yes|not_yet) are required.' });
        }

        const result = await findAndConfirmActivity(Farm, req.farmerId, {
            farmId,
            activityId,
            response,
        });

        if (result.error) {
            return res.status(result.status || 400).json({ msg: result.error });
        }

        res.json({
            success: true,
            message: response === 'yes' ? 'Thanks — activity confirmed.' : 'Noted — your agent will follow up.',
        });
    } catch (err) {
        console.error('grower confirmActivity error:', err.message);
        res.status(500).json({ msg: 'Could not save confirmation.' });
    }
};

// PATCH /api/grower/me/farm-profile — bio + grower stage notes (no re-verification)
exports.updateFarmProfile = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.farmerId);
        if (!farmer) return res.status(404).json({ msg: 'Grower not found' });

        if (req.body.investorBio !== undefined) {
            if (farmer.status !== 'active') {
                return res.status(403).json({
                    msg: 'Investor bio is available after your profile is verified (active).',
                });
            }
            const bio = String(req.body.investorBio || '').trim();
            if (bio.length > 500) {
                return res.status(400).json({ msg: 'Bio must be 500 characters or less.' });
            }
            farmer.investorBio = bio;
        }

        if (req.body.growerStageNotes && typeof req.body.growerStageNotes === 'object') {
            const allowed = ['planning', 'planting', 'growing', 'harvesting'];
            if (!farmer.growerStageNotes) {
                farmer.growerStageNotes = new Map();
            }
            for (const key of allowed) {
                if (req.body.growerStageNotes[key] !== undefined) {
                    const note = String(req.body.growerStageNotes[key] || '').trim().slice(0, 120);
                    farmer.growerStageNotes.set(key, note);
                }
            }
            farmer.markModified('growerStageNotes');
        }

        farmer.lastUpdated = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        await farmer.save();

        res.json({
            grower: formatGrowerProfile(farmer),
            message: 'Farm profile updated.',
        });
    } catch (err) {
        console.error('grower updateFarmProfile error:', err.message);
        res.status(500).json({ msg: 'Could not update farm profile' });
    }
};

// GET /api/grower/farms
exports.getMyFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ farmer: req.farmerId }).sort({ updatedAt: -1 });
        res.json(farms.map(formatFarmSummary));
    } catch (err) {
        console.error('grower getMyFarms error:', err.message);
        res.status(500).json({ msg: 'Could not load farms' });
    }
};
