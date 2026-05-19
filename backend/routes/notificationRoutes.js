const express = require('express');
const router  = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification
} = require('../controllers/notificationController');
const auth         = require('../middleware/auth');
const requireRole  = require('../middleware/requireRole');

// ─── Agent routes ─────────────────────────────────────────────────────────────
router.get('/',                  auth, getNotifications);
router.put('/mark-all-read',     auth, markAllAsRead);       // must be before /:id
router.put('/:id',               auth, markAsRead);

// ─── Admin / Supervisor routes ────────────────────────────────────────────────
// POST /api/notifications/send  — blast a notification to one or many agents
router.post('/send', auth, requireRole(['super_admin', 'supervisor']), sendNotification);

module.exports = router;
