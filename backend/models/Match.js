const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // M-101
    investor: { type: String, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    farmType: { type: String, required: true },
    value: { type: String, required: true },
    matchDate: { type: String },
    status: {
        type: String,
        enum: ['Active', 'Pending Funding', 'Pending Approval', 'Completed'],
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
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Match || mongoose.model('Match', matchSchema);
