const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: false // Optional, can be general media
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: false
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Photo', 'Video', 'KYC Doc', 'Harvest'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    size: {
        type: String, // e.g., "1.2 MB"
        required: false
    },
    format: {
        type: String, // e.g., "JPG", "PDF"
        required: false
    },
    status: {
        type: String,
        enum: ['Synced', 'Pending', 'Failed'],
        default: 'Synced'
    },
    album: {
        type: String,
        required: false
    },
    region: String,
    district: String,
    community: String,
    metadata: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        device: String,
        capturedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Media || mongoose.model('Media', MediaSchema);
