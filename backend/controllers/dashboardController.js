const dashboardService = require('../services/dashboardService');

/**
 * @route   GET api/dashboard/summary
 * @desc    Get all-in-one dashboard data for agent
 * @access  Private
 */
exports.getSummary = async (req, res) => {
    try {
        const summary = await dashboardService.getDashboardSummary(req.agent);
        res.json({
            success: true,
            data: summary
        });
    } catch (err) {
        console.error('Dashboard Summary Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard summary'
        });
    }
};

/**
 * @route   POST api/dashboard/refresh
 * @desc    Manually invalidate cache and get fresh data
 * @access  Private
 */
exports.refreshSummary = async (req, res) => {
    try {
        dashboardService.invalidateCache(req.agent.id);
        const summary = await dashboardService.getDashboardSummary(req.agent);
        res.json({
            success: true,
            data: summary
        });
    } catch (err) {
        console.error('Dashboard Refresh Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh dashboard data'
        });
    }
};
