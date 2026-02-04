const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Agent = require('./models/Agent');
const Farm = require('./models/Farm');
const Farmer = require('./models/Farmer');
const Match = require('./models/Match');
const Escalation = require('./models/Escalation');
const AuditLog = require('./models/AuditLog');

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';
        console.log(`Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Failed:', err);
        process.exit(1);
    }
};

const runDiagnostics = async () => {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checks = [
        { name: 'Agent.distinct("region")', promise: Agent.distinct('region') },
        { name: 'Agent.countDocuments({ role: "supervisor" })', promise: Agent.countDocuments({ role: 'supervisor' }) },
        { name: 'Agent.countDocuments({ role: "agent" })', promise: Agent.countDocuments({ role: 'agent' }) },
        { name: 'Farm.countDocuments()', promise: Farm.countDocuments() },
        { name: 'Farmer.countDocuments()', promise: Farmer.countDocuments() },
        { name: 'Match.countDocuments(...)', promise: Match.countDocuments({ status: { $in: ['active', 'approved', 'Ongoing', 'Completed'] } }) },
        { name: 'Escalation.countDocuments(...)', promise: Escalation.countDocuments({ status: { $ne: 'resolved' }, priority: { $in: ['critical', 'high'] } }) },
        { name: 'AuditLog.countDocuments()', promise: AuditLog.countDocuments() },
        { name: 'AuditLog.countDocuments({ action: /REPORT/i })', promise: AuditLog.countDocuments({ action: /REPORT/i }) },
        { name: 'AuditLog.distinct("user", ...)', promise: AuditLog.distinct('user', { action: 'LOGIN', createdAt: { $gte: today } }) },
        { name: 'AuditLog.find(...)', promise: AuditLog.find({ action: { $in: ['LOGIN', 'LOGOUT'] }, createdAt: { $gte: today } }).limit(10) }
    ];

    console.log('Running individual checks...');

    for (const check of checks) {
        try {
            const start = Date.now();
            const res = await check.promise;
            console.log(`[PASS] ${check.name} - ${(Date.now() - start)}ms - Result: ${Array.isArray(res) ? res.length + ' items' : res}`);
        } catch (err) {
            console.error(`[FAIL] ${check.name} - Error: ${err.message}`);
        }
    }

    process.exit(0);
};

runDiagnostics();
