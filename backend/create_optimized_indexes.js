const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Farmer = require('./models/Farmer');
const Farm = require('./models/Farm');
const Match = require('./models/Match');
const Notification = require('./models/Notification');
const Activity = require('./models/Activity');
const Dispute = require('./models/Dispute');

async function createIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Creating Farmer indexes...');
        await Farmer.collection.createIndex({ status: 1, region: 1 });
        await Farmer.collection.createIndex({ agent: 1, createdAt: -1 });

        console.log('Creating Farm indexes...');
        await Farm.collection.createIndex({ agent: 1, createdAt: -1 });

        console.log('Creating Match indexes...');
        await Match.collection.createIndex({ agent: 1, createdAt: -1 });

        console.log('Creating Notification indexes...');
        await Notification.collection.createIndex({ agent: 1, createdAt: -1 });

        console.log('Creating Activity indexes...');
        await Activity.collection.createIndex({ agent: 1, createdAt: -1 });

        console.log('Creating Dispute indexes...');
        await Dispute.collection.createIndex({ 'parties.agent': 1, createdAt: -1 });

        console.log('All indexes created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error creating indexes:', err);
        process.exit(1);
    }
}

createIndexes();
