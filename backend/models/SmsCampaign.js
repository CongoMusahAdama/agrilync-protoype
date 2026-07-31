const mongoose = require('mongoose');

const smsCampaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true },
        group: { type: String, required: true },
        channel: {
            type: String,
            enum: ['sms', 'email', 'both'],
            default: 'sms',
        },
        recipients: { type: Number, default: 0 },
        sent: { type: Number, default: 0 },
        smsSent: { type: Number, default: 0 },
        emailSent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['sent', 'failed', 'partial', 'pending'],
            default: 'pending',
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    },
    { timestamps: true }
);

module.exports = mongoose.models.SmsCampaign || mongoose.model('SmsCampaign', smsCampaignSchema);
