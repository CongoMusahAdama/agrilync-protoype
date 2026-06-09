const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config({ path: '../.env' });

const createAgent = async () => {
    try {
        const password = process.env.AGENT_PASSWORD?.trim();
        if (!password || password.length < 8) {
            console.error('❌ Set AGENT_PASSWORD (min 8 chars) in backend/.env before running this script.');
            process.exit(1);
        }

        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not configured.');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = process.env.AGENT_SEED_EMAIL?.trim() || 'amusahcongo@gmail.com';

        let agent = await Agent.findOne({ email });
        if (agent) {
            console.log('Agent already exists. Updating password...');
            agent.password = password;
            agent.name = 'Amusah Congo';
            agent.agentId = 'AL-001';
            agent.role = 'agent';
            agent.region = 'Ashanti';
            agent.hasChangedPassword = false;
            agent.isVerified = true;
            agent.isLoggedIn = false;
        } else {
            agent = new Agent({
                name: 'Amusah Congo',
                email,
                password,
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
        console.log('Password was set from AGENT_PASSWORD env var (not logged).');

        process.exit(0);
    } catch (err) {
        console.error('Error creating agent:', err.message);
        process.exit(1);
    }
};

createAgent();
