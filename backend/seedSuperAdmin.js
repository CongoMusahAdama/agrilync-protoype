const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('./models/Agent');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync');
        console.log('MongoDB Connected');

        const newEmail = 'amusahcongo@gmail.com';
        const newPassword = 'Musah@superadmin12345';

        // Check if ANY super admin exists or check for the old one to update
        let superAdmin = await Agent.findOne({ email: newEmail });

        if (superAdmin) {
            console.log(`Found existing user (${superAdmin.email}). Updating credentials and role...`);
            superAdmin.password = newPassword;
            superAdmin.role = 'super_admin';
            // Mongoose will key off the modification and the pre-save hook will hash it
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
                verificationStatus: 'verified'
            });
        }

        await superAdmin.save();

        // Also clean up any generic 'superadmin@gmail.com' to prevent confusion
        await Agent.deleteOne({ email: 'superadmin@gmail.com' });

        console.log('Super Admin Credentials Updated Successfully');
        console.log(`Email: ${newEmail}`);
        console.log(`Password: ${newPassword}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedSuperAdmin();
