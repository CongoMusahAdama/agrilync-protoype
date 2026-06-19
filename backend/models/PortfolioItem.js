const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        region: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        date: { type: String, default: '' },
        description: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
        featured: { type: Boolean, default: false },
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

portfolioItemSchema.index({ published: 1, featured: -1, sortOrder: 1, createdAt: -1 });

module.exports = mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', portfolioItemSchema);
