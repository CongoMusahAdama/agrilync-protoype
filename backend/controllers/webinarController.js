const WebinarRegistrant = require('../models/WebinarRegistrant');
const { fetchWebinarRegistrants } = require('../utils/bulkSmsRecipients');

// @route   POST /api/webinar/register
// @desc    Public webinar registration
exports.registerForWebinar = async (req, res) => {
    const { webinarId, webinarTitle, name, email, phone, organization } = req.body;

    if (!webinarId || !webinarTitle?.trim()) {
        return res.status(400).json({ success: false, message: 'Webinar details are required.' });
    }
    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = phone ? String(phone).trim() : '';

    try {
        const existing = await WebinarRegistrant.findOne({
            email: normalizedEmail,
            webinarId: Number(webinarId),
        });

        if (existing) {
            if (normalizedPhone) existing.phone = normalizedPhone;
            if (organization?.trim()) existing.organization = organization.trim();
            existing.name = name.trim();
            await existing.save();

            return res.json({
                success: true,
                message: 'You are already registered. Your details have been updated.',
                registrant: existing,
            });
        }

        const registrant = await WebinarRegistrant.create({
            webinarId: Number(webinarId),
            webinarTitle: webinarTitle.trim(),
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            organization: organization?.trim() || '',
        });

        return res.status(201).json({
            success: true,
            message: 'Registration successful! We will send you event details soon.',
            registrant,
        });
    } catch (err) {
        console.error('registerForWebinar error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Could not complete registration. Please try again.',
        });
    }
};

// @route   GET /api/webinar/registrants
// @desc    List webinar registrants (super admin)
exports.getRegistrants = async (req, res) => {
    try {
        const { webinarId } = req.query;
        const registrants = await WebinarRegistrant.find(
            webinarId ? { webinarId: Number(webinarId) } : {}
        )
            .sort({ createdAt: -1 })
            .lean();

        res.json(registrants);
    } catch (err) {
        console.error('getRegistrants error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load registrants.' });
    }
};

// @route   GET /api/webinar/registrants/sms-ready
// @desc    Registrants with valid phone numbers for bulk SMS preview
exports.getSmsReadyRegistrants = async (req, res) => {
    try {
        const recipients = await fetchWebinarRegistrants(req.query.webinarId);
        res.json(recipients);
    } catch (err) {
        console.error('getSmsReadyRegistrants error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load registrants.' });
    }
};
