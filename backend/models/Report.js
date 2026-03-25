const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    type: {
        type: String,
        required: true,
        // Match the frontend values
        enum: ['Routine Inspection', 'Pest Alert', 'Harvest Prep', 'Soil Test', 'field-visit', 'harvest', 'planting', 'inspection', 'monitoring', 'issue', 'other']
    },
    date: { type: String, required: true },
    notes: { type: String, required: true },
    cropStage: { type: String },
    healthScore: { type: String },
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

// Indexing for performance
reportSchema.index({ agent: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
