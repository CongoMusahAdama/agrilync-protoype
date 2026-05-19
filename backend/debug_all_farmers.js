const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Farmer = require('./models/Farmer');
const Agent = require('./models/Agent');

const main = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';
        await mongoose.connect(MONGO_URI);
        
        const farmerCount = await Farmer.countDocuments();
        const agentCount = await Agent.countDocuments();
        
        console.log(`Total Farmers: ${farmerCount}`);
        console.log(`Total Agents: ${agentCount}`);
        
        const sampleFarmers = await Farmer.find().limit(5).select('name agent region status').lean();
        console.log('Sample Farmers:', JSON.stringify(sampleFarmers, null, 2));
        
        const agents = await Agent.find().limit(5).select('name region').lean();
        console.log('Sample Agents:', JSON.stringify(agents, null, 2));

        if (farmerCount > 0) {
            const farmersWithoutAgent = await Farmer.countDocuments({ agent: { $exists: false } });
            console.log(`Farmers without agent: ${farmersWithoutAgent}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

main();
