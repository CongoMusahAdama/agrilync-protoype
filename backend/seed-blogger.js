const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BlogAdmin = require('./models/BlogAdmin');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function seedBlogger() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'raphmawuli.agrilync@gmail.com';
        let admin = await BlogAdmin.findOne({ email });

        if (!admin) {
            admin = new BlogAdmin({
                username: 'Raph Mawuli',
                email: email,
                password: 'password123',
                requiresPasswordChange: true
            });
            await admin.save();
            console.log(`Created new blogger account for ${email}`);
        } else {
            console.log(`Blogger account for ${email} already exists.`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedBlogger();
