const Agent = require('../models/Agent');
const { normalizeRegion } = require('./farmerOnboarding');

const regionStem = (region) =>
    normalizeRegion(region || '')
        .replace(/\s+region$/i, '')
        .trim()
        .toLowerCase();

const regionsMatch = (agentRegion, farmerRegion) => {
    const a = regionStem(agentRegion);
    const f = regionStem(farmerRegion);
    if (!a || !f) return false;
    return a === f || a.includes(f) || f.includes(a);
};

/** Score how well an agent covers a farmer's district / community */
const locationCoverageScore = (agent, farmer) => {
    const districts = Array.isArray(agent.districts) ? agent.districts : [];
    if (!districts.length) return 0;

    const needles = [farmer.district, farmer.community]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase().trim());

    let best = 0;
    for (const assigned of districts) {
        const hay = String(assigned).toLowerCase().trim();
        for (const needle of needles) {
            if (!needle) continue;
            if (hay === needle) best = Math.max(best, 20);
            else if (hay.includes(needle) || needle.includes(hay)) best = Math.max(best, 12);
        }
    }
    return best;
};

/**
 * Pick the field agent closest to a self-onboarded grower by region + district/community overlap.
 * Falls back to any active agent in the same region.
 */
exports.findNearestVerificationAgent = async (farmer) => {
    const farmerRegion = normalizeRegion(farmer.region);
    if (!farmerRegion) return null;

    const agents = await Agent.find({
        role: 'agent',
        status: 'active',
    })
        .select('_id name region districts agentId contact stats.farmersOnboarded')
        .lean();

    const inRegion = agents.filter((a) => regionsMatch(a.region, farmerRegion));
    if (!inRegion.length) return null;

    const ranked = inRegion
        .map((agent) => {
            let score = locationCoverageScore(agent, farmer);
            // Slight preference for agents with lighter current load
            const onboarded = agent.stats?.farmersOnboarded || 0;
            score += Math.max(0, 8 - Math.floor(onboarded / 25));
            return { agent, score };
        })
        .sort((a, b) => b.score - a.score);

    return ranked[0]?.agent || inRegion[0];
};

exports.buildPendingQueueQuery = (agent) => {
    const agentId = agent._id || agent.id;
    const agentRegion = agent.region || '';
    const stem = regionStem(agentRegion);
    const regionRegex = stem ? new RegExp(stem, 'i') : null;

    return {
        status: 'pending',
        $or: [
            { verificationAgent: agentId },
            {
                $and: [
                    { $or: [{ verificationAgent: null }, { verificationAgent: { $exists: false } }] },
                    regionRegex
                        ? {
                              $or: [
                                  { region: agentRegion },
                                  { region: regionRegex },
                                  { region: `${stem.charAt(0).toUpperCase()}${stem.slice(1)} Region` },
                              ],
                          }
                        : {},
                ],
            },
        ],
    };
};

exports.agentCanVerifyFarmer = (agent, farmer) => {
    const agentId = (agent._id || agent.id)?.toString();
    if (!agentId || !farmer) return false;

    const isAssigned = farmer.agent && farmer.agent.toString() === agentId;
    if (isAssigned) return true;

    if (farmer.status !== 'pending') return false;

    if (farmer.verificationAgent && farmer.verificationAgent.toString() === agentId) {
        return true;
    }

    if (!farmer.verificationAgent && regionsMatch(agent.region, farmer.region)) {
        return true;
    }

    return false;
};
