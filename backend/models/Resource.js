const mongoose = require('mongoose');

const RESOURCE_CATEGORIES = ['tools', 'guides', 'templates', 'videos', 'reports'];

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: RESOURCE_CATEGORIES,
    },
    type: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    documentUrl: { type: String, required: true, trim: true },
    badge: { type: String, default: 'Free', trim: true },
    tags: [{ type: String, trim: true }],
    stats: { type: String, default: '', trim: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
module.exports.RESOURCE_CATEGORIES = RESOURCE_CATEGORIES;
