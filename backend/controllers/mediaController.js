const Media = require('../models/Media');
const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const { uploadBase64ToCloudinary } = require('../utils/cloudinary');

// @desc    Get all media for an agent with filtering
// @route   GET /api/media
// @access  Private
exports.getMedia = async (req, res) => {
    try {
        const { type, farmId, search, region, district, community } = req.query;
        
        let query = { agent: req.agent.id };
        
        // Filter by media type
        if (type && type !== 'All' && type !== 'all') {
            if (type === 'Photos') query.type = 'Photo';
            else if (type === 'Videos') query.type = 'Video';
            else if (type === 'KYC Docs' || type === 'KYC Doc') query.type = 'KYC Doc';
            else if (type === 'Harvests' || type === 'Harvest') query.type = 'Harvest';
            else query.type = type;
        }

        // Filter by farm
        if (farmId) query.farm = farmId;

        // Search in names
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        // Filter by geolocation metadata if provided
        if (region && region !== 'all' && region !== 'All') query.region = region;
        if (district && district !== 'all' && district !== 'All') query.district = district;
        if (community && community !== 'all' && community !== 'All') query.community = community;

        const media = await Media.find(query)
            .populate('farmer', 'name')
            .populate('farm', 'name')
            .sort({ createdAt: -1 });
        
        res.json(media);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Upload media (supports single or batch)
// @route   POST /api/media
// @access  Private
exports.uploadMedia = async (req, res) => {
    try {
        const items = Array.isArray(req.body) ? req.body : [req.body];
        const uploadedItems = [];

        for (const item of items) {
            let { 
                name, 
                type, 
                url, 
                thumbnail, 
                size, 
                format, 
                farmerId, 
                farmId, 
                album,
                metadata 
            } = item;

            // Validate and upload
            if (url && url.startsWith('data:')) {
                // Security check: Only allow images, videos, and PDFs
                const allowedPrefixes = ['data:image/', 'data:video/', 'data:application/pdf'];
                const isValid = allowedPrefixes.some(p => url.startsWith(p));
                
                if (!isValid) {
                    return res.status(400).json({ msg: 'Invalid file type' });
                }

                url = await uploadBase64ToCloudinary(url, 'media/uploads');
            }
            
            if (thumbnail && thumbnail.startsWith('data:')) {
                thumbnail = await uploadBase64ToCloudinary(thumbnail, 'media/thumbnails');
            }

            const newMedia = new Media({
                agent: req.agent.id,
                farmer: farmerId,
                farm: farmId,
                name: name || `Upload_${Date.now()}`,
                type: type || 'Photo',
                url,
                thumbnail,
                size: size || '0 KB',
                format: format || 'JPG',
                album,
                region: req.agent.region,
                district: req.agent.district,
                community: req.agent.community,
                metadata
            });

            const savedMedia = await newMedia.save();
            uploadedItems.push(savedMedia);
        }

        res.json(Array.isArray(req.body) ? uploadedItems : uploadedItems[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Sync pending media
// @route   POST /api/media/sync
// @access  Private
exports.syncMedia = async (req, res) => {
    try {
        // Find all pending media for this agent
        const pendingMedia = await Media.find({ 
            agent: req.agent.id, 
            status: 'Pending' 
        });

        if (pendingMedia.length === 0) {
            return res.json({ msg: 'No pending items to sync', count: 0 });
        }

        // Simulating sync process
        await Media.updateMany(
            { agent: req.agent.id, status: 'Pending' },
            { $set: { status: 'Synced' } }
        );

        res.json({ 
            msg: 'Sync completed successfully', 
            count: pendingMedia.length,
            items: pendingMedia.map(m => m._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({ msg: 'Media not found' });
        }

        // Check if media belongs to agent
        if (media.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await media.deleteOne();
        res.json({ msg: 'Media removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get media stats with real calculations
// @route   GET /api/media/stats
// @access  Private
exports.getMediaStats = async (req, res) => {
    try {
        const agentId = req.agent.id;
        
        const totalFiles = await Media.countDocuments({ agent: agentId });
        const photos = await Media.countDocuments({ agent: agentId, type: 'Photo' });
        const videos = await Media.countDocuments({ agent: agentId, type: 'Video' });
        const documents = await Media.countDocuments({ agent: agentId, type: 'KYC Doc' });
        const harvests = await Media.countDocuments({ agent: agentId, type: 'Harvest' });
        const pendingSync = await Media.countDocuments({ agent: agentId, status: 'Pending' });

        // Calculate actual storage if possible, otherwise use smarter mock
        const mediaWithSizes = await Media.find({ agent: agentId }, 'size');
        let totalSizeMB = 0;
        mediaWithSizes.forEach(item => {
            if (item.size) {
                const match = item.size.match(/([\d.]+)\s*(MB|KB|GB)/i);
                if (match) {
                    let val = parseFloat(match[1]);
                    let unit = match[2].toUpperCase();
                    if (unit === 'KB') totalSizeMB += val / 1024;
                    else if (unit === 'MB') totalSizeMB += val;
                    else if (unit === 'GB') totalSizeMB += val * 1024;
                }
            }
        });

        const storageStr = totalSizeMB > 1024 
            ? (totalSizeMB / 1024).toFixed(1) + ' GB' 
            : totalSizeMB.toFixed(1) + ' MB';

        res.json({
            totalFiles: totalFiles.toLocaleString(),
            photos: photos.toLocaleString(),
            videos: videos.toLocaleString(),
            documents: (documents).toLocaleString(),
            harvests: harvests.toLocaleString(),
            pendingSync,
            storageUsed: storageStr || '0.0 MB'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
