const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // #D102
    parties: {
        farmer: { type: String, required: true },
        investor: { type: String, required: true },
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
    },
    type: { type: String, required: true },
    severity: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    dateLogged: { type: String },
    status: {
        type: String,
        enum: ['Under Review', 'Resolved', 'Pending', 'Escalated'],
        default: 'Pending'
    },
    region: { type: String },
    description: { type: String },
    timeline: [{
        date: { type: String },
        action: { type: String },
        user: { type: String }
    }],
    evidence: [String],
    notes: { type: String },
    resolution: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Dispute || mongoose.model('Dispute', disputeSchema);
