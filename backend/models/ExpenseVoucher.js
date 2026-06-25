const mongoose = require('mongoose');

const expenseVoucherSchema = new mongoose.Schema({
    voucherNumber: { type: String, unique: true, index: true },
    expenseDate: { type: Date, required: true },
    payee: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: [
            'transport',
            'fuel',
            'supplies',
            'meals',
            'accommodation',
            'equipment',
            'services',
            'training',
            'communication',
            'utilities',
            'salaries',
            'other',
        ],
        default: 'other',
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'GHS', trim: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'mobile_money', 'bank_transfer', 'cheque', 'card'],
        default: 'cash',
    },
    referenceNumber: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 1000 },
    preparedByName: { type: String, trim: true },
    preparedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    signatureName: { type: String, trim: true },
    signatureTitle: { type: String, trim: true },
    signatureImage: { type: String },
    signedAt: { type: Date },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved'],
        default: 'submitted',
    },
}, { timestamps: true });

expenseVoucherSchema.index({ expenseDate: -1 });
expenseVoucherSchema.index({ category: 1, expenseDate: -1 });

module.exports = mongoose.model('ExpenseVoucher', expenseVoucherSchema);
