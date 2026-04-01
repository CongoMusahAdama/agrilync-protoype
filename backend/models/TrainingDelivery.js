const mongoose = require('mongoose');

/**
 * TrainingDelivery — records a training session an agent schedules
 * to deliver to their registered growers in the field.
 *
 * Distinct from the platform "Training" model (which tracks
 * trainings the agent themselves attend / gets certified in).
 */
const trainingDeliverySchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
        index: true
    },

    // AgriLync module catalogue (matches frontend MODULES constant)
    moduleId: {
        type: String,
        required: true,
        enum: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5']
    },
    moduleTitle: { type: String, required: true },
    moduleSubtitle: { type: String },          // e.g. "Module 1"

    // Delivery scheduling
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, default: '09:00' },
    mode: {
        type: String,
        enum: ['In-Person Farm Visit', 'Community Group Session', 'Farmer Group Hall', 'Demo Session', 'WhatsApp Voice/Video'],
        required: true
    },
    venue: { type: String },
    community: { type: String },
    language: { type: String },

    // Farmers targeted in this session
    farmers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer'
    }],

    // Status lifecycle
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },

    // Optional notes / pre-delivery plan
    notes: { type: String },

    // Completion tracking
    completedAt: { type: Date },
    completionNotes: { type: String },
    farmersAttended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }],

    // SMS notification tracking
    smsSent: { type: Boolean, default: false },
    smsSentAt: { type: Date },

}, { timestamps: true });

// Indexes for common queries
trainingDeliverySchema.index({ agent: 1, status: 1 });
trainingDeliverySchema.index({ agent: 1, deliveryDate: -1 });

module.exports = mongoose.models.TrainingDelivery
    || mongoose.model('TrainingDelivery', trainingDeliverySchema);
