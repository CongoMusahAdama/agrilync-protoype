const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrilync');
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// Create or Update Field Agents
const syncFieldAgents = async () => {
    try {
        await connectDB();

        const agentsToSync = [
            {
                name: 'Osei Prince',
                email: 'oseiprince@agrilync.com',
                password: 'princeagrilync12345',
                role: 'agent',
                region: 'Ashanti',
                contact: '+233 000 000 000'
            },
            {
                name: 'Prince Sedem',
                email: 'psedem@agrilync.com',
                password: 'princeagrilync12345',
                role: 'agent',
                region: 'Central',
                contact: '+233 000 000 000'
            }
        ];

        for (const agentData of agentsToSync) {
            let user = await Agent.findOne({ email: agentData.email });

            if (user) {
                console.log(`🔄 Updating existing user: ${agentData.email}`);
                user.password = agentData.password; // Middleware will hash this
                user.name = agentData.name;
                user.role = agentData.role;
                user.region = agentData.region;
                user.status = 'active';
                await user.save();
                console.log(`✅ Updated password and details for ${agentData.email}`);
            } else {
                console.log(`➕ Creating new user: ${agentData.email}`);
                const agentId = `AGT-${Math.floor(1000 + Math.random() * 9000)}`;
                user = new Agent({
                    ...agentData,
                    agentId,
                    status: 'active'
                });
                await user.save();
                console.log(`✅ Created new agent: ${agentData.name} (${agentData.email}) - ID: ${agentId}`);
            }
        }

        console.log('\n🎉 Synchronization complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error synchronizing field agents:', err.message);
        process.exit(1);
    }
};

syncFieldAgents();
