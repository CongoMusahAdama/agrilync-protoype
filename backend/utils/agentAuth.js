/** Compare agent ids from JWT, Mongo ObjectId, or string agent codes. */
function agentIdsMatch(storedId, requestId) {
    if (storedId == null || requestId == null) return false;
    return String(storedId) === String(requestId);
}

function requestAgentId(req) {
    return req.agent?._id || req.agent?.id;
}

/** True when the logged-in agent may act on this grower record. */
function farmerAccessibleToAgent(farmer, requestAgentId) {
    if (!farmer || !requestAgentId) return false;
    return (
        agentIdsMatch(farmer.agent, requestAgentId) ||
        agentIdsMatch(farmer.onboardingAgentId, requestAgentId) ||
        agentIdsMatch(farmer.verificationAgent, requestAgentId)
    );
}

module.exports = { agentIdsMatch, farmerAccessibleToAgent, requestAgentId };
