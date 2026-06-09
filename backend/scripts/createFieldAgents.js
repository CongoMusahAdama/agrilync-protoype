const mongoose = require('mongoose');
const Agent = require('../models/Agent');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrilync');
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const requireSeedPassword = () => {
    const password = process.env.FIELD_AGENT_SEED_PASSWORD?.trim();
    if (!password || password.length < 8) {
        console.error('❌ Set FIELD_AGENT_SEED_PASSWORD (min 8 chars) in backend/.env before running this script.');
        process.exit(1);
    }
    return password;
};

const syncFieldAgents = async () => {
    try {
        await connectDB();
        const seedPassword = requireSeedPassword();

        const agentsToSync = [
            {
                name: 'Osei Prince',
                email: 'oseiprince@agrilync.com',
                role: 'agent',
                region: 'Ashanti',
                contact: '+233 000 000 000'
            },
            {
                name: 'Prince Sedem',
                email: 'psedem@agrilync.com',
                role: 'agent',
                region: 'Central',
                contact: '+233 000 000 000'
            }
        ];

        for (const agentData of agentsToSync) {
            let user = await Agent.findOne({ email: agentData.email });

            if (user) {
                console.log(`🔄 Updating existing user: ${agentData.email}`);
                user.password = seedPassword;
                user.name = agentData.name;
                user.role = agentData.role;
                user.region = agentData.region;
                user.status = 'active';
                await user.save();
                console.log(`✅ Updated details for ${agentData.email}`);
            } else {
                console.log(`➕ Creating new user: ${agentData.email}`);
                const agentId = `AGT-${Math.floor(1000 + Math.random() * 9000)}`;
                user = new Agent({
                    ...agentData,
                    password: seedPassword,
                    agentId,
                    status: 'active'
                });
                await user.save();
                console.log(`✅ Created new agent: ${agentData.name} (${agentData.email}) - ID: ${agentId}`);
            }
        }

        console.log('\n🎉 Synchronization complete. Share FIELD_AGENT_SEED_PASSWORD securely with agents, then ask them to change it on first login.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error synchronizing field agents:', err.message);
        process.exit(1);
    }
};

syncFieldAgents();
