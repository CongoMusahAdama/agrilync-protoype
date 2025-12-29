require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function updateAgentIds() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for ID migration...');

        const agents = await Agent.find({});
        console.log(`Found ${agents.length} agents to process.`);

        const generateAgentId = () => 'LYG' + Math.floor(1000000 + Math.random() * 9000000);

        for (let agent of agents) {
            if (!agent.agentId || !agent.agentId.startsWith('LYG') || agent.agentId.length !== 10) {
                const oldId = agent.agentId;
                agent.agentId = generateAgentId();
                await agent.save();
                console.log(`Updated agent ${agent.email}: ${oldId} -> ${agent.agentId}`);
            } else {
                console.log(`Skipping agent ${agent.email}: already has valid ID ${agent.agentId}`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        mongoose.disconnect();
    }
}

updateAgentIds();
