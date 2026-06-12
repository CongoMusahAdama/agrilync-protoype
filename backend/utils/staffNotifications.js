const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const Notification = require('../models/Notification');
const { sendSMS } = require('./smsService');
const { sendPushNotification } = require('./firebase');

const smsEnabledForAgent = (agent) => agent?.notificationPreferences?.sms !== false;

const sendSmsSafe = (phone, body) => {
    if (!phone || !body) return Promise.resolve();
    return sendSMS(phone, body).catch((err) => {
        console.error('[staffNotifications] SMS failed:', err.message);
    });
};

const createInAppNotification = async ({
    agentId,
    title,
    message,
    type = 'alert',
    priority = 'medium',
    senderRole = 'super-admin',
    senderName = 'AgriLync',
}) => {
    if (!agentId) return;
    try {
        await Notification.create({
            agent: agentId,
            title,
            message,
            type,
            priority,
            senderRole,
            senderName,
        });
    } catch (err) {
        console.error('[staffNotifications] In-app notification failed:', err.message);
    }
};

const pushToAgent = async (agentDoc, { title, body }) => {
    const token = agentDoc?.fcmToken;
    if (!token) return;
    try {
        await sendPushNotification(token, {
            title,
            body,
            data: { type: 'alert' },
        });
    } catch (err) {
        console.error('[staffNotifications] Push failed:', err.message);
    }
};

const formatSupervisorContact = (supervisor) => supervisor?.contact || supervisor?.email || '';

const buildAgentSupervisorAssignedSms = ({ agentName, agentId, region, supervisor }) => {
    const regionLabel = region || 'Unassigned';
    const supervisorContact = formatSupervisorContact(supervisor) || 'contact admin';
    return (
        `Hello ${agentName}, a reporting supervisor has been assigned to you on AgriLync. ` +
        `Agent ID: ${agentId}. Region: ${regionLabel}. ` +
        `Supervisor: ${supervisor.name} (ID: ${supervisor.agentId || 'N/A'}). Contact: ${supervisorContact}. ` +
        `View details in your agent dashboard.`
    );
};

const buildSupervisorAgentAssignedSms = ({
    supervisorName,
    agentName,
    agentId,
    region,
    agentPhone,
    agentEmail,
}) => {
    const regionLabel = region || 'Unassigned';
    const contactParts = [];
    if (agentPhone) contactParts.push(`Phone: ${agentPhone}`);
    if (agentEmail) contactParts.push(`Email: ${agentEmail}`);
    const contactLine = contactParts.length ? `${contactParts.join('. ')}.` : '';
    return (
        `Hello ${supervisorName}, a field agent has been assigned to you on AgriLync. ` +
        `Agent: ${agentName}. Agent ID: ${agentId}. Region: ${regionLabel}. ` +
        `${contactLine} ` +
        `They can reach you from their agent dashboard.`
    ).replace(/\s+/g, ' ').trim();
};

/** Notify all active super admins (in-app + SMS) */
const notifySuperAdmins = async ({
    title,
    message,
    smsBody,
    type = 'alert',
    priority = 'high',
    senderRole = 'supervisor',
    senderName = 'Field Agent',
}) => {
    const admins = await Agent.find({
        role: 'super_admin',
        status: { $ne: 'inactive' },
    })
        .select('_id contact name fcmToken notificationPreferences')
        .lean();

    await Promise.all(
        admins.map(async (admin) => {
            await createInAppNotification({
                agentId: admin._id,
                title,
                message,
                type,
                priority,
                senderRole,
                senderName,
            });
            await pushToAgent(admin, { title, body: message });
        })
    );

    if (smsBody) {
        const phones = [
            ...new Set(
                admins
                    .filter(smsEnabledForAgent)
                    .map((a) => a.contact)
                    .filter(Boolean)
            ),
        ];
        await Promise.all(phones.map((phone) => sendSmsSafe(phone, smsBody)));
    }
};

/** Notify a single staff agent (in-app + SMS + push) */
const notifyStaffAgent = async ({
    agentId,
    agentDoc,
    title,
    message,
    smsBody,
    type = 'alert',
    priority = 'medium',
    senderRole = 'super-admin',
    senderName = 'Admin',
}) => {
    let agent = agentDoc;
    if (!agent && agentId) {
        agent = await Agent.findById(agentId)
            .select('_id contact name fcmToken notificationPreferences agentId region email')
            .lean();
    }
    if (!agent) return;

    await createInAppNotification({
        agentId: agent._id,
        title,
        message,
        type,
        priority,
        senderRole,
        senderName,
    });
    await pushToAgent(agent, { title, body: message });
    if (smsBody && agent.contact && smsEnabledForAgent(agent)) {
        await sendSmsSafe(agent.contact, smsBody);
    }
};

/** Agent told they have a new reporting supervisor */
const notifyAgentSupervisorAssigned = async (agent, supervisor) => {
    if (!agent || !supervisor) return;

    const title = 'Supervisor Assigned';
    const contact = formatSupervisorContact(supervisor);
    const message = `${supervisor.name} is now your reporting supervisor${contact ? ` (${contact})` : ''}.`;
    const smsBody = buildAgentSupervisorAssignedSms({
        agentName: agent.name,
        agentId: agent.agentId,
        region: agent.region,
        supervisor,
    });

    await notifyStaffAgent({
        agentDoc: agent,
        title,
        message,
        smsBody,
        priority: 'high',
        senderName: 'AgriLync Admin',
    });
};

