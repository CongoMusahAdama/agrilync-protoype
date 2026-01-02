const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    type: {
        type: String,
        required: true,
        enum: ['field-visit', 'harvest', 'planting', 'inspection', 'monitoring', 'issue', 'other']
    },
    date: { type: String, required: true },
    notes: { type: String, required: true },
    media: [{
        type: { type: String, enum: ['image', 'video', 'document'] },
        url: String, // Base64 or URL
        name: String
    }],
    status: {
        type: String,
        enum: ['submitted', 'reviewed', 'archived'],
        default: 'submitted'
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
