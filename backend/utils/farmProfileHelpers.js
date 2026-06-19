const {
    inferFarmCategory,
    getStagesForCategory,
    normalizeStageKey,
    stageDetailsToObject,
} = require('./farmStages');

function formatStageTracker(farm) {
    const category = inferFarmCategory(farm.crop, farm.farmCategory);
    const stages = getStagesForCategory(category);
    const details = stageDetailsToObject(farm.stageDetails);
    const currentKey = normalizeStageKey(farm.currentStage || 'planning', category);
    const currentIdx = stages.findIndex((s) => s.key === currentKey);

    return {
        farmId: String(farm._id),
        farmCode: farm.id,
        farmName: farm.name,
        crop: farm.crop,
        category,
        currentStage: currentKey,
        stages: stages.map((stage, idx) => {
            const legacyData = stage.legacyKeys
                .map((lk) => details[lk])
                .find((d) => d && (d.status === 'completed' || d.status === 'in-progress'));

            let status = 'pending';
            if (legacyData?.status === 'completed' || idx < currentIdx) status = 'completed';
            else if (stage.key === currentKey || legacyData?.status === 'in-progress') {
                status = 'current';
            }

            return {
                key: stage.key,
                label: stage.label,
                status,
            };
        }),
    };
}

function flattenActivities(farms) {
    const rows = [];
    for (const farm of farms) {
        const category = inferFarmCategory(farm.crop, farm.farmCategory);
        const details = stageDetailsToObject(farm.stageDetails);

        for (const [stageKey, stageData] of Object.entries(details)) {
            const activities = stageData?.activities || [];
            const displayStage = normalizeStageKey(stageKey, category);

            for (const act of activities) {
                const hasPhoto =
                    Boolean(act.media?.length) ||
                    Boolean(act.additionalField2) ||
                    Boolean(act.photoUrl);

                rows.push({
                    id: act.id || `${farm._id}-${stageKey}-${act.date}-${act.activity}`,
                    farmId: String(farm._id),
                    farmName: farm.name,
                    date: act.date,
                    stage: displayStage,
                    stageLabel:
                        getStagesForCategory(category).find((s) => s.key === displayStage)?.label ||
                        stageKey,
                    activityType: act.activity,
                    description: act.description || '',
                    inputsUsed: act.inputsUsed || act.resources || '—',
                    cost: act.cost != null ? act.cost : null,
                    hasPhoto,
                    confirmationStatus: act.confirmationStatus || 'yes',
                });
            }
        }
    }

    return rows.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
    });
}

function collectPendingConfirmations(activities) {
    return activities
        .filter((a) => a.confirmationStatus === 'pending')
        .slice(0, 8)
        .map((a) => ({
            activityId: a.id,
            farmId: a.farmId,
            farmName: a.farmName,
            stage: a.stage,
            stageLabel: a.stageLabel,
            activityType: a.activityType,
            date: a.date,
            description: a.description,
        }));
}

function countCompletedStages(farms) {
    let count = 0;
    for (const farm of farms) {
        const tracker = formatStageTracker(farm);
        count += tracker.stages.filter((s) => s.status === 'completed').length;
    }
    return count;
}

function derivePrimaryActivity(farmer, farms) {
    const categories = farms.map((f) => inferFarmCategory(f.crop, f.farmCategory));
    const hasCrop = categories.includes('crop');
    const hasLivestock = categories.includes('livestock');

    if (hasCrop && hasLivestock) return 'mixed';
    if (hasLivestock) return 'livestock';
    if (hasCrop) return 'crop';

    const ft = String(farmer.farmType || '').toLowerCase();
    if (ft.includes('mixed')) return 'mixed';
    if (ft.includes('livestock')) return 'livestock';
    return 'crop';
}

function formatRating(farmer) {
    const doc = farmer.toObject ? farmer.toObject() : farmer;
    const confirmed = doc.ratingStatus === 'confirmed';
    return {
        stars: confirmed ? doc.rating || 0 : 0,
        proposedStars: doc.proposedRating || 0,
        note: doc.ratingNote || '',
        status: doc.ratingStatus || 'none',
        isConfirmed: confirmed,
        isPendingReview: doc.ratingStatus === 'pending_admin',
    };
}

