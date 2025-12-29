require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function seedAgent() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const generateAgentId = () => 'LYG' + Math.floor(1000000 + Math.random() * 9000000);

        const email = 'amusahcongo@gmail.com';
        const password = 'Musah12345';

        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            console.log('Agent already exists. Updating password and Agent ID...');
            existingAgent.password = password;
            existingAgent.agentId = generateAgentId();
            // The pre-save hook will hash the password
            await existingAgent.save();
            console.log(`Agent updated successfully! New ID: ${existingAgent.agentId}`);
        } else {
            const agentId = generateAgentId();
            const newAgent = new Agent({
                name: 'Musah Congo',
                email: email,
                password: password,
                agentId: agentId,
                region: 'Northern Region',
                isVerified: true,
                verificationStatus: 'verified'
            });
            await newAgent.save();
            console.log(`New agent seeded successfully! ID: ${agentId}`);
        }
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        mongoose.disconnect();
    }
}

seedAgent();
