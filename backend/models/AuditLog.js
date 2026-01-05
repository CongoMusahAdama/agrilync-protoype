const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    userRole: { type: String, required: true },
    details: { type: String },
    targetResource: { type: String }, // e.g., 'Farm:123', 'Agent:456'
    targetId: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
