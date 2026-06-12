require('dotenv').config();
const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');
const {
    isGhanaCardDerivedGrowerId,
    generateUniqueGrowerId,
} = require('./utils/generateGrowerId');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

async function updateFarmerIds() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for Farmer ID migration...');

        const farmers = await Farmer.find({});
        console.log(`Found ${farmers.length} farmers to process.`);

        for (const farmer of farmers) {
            if (!isGhanaCardDerivedGrowerId(farmer.id, farmer.ghanaCardNumber)) {
                console.log(`Skipped ${farmer.name}: already has system ID ${farmer.id}`);
                continue;
            }

            farmer.id = await generateUniqueGrowerId(Farmer);
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
