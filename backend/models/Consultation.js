const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    farmer: {
        type: String, // Can be a string name or ObjectId ref if we want to link
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    date: {
        type: String, // e.g., "Oct 24, 2026"
        required: true
    },
    time: {
        type: String, // e.g., "10:30 AM"
        required: true
    },
    mode: {
        type: String,
        enum: ['Virtual', 'In-Person'],
        default: 'In-Person'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Declined', 'Reschedule Requested'],
        default: 'Pending'
    },
    meetingLink: String,
    notes: String
}, { timestamps: true });

consultationSchema.index({ agent: 1, createdAt: -1 });

module.exports = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
