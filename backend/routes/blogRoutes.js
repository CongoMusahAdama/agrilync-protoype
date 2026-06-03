const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const BlogAdmin = require('../models/BlogAdmin');
const Farmer = require('../models/Farmer');
const Agent = require('../models/Agent');
const Subscriber = require('../models/Subscriber');
const multer = require('multer');
const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/blogs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage for Blog images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'blog-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Images only! (jpeg, jpg, png, gif, webp)'));
    }
});
const blogAuth = require('../middleware/blogAuth');

// Generate unique slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// Async function to broadcast new blog to subscribers via Resend
async function broadcastBlogEmail(blog) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        console.warn('✗ Blog broadcast skipped: RESEND_API_KEY not set in .env');
        return;
    }

    try {
        const resend = new Resend(RESEND_API_KEY);

        const farmers = await Farmer.find({ email: { $exists: true, $ne: '' } }).select('email');
        const agents = await Agent.find({ email: { $exists: true, $ne: '' } }).select('email');
        const subscribers = await Subscriber.find({ email: { $exists: true, $ne: '' } }).select('email');

        const allEmails = [
            ...farmers.map(f => f.email),
            ...agents.map(a => a.email),
            ...subscribers.map(s => s.email)
        ].filter(Boolean);

        if (allEmails.length === 0) {
            console.log('✗ Blog broadcast: no recipients found.');
            return;
        }

        const uniqueEmails = [...new Set(allEmails)];
        const frontendUrl = process.env.FRONTEND_URL || 'https://agri-lync.netlify.app';
        const articleLink = `${frontendUrl}/blog/${blog.slug}`;
        const imageSrc = blog.image && blog.image.startsWith('http') ? blog.image : `${frontendUrl}${blog.image}`;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'AgriLync Insights <noreply@agrilync.com>';

        const htmlBody = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <img src="${imageSrc}" alt="Article Banner" style="width: 100%; height: 250px; object-fit: cover;" />
                <div style="padding: 30px;">
                    <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; color: #7ede56; text-transform: uppercase; letter-spacing: 0.1em;">AgriLync Insights</p>
                    <h2 style="color: #002f37; margin-top: 0; font-size: 24px; line-height: 1.3;">${blog.title}</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${blog.excerpt}</p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="${articleLink}" style="background-color: #7ede56; color: #002f37; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Read Full Article</a>
                    </div>
                </div>
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">You received this because you are subscribed to AgriLync Insights.</p>
                </div>
            </div>
        `;

        // Resend supports up to 50 recipients per call via bcc
        const batchSize = 50;
        let successCount = 0;
        for (let i = 0; i < uniqueEmails.length; i += batchSize) {
            const batch = uniqueEmails.slice(i, i + batchSize);
            const result = await resend.emails.send({
                from: fromEmail,
                to: [fromEmail], // Required "to" field; actual delivery via bcc
                bcc: batch,
                subject: `New Article: ${blog.title}`,
                html: htmlBody
            });
            if (result.error) {
                console.error(`✗ Blog broadcast batch failed:`, result.error);
            } else {
                successCount += batch.length;
                console.log(`✓ Blog broadcast sent to ${batch.length} recipients (batch ${Math.floor(i/batchSize)+1}).`);
            }
        }
        console.log(`✓ Blog broadcast complete. Total delivered: ${successCount}/${uniqueEmails.length}`);
    } catch (err) {
        console.error('✗ Email broadcast failed:', err.message);
    }
}

// @route   POST api/blogs/auth/login
// @desc    Dedicated login for Blog Admin
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await BlogAdmin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            admin: { id: admin.id }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'jwt_secret_fallback_123',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                requiresPasswordChange: admin.requiresPasswordChange
            }
        });
    } catch (err) {
        console.error('Blog login error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/blogs/auth/force-reset
// @desc    Emergency force reset for admin credentials
router.get('/auth/force-reset', async (req, res) => {
    try {
        let admin = await BlogAdmin.findOne({ email: 'admin@agrilync.com' });
        if (!admin) {
            admin = new BlogAdmin({
                username: 'BlogAdmin',
                email: 'admin@agrilync.com'
            });
        }
        admin.password = 'adminpassword123';
        await admin.save();

        let blogger = await BlogAdmin.findOne({ email: 'raphmawuli.agrilync@gmail.com' });
        if (!blogger) {
            blogger = new BlogAdmin({
                username: 'Raph Mawuli',
                email: 'raphmawuli.agrilync@gmail.com',
                password: 'password123',
                requiresPasswordChange: true
            });
            await blogger.save();
        } else {
            blogger.password = 'password123';
            blogger.requiresPasswordChange = true;
            await blogger.save();
        }

        res.json({ msg: 'Admin and Blogger credentials forcefully reset.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST api/blogs/auth/change-password
// @desc    Change password
router.post('/auth/change-password', blogAuth, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }
    try {
        const admin = await BlogAdmin.findById(req.admin.id);
        if (!admin) return res.status(404).json({ msg: 'User not found' });
        
        admin.password = newPassword;
        admin.requiresPasswordChange = false;
        await admin.save();
        
        res.json({ 
            msg: 'Password updated successfully', 
            admin: { 
                id: admin.id, 
                username: admin.username, 
                email: admin.email, 
                requiresPasswordChange: false 
            } 
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/blogs/auth/me
// @desc    Get currently logged in admin details
router.get('/auth/me', blogAuth, async (req, res) => {
    res.json({
        admin: {
            id: req.admin.id,
            username: req.admin.username,
            email: req.admin.email
        }
    });
});

const { sendSMS } = require('../utils/smsService');

const WHATSAPP_COMMUNITY_URL =
    process.env.WHATSAPP_COMMUNITY_URL || 'https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe';

function buildResourceAccessSms(resourceTitle) {
    const title = resourceTitle || 'your resource';
    return (
        `Hello from AgriLync Nexus! Thank you for requesting "${title}". ` +
        `We hope it supports your farming journey. ` +
        `Join our WhatsApp community for tips and new resources: ${WHATSAPP_COMMUNITY_URL}`
    );
}

async function notifyResourceAccessSms(phone, resourceTitle) {
    if (!phone) return { sent: false };
    try {
        const result = await sendSMS(phone, buildResourceAccessSms(resourceTitle));
        return { sent: Boolean(result?.success) };
    } catch (err) {
        console.error('[Resource Access SMS]', err.message);
        return { sent: false };
    }
}

// @route   POST api/blogs/subscribe
// @desc    Subscribe from blog, resources modal, or newsletter forms
router.post('/subscribe', async (req, res) => {
    const { email, phone, resourceTitle, source } = req.body;
    if (!email || !String(email).trim()) {
        return res.status(400).json({ success: false, msg: 'Please provide a valid email address.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = phone ? String(phone).trim() : '';
    const normalizedSource = source ? String(source).trim() : 'website';
    const normalizedResource = resourceTitle ? String(resourceTitle).trim() : '';

    if (normalizedSource === 'resources-access' && !normalizedPhone) {
        return res.status(400).json({ success: false, msg: 'Please provide a valid phone number.' });
    }

    try {
        const existingSub = await Subscriber.findOne({ email: normalizedEmail });
        let smsSent = false;
        const shouldSendResourceSms =
            normalizedSource === 'resources-access' && normalizedPhone;

        if (existingSub) {
            if (normalizedPhone) existingSub.phone = normalizedPhone;
            if (normalizedResource) existingSub.lastResource = normalizedResource;
            existingSub.source = normalizedSource;
            await existingSub.save();
            if (shouldSendResourceSms) {
                const sms = await notifyResourceAccessSms(normalizedPhone, normalizedResource);
                smsSent = sms.sent;
            }
            return res.json({
                success: true,
                msg: smsSent
                    ? 'Welcome back! Check your phone — we sent your download link details by SMS.'
                    : 'Welcome back! Your details have been updated.',
                smsSent,
                whatsappCommunityUrl: WHATSAPP_COMMUNITY_URL,
                subscriber: {
                    email: existingSub.email,
                    phone: existingSub.phone,
                    lastResource: existingSub.lastResource,
                    source: existingSub.source,
                },
            });
        }

        const newSubscriber = new Subscriber({
            email: normalizedEmail,
            phone: normalizedPhone,
            lastResource: normalizedResource,
            source: normalizedSource,
        });
        await newSubscriber.save();
        if (shouldSendResourceSms) {
            const sms = await notifyResourceAccessSms(normalizedPhone, normalizedResource);
            smsSent = sms.sent;
        }
        res.status(201).json({
            success: true,
            msg: smsSent
                ? 'Thank you! Check your phone for a welcome SMS with our WhatsApp community link.'
                : 'Successfully subscribed to AgriLync updates!',
            smsSent,
            whatsappCommunityUrl: WHATSAPP_COMMUNITY_URL,
            subscriber: {
                email: newSubscriber.email,
                phone: newSubscriber.phone,
                lastResource: newSubscriber.lastResource,
                source: newSubscriber.source,
            },
        });
    } catch (err) {
        console.error('Subscription error:', err.message);
        res.status(500).json({ success: false, msg: 'Could not save your details. Please try again.' });
    }
});

// @route   GET api/blogs
// @desc    Fetch all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error('Fetch blogs error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/blogs/subscribers
// @desc    List newsletter / resource subscribers (blog admin)
router.get('/subscribers', blogAuth, async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (err) {
        console.error('Fetch subscribers error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/blogs/:slug
// @desc    Fetch single blog by slug
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error('Fetch blog by slug error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/blogs
// @desc    Create a new blog post (Protected)
router.post('/', blogAuth, async (req, res) => {
    const { title, category, author, readTime, excerpt, content, image, tags } = req.body;

    if (!title || !category || !excerpt || !content) {
        return res.status(400).json({ msg: 'Please provide all required fields (title, category, excerpt, content)' });
    }

    try {
        const slug = generateSlug(title);
        
        // Ensure unique slug
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return res.status(400).json({ msg: 'A blog post with a similar title already exists' });
        }

        const newBlog = new Blog({
            title,
            slug,
            category,
            author: author || 'AgriLync Team',
            readTime: readTime || '5 min read',
            excerpt,
            content,
            image: image || '/lovable-uploads/blog1.png',
            tags: Array.isArray(tags) ? tags : []
        });

        await newBlog.save();

        if (req.body.sendBlast) {
            broadcastBlogEmail(newBlog).catch(err => console.error(err));
        }

        res.json(newBlog);
    } catch (err) {
        console.error('Create blog error:', err.message);
        res.status(500).json({ msg: err.message || 'Failed to create blog post.' });
    }
});

// @route   PUT api/blogs/:id
// @desc    Update an existing blog post (Protected)
router.put('/:id', blogAuth, async (req, res) => {
    const { title, category, author, readTime, excerpt, content, image, tags } = req.body;

    if (!title || !category || !excerpt || !content) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        blog.title = title;
        blog.category = category;
        blog.author = author || 'AgriLync Team';
        blog.readTime = readTime || '5 min read';
        blog.excerpt = excerpt;
        blog.content = content;
        blog.image = image || blog.image;
        blog.tags = Array.isArray(tags) ? tags : blog.tags;

        await blog.save();
        res.json(blog);
    } catch (err) {
        console.error('Update blog error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog post
router.delete('/:id', blogAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }

        await blog.deleteOne();
        res.json({ msg: 'Blog post removed' });
    } catch (err) {
        console.error('Error deleting blog:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/blogs/upload
// @desc    Upload an image for the blog post
router.post('/upload', blogAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Return the path that the frontend can use to access the image
        res.json({
            imageUrl: `/uploads/blogs/${req.file.filename}`
        });
    } catch (err) {
        console.error('Image upload error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
