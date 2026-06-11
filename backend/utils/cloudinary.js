const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload Base64 image to Cloudinary
 * @param {string} base64String 
 * @param {string} folder 
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadDataUrl = async (dataUrl, folder = 'agrilync') => {
  if (!dataUrl?.startsWith('data:')) return dataUrl;

  if (!isCloudinaryConfigured()) {
    if (dataUrl.length > 12_000_000) {
      throw new Error('File is too large. Configure Cloudinary or use a file under 8MB.');
    }
    return dataUrl;
  }

  try {
    return await uploadBase64ToCloudinary(dataUrl, folder);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && dataUrl.length <= 12_000_000) {
      console.warn('[cloudinary] Upload failed — using inline data URL in dev:', err.message);
      return dataUrl;
    }
    throw err;
  }
};

const uploadBase64ToCloudinary = async (base64String, folder = 'agrilync') => {
  try {
    if (!base64String) return null;

    // Detect resource type from base64 MIME (e.g., data:video/mp4;base64,...)
    const isVideo = base64String.startsWith('data:video/');
    
    // Use Cloudinary's uploader for base64 strings
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: isVideo ? 'video' : 'auto'
    });

    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary Upload Error:', err.message);
    const hint = /file size|too large|max/i.test(err.message || '')
      ? 'File is too large for cloud storage. Please use a smaller image (under 10MB).'
      : (err.message || 'Cloud storage upload failed');
    throw new Error(hint);
  }
};

/**
 * Delete image from Cloudinary (optional)
 * @param {string} publicId 
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary Delete Error:', err.message);
  }
};

/**
 * Upload a local file (e.g. from Multer) to Cloudinary — use on Render instead of disk.
 * @param {string} filePath
 * @param {string} folder
 * @returns {Promise<string>} secure_url
 */
const uploadFileToCloudinary = async (filePath, folder = 'agrilync/blogs') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });
  return result.secure_url;
};

const isCloudinaryConfigured = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

module.exports = {
  cloudinary,
  uploadBase64ToCloudinary,
  uploadDataUrl,
  uploadFileToCloudinary,
  isCloudinaryConfigured,
  deleteFromCloudinary
};
