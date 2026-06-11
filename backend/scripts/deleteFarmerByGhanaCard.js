/**
 * Dev/admin utility: remove a farmer (and linked records) by Ghana Card number.
 * Usage: node scripts/deleteFarmerByGhanaCard.js GHA-719222525-1
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

const ghanaCard = process.argv[2]?.trim().toUpperCase();

if (!ghanaCard || !/^GHA-\d{9}-\d$/.test(ghanaCard)) {
  console.error('Usage: node scripts/deleteFarmerByGhanaCard.js GHA-XXXXXXXXX-X');
  process.exit(1);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const farmer = await Farmer.findOne({ ghanaCardNumber: ghanaCard });
  if (!farmer) {
    console.log(`No farmer found with Ghana Card ${ghanaCard}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const farmerId = farmer._id;
  const summary = { farmer: farmer.name, ghanaCard, id: farmer.id };

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

  console.log('Deleted farmer:', summary);
  console.log('Related records removed:', {
    farms: farms.deletedCount,
    disputes: disputes.deletedCount,
    media: media.deletedCount,
    reports: reports.deletedCount,
    tasks: tasks.deletedCount,
    scheduledVisits: visits.deletedCount,
    fieldVisits: fieldVisits.deletedCount,
    matches: matches.deletedCount,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
