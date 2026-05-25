const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('./models/Agent');
require('dotenv').config();

// Pass phone number as argument: node resetAgentPassword.js 0203154307
const identifier = process.argv[2];

const resetPassword = async () => {
    if (!identifier) {
        console.error('Usage: node resetAgentPassword.js <email_or_phone>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const agent = await Agent.findOne({
            $or: [{ email: identifier }, { contact: identifier }]
        });

        if (!agent) {
            console.error(`No agent found with email/phone: ${identifier}`);
            process.exit(1);
        }

        // Generate a fresh clean password
        const crypto = require('crypto');
        const newPassword = crypto.randomBytes(4).toString('hex');

        // Hash it correctly once
        const salt = await bcrypt.genSalt(10);
        agent.password = await bcrypt.hash(newPassword, salt);
        agent.hasChangedPassword = false;
        agent.isLoggedIn = false;

        // Skip pre-save hook by using updateOne directly
        await Agent.updateOne(
            { _id: agent._id },
            {
                password: agent.password,
                hasChangedPassword: false,
                isLoggedIn: false
            }
        );

        console.log('===========================================');
        console.log(`Agent: ${agent.name}`);
        console.log(`Email: ${agent.email}`);
        console.log(`Phone: ${agent.contact}`);
        console.log(`New Temp Password: ${newPassword}`);
        console.log('===========================================');
        console.log('Password reset successfully. Share the new password above with the agent.');
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

resetPassword();
