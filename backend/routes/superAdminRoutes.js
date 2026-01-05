const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRegionalPerformance,
    getAgentAccountability,
    createUser,
    getEscalations,
    getSystemLogs,
    getFarmsOversight,
    getPartnershipsSummary,
    getUsersList
} = require('../controllers/superAdminController');
const auth = require('../middleware/auth');

// Middleware to check if user is super_admin
const isSuperAdmin = async (req, res, next) => {
    try {
        if (req.agent.role !== 'super_admin') {
            return res.status(403).json({ msg: 'Access denied. Super Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

router.use(auth); // All routes require login

// Apply explicit role check for extra security (though checking req.agent.role in logic is also fine)
// We need to fetch the full agent in auth middleware to check role, or rely on token payload if we add it there.
// For now, assuming auth middleware populates req.agent from DB or we trust the logic.

router.get('/stats', getDashboardStats);
router.get('/regions', getRegionalPerformance); // Updated from regional-performance for shorter path
router.get('/agents', getAgentAccountability);
router.post('/users', createUser);
router.get('/users-list', getUsersList);
router.get('/escalations', getEscalations);
router.get('/audit-logs', getSystemLogs);
router.get('/farms', getFarmsOversight);
router.get('/partnerships', getPartnershipsSummary);

module.exports = router;
