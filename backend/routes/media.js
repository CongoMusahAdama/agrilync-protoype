const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {
    getMedia,
    uploadMedia,
    deleteMedia,
    getMediaStats,
    syncMedia
} = require('../controllers/mediaController');

const mediaUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

// @route   GET api/media
// @desc    Get all media for an agent
// @access  Private
router.get('/', auth, getMedia);

// @route   POST api/media
// @desc    Upload media (JSON base64 or multipart file)
// @access  Private
router.post('/', auth, (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return mediaUpload.single('file')(req, res, (err) => {
            if (err) {
                const message = err.code === 'LIMIT_FILE_SIZE'
                    ? 'File is too large. Maximum upload size is 50MB.'
                    : (err.message || 'Could not process the uploaded file.');
                return res.status(400).json({ msg: message });
            }
            next();
        });
    }
    next();
}, uploadMedia);

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
