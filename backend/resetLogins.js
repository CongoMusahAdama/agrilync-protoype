const mongoose = require('mongoose');
require('dotenv').config();
const Agent = require('./models/Agent');

const resetLogins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Reset all agents' isLoggedIn to false
        const result = await Agent.updateMany({}, { isLoggedIn: false });
        
        console.log(`Successfully reset login status for ${result.modifiedCount} agents/users.`);
        
        process.exit();
    } catch (err) {
        console.error('Error resetting logins:', err);
        process.exit(1);
    }
};

resetLogins();
