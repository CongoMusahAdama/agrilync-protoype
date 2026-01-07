const mongoose = require('mongoose');

const scheduledVisitSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    visitType: {
        type: String,
        enum: ['farm-visit', 'community-visit', 'farmer-meeting'],
        required: true
    },
    farmers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer'
    }],
    // For community visits
    community: {
        type: String,
        required: false
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: String, // Format: "HH:MM"
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    // SMS notification tracking
    smsSent: {
        type: Boolean,
        default: false
    },
    smsSentAt: {
        type: Date,
        required: false
    },
    smsMessage: {
        type: String,
        required: false
    },
    // Phone call tracking
    phoneCallMade: {
        type: Boolean,
        default: false
    },
    phoneCallMadeAt: {
        type: Date,
        required: false
    },
    phoneCallNotes: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for performance
scheduledVisitSchema.index({ agent: 1, scheduledDate: -1 });
scheduledVisitSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.models.ScheduledVisit || mongoose.model('ScheduledVisit', scheduledVisitSchema);
