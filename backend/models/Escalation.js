const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['supervisor_escalation', 'critical_dispute', 'agent_performance', 'data_inconsistency', 'system_risk']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'investigating', 'resolved', 'dismissed'],
        default: 'open'
    },
    message: { type: String, required: true },
    source: { type: String }, // e.g., 'System', 'Supervisor Name'
    region: { type: String },
    relatedId: { type: String }, // ID of the related farm, agent, etc.
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Escalation', escalationSchema);
