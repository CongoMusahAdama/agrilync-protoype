require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./models/Agent');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const agents = await Agent.find({}, 'email agentId name');
            console.log('--- Available Agents ---');
            if (agents.length === 0) {
                console.log('No agents found in database.');
            } else {
                agents.forEach(a => {
                    console.log(`Name: ${a.name}, Email: ${a.email}, AgentID: ${a.agentId}`);
                });
            }
        } catch (err) {
            console.error('Error fetching agents:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));
