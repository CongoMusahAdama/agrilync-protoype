const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrilync');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// Verify Field Agents and save to file
const verifyFieldAgents = async () => {
    try {
        await connectDB();

        const agents = await Agent.find({
            email: { $in: ['oseiprince@agrilync.com', 'psedem@agrilync.com'] }
        }).select('name email agentId role region status');

        let output = '';
        output += '=================================================================\n';
        output += '           AGRILYNC FIELD AGENTS - LOGIN CREDENTIALS             \n';
        output += '=================================================================\n\n';

        if (agents.length === 0) {
            output += 'ERROR: No field agents found!\n';
            console.log('ERROR: No field agents found!');
        } else {
            output += `Total Agents Created: ${agents.length}\n\n`;

            agents.forEach((agent, index) => {
                output += `${index + 1}. ${agent.name}\n`;
                output += `   Email: ${agent.email}\n`;
                output += `   Agent ID: ${agent.agentId}\n`;
                output += `   Role: ${agent.role}\n`;
                output += `   Region: ${agent.region}\n`;
                output += `   Status: ${agent.status}\n`;
                output += `   ---------------------------------------------------------\n\n`;
            });

            output += '\n=================================================================\n';
            output += '                      LOGIN CREDENTIALS                          \n';
            output += '=================================================================\n\n';
            output += 'AGENT 1: Osei Prince\n';
            output += '   Email: oseiprince@agrilync.com\n';
            output += '   Password: princeagrilync12345\n';
            output += '   Role: Field Agent\n\n';
            output += 'AGENT 2: Prince Sedem\n';
            output += '   Email: psedem@agrilync.com\n';
            output += '   Password: princeagrilync12345\n';
            output += '   Role: Field Agent\n\n';
            output += '=================================================================\n';

            // Save to file
            const outputPath = path.join(__dirname, 'field_agents_credentials.txt');
            fs.writeFileSync(outputPath, output);
            console.log(`\nCredentials saved to: ${outputPath}`);
            console.log('\n' + output);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error verifying field agents:', err.message);
        process.exit(1);
    }
};

verifyFieldAgents();
