const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config({ path: '../.env' });

const createAgent = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'amusahcongo@gmail.com';
        const password = process.env.AGENT_PASSWORD || 'lyncagent0001';

        // Check if exists
        let agent = await Agent.findOne({ email });
        if (agent) {
            console.log('Agent already exists. Updating password...');
            agent.password = password;
            agent.name = 'Amusah Congo';
            agent.agentId = 'AL-001';
            agent.role = 'agent';
            agent.region = 'Ashanti'; // Default initial region
            agent.hasChangedPassword = false;
            agent.isVerified = true;
            agent.isLoggedIn = false;
        } else {
            agent = new Agent({
                name: 'Amusah Congo',
                email: email,
                password: password,
                agentId: 'AL-001',
                role: 'agent',
                region: 'Ashanti',
                hasChangedPassword: false,
                isVerified: true,
                stats: {
                    farmersOnboarded: 0,
                    activeFarms: 0,
                    investorMatches: 0,
                    pendingDisputes: 0,
                    reportsThisMonth: 0,
                    verificationPassRate: 100
                }
            });
        }

        await agent.save();
        console.log('Real agent created/updated successfully.');
        console.log('Email:', email);
        console.log('Password:', password);
        
        process.exit(0);
    } catch (err) {
        console.error('Error creating agent:', err.message);
        process.exit(1);
    }
};

createAgent();
