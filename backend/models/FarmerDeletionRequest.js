const mongoose = require('mongoose');

const farmerDeletionRequestSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
        index: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
        index: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
    reviewNote: { type: String, trim: true, maxlength: 2000 },
    reviewedAt: { type: Date },
    farmerSnapshot: {
        name: String,
        lyncId: String,
        contact: String,
        region: String,
        community: String,
        ghanaCardNumber: String,
    },
}, { timestamps: true });

farmerDeletionRequestSchema.index({ farmer: 1, status: 1 });

module.exports = mongoose.models.FarmerDeletionRequest
    || mongoose.model('FarmerDeletionRequest', farmerDeletionRequestSchema);
