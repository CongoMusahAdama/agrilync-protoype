const PartnershipInquiry = require('../models/PartnershipInquiry');
const { notifySuperAdmins, staffSms, truncateSms } = require('../utils/staffNotifications');

const VALID_ROLES = [
    'Institution',
    'Development Partner',
    'Individual Investor',
    'NGO / Foundation',
    'Government Agency',
    'Other',
];

// @route   POST /api/partnership/submit
// @desc    Public partnership/institution inquiry submission
exports.submitInquiry = async (req, res) => {
    const { name, email, organization, role, message } = req.body;

    if (!name?.trim() || !email?.trim() || !role?.trim() || !message?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, role, and message are required.',
        });
    }

    if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    try {
        const inquiry = await PartnershipInquiry.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            organization: organization?.trim() || '',
            role,
            message: message.trim(),
        });

        const requesterLabel = inquiry.organization
            ? `${inquiry.name} (${inquiry.organization})`
            : inquiry.name;

        await notifySuperAdmins({
            title: 'New Partnership Inquiry',
            message: `${requesterLabel} submitted a ${role} inquiry: ${truncateSms(inquiry.message, 140)}`,
            smsBody: staffSms(
                `New partnership inquiry from ${requesterLabel} (${role}). Reply: ${inquiry.email}. ` +
                    `${truncateSms(inquiry.message, 80)}`
            ),
            priority: 'medium',
            senderName: 'Partnership Page',
        });

        return res.status(201).json({
            success: true,
            message: "Thanks — we've received your message and will get back to you within one business day.",
        });
    } catch (err) {
        console.error('submitInquiry error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Could not send your message. Please try again.',
        });
    }
};

// @route   GET /api/partnership
// @desc    List partnership inquiries (super admin)
exports.getInquiries = async (req, res) => {
    try {
        const { status } = req.query;
        const inquiries = await PartnershipInquiry.find(status ? { status } : {})
            .sort({ createdAt: -1 })
            .lean();

        res.json(inquiries);
    } catch (err) {
        console.error('getInquiries error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load inquiries.' });
    }
};

// @route   PATCH /api/partnership/:id/status
// @desc    Update an inquiry's status (super admin)
exports.updateInquiryStatus = async (req, res) => {
    const { status } = req.body;
    if (!['New', 'Contacted', 'Closed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    try {
        const inquiry = await PartnershipInquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found.' });
        }
        res.json({ success: true, inquiry });
    } catch (err) {
        console.error('updateInquiryStatus error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
    }
};
