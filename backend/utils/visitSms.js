const Farmer = require('../models/Farmer');
const { dispatchBulkGrowerSms } = require('./bulkGrowerSms');

const formatVisitDate = (date) => {
    if (!date) return 'a date to be confirmed';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const visitTypeLabel = (visitType) => {
    if (visitType === 'farm-visit') return 'farm visit';
    if (visitType === 'community-visit') return 'community visit';
    if (visitType === 'farmer-meeting') return 'farmer group meeting';
    return 'field visit';
};

/**
 * Resolve growers who should receive a scheduled-visit SMS.
 */
exports.resolveScheduledVisitRecipients = async (visit, agentId) => {
    const farmerIds = (visit.farmers || []).filter(Boolean);
    if (farmerIds.length > 0) {
        const query = { _id: { $in: farmerIds } };
        if (agentId) query.agent = agentId;
        return Farmer.find(query).select('name contact').lean();
    }

    if (visit.visitType === 'community-visit' && visit.community && agentId) {
        const communityRegex = new RegExp(String(visit.community).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        return Farmer.find({ agent: agentId, community: communityRegex }).select('name contact').lean();
    }

    return [];
};

/** Matches Bulk SMS modal "Field Visit" template style */
exports.buildScheduledVisitSms = (visit, agent, customMessage) => {
    if (customMessage) return customMessage;

    const dateStr = formatVisitDate(visit.scheduledDate);
    const timeStr = visit.scheduledTime || 'morning';
    const typeLabel = visitTypeLabel(visit.visitType);
    const purpose = visit.purpose || 'Field check';
    const location = visit.location || visit.community || 'your farm';

    return (
        `Dear {farmer_name}, this is {agent_name}. ` +
        `A ${typeLabel} is scheduled for ${dateStr} at ${timeStr} (${location}). ` +
        `Purpose: ${purpose}. Please be available. - AgriLync`
    );
};

exports.sendScheduledVisitSms = async (visit, agent, options = {}) => {
    const agentId = agent?._id || agent?.id;
    const farmers = await exports.resolveScheduledVisitRecipients(visit, agentId);
    const message = exports.buildScheduledVisitSms(visit, agent, options.customMessage);
    const farmerIds = farmers.map((f) => f._id);

    return dispatchBulkGrowerSms({
        farmerIds,
        farmers,
        agentId,
        message,
        agentName: agent?.name || 'AgriLync Agent',
        requireAgentOwnership: Boolean(agentId),
    });
};

/** Matches Bulk SMS modal "Training Session" template style */
exports.buildTrainingSessionSms = (delivery, agent, customMessage) => {
    if (customMessage) return customMessage;

    const dateStr = formatVisitDate(delivery.deliveryDate);
    const timeStr = delivery.deliveryTime || 'morning';
    const venue = delivery.venue || delivery.community || 'the scheduled location';

    return (
        `Hello {farmer_name}, this is an official reminder from {agent_name} ` +
        `for your ${delivery.moduleTitle} workshop on ${dateStr} at ${timeStr} (${venue}). ` +
        `Please ensure you are prompt. - AgriLync Field Ops`
    );
};

exports.sendTrainingSessionSms = async (delivery, agent, options = {}) => {
    const agentId = agent?._id || agent?.id;
    const farmerIds = (delivery.farmers || []).filter(Boolean);
    const message = exports.buildTrainingSessionSms(delivery, agent, options.customMessage);

    return dispatchBulkGrowerSms({
        farmerIds,
        agentId,
        message,
        agentName: agent?.name || 'AgriLync Agent',
        requireAgentOwnership: Boolean(agentId),
    });
};
