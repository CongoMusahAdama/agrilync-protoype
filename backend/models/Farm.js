const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // F-2045
    name: { type: String, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    location: { type: String, required: true },
    crop: { type: String, required: true },
    status: {
        type: String,
        enum: ['verified', 'scheduled', 'needs-attention'],
        default: 'scheduled'
    },
    lastVisit: { type: String },
    nextVisit: { type: String },
    reportStatus: {
        type: String,
        enum: ['Ready', 'Pending', 'Flagged', 'Awaiting'],
        default: 'Pending'
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

module.exports = mongoose.models.Farm || mongoose.model('Farm', farmSchema);
