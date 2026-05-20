const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const Farmer = require('./models/Farmer');

const seedJourney = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected...');

        const farmers = await Farmer.find();
        let updated = 0;
        
        for (const farmer of farmers) {
            // Give 50% of farmers an active journey
            if (Math.random() > 0.5) {
                farmer.currentStage = 'growing';
                
                // Mongoose Map assignment
                farmer.stageDetails = {
                    planning: { date: '2026-01-15T10:00:00Z', notes: 'Seeds and fertilizers procured.', status: 'completed', activities: [] },
                    planting: { date: '2026-02-20T10:00:00Z', notes: 'Planted on 5 acres.', status: 'completed', activities: [] },
                    growing: { date: '2026-03-10T10:00:00Z', notes: 'Applying top dressing.', status: 'in-progress', activities: [] },
                    harvesting: { date: '', notes: '', status: 'pending', activities: [] },
                    maintenance: { date: '', notes: '', status: 'pending', activities: [] }
                };
                await farmer.save();
                updated++;
            }
        }
        
        console.log(`Successfully seeded farm journeys for ${updated} farmers.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedJourney();
