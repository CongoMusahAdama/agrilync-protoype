/**
 * Dev/admin utility: remove ALL farmers and linked records.
 * Usage: node scripts/deleteAllFarmers.js
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
const TrainingDelivery = require('../models/TrainingDelivery');
const Consultation = require('../models/Consultation');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const farmerCount = await Farmer.countDocuments();
  if (farmerCount === 0) {
    console.log('No farmers in the database.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const farmerIds = await Farmer.find().distinct('_id');

  const [farms, disputes, media, reports, tasks, visits, fieldVisits, matches, consultations, trainingPull] =
    await Promise.all([
      Farm.deleteMany({ farmer: { $in: farmerIds } }),
      Dispute.deleteMany({ farmer: { $in: farmerIds } }),
      Media.deleteMany({ farmer: { $in: farmerIds } }),
      Report.deleteMany({ farmer: { $in: farmerIds } }),
      Task.deleteMany({ farmer: { $in: farmerIds } }),
      ScheduledVisit.deleteMany({ farmer: { $in: farmerIds } }),
      FieldVisit.deleteMany({ farmer: { $in: farmerIds } }),
      Match.deleteMany({ farmer: { $in: farmerIds } }),
      Consultation.deleteMany({ farmer: { $in: farmerIds } }),
      TrainingDelivery.updateMany(
        { farmersAttended: { $in: farmerIds } },
        { $pull: { farmersAttended: { $in: farmerIds } } }
      ),
    ]);

  const farmersResult = await Farmer.deleteMany({});

  console.log(`Deleted ${farmersResult.deletedCount} farmer(s).`);
  console.log('Related records removed:', {
    farms: farms.deletedCount,
    disputes: disputes.deletedCount,
    media: media.deletedCount,
    reports: reports.deletedCount,
    tasks: tasks.deletedCount,
    scheduledVisits: visits.deletedCount,
    fieldVisits: fieldVisits.deletedCount,
    matches: matches.deletedCount,
    consultations: consultations.deletedCount,
    trainingDeliveriesUpdated: trainingPull.modifiedCount,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
