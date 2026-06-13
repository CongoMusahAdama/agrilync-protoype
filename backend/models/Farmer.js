const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//farmers table
const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, unique: true, sparse: true }, // Auto-generated AgriLync grower ID (LYG-########)
    password: { type: String, required: false }, // Optional - will be auto-generated if not provided
    region: { type: String, required: true },
    district: { type: String, required: true },
    community: { type: String, required: true },
    farmType: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'pending', 'inactive'],
        default: 'pending'
    },
    investmentStatus: { type: String, default: 'Pending' },
    lastVisit: { type: String },
    lastUpdated: { type: String },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: false },
    /** Nearest field agent routed to verify this self-onboarded grower */
    verificationAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: false },
    onboardingSource: {
        type: String,
        enum: ['agent', 'self'],
        default: 'agent',
    },
    profileCompleteness: { type: Number, default: 0, min: 0, max: 100 },
    profilePicture: { type: String }, // Base64
    currentStage: { type: String, default: 'planning' },
    stageDetails: {
        type: Map,
        of: {
            date: String,
            notes: String,
            status: { type: String, enum: ['completed', 'in-progress', 'pending'], default: 'pending' },
            activities: [{
                id: String,
                date: String,
                activity: String,
                description: String,
                resources: String
            }]
        },
        default: {
            planning: { date: '', notes: '', status: 'pending', activities: [] },
            planting: { date: '', notes: '', status: 'pending', activities: [] },
            growing: { date: '', notes: '', status: 'pending', activities: [] },
            harvesting: { date: '', notes: '', status: 'pending', activities: [] },
            maintenance: { date: '', notes: '', status: 'pending', activities: [] },
            other: { date: '', notes: '', status: 'pending', activities: [] }
        }
    },
    contact: { type: String },
    gender: { type: String },
    dob: { type: String },
    language: { type: String },
    otherLanguage: { type: String },
    email: { type: String },
    farmSize: { type: Number },
    yearsOfExperience: { type: Number },
    landOwnershipStatus: { type: String },
    cropsGrown: { type: String },
    cropList: [{ type: String }],
    cropsGrownOther: { type: String },
    livestockType: { type: String },
    livestockInventory: [{
        type: { type: String },
        count: { type: Number, default: 0 },
        otherLabel: { type: String },
    }],
    trainingModules: [{ type: String }],
    farmLocation: {
        lat: { type: Number },
        lng: { type: Number },
        measuredAcres: { type: Number },
        /** Polygon vertices [lat, lng] from field boundary measurement */
        boundary: { type: [[Number]], default: undefined },
    },
    idCardFront: { type: String },
    idCardBack: { type: String },
    ghanaCardNumber: { type: String, unique: true, sparse: true },
    verificationConfirmed: { type: Boolean, default: false },
    /** Human-readable agent ID (e.g. LYC-…) stamped at onboarding */
    onboardingAgentId: { type: String },
    gpsLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    imageHash: { type: String },
    flags: [{ type: String }],
    fieldNotes: { type: String },
    investmentInterest: {
        type: String,
        enum: ['yes', 'no', 'maybe'],
        default: 'no'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    preferredInvestmentType: {
        type: String,
        enum: ['inputs', 'cash', 'equipment', 'partnership', 'mechanization', 'irrigation', 'infrastructure', 'working_capital'],
    },
    estimatedCapitalNeed: {
        type: Number, // optional, farmer estimate
    },
    hasPreviousInvestment: {
        type: Boolean,
        default: false
    },
    investmentReadinessScore: {
        type: Number, // calculated later by system/admin
    },
    /** Dedicated serial printed on the grower ID card (AGL-C-########) */
    digitalCardNumber: { type: String, unique: true, sparse: true, index: true },
    digitalCardIssuedAt: { type: Date },
    digitalCardGenerated: { type: Boolean, default: false },
}, { timestamps: true });

// Indexing for performance
farmerSchema.index({ agent: 1, status: 1, region: 1 });
farmerSchema.index({ status: 1, region: 1 });
farmerSchema.index({ verificationAgent: 1, status: 1 });

const {
    isGhanaCardDerivedGrowerId,
    generateUniqueGrowerId,
} = require('../utils/generateGrowerId');
const { issueDigitalCardIfNeeded } = require('../utils/generateGrowerCard');

// Internal ID and Password Generation
farmerSchema.pre('save', async function () {
    if (!this.id || isGhanaCardDerivedGrowerId(this.id, this.ghanaCardNumber)) {
        this.id = await generateUniqueGrowerId(this.constructor);
    }

    if (this.status === 'active') {
        await issueDigitalCardIfNeeded(this);
    }

    // 2. Password - Generate random if not provided
    if (!this.password) {
        const crypto = require('crypto');
        this.password = crypto.randomBytes(12).toString('hex');
    }

    // 3. Hash password
    if (this.isModified('password') && this.password) {
        if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
});

// Method to compare password
farmerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Clear model from cache to force schema update in dev environment
if (mongoose.models.Farmer) {
    delete mongoose.models.Farmer;
}

module.exports = mongoose.model('Farmer', farmerSchema);
