require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function createIsabella() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'isabella@agrilync.com';
        const password = 'issabel12345';
        const name = 'Isabella Adzah';

        // Check if agent exists
        let agent = await Agent.findOne({ email });

        if (agent) {
            console.log('Agent Isabella already exists. Updating...');
            agent.name = name;
            agent.password = password; // Pre-save hook will hash this
            // Ensure other fields are set if needed, but primarily updating credentials
            await agent.save();
            console.log('Agent Isabella updated successfully.');
        } else {
            console.log('Creating new agent Isabella...');
            // Generate a random Agent ID if not provided. 
            // The format from seedAgent.js is LYG + random numbers, or createAgent uses prefix.
            // I'll stick to a simple one or let the system handle it if it was auto-generated, 
            // but the model likely requires it. seedAgent.js generates it manually.
            const generateAgentId = () => 'LYG' + Math.floor(1000000 + Math.random() * 9000000);

            const newAgent = new Agent({
                name: name,
                email: email,
                password: password,
                agentId: generateAgentId(),
                role: 'agent', // Defaulting to agent role based on request "create an agent"
                region: 'Greater Accra', // Placeholder, can be updated later
                isVerified: true,
                verificationStatus: 'verified',
                status: 'active'
            });

            await newAgent.save();
            console.log(`Agent Isabella created successfully! ID: ${newAgent.agentId}`);
        }

    } catch (err) {
        console.error('Error creating agent:', err);
    } finally {
        mongoose.disconnect();
    }
}

createIsabella();
