const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { RESOURCE_CATEGORIES } = require('../models/Resource');
const blogAuth = require('../middleware/blogAuth');

// @route   GET api/resources
// @desc    Public list of published resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find({ published: true })
            .sort({ order: -1, createdAt: -1 });
        res.json(resources);
    } catch (err) {
        console.error('Fetch resources error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/resources/admin/all
// @desc    All resources for blog admin (including unpublished)
router.get('/admin/all', blogAuth, async (req, res) => {
    try {
        const resources = await Resource.find().sort({ order: -1, createdAt: -1 });
        res.json(resources);
    } catch (err) {
        console.error('Fetch admin resources error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/resources
// @desc    Create a resource (blog admin)
router.post('/', blogAuth, async (req, res) => {
    const { title, category, type, description, coverImage, documentUrl, badge, tags, stats, published, order } = req.body;

    if (!title?.trim() || !category || !description?.trim() || !coverImage?.trim() || !documentUrl?.trim()) {
        return res.status(400).json({
            msg: 'Please provide title, category, description, cover image, and document URL.',
        });
    }

    if (!RESOURCE_CATEGORIES.includes(category)) {
        return res.status(400).json({ msg: 'Invalid category.' });
    }

    try {
        const resource = new Resource({
            title: title.trim(),
            category,
            type: type?.trim() || '',
            description: description.trim(),
            coverImage: coverImage.trim(),
            documentUrl: documentUrl.trim(),
            badge: badge?.trim() || 'Free',
            tags: Array.isArray(tags) ? tags : [],
            stats: stats?.trim() || '',
            published: published !== false,
            order: Number(order) || 0,
        });
        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        console.error('Create resource error:', err.message);
        res.status(500).json({ msg: err.message || 'Failed to create resource.' });
    }
});

// @route   PUT api/resources/:id
// @desc    Update a resource (blog admin)
router.put('/:id', blogAuth, async (req, res) => {
    const { title, category, type, description, coverImage, documentUrl, badge, tags, stats, published, order } = req.body;

    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        if (title !== undefined) resource.title = String(title).trim();
        if (category !== undefined) {
            if (!RESOURCE_CATEGORIES.includes(category)) {
                return res.status(400).json({ msg: 'Invalid category.' });
            }
            resource.category = category;
        }
        if (type !== undefined) resource.type = String(type).trim();
        if (description !== undefined) resource.description = String(description).trim();
        if (coverImage !== undefined) resource.coverImage = String(coverImage).trim();
        if (documentUrl !== undefined) resource.documentUrl = String(documentUrl).trim();
        if (badge !== undefined) resource.badge = String(badge).trim();
        if (tags !== undefined) resource.tags = Array.isArray(tags) ? tags : resource.tags;
        if (stats !== undefined) resource.stats = String(stats).trim();
        if (published !== undefined) resource.published = Boolean(published);
        if (order !== undefined) resource.order = Number(order) || 0;

        await resource.save();
        res.json(resource);
    } catch (err) {
        console.error('Update resource error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource (blog admin)
router.delete('/:id', blogAuth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        await resource.deleteOne();
        res.json({ msg: 'Resource removed' });
    } catch (err) {
        console.error('Delete resource error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Resource not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
