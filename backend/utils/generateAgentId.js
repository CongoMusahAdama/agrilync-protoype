/** Staff ID prefixes — LYC = field agent, SUP = supervisor, SA = super admin */
const AGENT_ID_PATTERN = /^LYC\d{5}$/;
const SUPERVISOR_ID_PATTERN = /^SUP-\d{4}$/;
const SUPER_ADMIN_ID_PATTERN = /^SA-\d{3}$/;

const randomInRange = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const isValidStaffId = (role, agentId) => {
    const id = String(agentId || '').trim();
    if (role === 'supervisor') return SUPERVISOR_ID_PATTERN.test(id);
    if (role === 'super_admin') return SUPER_ADMIN_ID_PATTERN.test(id);
    return AGENT_ID_PATTERN.test(id);
};

const generateStaffIdCandidate = (dbRole) => {
    if (dbRole === 'supervisor') {
        return `SUP-${randomInRange(1000, 9999)}`;
    }
    if (dbRole === 'super_admin') {
        return `SA-${randomInRange(100, 999)}`;
    }
    return `LYC${randomInRange(10000, 99999)}`;
};

/**
 * Generate a unique staff agentId with collision retry.
 * @param {import('mongoose').Model} AgentModel
 * @param {'agent'|'supervisor'|'super_admin'} dbRole
 */
const generateUniqueStaffId = async (AgentModel, dbRole = 'agent') => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
        const candidate = generateStaffIdCandidate(dbRole);
        const exists = await AgentModel.findOne({ agentId: candidate }).select('_id').lean();
        if (!exists) return candidate;
    }
    const tail = Date.now().toString().slice(-5);
    return dbRole === 'supervisor'
        ? `SUP-${tail.slice(-4)}`
        : dbRole === 'super_admin'
          ? `SA-${tail.slice(-3)}`
          : `LYC${tail}`;
};

module.exports = {
    AGENT_ID_PATTERN,
    isValidStaffId,
    generateStaffIdCandidate,
    generateUniqueStaffId,
};
