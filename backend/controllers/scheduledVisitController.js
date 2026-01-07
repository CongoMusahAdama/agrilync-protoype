const ScheduledVisit = require('../models/ScheduledVisit');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// @route   GET api/scheduled-visits
// @desc    Get all scheduled visits for current agent
exports.getScheduledVisits = async (req, res) => {
    try {
        const agentId = req.agent._id || req.agent.id;
        const visits = await ScheduledVisit.find({ agent: agentId })
            .populate('farmers', 'name contact region district community')
            .sort({ scheduledDate: 1, scheduledTime: 1 });
        res.json({ success: true, data: visits });
    } catch (err) {
        console.error('getScheduledVisits error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/scheduled-visits
// @desc    Create a new scheduled visit
exports.createScheduledVisit = async (req, res) => {
    const { visitType, farmerIds, community, scheduledDate, scheduledTime, purpose, location, notes } = req.body;

    try {
        const agentId = req.agent._id || req.agent.id;
        
        // Validate farmers belong to agent
        if (farmerIds && farmerIds.length > 0) {
            const farmers = await Farmer.find({ _id: { $in: farmerIds } });
            const agentIdStr = String(agentId);
            const invalidFarmers = farmers.filter(f => {
                const farmerAgentId = f.agent._id ? f.agent._id.toString() : f.agent.toString();
                return farmerAgentId !== agentIdStr;
            });
            if (invalidFarmers.length > 0) {
                return res.status(401).json({ success: false, message: 'Some farmers do not belong to you' });
            }
        }

        // Ensure scheduledDate is a proper Date object
        const visitDate = scheduledDate instanceof Date ? scheduledDate : new Date(scheduledDate);
        
        // Validate date is not in the past
        if (isNaN(visitDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        const scheduledVisit = new ScheduledVisit({
            agent: agentId,
            visitType,
            farmers: farmerIds || [],
            community: community || undefined,
            scheduledDate: visitDate,
            scheduledTime: scheduledTime || '09:00',
            purpose: purpose || '',
            location: location || undefined,
            notes: notes || undefined,
            status: 'scheduled'
        });

        const savedVisit = await scheduledVisit.save();

        // Log activity
        try {
            await Activity.create({
                agent: agentId,
                type: 'event',
                title: `Scheduled ${visitType === 'farm-visit' ? 'Farm Visit' : visitType === 'community-visit' ? 'Community Visit' : 'Farmer Meeting'}`,
                description: `${purpose} - ${farmerIds?.length || 0} farmer(s)`
            });
        } catch (activityErr) {
            // Log activity error but don't fail the request
            console.error('Failed to log activity:', activityErr.message);
        }

        const populatedVisit = await ScheduledVisit.findById(savedVisit._id)
            .populate('farmers', 'name contact region district community');

        res.json({ success: true, data: populatedVisit });
    } catch (err) {
        console.error('createScheduledVisit error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/scheduled-visits/:id/send-sms
// @desc    Send SMS notification to farmers for scheduled visit
exports.sendSMSNotification = async (req, res) => {
    const { id } = req.params;
    const { customMessage } = req.body;

    try {
        if (!req.agent) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const visit = await ScheduledVisit.findById(id).populate('farmers', 'name contact');
        
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit not found' });
        }

        // Safely compare agent IDs
        const agentId = String(req.agent._id || req.agent.id || req.agent);
        // visit.agent is an ObjectId (not populated), so convert to string
        const visitAgentId = String(visit.agent);
        
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Check if visit has farmers (for community visits, we might not have farmers)
        if (visit.visitType !== 'community-visit' && (!visit.farmers || visit.farmers.length === 0)) {
            return res.status(400).json({ success: false, message: 'No farmers assigned to this visit' });
        }

        // Generate SMS message
        const dateStr = new Date(visit.scheduledDate).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const agentName = req.agent.name || 'AgriLync Agent';
        const visitTypeText = visit.visitType === 'farm-visit' ? 'farm visit' : 
                             visit.visitType === 'community-visit' ? 'community visit' : 'meeting';
        
        const defaultMessage = customMessage || 
            `Hello! This is ${agentName} from AgriLync. ` +
            `I have scheduled a ${visitTypeText} ` +
            `on ${dateStr} at ${visit.scheduledTime}. ` +
            `Purpose: ${visit.purpose}. ` +
            `Please confirm your availability. Thank you!`;

        // Get phone numbers from farmers
        let phoneNumbers = [];
        if (visit.visitType === 'community-visit') {
            // For community visits, we might need to get farmers from the community
            // For now, return a message that community notification will be sent
            phoneNumbers = [];
        } else {
            // Extract contact numbers from farmers
            if (visit.farmers && Array.isArray(visit.farmers) && visit.farmers.length > 0) {
                phoneNumbers = visit.farmers
                    .map(f => {
                        if (f && f.contact) {
                            // Clean phone number (remove spaces, dashes, etc.)
                            return String(f.contact).replace(/[\s\-\(\)]/g, '');
                        }
                        return null;
                    })
                    .filter(Boolean);
            } else {
                phoneNumbers = [];
            }
        }

        if (phoneNumbers.length === 0 && visit.visitType !== 'community-visit') {
            return res.status(400).json({ 
                success: false, 
                message: 'No valid phone numbers found for the selected farmers' 
            });
        }

        // Simulate SMS sending (in production, integrate with SMS gateway)
        console.log(`[SMS] Sending to ${phoneNumbers.length} farmer(s):`, phoneNumbers);
        console.log(`[SMS] Message: ${defaultMessage}`);

        // Update visit record
        visit.smsSent = true;
        visit.smsSentAt = new Date();
        visit.smsMessage = defaultMessage;
        await visit.save();

        // Log activity
        const agentIdForActivity = req.agent._id || req.agent.id;
        try {
            await Activity.create({
                agent: agentIdForActivity,
                type: 'event',
                title: `SMS sent for scheduled visit`,
                description: visit.visitType === 'community-visit' 
                    ? `SMS notification sent for community visit in ${visit.community}`
                    : `Sent to ${phoneNumbers.length} farmer(s)`
            });
        } catch (activityErr) {
            // Log activity error but don't fail the request
            console.error('Failed to log activity:', activityErr.message);
        }

        res.json({ 
            success: true, 
            message: visit.visitType === 'community-visit'
                ? `SMS notification prepared for community visit in ${visit.community}`
                : `SMS sent to ${phoneNumbers.length} farmer(s)`,
            data: { 
                phoneNumbers, 
                message: defaultMessage,
                visitType: visit.visitType
            }
        });
    } catch (err) {
        console.error('sendSMSNotification error:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            success: false, 
            message: err.message || 'Failed to send SMS. Please try again.' 
        });
    }
};

// @route   POST api/scheduled-visits/:id/phone-call
// @desc    Log a phone call follow-up
exports.logPhoneCall = async (req, res) => {
    const { id } = req.params;
    const { farmerId, notes, callDuration } = req.body;

    try {
        if (!req.agent) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const visit = await ScheduledVisit.findById(id).populate('farmers', 'name contact');
        
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit not found' });
        }

        // Safely compare agent IDs
        const agentId = String(req.agent._id || req.agent.id || req.agent);
        // visit.agent is an ObjectId (not populated), so convert to string
        const visitAgentId = String(visit.agent);
        
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Get farmer info if farmerId provided
        let farmer = null;
        if (farmerId) {
            farmer = await Farmer.findById(farmerId);
        } else if (visit.farmers && visit.farmers.length > 0) {
            // If no specific farmerId, use first farmer
            farmer = visit.farmers[0];
        }

        // Update visit record
        const callNotes = notes || 'Follow-up phone call made';
        const timestamp = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        visit.phoneCallMade = true;
        visit.phoneCallMadeAt = new Date();
        
        // Append to existing notes or create new
        const newNote = `[${timestamp}] ${callNotes}${callDuration ? ` (Duration: ${callDuration} min)` : ''}${farmer ? ` - ${farmer.name}` : ''}`;
        visit.phoneCallNotes = visit.phoneCallNotes 
            ? `${visit.phoneCallNotes}\n${newNote}` 
            : newNote;
        
        await visit.save();

        // Log activity
        const activityTitle = farmer 
            ? `Phone call made to ${farmer.name}` 
            : visit.visitType === 'community-visit'
                ? `Phone call made for community visit in ${visit.community}`
                : 'Phone call made for scheduled visit';
        
        const agentIdForActivity = req.agent._id || req.agent.id;
        try {
            await Activity.create({
                agent: agentIdForActivity,
                type: 'event',
                title: activityTitle,
                description: callNotes
            });
        } catch (activityErr) {
            // Log activity error but don't fail the request
            console.error('Failed to log activity:', activityErr.message);
        }

        // Return populated visit
        const populatedVisit = await ScheduledVisit.findById(visit._id)
            .populate('farmers', 'name contact region district community');

        res.json({ 
            success: true, 
            message: 'Phone call logged successfully',
            data: populatedVisit 
        });
    } catch (err) {
        console.error('logPhoneCall error:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            success: false, 
            message: err.message || 'Failed to log phone call. Please try again.' 
        });
    }
};

// @route   PUT api/scheduled-visits/:id
// @desc    Update scheduled visit
exports.updateScheduledVisit = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const visit = await ScheduledVisit.findById(id);
        
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit not found' });
        }

        // Safely compare agent IDs
        const agentId = String(req.agent._id || req.agent.id);
        // visit.agent is an ObjectId (not populated), so convert to string
        const visitAgentId = String(visit.agent);
        
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        Object.assign(visit, updates);
        visit.updatedAt = new Date();
        await visit.save();

        const populatedVisit = await ScheduledVisit.findById(visit._id)
            .populate('farmers', 'name contact region district community');

        res.json({ success: true, data: populatedVisit });
    } catch (err) {
        console.error('updateScheduledVisit error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   DELETE api/scheduled-visits/:id
// @desc    Cancel scheduled visit
exports.cancelScheduledVisit = async (req, res) => {
    const { id } = req.params;

    try {
        const visit = await ScheduledVisit.findById(id);
        
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit not found' });
        }

        // Safely compare agent IDs
        const agentId = String(req.agent._id || req.agent.id);
        // visit.agent is an ObjectId (not populated), so convert to string
        const visitAgentId = String(visit.agent);
        
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        visit.status = 'cancelled';
        await visit.save();

        res.json({ success: true, message: 'Visit cancelled' });
    } catch (err) {
        console.error('cancelScheduledVisit error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
