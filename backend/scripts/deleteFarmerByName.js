/**
 * Dev/admin utility: remove farmer(s) by name (case-insensitive partial match).
 * Usage: node scripts/deleteFarmerByName.js "CONGO MUSAH ADAMS"
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Dispute = require('../models/Dispute');
const Media = require('../models/Media');
const Report = require('../models/Report');
const Task = require('../models/Task');
const ScheduledVisit = require('../models/ScheduledVisit');
const FieldVisit = require('../models/FieldVisit');
const Match = require('../models/Match');

const nameQuery = process.argv.slice(2).join(' ').trim();

if (!nameQuery) {
    console.error('Usage: node scripts/deleteFarmerByName.js "Farmer Full Name"');
    process.exit(1);
}

async function deleteFarmerRecord(farmer) {
    const farmerId = farmer._id;
    const [farms, disputes, media, reports, tasks, visits, fieldVisits, matches] = await Promise.all([
        Farm.deleteMany({ farmer: farmerId }),
        Dispute.deleteMany({ farmer: farmerId }),
        Media.deleteMany({ farmer: farmerId }),
        Report.deleteMany({ farmer: farmerId }),
        Task.deleteMany({ farmer: farmerId }),
        ScheduledVisit.deleteMany({ farmer: farmerId }),
        FieldVisit.deleteMany({ farmer: farmerId }),
        Match.deleteMany({ farmer: farmerId }),
    ]);
    await Farmer.deleteOne({ _id: farmerId });
    return {
        name: farmer.name,
        ghanaCard: farmer.ghanaCardNumber,
        lyncId: farmer.id,
        farms: farms.deletedCount,
        disputes: disputes.deletedCount,
        media: media.deletedCount,
        reports: reports.deletedCount,
        tasks: tasks.deletedCount,
        scheduledVisits: visits.deletedCount,
        fieldVisits: fieldVisits.deletedCount,
        matches: matches.deletedCount,
    };
}

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not set');
        process.exit(1);
    }

    await mongoose.connect(uri);
    const regex = new RegExp(nameQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const farmers = await Farmer.find({ name: regex });

    if (!farmers.length) {
        console.log(`No farmer found matching name: ${nameQuery}`);
        await mongoose.disconnect();
        process.exit(0);
    }

    for (const farmer of farmers) {
        const result = await deleteFarmerRecord(farmer);
        console.log('Deleted:', result);
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
