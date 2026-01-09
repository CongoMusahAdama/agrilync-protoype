const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // F-2045
    name: { type: String, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    location: { type: String, required: true },
    crop: { type: String, required: true },
    status: {
        type: String,
        enum: ['verified', 'scheduled', 'needs-attention'],
        default: 'scheduled'
    },
    lastVisit: { type: String },
    nextVisit: { type: String },
    currentStage: { type: String, default: 'planning' },
    stageDetails: {
        type: Map,
        of: {
            date: String,
            notes: String,
            status: { type: String, enum: ['completed', 'in-progress', 'pending'], default: 'pending' },
            activities: [{
                id: String,
                date: String,
                activity: String,
                description: String,
                resources: String,
                media: [{
                    type: { type: String, enum: ['image', 'video'] },
                    url: String,
                    name: String
                }]
            }]
        },
        default: {
            planning: { date: '', notes: '', status: 'pending', activities: [] },
            planting: { date: '', notes: '', status: 'pending', activities: [] },
            growing: { date: '', notes: '', status: 'pending', activities: [] },
            harvesting: { date: '', notes: '', status: 'pending', activities: [] },
            maintenance: { date: '', notes: '', status: 'pending', activities: [] },
            other: { date: '', notes: '', status: 'pending', activities: [] }
        }
    },
    reportStatus: {
        type: String,
        enum: ['Ready', 'Pending', 'Flagged', 'Awaiting'],
        default: 'Pending'
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }
}, { timestamps: true });

// Indexing for performance
farmSchema.index({ agent: 1, status: 1 });
farmSchema.index({ agent: 1, createdAt: -1 });

module.exports = mongoose.models.Farm || mongoose.model('Farm', farmSchema);
