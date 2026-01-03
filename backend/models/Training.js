const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    mode: { type: String, required: true },
    trainer: { type: String },
    description: { type: String },
    spots: { type: Number },
}, { timestamps: true });

// Indexing for performance
trainingSchema.index({ date: 1 });

const agentTrainingSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    training: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: true },
    status: {
        type: String,
        enum: ['Registered', 'Completed', 'Ongoing', 'Missed'],
        default: 'Registered'
    },
    certificate: { type: Boolean, default: false }
}, { timestamps: true });

// Indexing for performance
agentTrainingSchema.index({ agent: 1 });

module.exports = {
    Training: mongoose.models.Training || mongoose.model('Training', trainingSchema),
    AgentTraining: mongoose.models.AgentTraining || mongoose.model('AgentTraining', agentTrainingSchema)
};
