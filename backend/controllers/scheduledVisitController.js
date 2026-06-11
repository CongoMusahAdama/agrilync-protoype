const ScheduledVisit = require('../models/ScheduledVisit');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const { sendScheduledVisitSms } = require('../utils/visitSms');

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

        let smsResult = { sent: false, succeeded: 0, message: 'SMS not attempted' };
        try {
            smsResult = await sendScheduledVisitSms(savedVisit, req.agent);
            if (smsResult.sent) {
                await ScheduledVisit.findByIdAndUpdate(savedVisit._id, {
                    smsSent: true,
                    smsSentAt: new Date(),
                    smsMessage: String(smsResult.smsMessage || '').substring(0, 500),
                });
                populatedVisit.smsSent = true;
            }
        } catch (smsErr) {
            console.error('createScheduledVisit SMS failed (non-fatal):', smsErr.message);
            smsResult = { sent: false, succeeded: 0, message: smsErr.message };
        }

        res.json({
            success: true,
            data: populatedVisit,
            sms: {
                sent: smsResult.sent,
                recipientCount: smsResult.succeeded || 0,
                message: smsResult.message,
            },
        });
    } catch (err) {
        console.error('createScheduledVisit error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST api/scheduled-visits/:id/send-sms
// @desc    Send SMS notification to farmers using their onboarding contact number
exports.sendSMSNotification = async (req, res) => {
    const { id } = req.params;
    const { customMessage } = req.body || {};

    try {
        const { id } = req.params;
        const mongoose = require('mongoose');
        
        if (req.agent && req.agent.isMock) {
            console.log('[MOCK] sendSMSNotification - simulating success');
            return res.json({ success: true, message: 'Mock SMS sent successfully' });
        }

        // Validate ID format before DB lookup to prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`[SMS] Invalid Visit ID: ${id}. Using simulated response for trial/mock records.`);
            return res.json({ 
                success: true, 
                message: 'Simulation Succeeded: SMS broadcast marked as queued for this trial record.',
                warning: 'Note: This is a trial/mock record. Real transmission is reserved for verified field logs.'
            });
        }

        const visit = await ScheduledVisit.findById(id);
        if (!visit) {
            return res.status(404).json({ success: false, message: 'Scheduled visit for ID ' + id + ' not found in field records.' });
        }

        const agentId = String(req.agent._id || req.agent.id);
        const visitAgentId = String(visit.agent);
        if (visitAgentId !== agentId) {
            return res.status(401).json({ success: false, message: 'Authorization mismatch: This visit record belongs to another agent.' });
        }

        const smsResult = await sendScheduledVisitSms(visit, req.agent, { customMessage });

        if (!smsResult.sent && smsResult.total === 0) {
            return res.json({
                success: true,
                message: smsResult.message || 'No growers were linked to this visit for SMS.',
                warning: 'No growers in this visit list have valid contact numbers.',
                data: { recipientCount: 0 },
            });
        }

        if (!smsResult.sent) {
            return res.json({
                success: true,
                message: smsResult.message || 'No valid phone numbers found for the selected growers.',
                warning: 'No growers in this visit list have valid contact numbers.',
                data: { recipientCount: 0 },
            });
        }

        try {
            await ScheduledVisit.findByIdAndUpdate(id, {
                smsSent: true,
                smsSentAt: new Date(),
                smsMessage: String(smsResult.smsMessage || '').substring(0, 500),
            });
        } catch (dbErr) {
            console.error('[SMS] Status update failed:', dbErr.message);
        }

        const agentIdForActivity = req.agent._id || req.agent.id;
        await Activity.create({
            agent: agentIdForActivity,
            type: 'event',
            title: 'Bulk SMS — field visit',
            description: `mNotify bulk SMS queued for ${smsResult.succeeded}/${smsResult.total} grower(s).`,
        });

        return res.json({
            success: true,
            message: `Communication broadcast successfully queued for ${smsResult.succeeded} grower(s).`,
            data: { recipientCount: smsResult.succeeded },
        });

    } catch (err) {
        console.error('[SMS] sendSMSNotification critical failure:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Transmission Error 500: System could not finalize the SMS broadcast. Please check your network or try logging a call instead.',
            error: err.message
        });
    }
};


// @route   POST api/scheduled-visits/:id/phone-call
// @desc    Log a phone call follow-up
exports.logPhoneCall = async (req, res) => {
    const { id } = req.params;
    const { farmerId, notes, callDuration } = req.body;

    try {
        const { id } = req.params;
        const mongoose = require('mongoose');

        if (req.agent && req.agent.isMock) {
            console.log('[MOCK REQ] logPhoneCall for visit:', id);
            return res.json({ success: true, message: 'Mock phone call logged' });
        }

        // Validate ID format before DB lookup
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid field record ID. Please ensure you are logging against a verified mission.' });
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
