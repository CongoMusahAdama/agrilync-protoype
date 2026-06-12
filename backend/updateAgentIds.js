require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('./models/Agent');
const { generateUniqueStaffId, isValidStaffId } = require('./utils/generateAgentId');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function updateAgentIds() {
    let exitCode = 0;
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for agent ID migration...');

        const agents = await Agent.find({}).select('email agentId role');
        console.log(`Found ${agents.length} staff record(s) to process.`);

        const bulkOps = [];

        for (const agent of agents) {
            const dbRole = agent.role || 'agent';
            const needsUpdate =
                !agent.agentId || !isValidStaffId(dbRole, agent.agentId);

            if (!needsUpdate) {
                console.log(`Skipping ${agent.email}: valid ID ${agent.agentId}`);
                continue;
            }

            const oldId = agent.agentId;
            const newId = await generateUniqueStaffId(Agent, dbRole);
            bulkOps.push({
                updateOne: {
                    filter: { _id: agent._id },
                    update: { $set: { agentId: newId } },
                },
            });
            console.log(`Queued ${agent.email}: ${oldId || '(none)'} -> ${newId}`);
        }

        if (bulkOps.length > 0) {
            const result = await Agent.bulkWrite(bulkOps);
            console.log(`Updated ${result.modifiedCount} agent ID(s).`);
        } else {
            console.log('No agent IDs required updating.');
        }

        console.log('Migration completed successfully.');
    } catch (err) {
        exitCode = 1;
        console.error('Migration error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(exitCode);
    }
}

updateAgentIds();