function formatFarmFull(farm) {
    const doc = farm.toObject ? farm.toObject() : farm;
    const category = inferFarmCategory(doc.crop, doc.farmCategory);
    return {
        id: String(doc._id),
        farmCode: doc.id,
        name: doc.name,
        crop: doc.crop,
        category,
        location: doc.location,
        coordinates: doc.coordinates,
        measuredAcres: doc.measuredAcres,
        status: doc.status,
        currentStage: doc.currentStage,
        lastVisit: doc.lastVisit,
        stageTracker: formatStageTracker(doc),
    };
}

exports.buildFarmProfilePayload = ({ farmer, farms, visits, media }) => {
    const farmDocs = farms.map((f) => (f.toObject ? f.toObject() : f));
    const activities = flattenActivities(farmDocs);
    const primaryActivity = derivePrimaryActivity(farmer, farmDocs);
    const rating = formatRating(farmer);

    const doc = farmer.toObject ? farmer.toObject() : farmer;
    const gps =
        doc.gpsLocation?.lat != null
            ? doc.gpsLocation
            : doc.farmLocation?.lat != null
              ? { lat: doc.farmLocation.lat, lng: doc.farmLocation.lng }
              : null;

    const farmNames = farmDocs.map((f) => f.name).filter(Boolean);
    const farmName = farmNames.length === 1 ? farmNames[0] : farmNames.join(' & ') || `${doc.name}'s Farm`;

    const currentStageLabel =
        farmDocs.length > 0
            ? formatStageTracker(farmDocs[0]).stages.find((s) => s.status === 'current')?.label
            : null;

    return {
        summary: {
            farmName,
            farmId: doc.id,
            farmSize: doc.farmSize,
            measuredAcres: doc.farmLocation?.measuredAcres,
            gps,
            primaryActivity,
            currentSeason: doc.currentSeason || new Date().getFullYear().toString(),
            currentStage: doc.currentStage,
            currentStageLabel: currentStageLabel || doc.currentStage,
            farmStatusFlag: doc.farmStatusFlag || 'on_track',
            region: doc.region,
            district: doc.district,
            community: doc.community,
        },
        rating,
        pendingConfirmations: collectPendingConfirmations(activities),
        farms: farmDocs.map(formatFarmFull),
        activities,
        performance: {
            stagesCompleted: countCompletedStages(farmDocs),
            trainingModulesCompleted: (doc.trainingModules || []).length,
            trainingModulesTotal: 5,
            lastAgentVisit: doc.lastVisit || visits[0]?.date || null,
            rating,
            farmStatusFlag: doc.farmStatusFlag || 'on_track',
        },
        visits: visits.map((v) => ({
            id: String(v._id),
            date: v.date,
            purpose: v.purpose,
            status: v.status,
            notes: v.notes,
            agentName: v.agent?.name,
        })),
        media: media.map((m) => ({
            id: String(m._id),
            name: m.name,
            type: m.type,
            url: m.url,
            thumbnail: m.thumbnail,
        })),
    };
};

exports.findAndConfirmActivity = async (Farm, farmerId, { farmId, activityId, response }) => {
    const farm = await Farm.findOne({ _id: farmId, farmer: farmerId });
    if (!farm) return { error: 'Farm not found', status: 404 };

    const details = stageDetailsToObject(farm.stageDetails);
    let found = false;

    for (const [stageKey, stageData] of Object.entries(details)) {
        const activities = stageData?.activities || [];
        for (const act of activities) {
            const id = act.id || `${farmId}-${stageKey}-${act.date}-${act.activity}`;
            if (id === activityId || act.id === activityId) {
                act.confirmationStatus = response === 'yes' ? 'yes' : 'not_yet';
                act.confirmedAt = new Date();
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found) return { error: 'Activity not found', status: 404 };

    farm.stageDetails = details;
    farm.markModified('stageDetails');
    await farm.save();

    return { success: true };
};
