const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
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
    lastUpdated: { type: String },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
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
    livestockType: { type: String },
    cropsGrown: { type: String },
    livestockType: { type: String },
    idCardFront: { type: String },
    idCardBack: { type: String },
    fieldNotes: { type: String },
    investmentInterest: {
        type: String,
        enum: ['yes', 'no', 'maybe'],
        default: 'no'
    },
    preferredInvestmentType: {
        type: String,
        enum: ['inputs', 'cash', 'equipment', 'partnership'],
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
    }
}, { timestamps: true });

// Hash password before saving
farmerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
farmerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);
