const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Farmer = require('./models/Farmer');

const main = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';
        await mongoose.connect(MONGO_URI);
        const farmer = await Farmer.findOne().lean();
        if (farmer) {
            delete farmer.profilePicture;
            delete farmer.idCardFront;
            delete farmer.idCardBack;
        }
        console.log('FARMER DATA:', JSON.stringify(farmer, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

main();
