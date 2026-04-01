require('dotenv').config();
const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function updateFarmerIds() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for Farmer ID migration...');

        const farmers = await Farmer.find({});
        console.log(`Found ${farmers.length} farmers to process.`);

        for (let farmer of farmers) {
            // Trigger the pre-save hook by saving (hook logic handles ID generation)
            // Or set it manually here for speed
            const baseId = farmer.ghanaCardNumber || farmer._id.toString().replace(/\D/g, '').padEnd(7, '0').slice(0, 7);
            farmer.id = `LYG-${baseId}`;
            
            await farmer.save();
            console.log(`Updated farmer ${farmer.name}: ID -> ${farmer.id}`);
        }

        console.log('Farmer ID migration completed successfully!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        mongoose.disconnect();
    }
}

updateFarmerIds();
