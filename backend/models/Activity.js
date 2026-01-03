const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    type: {
        type: String,
        enum: ['training', 'report', 'verification', 'dispute', 'info'],
        default: 'info'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for performance
ActivitySchema.index({ agent: 1, createdAt: -1 });

module.exports = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
