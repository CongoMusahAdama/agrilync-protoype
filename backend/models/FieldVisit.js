const mongoose = require('mongoose');

const FieldVisitSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,  // Format: "HH:MM"
        required: true
    },
    hoursSpent: {
        type: Number,  // Decimal number for hours (e.g., 1.5 for 1hr 30min)
        required: true,
        min: 0.1,
        max: 24
    },
    purpose: {
        type: String,
        required: true,
        enum: ['Routine inspection', 'Pest control', 'Irrigation check', 'Harvest assessment', 'Soil testing', 'Training session', 'Other']
    },
    status: {
        type: String,
        enum: ['Completed', 'Follow-up Required'],
        default: 'Completed'
    },
    notes: {
        type: String,
        required: false
    },
    visitImages: [{
        type: String  // Base64 encoded images
    }],
    challenges: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.FieldVisit || mongoose.model('FieldVisit', FieldVisitSchema);
