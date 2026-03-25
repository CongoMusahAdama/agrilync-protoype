const mongoose = require('mongoose');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const Farmer = require('../models/Farmer');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

const seedTasks = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Seeding Tasks');

        // Clear existing tasks
        await Task.deleteMany({});
        console.log('Cleared existing tasks');

        // Get the first agent (or a specific one if needed)
        const agent = await Agent.findOne({});
        if (!agent) {
            console.error('No agent found. Please seed agents first.');
            process.exit(1);
        }

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 5);

        const tasksData = [
            {
                agent: agent._id,
                type: 'visit',
                title: 'Farm Monitoring',
                farmerName: 'Kwame Mensah',
                farmName: 'Mensah Farms',
                dueDate: yesterday,
                priority: 'urgent',
                status: 'pending',
                synced: true
            },
            {
                agent: agent._id,
                type: 'kyc',
                title: 'KYC Verification',
                farmerName: 'Abena Osei',
                farmName: 'Osei Cocoa',
                dueDate: today,
                priority: 'urgent',
                status: 'in-progress',
                synced: true
            },
            {
                agent: agent._id,
                type: 'media',
                title: 'Upload Field Photos',
                farmerName: 'Kofi Annan',
                farmName: 'Green Valley',
                dueDate: today,
                priority: 'normal',
                status: 'pending',
                synced: true
            },
            {
                agent: agent._id,
                type: 'harvest',
                title: 'Record Yield Data',
                farmerName: 'Yaw Ofori',
                farmName: 'Ofori Plantations',
                dueDate: tomorrow,
                priority: 'normal',
                status: 'pending',
                synced: true
            },
            {
                agent: agent._id,
                type: 'training',
                title: 'Pest Control Training',
                farmerName: 'Ama Serwaa',
                farmName: 'Serwaa Organics',
                dueDate: nextWeek,
                priority: 'low',
                status: 'pending',
                synced: true
            },
            {
                agent: agent._id,
                type: 'sync',
                title: 'Sync Offline Data',
                farmerName: 'System',
                farmName: 'N/A',
                dueDate: nextWeek,
                priority: 'normal',
                status: 'pending',
                synced: false
            }
        ];

        await Task.insertMany(tasksData);
        console.log('Tasks seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding tasks:', error);
        process.exit(1);
    }
};

seedTasks();
