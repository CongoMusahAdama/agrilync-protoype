export type ExpenseVoucherCategory =
    | 'transport'
    | 'fuel'
    | 'supplies'
    | 'meals'
    | 'accommodation'
    | 'equipment'
    | 'services'
    | 'training'
    | 'communication'
    | 'utilities'
    | 'salaries'
    | 'other';

export type ExpensePaymentMethod =
    | 'cash'
    | 'mobile_money'
    | 'bank_transfer'
    | 'cheque'
    | 'card';

export type ExpenseVoucherStatus = 'draft' | 'submitted' | 'approved';

export interface ExpenseVoucher {
    id: string;
    voucherNumber: string;
    expenseDate: string;
    payee: string;
    description: string;
    category: ExpenseVoucherCategory;
    categoryLabel?: string;
    amount: number;
    currency: string;
    paymentMethod: ExpensePaymentMethod;
    paymentMethodLabel?: string;
    referenceNumber?: string;
    notes?: string;
    preparedByName?: string;
    preparedById?: string | null;
    signatureName?: string;
    signatureTitle?: string;
    signatureImage?: string;
    signedAt?: string | null;
    status: ExpenseVoucherStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface ExpenseVoucherListResponse {
    success: boolean;
    total: number;
    totalAmount: number;
    currency: string;
    data: ExpenseVoucher[];
}

export const EXPENSE_CATEGORY_OPTIONS: { value: ExpenseVoucherCategory; label: string }[] = [
    { value: 'transport', label: 'Transport & Travel' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'supplies', label: 'Office & Field Supplies' },
    { value: 'meals', label: 'Meals & Refreshments' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'equipment', label: 'Equipment & Tools' },
    { value: 'services', label: 'Professional Services' },
    { value: 'training', label: 'Training & Events' },
    { value: 'communication', label: 'Communication' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'salaries', label: 'Salaries & Allowances' },
    { value: 'other', label: 'Other' },
];

export const PAYMENT_METHOD_OPTIONS: { value: ExpensePaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card', label: 'Card / POS' },
];
