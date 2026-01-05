const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('./models/Agent');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync');
        console.log('MongoDB Connected');

        const newEmail = 'superadmin@gmail.com';
        const newPassword = 'Superadmin12345';

        // Check if ANY super admin exists or check for the old one to update
        let superAdmin = await Agent.findOne({ role: 'super_admin' });

        if (superAdmin) {
            console.log(`Found existing Super Admin (${superAdmin.email}). Updating credentials...`);
            superAdmin.email = newEmail;
            superAdmin.password = newPassword;
            // Mongoose will key off the modification and the pre-save hook will hash it
        } else {
            console.log('Creating new Super Admin...');
            superAdmin = new Agent({
                name: 'Super Admin',
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
