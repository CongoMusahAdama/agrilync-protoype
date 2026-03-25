const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getMedia,
    uploadMedia,
    deleteMedia,
    getMediaStats,
    syncMedia
} = require('../controllers/mediaController');

// @route   GET api/media
// @desc    Get all media for an agent
// @access  Private
router.get('/', auth, getMedia);

// @route   POST api/media
// @desc    Upload media
// @access  Private
router.post('/', auth, uploadMedia);

// @route   DELETE api/media/:id
// @desc    Delete media
// @access  Private
router.delete('/:id', auth, deleteMedia);

// @route   POST api/media/sync
// @desc    Sync pending media
// @access  Private
router.post('/sync', auth, syncMedia);

// @route   GET api/media/stats
// @desc    Get media stats
// @access  Private
router.get('/stats', auth, getMediaStats);

module.exports = router;
