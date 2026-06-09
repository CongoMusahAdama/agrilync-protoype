const mongoose = require('mongoose');
const Agent = require('./models/Agent');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        const newPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();
        if (!newPassword || newPassword.length < 8) {
            console.error('❌ Set SUPER_ADMIN_PASSWORD (min 8 chars) in backend/.env before running this script.');
            process.exit(1);
        }

        const newEmail = process.env.SUPER_ADMIN_EMAIL?.trim() || 'amusahcongo@gmail.com';

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync');
        console.log('MongoDB Connected');

        let superAdmin = await Agent.findOne({ email: newEmail });

        if (superAdmin) {
            console.log(`Found existing user (${superAdmin.email}). Updating credentials and role...`);
            superAdmin.password = newPassword;
            superAdmin.role = 'super_admin';
            superAdmin.status = 'active';
            superAdmin.isLoggedIn = false;
            superAdmin.currentSessionId = null;
            superAdmin.refreshToken = null;
            superAdmin.enableMultipleLogin = true;
        } else {
            console.log('Creating new Super Admin...');
            superAdmin = new Agent({
                name: 'Congo Musah',
                email: newEmail,
                password: newPassword,
                agentId: 'SA-001',
                role: 'super_admin',
                status: 'active',
                region: 'Headquarters',
                contact: '0000000000',
                isVerified: true,
                verificationStatus: 'verified',
                enableMultipleLogin: true,
            });
        }

        superAdmin.isLoggedIn = false;
        superAdmin.currentSessionId = null;
        superAdmin.refreshToken = null;

        await superAdmin.save();
        await Agent.deleteOne({ email: 'superadmin@gmail.com' });

        console.log('Super Admin credentials updated successfully.');
        console.log('Session lock cleared — you can log in again.');
        console.log(`Email: ${newEmail}`);
        console.log('Password was set from SUPER_ADMIN_PASSWORD env var (not logged).');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedSuperAdmin();
