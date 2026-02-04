const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import all models to ensure schemas are registered
let Farmer, Farm, Match, Dispute, Notification, Activity, Report, Training, AgentTraining;
try {
    Farmer = require('./models/Farmer');
    Farm = require('./models/Farm');
    Match = require('./models/Match');
    Dispute = require('./models/Dispute');
    Notification = require('./models/Notification');
    Activity = require('./models/Activity');
    Report = require('./models/Report');
    AuditLog = require('./models/AuditLog');
    const TrainingModels = require('./models/Training');
    Training = TrainingModels.Training;
    AgentTraining = TrainingModels.AgentTraining;
} catch (error) {
    console.error('Error loading models:', error);
    process.exit(1);
}

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';
        console.log(`Attempting to connect to MongoDB at: ${MONGO_URI.split('@').pop()}`);

        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');
    } catch (err) {
        console.error('❌ Database connection failed completely.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

const createIndexes = async () => {
    try {
        await connectDB();

        console.log('Starting index creation...');

        console.log('Indexing Farmers...');
        await Farmer.createIndexes();

        console.log('Indexing Farms...');
        await Farm.createIndexes();

        console.log('Indexing Matches...');
        await Match.createIndexes();

        console.log('Indexing Disputes...');
        await Dispute.createIndexes();

        console.log('Indexing Notifications...');
        await Notification.createIndexes();

        console.log('Indexing Activities...');
        await Activity.createIndexes();

        console.log('Indexing AuditLogs...');
        await AuditLog.createIndexes();

        console.log('Indexing Reports...');
        await Report.createIndexes();

        console.log('Indexing Trainings...');
        await Training.createIndexes();
        await AgentTraining.createIndexes();

        console.log('✅ All indexes created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating indexes:', err);
        process.exit(1);
    }
};

createIndexes();
