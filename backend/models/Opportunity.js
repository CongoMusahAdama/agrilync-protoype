const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    investor: { type: String, required: true }, // Name of investor/org
    type: {
        type: String,
        enum: ['Input Support', 'Cash Financing', 'Equipment Lease', 'Land Development', 'Mixed'],
        required: true
    },
    valueRange: { type: String, required: true }, // e.g. "GHS 5,000 - 20,000"
    description: { type: String },
    targetRegions: [{ type: String }], // e.g. ["Northern", "Ashanti"] - empty means all
    requirements: { type: String },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Coming Soon'],
        default: 'Open'
    },
    createdAt: { type: Date, default: Date.now },
    logo: { type: String } // Optional URL/Base64 for investor logo
});

module.exports = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema);
