const ExpenseVoucher = require('../models/ExpenseVoucher');
const { uploadDataUrl } = require('../utils/cloudinary');

const CATEGORY_LABELS = {
    transport: 'Transport & Travel',
    fuel: 'Fuel',
    supplies: 'Office & Field Supplies',
    meals: 'Meals & Refreshments',
    accommodation: 'Accommodation',
    equipment: 'Equipment & Tools',
    services: 'Professional Services',
    training: 'Training & Events',
    communication: 'Communication',
    utilities: 'Utilities',
    salaries: 'Salaries & Allowances',
    other: 'Other',
};

const PAYMENT_LABELS = {
    cash: 'Cash',
    mobile_money: 'Mobile Money',
    bank_transfer: 'Bank Transfer',
    cheque: 'Cheque',
    card: 'Card / POS',
};

async function generateVoucherNumber() {
    const year = new Date().getFullYear();
    const prefix = `AV-${year}-`;
    const latest = await ExpenseVoucher.findOne({ voucherNumber: new RegExp(`^${prefix}`) })
        .sort({ voucherNumber: -1 })
        .select('voucherNumber')
        .lean();
    let seq = 1;
    if (latest?.voucherNumber) {
        const tail = parseInt(String(latest.voucherNumber).split('-').pop(), 10);
        if (Number.isFinite(tail)) seq = tail + 1;
    }
    return `${prefix}${String(seq).padStart(4, '0')}`;
}

async function resolveSignatureUrl(signatureImage) {
    if (!signatureImage || typeof signatureImage !== 'string') return undefined;
    const trimmed = signatureImage.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith('data:')) {
        return uploadDataUrl(trimmed, 'agrilync/vouchers/signatures');
    }
    return trimmed;
}

function formatVoucher(doc) {
    const item = doc.toObject ? doc.toObject() : doc;
    return {
        id: String(item._id),
        voucherNumber: item.voucherNumber,
        expenseDate: item.expenseDate,
        payee: item.payee,
        description: item.description,
        category: item.category,
        categoryLabel: CATEGORY_LABELS[item.category] || item.category,
        amount: item.amount,
        currency: item.currency || 'GHS',
        paymentMethod: item.paymentMethod,
        paymentMethodLabel: PAYMENT_LABELS[item.paymentMethod] || item.paymentMethod,
        referenceNumber: item.referenceNumber || '',
        notes: item.notes || '',
        preparedByName: item.preparedByName || '',
        preparedById: item.preparedById ? String(item.preparedById) : null,
        signatureName: item.signatureName || '',
        signatureTitle: item.signatureTitle || '',
        signatureImage: item.signatureImage || '',
        signedAt: item.signedAt || null,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

function parseBody(body = {}, agent) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount < 0) {
        return { error: 'A valid amount is required.' };
    }
    if (!body.payee?.trim()) return { error: 'Payee / vendor name is required.' };
    if (!body.description?.trim()) return { error: 'Description / purpose is required.' };
    if (!body.expenseDate) return { error: 'Expense date is required.' };

    const expenseDate = new Date(body.expenseDate);
    if (Number.isNaN(expenseDate.getTime())) {
        return { error: 'Invalid expense date.' };
    }

    return {
        expenseDate,
        payee: String(body.payee).trim(),
        description: String(body.description).trim(),
        category: body.category || 'other',
        amount,
        currency: String(body.currency || 'GHS').trim().toUpperCase(),
        paymentMethod: body.paymentMethod || 'cash',
        referenceNumber: body.referenceNumber?.trim() || '',
        notes: body.notes?.trim() || '',
        preparedByName: body.preparedByName?.trim() || agent?.name || '',
        preparedById: agent?._id || agent?.id,
        signatureName: body.signatureName?.trim() || '',
        signatureTitle: body.signatureTitle?.trim() || '',
        status: body.status || 'submitted',
    };
}

