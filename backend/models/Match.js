const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // M-101
    investor: { type: String, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    farmType: { type: String, required: true },
    value: { type: String, required: true },
    investmentType: { type: String, default: 'Cash' },
    category: { type: String, default: 'General' },
    partnershipModel: { type: String, default: 'Profit Sharing' },
    matchDate: { type: String },
    startDate: { type: String },
    progress: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Active', 'Pending Funding', 'Flagged', 'Pending Approval', 'Completed'],
        default: 'Pending Approval'
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    documents: {
        farmerSignature: { type: Boolean, default: false },
        investorSignature: { type: Boolean, default: false },
        agentApproval: { type: Boolean, default: false },
        agreement: { type: String }
    },
    notes: { type: String },
    updates: [{
        title: String,
        description: String,
        date: String,
        progress: Number
    }],
    timeline: [{
        action: String,
        date: String,
        type: { type: String, enum: ['info', 'issue', 'complete', 'match'], default: 'info' }
    }],
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

// Indexing for performance
matchSchema.index({ agent: 1, approvalStatus: 1 });

module.exports = mongoose.models.Match || mongoose.model('Match', matchSchema);
