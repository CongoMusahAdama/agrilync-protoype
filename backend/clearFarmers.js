const mongoose = require('mongoose');
require('dotenv').config();

const deleteAllFarmers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const Farmer = require('./models/Farmer');
        const Farm = require('./models/Farm');

        const farmerResult = await Farmer.deleteMany({});
        console.log(`Deleted ${farmerResult.deletedCount} farmers.`);

        // Also clean up orphaned farms
        const farmResult = await Farm.deleteMany({});
        console.log(`Deleted ${farmResult.deletedCount} farms.`);

        console.log('Grower directory cleared successfully.');
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

deleteAllFarmers();
