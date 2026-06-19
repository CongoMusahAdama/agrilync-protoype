const Farm = require('../models/Farm');
const { inferFarmCategory } = require('./farmStages');
const { normalizeCropName } = require('../data/ghanaCrops');

const FARM_TYPE_MAP = {
    crop: 'crop',
    livestock: 'livestock',
    mixed: 'mixed',
    aquaculture: 'aquaculture',
    'crop farming': 'crop',
    'livestock farming': 'livestock',
    'mixed farming': 'mixed',
};

exports.normalizeFarmType = (value) => {
    if (!value) return 'crop';
    const key = String(value).toLowerCase().trim();
    return FARM_TYPE_MAP[key] || value;
};

exports.normalizeRegion = (region) => {
    if (!region) return '';
    const r = String(region).trim();
    const lower = r.toLowerCase();
    const legacyBono = new Set(['bono', 'bono region', 'bono ahafo', 'bono ahafo region']);
    if (legacyBono.has(lower)) return 'Bono Ahafo Region';
    const legacyAhafo = new Set([
        'ahafo',
        'ahafo region',
        'asunafo north ahafo',
        'asunafo north ahafo region',
    ]);
    if (legacyAhafo.has(lower) || lower.includes('asunafo')) return 'Asunafo North Ahafo Region';
    if (!r.toLowerCase().endsWith('region')) {
        return `${r.charAt(0).toUpperCase()}${r.slice(1)} Region`;
    }
    return r;
};

exports.normalizeCropPayload = (body = {}) => {
    let cropList = Array.isArray(body.cropList) ? body.cropList : [];
    cropList = cropList.map((c) => normalizeCropName(c)).filter(Boolean);

    if (cropList.length === 0 && body.cropsGrown) {
        cropList = String(body.cropsGrown)
            .split(/[,;]+/)
            .map((s) => normalizeCropName(s))
            .filter(Boolean);
    }

    const cropsGrownOther = body.cropsGrownOther?.trim() || '';
    const displayCrops = cropList
        .map((c) => (c === 'Other' && cropsGrownOther ? cropsGrownOther : c))
        .filter((c) => c && c !== 'Other');

    return {
        cropList,
        cropsGrownOther,
        cropsGrown: displayCrops.length ? displayCrops.join(', ') : (body.cropsGrown?.trim() || ''),
    };
};

exports.normalizeLivestockPayload = (body = {}) => {
    let livestockInventory = Array.isArray(body.livestockInventory) ? body.livestockInventory : [];

    livestockInventory = livestockInventory
        .filter((item) => item && item.type)
        .map((item) => ({
            type: String(item.type).trim(),
            count: Math.max(0, Number(item.count) || 0),
            otherLabel: item.otherLabel?.trim() || '',
        }));

    let livestockType = body.livestockType?.trim() || '';
    if (livestockInventory.length > 0) {
        livestockType = livestockInventory
            .map((item) => {
                const label = item.type === 'Other' && item.otherLabel ? item.otherLabel : item.type;
                return item.count > 0 ? `${label} (${item.count})` : label;
            })
            .join(', ');
    }

    return { livestockInventory, livestockType };
};

exports.resolveFarmLocation = (body = {}) => {
    const fromMap = body.farmLocation;
    if (fromMap?.lat != null && fromMap?.lng != null) {
        const lat = Number(fromMap.lat);
        const lng = Number(fromMap.lng);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            const measuredAcres = Number(fromMap.measuredAcres || body.farmSize);
            return {
                lat,
                lng,
                measuredAcres: Number.isNaN(measuredAcres) ? undefined : measuredAcres,
                boundary: Array.isArray(fromMap.boundary) && fromMap.boundary.length >= 3
                    ? fromMap.boundary
                    : undefined,
            };
        }
    }
    return null;
};

/** Farm GPS is authoritative; agent device GPS is fallback only */
exports.resolveGpsLocation = (body, farmLocation) => {
    if (farmLocation) {
        return { lat: farmLocation.lat, lng: farmLocation.lng };
    }
    const gps = body.gpsLocation;
    if (gps?.lat != null && gps?.lng != null) {
        return { lat: Number(gps.lat), lng: Number(gps.lng) };
    }
    return undefined;
};

