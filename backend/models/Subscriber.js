const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    source: {
        type: String,
        trim: true,
        default: 'website'
    },
    lastResource: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
