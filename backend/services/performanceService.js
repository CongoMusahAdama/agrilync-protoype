const Farmer = require('../models/Farmer');
const mongoose = require('mongoose');
const { PERFORMANCE_TARGETS } = require('../config/constants');

/**
 * Calculate trend data using MongoDB Aggregation for efficiency
 * Returns counts of farmers onboarded per month for the last 6 months
 */
exports.calculateOnboardingTrend = async (agentId) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    // Aggregation pipeline:
    // 1. Match farmers for agent in the last 6 months
    // 2. Group by month (and year to be safe)
    // 3. Format output
    const rawTrend = await Farmer.aggregate([
        {
            $match: {
                agent: new mongoose.Types.ObjectId(agentId),
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fill in missing months with zero if needed
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trend = [];
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth() + 1; // MongoDB months are 1-indexed
        
        const match = rawTrend.find(item => item._id.year === y && item._id.month === m);
        trend.push({
            month: monthNames[d.getMonth()],
            value: match ? match.count : 0
        });
    }

    return trend;
};

/**
 * Calculate KPI scorecard against standardized targets
 */
exports.calculateKpis = (agentData) => {
    const { totalFarmers, activeFarmers, verifiedFarmers, avgVisitsPerFarmer, syncRate } = agentData;
    const { ONBOARDING_VOLUME, COMPLETION_RATE, VERIFICATION_PASS_RATE, VISIT_FREQUENCY, SYNC_RATE } = PERFORMANCE_TARGETS;

    const onboardingProgress = Math.min(Math.round((totalFarmers / ONBOARDING_VOLUME) * 100), 100);
    const completionRate = totalFarmers > 0 ? Math.round((activeFarmers / totalFarmers) * 100) : 0;
    const verificationRate = totalFarmers > 0 ? Math.round((verifiedFarmers / totalFarmers) * 100) : 0;
    const visitFreqProgress = Math.min(Math.round((avgVisitsPerFarmer / VISIT_FREQUENCY) * 100), 100);

    return [
        {
            label: 'Onboarding Volume',
            value: String(totalFarmers),
            unit: 'farmers',
            target: String(ONBOARDING_VOLUME),
            progress: onboardingProgress,
            status: onboardingProgress >= 80 ? 'On Track' : onboardingProgress >= 50 ? 'In Progress' : 'Needs Work',
        },
        {
            label: 'Onboarding Completion Rate',
            value: String(completionRate),
            unit: '%',
            target: `\u2265${COMPLETION_RATE}%`,
            progress: completionRate,
            status: completionRate >= COMPLETION_RATE ? 'On Track' : completionRate >= (COMPLETION_RATE*0.8) ? 'In Progress' : 'Needs Work',
        },
        {
            label: 'Verification Pass Rate',
            value: String(verificationRate),
            unit: '%',
            target: `\u2265${VERIFICATION_PASS_RATE}%`,
            progress: verificationRate,
            status: verificationRate >= VERIFICATION_PASS_RATE ? 'On Track' : verificationRate >= (VERIFICATION_PASS_RATE*0.7) ? 'In Progress' : 'Needs Work',
        },
        {
            label: 'Monitoring Visit Frequency',
            value: String(avgVisitsPerFarmer),
            unit: 'visits/mo',
            target: `min. ${VISIT_FREQUENCY}`,
            progress: visitFreqProgress,
            status: avgVisitsPerFarmer >= VISIT_FREQUENCY ? 'On Track' : avgVisitsPerFarmer >= (VISIT_FREQUENCY*0.5) ? 'In Progress' : 'Needs Work',
        },
        {
            label: 'Data Sync Timeliness',
            value: String(syncRate),
            unit: '%',
            target: `\u2265${SYNC_RATE}%`,
            progress: syncRate,
            status: syncRate >= SYNC_RATE ? 'On Track' : syncRate >= (SYNC_RATE*0.8) ? 'In Progress' : 'Needs Work',
        },
        {
            label: 'Harvest Yield Documentation',
            value: String(activeFarmers),
            unit: 'farms',
            target: String(totalFarmers),
            progress: totalFarmers > 0 ? Math.round((activeFarmers / totalFarmers) * 100) : 0,
            status: totalFarmers > 0 && activeFarmers / totalFarmers >= 0.7 ? 'On Track' : 'Needs Work',
        },
    ];
};
