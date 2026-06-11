/**
 * Roles and accounts that may stay signed in on multiple devices at once.
 */
function allowsConcurrentSessions(agent) {
    if (!agent) return false;
    if (agent.enableMultipleLogin) return true;
    return agent.role === 'super_admin' || agent.role === 'supervisor';
}

module.exports = { allowsConcurrentSessions };
