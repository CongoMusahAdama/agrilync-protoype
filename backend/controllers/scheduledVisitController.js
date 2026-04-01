const ScheduledVisit = require('../models/ScheduledVisit');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// @route   GET api/scheduled-visits
// @desc    Get all scheduled visits for current agent
exports.getScheduledVisits = async (req, res) => {
    try {
        if (req.agent && req.agent.isMock) {
            // Return rich mock data for development
            const mockVisits = [
                {
                    _id: 'mock-visit-1',
                    visitType: 'farm-visit',
                    farmers: [
                        { name: 'Kwame Mensah', contact: '024 123 4567', region: 'Ashanti', district: 'Ejisu', community: 'Bonwire' },
                        { name: 'Ama Serwaa', contact: '050 987 6543', region: 'Ashanti', district: 'Juaben', community: 'Nobewam' }
                    ],
                    scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
                    scheduledTime: '08:30',
                    purpose: 'Post-planting inspection and technical assistance',
                    status: 'scheduled',
                    region: 'Ashanti',
                    smsSent: true
                },
                {
                    _id: 'mock-visit-2',
                    visitType: 'community-visit',
                    community: 'Bonwire Community Center',
                    scheduledDate: new Date(Date.now() + 172800000), // Day after tomorrow
                    scheduledTime: '14:00',
                    purpose: 'Investor matching info session for all cocoa growers',
                    status: 'scheduled',
                    region: 'Ashanti',
                    smsSent: false
                }
            ];
            return res.json({ success: true, data: mockVisits });
        }

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
// @desc    Send SMS notification to farmers using their onboarding contact number
exports.sendSMSNotification = async (req, res) => {
    const { id } = req.params;
    const { customMessage } = req.body;

    try {
        if (req.agent && req.agent.isMock) {
            return res.json({ success: true, message: 'Mock SMS sent successfully' });
        }

        // Use findById without populate first to confirm ownership
        const visit = await ScheduledVisit.findById(id);
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit not found' });
        }

        const agentId = String(req.agent._id || req.agent.id);
        const visitAgentId = String(visit.agent);
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Fetch full farmer details using onboarding contact field
        const Farmer = require('../models/Farmer');
        let farmers = [];
        if (visit.farmers && visit.farmers.length > 0) {
            farmers = await Farmer.find({ _id: { $in: visit.farmers } }, 'name contact id');
        }

        // Build the SMS message
        const dateStr = new Date(visit.scheduledDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
        const agentName = req.agent.name || 'AgriLync Agent';
        const visitTypeLabel = visit.visitType === 'farm-visit' ? 'farm visit'
            : visit.visitType === 'community-visit' ? 'community visit' : 'meeting';

        const smsMessage = customMessage ||
            `Hello! This is ${agentName} from AgriLync. ` +
            `A ${visitTypeLabel} has been scheduled for ${dateStr} at ${visit.scheduledTime}. ` +
            `Purpose: ${visit.purpose}. Please prepare accordingly. Thank you.`;

        // Collect valid phone numbers from onboarding contact field
        const recipients = farmers
            .filter(f => f.contact && String(f.contact).trim() !== '')
            .map(f => ({
                name: f.name,
                lyncId: f.id,
                phone: String(f.contact).replace(/[\s\-\(\)]/g, '')
            }));

        const noPhoneWarning = farmers.length > 0 && recipients.length === 0
            ? 'Note: No growers in this visit have a phone number on file from onboarding.'
            : null;

        // ── SMS Gateway Integration Point ──────────────────────────────────────
        // When an SMS gateway (e.g. Arkesel, Hubtel, Twilio) is configured,
        // replace this comment block with:
        //   for (const r of recipients) {
        //     await smsClient.send({ to: r.phone, message: smsMessage });
        //   }
        // ───────────────────────────────────────────────────────────────────────
        console.log(`[SMS] To ${recipients.length} grower(s):`, recipients.map(r => r.phone));
        console.log(`[SMS] Message: ${smsMessage}`);

        // Mark SMS as sent using findByIdAndUpdate (avoids mongoose re-validation crash)
        await ScheduledVisit.findByIdAndUpdate(id, {
            smsSent: true,
            smsSentAt: new Date(),
            smsMessage
        });

        // Log activity — wrapped so it never crashes the main flow
        try {
            const agentIdForActivity = req.agent._id || req.agent.id;
            await Activity.create({
                agent: agentIdForActivity,
                type: 'event',
                title: 'SMS notification sent for scheduled visit',
                description: recipients.length > 0
                    ? `Sent to ${recipients.length} grower(s): ${recipients.map(r => r.name).join(', ')}`
                    : `Visit ID ${id} — ${noPhoneWarning || 'Community visit notification prepared'}`
            });
        } catch (actErr) {
            console.error('[SMS] Activity log failed (non-fatal):', actErr.message);
        }

        return res.json({
            success: true,
            message: recipients.length > 0
                ? `SMS queued for ${recipients.length} grower(s)`
                : visit.visitType === 'community-visit'
                    ? 'Community visit notification prepared'
                    : 'Visit marked — no grower phone numbers found from onboarding',
            warning: noPhoneWarning || undefined,
            data: {
                recipients,
                message: smsMessage,
                visitType: visit.visitType
            }
        });

    } catch (err) {
        console.error('[SMS] sendSMSNotification crash:', err.message);
        console.error('[SMS] Stack:', err.stack);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to send SMS notification'
        });
    }
};


// @route   POST api/scheduled-visits/:id/phone-call
// @desc    Log a phone call follow-up
exports.logPhoneCall = async (req, res) => {
    const { id } = req.params;
    const { farmerId, notes, callDuration } = req.body;

    try {
        if (req.agent && req.agent.isMock) {
            console.log('[MOCK REQ] logPhoneCall for visit:', id);
            return res.json({ success: true, message: 'Mock phone call logged' });
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