exports.normalizeCocoaPayload = (body = {}) => {
    const cropList = Array.isArray(body.cropList) ? body.cropList : [];
    const hasCocoaCrop =
        cropList.some((c) => String(c).toLowerCase() === 'cocoa') ||
        String(body.cropsGrown || '').toLowerCase().includes('cocoa');

    const cocoaFarmerId = body.cocoaFarmerId != null ? String(body.cocoaFarmerId).trim() : undefined;
    const hasPhoto = Boolean(body.cocoaCardPhoto);
    const hasId = Boolean(cocoaFarmerId);
    /** Only stamp consent/verified when this request explicitly submits consent */
    const consentSubmitted = body.cocoaCardConsent === true;

    if (!hasCocoaCrop && !hasId && !hasPhoto) {
        return {};
    }

    const result = {};
    if (cocoaFarmerId !== undefined) {
        result.cocoaFarmerId = cocoaFarmerId || undefined;
    }
    if (consentSubmitted) {
        result.cocoaCardConsentAt = new Date();
        if (hasId || hasPhoto) {
            result.cocoaCardVerifiedAt = new Date();
        }
    }
    return result;
};

exports.computeProfileCompleteness = (fields) => {
    const checks = [
        fields.name,
        fields.contact,
        fields.region,
        fields.district,
        fields.community,
        fields.farmType,
        fields.cropList?.length || fields.cropsGrown,
        fields.farmLocation?.lat != null || fields.community,
        fields.ghanaCardNumber || fields.onboardingSource === 'self',
        fields.investmentInterest,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
};

exports.buildFarmerOnboardingFields = (body, options = {}) => {
    const { onboardingSource = 'agent' } = options;
    const cropData = exports.normalizeCropPayload(body);
    const livestockData = exports.normalizeLivestockPayload(body);
    const farmLocation = exports.resolveFarmLocation(body);
    const gpsLocation = exports.resolveGpsLocation(body, farmLocation);

    const farmSizeFromMap = farmLocation?.measuredAcres;
    const farmSize = farmSizeFromMap != null && farmSizeFromMap > 0
        ? farmSizeFromMap
        : (body.farmSize != null ? Number(body.farmSize) : undefined);

    const trainingModules = Array.isArray(body.trainingModules)
        ? body.trainingModules.map(String)
        : [];

    const investmentReadinessScore = body.investmentReadinessScore != null
        ? Math.min(100, Math.max(0, Number(body.investmentReadinessScore) || 0))
        : undefined;

    const base = {
        name: body.name,
        region: exports.normalizeRegion(body.region),
        district: body.district,
        community: body.community,
        farmType: exports.normalizeFarmType(body.farmType),
        contact: body.contact,
        gender: body.gender,
        dob: body.dob,
        language: body.language,
        otherLanguage: body.otherLanguage,
        email: body.email,
        farmSize,
        yearsOfExperience: body.yearsOfExperience != null ? Number(body.yearsOfExperience) : undefined,
        landOwnershipStatus: body.landOwnershipStatus,
        ...cropData,
        ...livestockData,
        fieldNotes: body.fieldNotes,
        investmentInterest: body.investmentInterest,
        preferredInvestmentType:
            body.investmentInterest === 'yes' && body.preferredInvestmentType
                ? body.preferredInvestmentType
                : undefined,
        estimatedCapitalNeed: body.estimatedCapitalNeed != null ? Number(body.estimatedCapitalNeed) : undefined,
        hasPreviousInvestment: Boolean(body.hasPreviousInvestment),
        investmentReadinessScore,
        trainingModules,
        farmLocation: farmLocation || undefined,
        gpsLocation,
        onboardingSource,
        ghanaCardNumber: body.ghanaCardNumber,
        onboardingAgentId: body.onboardingAgentId || undefined,
        verificationConfirmed: Boolean(body.verificationConfirmed || body.onboardingAgentId),
        ...exports.normalizeCocoaPayload(body),
    };

    base.profileCompleteness = exports.computeProfileCompleteness(base);

    return base;
};

exports.ensurePrimaryFarm = async (farmer, agentId) => {
    if (!farmer?._id || !agentId) return null;

    const existing = await Farm.findOne({ farmer: farmer._id });
    if (existing) return existing;

    const crop =
        farmer.cropList?.find((c) => c && c !== 'Other') ||
        farmer.cropsGrown?.split(',')[0]?.trim() ||
        farmer.livestockInventory?.[0]?.type ||
        'Mixed';

    const farmCategory = inferFarmCategory(crop);

    const locationParts = [farmer.community, farmer.district, farmer.region].filter(Boolean);
    const farm = new Farm({
        id: `F-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${farmer.name}'s Farm`,
        farmer: farmer._id,
        location: locationParts.join(', ') || 'Ghana',
        crop,
        farmCategory,
        agent: agentId,
        status: 'scheduled',
        coordinates: farmer.farmLocation?.lat != null
            ? { lat: farmer.farmLocation.lat, lng: farmer.farmLocation.lng }
            : undefined,
        measuredAcres: farmer.farmLocation?.measuredAcres || farmer.farmSize,
    });

    return farm.save();
};
