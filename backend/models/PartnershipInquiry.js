const mongoose = require('mongoose');

const partnershipInquirySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        organization: { type: String, trim: true, default: '' },
        role: {
            type: String,
            required: true,
            enum: [
                'Institution',
                'Development Partner',
                'Individual Investor',
                'NGO / Foundation',
                'Government Agency',
                'Other',
            ],
        },
        message: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Closed'],
            default: 'New',
        },
        source: { type: String, default: 'partnership-page' },
    },
    { timestamps: true }
);

partnershipInquirySchema.index({ createdAt: -1 });
partnershipInquirySchema.index({ status: 1 });

module.exports =
    mongoose.models.PartnershipInquiry ||
    mongoose.model('PartnershipInquiry', partnershipInquirySchema);
