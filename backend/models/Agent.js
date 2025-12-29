const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    agentId: { type: String, required: true, unique: true },
    title: { type: String, default: 'Junior Lync Agent' },
    avatar: { type: String, default: '/lovable-uploads/profile.png' },
    region: { type: String, required: true },
    districts: [String],
    contact: { type: String },
    hasChangedPassword: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified'
    },
    stats: {
        farmersOnboarded: { type: Number, default: 0 },
        activeFarms: { type: Number, default: 0 },
        investorMatches: { type: Number, default: 0 },
        pendingDisputes: { type: Number, default: 0 },
        reportsThisMonth: { type: Number, default: 0 },
        trainingsAttended: { type: Number, default: 0 }
    }
}, { timestamps: true });

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
