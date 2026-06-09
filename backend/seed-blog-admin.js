const mongoose = require('mongoose');
const BlogAdmin = require('./models/BlogAdmin');
require('dotenv').config();

async function seedBlogAdmin() {
    try {
        const password = process.env.BLOG_ADMIN_PASSWORD?.trim();
        if (!password || password.length < 8) {
            console.error('❌ Set BLOG_ADMIN_PASSWORD (min 8 chars) in backend/.env before running this script.');
            process.exit(1);
        }

        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not configured.');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const email = process.env.BLOG_ADMIN_EMAIL?.trim() || 'admin@agrilync.com';
        let admin = await BlogAdmin.findOne({ email });

        if (!admin) {
            admin = new BlogAdmin({
                username: 'BlogAdmin',
                email,
                password,
                requiresPasswordChange: true
            });
            await admin.save();
            console.log(`Created blog admin account for ${email}`);
        } else {
            admin.password = password;
            admin.requiresPasswordChange = true;
            await admin.save();
            console.log(`Updated blog admin account for ${email}`);
        }

        console.log('Password was set from BLOG_ADMIN_PASSWORD env var (not logged).');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedBlogAdmin();
