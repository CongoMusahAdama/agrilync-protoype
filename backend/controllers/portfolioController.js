const PortfolioItem = require('../models/PortfolioItem');
const { uploadDataUrl } = require('../utils/cloudinary');

function formatItem(doc) {
    const item = doc.toObject ? doc.toObject() : doc;
    return {
        id: String(item._id),
        title: item.title,
        image: item.image,
        region: item.region,
        category: item.category,
        date: item.date || '',
        description: item.description || '',
        sortOrder: item.sortOrder ?? 0,
        featured: !!item.featured,
        published: item.published !== false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

async function resolveImageUrl(image) {
    if (!image || typeof image !== 'string') return null;
    const trimmed = image.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('data:')) {
        return uploadDataUrl(trimmed, 'agrilync/portfolio');
    }
    return trimmed;
}

// GET /api/portfolio — public website
exports.getPublicPortfolio = async (req, res) => {
    try {
        const items = await PortfolioItem.find({ published: true })
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();
        res.json(items.map(formatItem));
    } catch (err) {
        console.error('getPublicPortfolio error:', err.message);
        res.status(500).json({ msg: 'Could not load portfolio' });
    }
};

// GET /api/super-admin/portfolio
exports.getAdminPortfolio = async (req, res) => {
    try {
        const items = await PortfolioItem.find()
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();
        res.json(items.map(formatItem));
    } catch (err) {
        console.error('getAdminPortfolio error:', err.message);
        res.status(500).json({ msg: 'Could not load portfolio items' });
    }
};

// POST /api/super-admin/portfolio
exports.createPortfolioItem = async (req, res) => {
    try {
        const { title, region, category, date, description, sortOrder, featured, published, image } = req.body;

        if (!title?.trim() || !region?.trim() || !category?.trim()) {
            return res.status(400).json({ msg: 'Title, region, and category are required.' });
        }

        const imageUrl = await resolveImageUrl(image);
        if (!imageUrl) {
            return res.status(400).json({ msg: 'An image is required.' });
        }

        const maxOrderDoc = await PortfolioItem.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean();
        const nextSortOrder = Number.isFinite(Number(sortOrder)) && Number(sortOrder) > 0
            ? Number(sortOrder)
            : (maxOrderDoc?.sortOrder ?? 0) + 100;

        const item = await PortfolioItem.create({
            title: title.trim(),
            image: imageUrl,
            region: region.trim(),
            category: category.trim(),
            date: date?.trim() || '',
            description: description?.trim() || '',
            sortOrder: nextSortOrder,
            featured: false,
            published: published !== false,
        });

        res.status(201).json(formatItem(item));
    } catch (err) {
        console.error('createPortfolioItem error:', err.message);
        res.status(500).json({ msg: err.message || 'Could not create portfolio item' });
    }
};

// PUT /api/super-admin/portfolio/:id
exports.updatePortfolioItem = async (req, res) => {
    try {
        const item = await PortfolioItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Portfolio item not found' });

        const { title, region, category, date, description, sortOrder, featured, published, image } = req.body;

        if (title != null) item.title = String(title).trim();
        if (region != null) item.region = String(region).trim();
        if (category != null) item.category = String(category).trim();
        if (date != null) item.date = String(date).trim();
        if (description != null) item.description = String(description).trim();
        if (sortOrder != null && Number.isFinite(Number(sortOrder))) item.sortOrder = Number(sortOrder);
        if (published != null) item.published = !!published;

        if (featured != null) {
            item.featured = false;
        }

        if (image != null && String(image).trim()) {
            const imageUrl = await resolveImageUrl(image);
            if (imageUrl) item.image = imageUrl;
        }

        await item.save();
        res.json(formatItem(item));
    } catch (err) {
        console.error('updatePortfolioItem error:', err.message);
        res.status(500).json({ msg: err.message || 'Could not update portfolio item' });
    }
};

// DELETE /api/super-admin/portfolio/:id
exports.deletePortfolioItem = async (req, res) => {
    try {
        const item = await PortfolioItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Portfolio item not found' });
        res.json({ msg: 'Portfolio item removed' });
    } catch (err) {
        console.error('deletePortfolioItem error:', err.message);
        res.status(500).json({ msg: 'Could not delete portfolio item' });
    }
};
