const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRegionalPerformance,
    getRegionalPerformanceDetail,
    getAgentAccountability,
    createUser,
    updateUser,
    resetUserSession,
    deleteUser,
    getEscalations,
    getSystemLogs,
    getFarmsOversight,
    getPartnershipsSummary,
    getUsersList,
    getSupervisors,
    getAllFarmers,
    getFarmerDetails,
    updateFarmerStatus,
    resolveEscalation,
    getVisits,
    getMedia,
    getTraining,
    getTasks,
    getReports,
    sendNotification,
    getBlogAuthors,
    createBlogAuthor,
    updateBlogAuthor,
    deleteBlogAuthor,
    getSubscribers,
    getFarmerDeletionRequests,
    reviewFarmerDeletionRequest,
} = require('../controllers/superAdminController');
const auth = require('../middleware/auth');

// Middleware to check if user is super_admin
const isSuperAdmin = async (req, res, next) => {
    try {
        if (req.agent.role !== 'super_admin' && req.agent.role !== 'supervisor') {
            return res.status(403).json({ msg: 'Access denied.' });
        }
        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

router.use(auth); // All routes require login
router.use(isSuperAdmin); // All routes in this file require Super Admin role

router.get('/stats', getDashboardStats);
router.get('/regions', getRegionalPerformance); // Updated from regional-performance for shorter path
router.get('/regional-performance', getRegionalPerformance); // Added alias for compatibility
router.get('/regional-performance/:id', getRegionalPerformanceDetail);
router.get('/agents', getAgentAccountability);
router.get('/supervisors', getSupervisors);
router.get('/users', getUsersList);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.post('/users/:id/reset-session', resetUserSession);
router.delete('/users/:id', deleteUser);
router.get('/users-list', getUsersList);
router.get('/escalations', getEscalations);
router.put('/escalations/:id/resolve', resolveEscalation); // Resolve escalation route
router.get('/audit-logs', getSystemLogs);
router.get('/logs', getSystemLogs); // Added alias for frontend
router.get('/farms', getFarmsOversight);
router.get('/partnerships', getPartnershipsSummary);
router.get('/farmers', getAllFarmers); // New route for farmers
router.get('/farmers/:id', getFarmerDetails); // Get deep details
router.put('/farmers/:id/status', updateFarmerStatus); // Override status route
router.get('/farmer-deletion-requests', getFarmerDeletionRequests);
router.put('/farmer-deletion-requests/:id/review', reviewFarmerDeletionRequest);
router.get('/visits', getVisits); // Field visits route
router.get('/media', getMedia); // Media route
router.get('/training', getTraining); // Training audit route
router.get('/tasks', getTasks); // Tasks route
router.get('/reports', getReports); // Analytics reports route
router.post('/notifications', sendNotification); // New route to send notifications

router.get('/subscribers', getSubscribers);
router.get('/blog-authors', getBlogAuthors);
router.post('/blog-authors', createBlogAuthor);
router.put('/blog-authors/:id', updateBlogAuthor);
router.delete('/blog-authors/:id', deleteBlogAuthor);

module.exports = router;

