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
const Consultation = require('../models/Consultation');
const TrainingDelivery = require('../models/TrainingDelivery');

/**
 * Permanently remove a farmer and linked records.
 * @param {string|import('mongoose').Types.ObjectId} farmerId
 */
async function deleteFarmerCascade(farmerId) {
    const id = mongoose.isValidObjectId(farmerId)
        ? new mongoose.Types.ObjectId(farmerId)
        : null;
    if (!id) {
        throw new Error('Invalid farmer id');
    }

    const farmer = await Farmer.findById(id).select('name id ghanaCardNumber').lean();
    if (!farmer) {
        throw new Error('Farmer not found');
    }

    const [
        farms,
        disputes,
        media,
        reports,
        tasks,
        fieldVisits,
        matches,
        consultations,
        scheduledPull,
        trainingPull,
    ] = await Promise.all([
        Farm.deleteMany({ farmer: id }),
        Dispute.deleteMany({ farmer: id }),
        Media.deleteMany({ farmer: id }),
        Report.deleteMany({ farmer: id }),
        Task.deleteMany({ farmer: id }),
        FieldVisit.deleteMany({ farmer: id }),
        Match.deleteMany({ farmer: id }),
        Consultation.deleteMany({ farmer: id }),
        ScheduledVisit.updateMany({ farmers: id }, { $pull: { farmers: id } }),
        TrainingDelivery.updateMany({ farmers: id }, { $pull: { farmers: id } }),
    ]);

    await ScheduledVisit.deleteMany({ farmers: { $size: 0 } });
    await Farmer.deleteOne({ _id: id });

    return {
        farmerName: farmer.name,
        lyncId: farmer.id,
        ghanaCardNumber: farmer.ghanaCardNumber,
        farms: farms.deletedCount,
        disputes: disputes.deletedCount,
        media: media.deletedCount,
        reports: reports.deletedCount,
        tasks: tasks.deletedCount,
        fieldVisits: fieldVisits.deletedCount,
        matches: matches.deletedCount,
        consultations: consultations.deletedCount,
        scheduledVisitsUpdated: scheduledPull.modifiedCount,
        trainingSessionsUpdated: trainingPull.modifiedCount,
    };
}

module.exports = { deleteFarmerCascade };
