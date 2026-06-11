const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const { sendBulkSMS, normalizePhone } = require('./smsService');

/**
 * Build mNotify recipient list from grower records (same rules as POST /farmers/bulk-sms).
 */
const growersToRecipients = (farmers) =>
    farmers
        .filter((f) => f.contact && String(f.contact).trim() && String(f.contact).toLowerCase() !== 'null')
        .map((f) => ({
            name: f.name,
            phone: normalizePhone(f.contact),
        }))
        .filter((r) => r.phone.length >= 12);

/**
 * Canonical bulk grower SMS dispatch — used by Bulk SMS modal, visit alerts, and training alerts.
 */
exports.dispatchBulkGrowerSms = async ({
    farmerIds = [],
    farmers: presetFarmers = null,
    agentId = null,
    message,
    agentName = 'AgriLync Agent',
    requireAgentOwnership = true,
}) => {
    if (!message?.trim()) {
        return {
            success: false,
            sent: false,
            total: 0,
            succeeded: 0,
            failed: 0,
            message: 'Message text is required.',
        };
    }

    let farmers = Array.isArray(presetFarmers) ? presetFarmers : [];

    if (!farmers.length && Array.isArray(farmerIds) && farmerIds.length > 0) {
        const validIds = farmerIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (!validIds.length) {
            return {
                success: false,
                sent: false,
                total: 0,
                succeeded: 0,
                failed: 0,
                message: 'No valid grower IDs provided.',
            };
        }

        const query = { _id: { $in: validIds } };
        if (requireAgentOwnership && agentId) {
            query.agent = agentId;
        }

        farmers = await Farmer.find(query).select('name contact').lean();
    }

    if (!farmers.length) {
        return {
            success: false,
            sent: false,
            total: 0,
            succeeded: 0,
            failed: 0,
            message: requireAgentOwnership && agentId
                ? 'No matching growers found for your account.'
                : 'No growers were linked for SMS.',
        };
    }

    const recipients = growersToRecipients(farmers);

    if (!recipients.length) {
        return {
            success: true,
            sent: false,
            total: farmers.length,
            succeeded: 0,
            failed: farmers.length,
            message: 'None of the selected growers have a valid mobile number on file.',
            smsMessage: message.trim(),
        };
    }

    const broadcastResult = await sendBulkSMS(recipients, message.trim(), {
        agentName: agentName || 'AgriLync Agent',
    });

    const succeeded = broadcastResult.succeeded || 0;
    const sent = succeeded > 0;

    return {
        success: sent || broadcastResult.simulated,
        sent,
        total: recipients.length,
        succeeded,
        failed: broadcastResult.failed ?? (recipients.length - succeeded),
        simulated: broadcastResult.simulated,
        channel: broadcastResult.channel || 'mnotify',
        message: broadcastResult.simulated
            ? `Simulated bulk SMS to ${succeeded} grower(s) (mNotify key missing on server).`
            : sent
                ? `mNotify is delivering your message to ${succeeded} grower(s).`
                : 'SMS could not be delivered. Check grower phone numbers and mNotify balance.',
        smsMessage: message.trim(),
        data: broadcastResult,
    };
};

exports.growersToRecipients = growersToRecipients;
