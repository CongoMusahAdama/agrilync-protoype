const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    type: {
        type: String,
        enum: ['training', 'report', 'alert', 'verification', 'message', 'dispute', 'match', 'event'],
        default: 'message'
    },
    read: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

// Indexing for performance
notificationSchema.index({ agent: 1, read: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
