const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Agent = require('./models/Agent');

const checkSuperAdmin = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGO_URI);

        console.log('Searching for Super Admins...');
        // Try to find any user that looks like a super admin
        const users = await Agent.find({}).select('email role name').lean();

        console.log('Total Users found:', users.length);
        console.log('User Roles Distribution:');

        users.forEach(u => {
            console.log(`- ${u.email}: ${u.role} (${u.name})`);
        });

        const superAdmins = users.filter(u => u.role === 'super_admin' || u.role === 'super-admin' || u.role === 'SuperAdmin');

        if (superAdmins.length === 0) {
            console.log('WARNING: No user with role "super_admin" found!');
        } else {
            console.log('Verified Super Admin users:', superAdmins.length);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSuperAdmin();
