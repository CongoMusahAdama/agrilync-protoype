const express = require('express');
const router = express.Router();
const { getTickets, createTicket, addMessage } = require('../controllers/supportController');
const auth = require('../middleware/auth');

router.get('/tickets', auth, getTickets);
router.post('/tickets', auth, createTicket);
router.post('/tickets/:id/message', auth, addMessage);

module.exports = router;
