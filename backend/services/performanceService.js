const Farmer = require('../models/Farmer');
const mongoose = require('mongoose');
const { PERFORMANCE_TARGETS, INCENTIVE_RATES, TRAINING_MODULE_DEFS } = require('../config/constants');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const lastSixMonthBuckets = () => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()] });
    }
    return buckets;
};

const toChartPercent = (value, target) => {
    if (!target || target <= 0) return 0;
    return Math.min(Math.round((value / target) * 100), 100);
};

/**
 * Calculate trend data using MongoDB Aggregation for efficiency
 * Returns counts of farmers onboarded per month for the last 6 months
 */
exports.calculateOnboardingTrend = async (agentId) => {
    // Robust agentId check to prevent 500 errors if ID is not a valid ObjectId
    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
        console.warn(`[PERFORMANCE_SERVICE] Invalid agentId provided: ${agentId}. Returning empty trend.`);
        return Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return { month: d.toLocaleString('en-US', { month: 'short' }), value: 0 };
        });
    }

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    try {
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
    } catch (err) {
        console.error('[PERFORMANCE_SERVICE] Aggregation Failed:', err.message);
        return Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return { month: d.toLocaleString('en-US', { month: 'short' }), value: 0 };
        });
    }
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
        {
            label: 'Gender Balance',
            value: totalFarmers > 0 ? `${Math.round((agentData.femaleCount / totalFarmers) * 100)}/${Math.round((agentData.maleCount / totalFarmers) * 100)}` : '0/0',
            unit: 'F/M %',
            target: '60/40',
            progress: totalFarmers > 0 ? Math.min(Math.round(((agentData.femaleCount / totalFarmers) / 0.6) * 100), 100) : 0,
            status: totalFarmers > 0 && (agentData.femaleCount / totalFarmers) >= 0.55 ? 'On Track' : 'Needs Work',
        },
    ];
};

exports.calculateVisitTrend = async (agentId) => {
    const FieldVisit = require('../models/FieldVisit');
    const buckets = lastSixMonthBuckets();
    const start = new Date(buckets[0].year, buckets[0].month - 1, 1);

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }

    try {
        const raw = await FieldVisit.aggregate([
            { $match: { agent: new mongoose.Types.ObjectId(agentId), date: { $gte: start } } },
            { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, count: { $sum: 1 } } },
        ]);

        return buckets.map((b) => {
            const match = raw.find((r) => r._id.year === b.year && r._id.month === b.month);
            const count = match ? match.count : 0;
            return { month: b.label, value: toChartPercent(count, PERFORMANCE_TARGETS.MONTHLY_VISITS), raw: count };
        });
    } catch (err) {
        console.error('[PERFORMANCE_SERVICE] Visit trend failed:', err.message);
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }
};

exports.calculateGenderTrend = async (agentId) => {
    const buckets = lastSixMonthBuckets();
    const start = new Date(buckets[0].year, buckets[0].month - 1, 1);

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }

    try {
        const farmers = await Farmer.find({ agent: agentId, createdAt: { $gte: start } }).select('gender createdAt').lean();
        return buckets.map((b) => {
            const monthEnd = new Date(b.year, b.month, 0, 23, 59, 59);
            const inMonth = farmers.filter((f) => new Date(f.createdAt) <= monthEnd);
            const female = inMonth.filter((f) => String(f.gender).toLowerCase() === 'female').length;
            const pct = inMonth.length ? Math.round((female / inMonth.length) * 100) : 0;
            return { month: b.label, value: toChartPercent(pct, PERFORMANCE_TARGETS.GENDER_FEMALE_TARGET), raw: pct };
        });
    } catch (err) {
        console.error('[PERFORMANCE_SERVICE] Gender trend failed:', err.message);
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }
};

exports.calculateTrainingTrend = async (agentId, totalFarmers) => {
    const TrainingDelivery = require('../models/TrainingDelivery');
    const buckets = lastSixMonthBuckets();
    const start = new Date(buckets[0].year, buckets[0].month - 1, 1);

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }

    try {
        const deliveries = await TrainingDelivery.find({
            agent: agentId,
            status: 'completed',
            deliveryDate: { $gte: start },
        }).select('deliveryDate farmersAttended farmers').lean();

        return buckets.map((b) => {
            const inMonth = deliveries.filter((d) => {
                const dt = new Date(d.deliveryDate);
                return dt.getFullYear() === b.year && dt.getMonth() + 1 === b.month;
            });
            const attendees = inMonth.reduce((sum, d) => sum + (d.farmersAttended?.length || d.farmers?.length || 0), 0);
            const rate = totalFarmers > 0 ? Math.round((attendees / totalFarmers) * 100) : 0;
            return { month: b.label, value: toChartPercent(rate, PERFORMANCE_TARGETS.TRAINING_RATE), raw: rate };
        });
    } catch (err) {
        console.error('[PERFORMANCE_SERVICE] Training trend failed:', err.message);
        return buckets.map((b) => ({ month: b.label, value: 0, raw: 0 }));
    }
};