exports.getVouchers = async (req, res) => {
    try {
        const { category, from, to, q } = req.query;
        const filter = {};

        if (category && category !== 'all') filter.category = category;
        if (from || to) {
            filter.expenseDate = {};
            if (from) filter.expenseDate.$gte = new Date(from);
            if (to) {
                const end = new Date(to);
                end.setHours(23, 59, 59, 999);
                filter.expenseDate.$lte = end;
            }
        }
        if (q?.trim()) {
            const term = q.trim();
            filter.$or = [
                { payee: new RegExp(term, 'i') },
                { description: new RegExp(term, 'i') },
                { voucherNumber: new RegExp(term, 'i') },
                { referenceNumber: new RegExp(term, 'i') },
            ];
        }

        const vouchers = await ExpenseVoucher.find(filter)
            .sort({ expenseDate: -1, createdAt: -1 })
            .lean();

        const formatted = vouchers.map(formatVoucher);
        const totalAmount = formatted.reduce((sum, v) => sum + (v.amount || 0), 0);

        res.json({
            success: true,
            total: formatted.length,
            totalAmount,
            currency: 'GHS',
            data: formatted,
        });
    } catch (err) {
        console.error('getVouchers error:', err.message);
        res.status(500).json({ success: false, msg: 'Could not load vouchers' });
    }
};

exports.getVoucherById = async (req, res) => {
    try {
        const voucher = await ExpenseVoucher.findById(req.params.id).lean();
        if (!voucher) return res.status(404).json({ msg: 'Voucher not found' });
        res.json({ success: true, data: formatVoucher(voucher) });
    } catch (err) {
        console.error('getVoucherById error:', err.message);
        res.status(500).json({ msg: 'Could not load voucher' });
    }
};

exports.createVoucher = async (req, res) => {
    try {
        const parsed = parseBody(req.body, req.agent);
        if (parsed.error) return res.status(400).json({ msg: parsed.error });

        const signatureImage = await resolveSignatureUrl(req.body.signatureImage);
        if (req.body.signatureImage && !signatureImage) {
            return res.status(400).json({ msg: 'Could not save signature image.' });
        }

        const voucherNumber = await generateVoucherNumber();
        const signedAt = signatureImage ? new Date() : undefined;

        const voucher = await ExpenseVoucher.create({
            ...parsed,
            voucherNumber,
            signatureImage,
            signedAt,
        });

        res.status(201).json({ success: true, data: formatVoucher(voucher) });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Voucher number conflict — please try again.' });
        }
        console.error('createVoucher error:', err.message);
        res.status(500).json({ msg: err.message || 'Could not create voucher' });
    }
};

exports.updateVoucher = async (req, res) => {
    try {
        const voucher = await ExpenseVoucher.findById(req.params.id);
        if (!voucher) return res.status(404).json({ msg: 'Voucher not found' });

        const parsed = parseBody(req.body, req.agent);
        if (parsed.error) return res.status(400).json({ msg: parsed.error });

        Object.assign(voucher, parsed);

        if (req.body.signatureImage !== undefined) {
            if (!req.body.signatureImage) {
                voucher.signatureImage = undefined;
                voucher.signedAt = undefined;
            } else {
                const signatureImage = await resolveSignatureUrl(req.body.signatureImage);
                voucher.signatureImage = signatureImage;
                voucher.signedAt = signatureImage ? new Date() : undefined;
            }
        }

        await voucher.save();
        res.json({ success: true, data: formatVoucher(voucher) });
    } catch (err) {
        console.error('updateVoucher error:', err.message);
        res.status(500).json({ msg: err.message || 'Could not update voucher' });
    }
};

exports.deleteVoucher = async (req, res) => {
    try {
        const voucher = await ExpenseVoucher.findByIdAndDelete(req.params.id);
        if (!voucher) return res.status(404).json({ msg: 'Voucher not found' });
        res.json({ success: true, msg: 'Voucher deleted' });
    } catch (err) {
        console.error('deleteVoucher error:', err.message);
        res.status(500).json({ msg: 'Could not delete voucher' });
    }
};

exports.CATEGORY_LABELS = CATEGORY_LABELS;
exports.PAYMENT_LABELS = PAYMENT_LABELS;