/** Supervisor told an agent was assigned to them */
const notifySupervisorOfAgentAssignment = async (supervisor, agent) => {
    if (!supervisor || !agent) return;

    const title = 'New Agent Assignment';
    const message = `${agent.name} (${agent.agentId || 'N/A'}) has been assigned to you in ${agent.region || 'your region'}.`;
    const smsBody = buildSupervisorAgentAssignedSms({
        supervisorName: supervisor.name,
        agentName: agent.name,
        agentId: agent.agentId,
        region: agent.region,
        agentPhone: agent.contact,
        agentEmail: agent.email,
    });

    await notifyStaffAgent({
        agentDoc: supervisor,
        title,
        message,
        smsBody,
        priority: 'high',
        senderName: 'AgriLync Admin',
    });
};

/** Both parties when supervisor assignment changes */
const notifySupervisorAssignmentPair = async (agent, supervisor) => {
    await Promise.all([
        notifyAgentSupervisorAssigned(agent, supervisor),
        notifySupervisorOfAgentAssignment(supervisor, agent),
    ]);
};

const buildFarmerDeletionRequestAdminSms = ({ agentName, farmerName, farmerId, reason }) =>
    `AgriLync Admin: ${agentName} requested deletion of grower ${farmerName} (${farmerId || 'N/A'}). ` +
    `Reason: ${reason.slice(0, 120)}${reason.length > 120 ? '…' : ''}. ` +
    `A request is pending — review in Farm & Farmer Oversight.`;

const truncateSms = (text, max = 120) => {
    const value = String(text || '').trim();
    if (!value) return '';
    return value.length > max ? `${value.slice(0, max)}…` : value;
};

const staffSms = (body) => (body.startsWith('AgriLync') ? body : `AgriLync: ${body}`);

/** Notify the reporting supervisor of a field agent, if one is assigned */
const notifyAgentSupervisorIfAny = async (agentId, payload) => {
    if (!agentId) return;
    const agent = await Agent.findById(agentId)
        .populate('supervisor', 'name contact email agentId region notificationPreferences fcmToken')
        .select('name agentId supervisor')
        .lean();
    const supervisor = agent?.supervisor;
    if (!supervisor?._id) return;

    await notifyStaffAgent({
        agentId: supervisor._id,
        agentDoc: supervisor,
        senderName: payload.senderName || agent?.name || 'Field Agent',
        senderRole: payload.senderRole || 'supervisor',
        ...payload,
    });
};

/** Notify active supervisors whose region overlaps the given region label */
const notifySupervisorsInRegion = async ({
    region,
    title,
    message,
    smsBody,
    type = 'alert',
    priority = 'medium',
    senderRole = 'super-admin',
    senderName = 'AgriLync',
}) => {
    if (!region) return;
    const stem = String(region).replace(/\s*region\s*$/i, '').trim();
    const regionPattern = stem ? new RegExp(stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
    if (!regionPattern) return;

    const supervisors = await Agent.find({
        role: 'supervisor',
        status: 'active',
        region: regionPattern,
    })
        .select('_id contact name fcmToken notificationPreferences')
        .lean();

    await Promise.all(
        supervisors.map((supervisor) =>
            notifyStaffAgent({
                agentId: supervisor._id,
                agentDoc: supervisor,
                title,
                message,
                smsBody,
                type,
                priority,
                senderRole,
                senderName,
            })
        )
    );
};

/** Notify stakeholders when an admin resolves an escalation ticket */
const notifyEscalationResolved = async (escalation, adminName = 'Admin') => {
    if (!escalation) return;

    const summary = truncateSms(escalation.message, 100);
    const title = 'Escalation Resolved';
    const message = `${adminName} resolved: ${summary}`;
    const smsBody = staffSms(
        `${adminName} resolved an escalation (${escalation.priority || 'medium'} priority) ` +
            `in ${escalation.region || 'your region'}: ${truncateSms(escalation.message, 80)}`
    );

    if (escalation.relatedId && mongoose.Types.ObjectId.isValid(escalation.relatedId)) {
        const relatedAgent = await Agent.findById(escalation.relatedId)
            .select('_id contact name fcmToken notificationPreferences')
            .lean();
        if (relatedAgent) {
            await notifyStaffAgent({
                agentDoc: relatedAgent,
                title,
                message,
                smsBody,
                type: 'alert',
                priority: 'high',
                senderName: adminName,
            });
            return;
        }
    }

    await notifySupervisorsInRegion({
        region: escalation.region,
        title,
        message,
        smsBody,
        type: 'alert',
        priority: 'high',
        senderName: adminName,
    });
};

module.exports = {
    sendSmsSafe,
    staffSms,
    truncateSms,
    smsEnabledForAgent,
    notifySuperAdmins,
    notifyStaffAgent,
    notifyAgentSupervisorAssigned,
    notifySupervisorOfAgentAssignment,
    notifySupervisorAssignmentPair,
    notifyAgentSupervisorIfAny,
    notifySupervisorsInRegion,
    notifyEscalationResolved,
    buildFarmerDeletionRequestAdminSms,
};
