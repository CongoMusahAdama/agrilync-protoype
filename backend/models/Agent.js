const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    agentId: { type: String, required: true, unique: true },
    title: { type: String, default: 'Junior Lync Agent' },
    avatar: { type: String, default: '/lovable-uploads/profile.png' },
    region: { type: String, required: true },
    assignedRegions: { type: [String], default: ['Ashanti'] },
    districts: [String],
    contact: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    dob: { type: Date },
    hasChangedPassword: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified'
    },
    role: {
        type: String,
        enum: ['super_admin', 'supervisor', 'agent'],
        default: 'agent'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    stats: {
        farmersOnboarded: { type: Number, default: 0 },
        activeFarms: { type: Number, default: 0 },
        investorMatches: { type: Number, default: 0 },
        pendingDisputes: { type: Number, default: 0 },
        reportsThisMonth: { type: Number, default: 0 },
        trainingsAttended: { type: Number, default: 0 }
    },
    isLoggedIn: { type: Boolean, default: false },
    currentSessionId: { type: String, default: null },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
    },
    appPreferences: {
        language: { type: String, default: 'English' },
        theme: { type: String, default: 'light' },
        highContrast: { type: Boolean, default: false },
        compactView: { type: Boolean, default: false }
    },
    fcmToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null }
}, { timestamps: true });

// Indexing for performance
agentSchema.index({ fcmToken: 1 });

// Hash password before saving
agentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
agentSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
