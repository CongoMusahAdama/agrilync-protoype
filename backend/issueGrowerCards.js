/**
 * Backfill digital ID cards for active growers missing AGL-C-######## serials.
 * Run: node backend/issueGrowerCards.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');
const { issueDigitalCardIfNeeded } = require('./utils/generateGrowerCard');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const growers = await Farmer.find({
        status: 'active',
        $or: [{ digitalCardGenerated: { $ne: true } }, { digitalCardNumber: { $exists: false } }],
    });

    let updated = 0;
    for (const grower of growers) {
        await issueDigitalCardIfNeeded(grower);
        if (grower.isModified()) {
            await grower.save();
            updated += 1;
            console.log(`Issued ${grower.digitalCardNumber} → ${grower.name} (${grower.id})`);
        }
    }

    console.log(`Done. ${updated} card(s) issued of ${growers.length} active grower(s) checked.`);
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
