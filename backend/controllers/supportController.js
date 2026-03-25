const SupportTicket = require('../models/SupportTicket');

// @route   GET api/support/tickets
// @desc    Get all tickets for logged-in user
exports.getTickets = async (req, res) => {
    try {
        if (req.agent && req.agent.isMock) {
            // Return some mock tickets for dev
            return res.json([
                {
                    _id: 'mock-tkt-1',
                    ticketId: 'TKT-1001',
                    subject: 'Farmer registration app crash',
                    category: 'Technical',
                    status: 'In Progress',
                    priority: 'High',
                    createdAt: new Date(Date.now() - 86400000),
                    messages: [{ sender: 'user', message: 'The app crashes when I try to upload farmer images in offline mode.' }]
                },
                {
                    _id: 'mock-tkt-2',
                    ticketId: 'TKT-1002',
                    subject: 'Payout mismatch for October',
                    category: 'Payouts',
                    status: 'Resolved',
                    priority: 'Medium',
                    createdAt: new Date(Date.now() - 172800000),
                    messages: [
                        { sender: 'user', message: 'My dashboard shows GH₵ 908 but I received GH₵ 850.' },
                        { sender: 'support', message: 'Hello! The GH₵ 58 difference is due to withholding tax on commissions.' }
                    ]
                }
            ]);
        }

        const tickets = await SupportTicket.find({ user: req.agent._id || req.agent.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error('getTickets error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/support/tickets
// @desc    Create a new support ticket
exports.createTicket = async (req, res) => {
    const { subject, description, category, priority } = req.body;

    try {
        if (req.agent && req.agent.isMock) {
            console.log('[MOCK REQ] createTicket:', req.body);
            return res.json({ 
                success: true, 
                ticketId: `TKT-${Math.floor(Math.random()*1000)}`,
                subject,
                status: 'Open'
            });
        }

        const ticketCount = await SupportTicket.countDocuments();
        const ticketId = `TKT-${1000 + ticketCount + 1}`;

        // Map frontend categories to model enum
        const categoryMap = {
            'Technical Issue': 'Technical',
            'Account Access': 'Other',
            'Payout Issue': 'Payouts',
            'Other': 'Other'
        };

        const newTicket = new SupportTicket({
            ticketId,
            user: req.agent._id || req.agent.id,
            userType: req.agent.role === 'super_admin' ? 'super_admin' : 'agent',
            subject,
            description,
            category: categoryMap[category] || 'Other',
            priority: priority || 'Medium',
            region: req.agent.region,
            district: req.agent.district,
            community: req.agent.community,
            messages: [{
                sender: 'user',
                message: description
            }]
        });

        const ticket = await newTicket.save();
        res.json(ticket);
    } catch (err) {
        console.error('createTicket error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/support/tickets/:id/message
// @desc    Add a message to a ticket
exports.addMessage = async (req, res) => {
    const { message } = req.body;

    try {
        if (req.agent && req.agent.isMock) {
            return res.json({ success: true, message: 'Mock message added' });
        }

        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        const agentId = req.agent._id || req.agent.id;
        if (ticket.user.toString() !== agentId.toString() && req.agent.role !== 'super_admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        ticket.messages.push({
            sender: 'user',
            message
        });

        if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
            ticket.status = 'Open';
        }

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error('addMessage error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
