const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Upload Base64 image to S3
 * @param {string} base64String - Full base64 string (including data:image/...)
 * @param {string} folder - Folder in S3 bucket (e.g., 'farmers', 'id-cards')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
exports.uploadBase64ToS3 = async (base64String, folder = 'uploads') => {
    if (!base64String || !base64String.startsWith('data:')) {
        return base64String; // Return original if not a base64 string or empty
    }

    try {
        // Extract content type and data
        const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string format');
        }

        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = contentType.split('/')[1] || 'png';
        const fileName = `${folder}/${uuidv4()}.${extension}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: contentType,
            // ACL: 'public-read' // Commented out - best practice is to use Bucket Policy or CloudFront
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Construct the URL (Assuming bucket is public or using CloudFront)
        // Adjust this based on your AWS configuration (e.g., if using custom domain)
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error('Failed to upload image to S3');
    }
};