exports.buildVisitLog = (allFarmers, visitsThisMonth, visitTarget = PERFORMANCE_TARGETS.VISIT_FREQUENCY) => {
    const visitsByFarmer = {};
    visitsThisMonth.forEach((v) => {
        const fid = (v.farmer?._id || v.farmer)?.toString();
        if (!fid) return;
        if (!visitsByFarmer[fid]) visitsByFarmer[fid] = [];
        visitsByFarmer[fid].push(v);
    });

    return allFarmers.map((farmer) => {
        const fid = farmer._id.toString();
        const farmerVisits = visitsByFarmer[fid] || [];
        const visitCount = farmerVisits.length;
        const sorted = [...farmerVisits].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        const lastVisit = sorted[0];
        let status = 'On Track';
        let color = 'green';
        if (visitCount === 0) { status = 'Off Track'; color = 'red'; }
        else if (visitCount < visitTarget) { status = 'At Risk'; color = 'amber'; }

        const hasId = !!(farmer.idCardFront && farmer.idCardBack);
        const hasGps = !!(farmer.farmLocation?.lat && farmer.farmLocation?.lng);

        return {
            farmer: farmer.name,
            farm: farmer.farmType ? `${farmer.farmType} Farm` : 'Farm',
            region: farmer.region || '—',
            last: lastVisit
                ? new Date(lastVisit.date || lastVisit.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                : farmer.lastVisit || '—',
            visits: `${visitCount}/${visitTarget}`,
            sync: hasId && hasGps ? 'Synced' : 'Pending',
            status,
            color,
            vIcon: visitCount >= visitTarget ? '✓' : '',
        };
    }).sort((a, b) => {
        const order = { 'Off Track': 0, 'At Risk': 1, 'On Track': 2 };
        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
};

exports.calculateTrainingDeliveryProgress = (allFarmers) => {
    const total = allFarmers.length;
    return TRAINING_MODULE_DEFS.map((mod) => {
        const completed = allFarmers.filter((f) => (f.trainingModules || []).includes(mod.id)).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { id: mod.id, title: mod.title, tag: mod.tag, count: `${completed}/${total}`, perc: `${progress}%`, progress };
    });
};

exports.calculateCompliance = (allFarmers, syncRate) => {
    const total = allFarmers.length || 1;
    const idVerified = allFarmers.filter((f) => f.idCardFront && f.idCardBack).length;
    const gpsCaptured = allFarmers.filter((f) => f.farmLocation?.lat && f.farmLocation?.lng).length;
    const withTraining = allFarmers.filter((f) => (f.trainingModules || []).length > 0).length;
    const active = allFarmers.filter((f) => f.status === 'active').length;
    const pct = (n) => `${Math.round((n / total) * 100)}%`;

    return [
        { label: 'ID Verification (Ghana Card)', value: pct(idVerified), status: idVerified / total >= 0.85 ? 'Compliant' : 'Ongoing' },
        { label: 'GPS Farm Capture', value: pct(gpsCaptured), status: gpsCaptured / total >= 0.7 ? 'Compliant' : 'Ongoing' },
        { label: 'Training Module Coverage', value: pct(withTraining), status: withTraining / total >= 0.5 ? 'Compliant' : 'Ongoing' },
        { label: 'Profile Sync Rate', value: `${syncRate}%`, status: syncRate >= PERFORMANCE_TARGETS.SYNC_RATE ? 'Excellent' : 'Ongoing' },
        { label: 'Active Farmer Rate', value: pct(active), status: active / total >= 0.7 ? 'Compliant' : 'Ongoing' },
    ];
};

exports.calculateVerificationStats = (allFarmers) => {
    const total = allFarmers.length || 1;
    const idComplete = allFarmers.filter((f) => f.idCardFront && f.idCardBack).length;
    const gpsComplete = allFarmers.filter((f) => f.farmLocation?.lat && f.farmLocation?.lng).length;
    const idAccuracy = Math.round((idComplete / total) * 1000) / 10;
    const gpsValidation = Math.round((gpsComplete / total) * 1000) / 10;
    const avg = (idAccuracy + gpsValidation) / 2;
    let qaRating = 'Building';
    if (avg >= 90) qaRating = 'Elite Agent Status';
    else if (avg >= 75) qaRating = 'Strong Performer';
    else if (avg >= 50) qaRating = 'Developing';
    return { idAccuracy, gpsValidation, qaRating };
};

exports.calculateIncentives = ({ totalFarmers, trainingRate, syncRate, mediaVerified }) => {
    const { ONBOARDING_BONUS, ONBOARDING_THRESHOLD, TRAINING_BONUS, TRAINING_PARTIAL, MEDIA_BONUS, MAX_POTENTIAL } = INCENTIVE_RATES;
    const onboardingEarned = totalFarmers >= ONBOARDING_THRESHOLD;
    const trainingFull = trainingRate >= PERFORMANCE_TARGETS.TRAINING_RATE;
    const trainingPartial = trainingRate >= PERFORMANCE_TARGETS.TRAINING_RATE * 0.75;
    const mediaEarned = mediaVerified;

    let estimated = 0;
    if (onboardingEarned) estimated += ONBOARDING_BONUS;
    if (trainingFull) estimated += TRAINING_BONUS;
    else if (trainingPartial) estimated += TRAINING_PARTIAL;
    if (mediaEarned) estimated += MEDIA_BONUS;

    return {
        items: [
            { label: 'High Volume Onboarding', amount: ONBOARDING_BONUS, progress: `${totalFarmers} / ${ONBOARDING_THRESHOLD} Farmers`, status: onboardingEarned ? 'Earned' : 'In Progress', earned: onboardingEarned },
            { label: 'Training Completion', amount: TRAINING_BONUS, progress: `${trainingRate}% / ${PERFORMANCE_TARGETS.TRAINING_RATE}% Rate`, status: trainingFull ? 'Earned' : trainingPartial ? 'Partial' : 'In Progress', earned: trainingFull, partialAmount: trainingPartial && !trainingFull ? TRAINING_PARTIAL : 0 },
            { label: 'Reporting & Media', amount: MEDIA_BONUS, progress: `${syncRate}% Sync · ${mediaVerified ? 'Verified' : 'Pending'}`, status: mediaEarned ? 'Earned' : 'In Progress', earned: mediaEarned },
        ],
        estimatedBonus: estimated,
        potentialBonus: MAX_POTENTIAL,
        framework: [
            { title: 'Training Delivery', subtitle: 'Activity Allowance', amount: TRAINING_BONUS, note: 'Per manual completion target' },
            { title: 'Monthly Goal Achievement', subtitle: 'Target Incentive A', amount: 600, note: `On reaching ${PERFORMANCE_TARGETS.ONBOARDING_VOLUME} farmer onboarding` },
            { title: 'Excellence Bonus', subtitle: 'Target Incentive B', amount: MAX_POTENTIAL, note: 'Top tier regional performance' },
        ],
    };
};

exports.calculateOverallScore = (kpis) => {
    if (!kpis?.length) return 0;
    return Math.round(kpis.reduce((sum, k) => sum + (k.progress || 0), 0) / kpis.length);
};

exports.calculateMetricTrends = async (agentId, totalFarmers) => {
    const onboarding = await exports.calculateOnboardingTrend(agentId);
    const monthlyTarget = Math.ceil(PERFORMANCE_TARGETS.ONBOARDING_VOLUME / 6);
    const onboardingChart = onboarding.map((t) => ({ ...t, value: toChartPercent(t.value, monthlyTarget), raw: t.value }));

    const [visits, training, gender] = await Promise.all([
        exports.calculateVisitTrend(agentId),
        exports.calculateTrainingTrend(agentId, totalFarmers),
        exports.calculateGenderTrend(agentId),
    ]);

    return {
        onboarding: { color: 'var(--lgreen)', data: onboardingChart.map((t) => t.value), months: onboardingChart.map((t) => t.month), target: String(monthlyTarget) },
        visits: { color: 'var(--teal)', data: visits.map((t) => t.value), months: visits.map((t) => t.month), target: String(PERFORMANCE_TARGETS.MONTHLY_VISITS) },
        training: { color: 'var(--amber)', data: training.map((t) => t.value), months: training.map((t) => t.month), target: `${PERFORMANCE_TARGETS.TRAINING_RATE}%` },
        gender: { color: '#921573', data: gender.map((t) => t.value), months: gender.map((t) => t.month), target: `${PERFORMANCE_TARGETS.GENDER_FEMALE_TARGET}% F` },
    };
};
