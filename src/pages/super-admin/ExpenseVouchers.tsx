import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';
import {
    Download,
    Loader2,
    Pencil,
    Plus,
    Receipt,
    Search,
    Share2,
    Trash2,
    Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import SignaturePad from '@/components/ui/SignaturePad';
import {
    EXPENSE_CATEGORY_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    type ExpenseVoucher,
    type ExpenseVoucherListResponse,
} from '@/types/expenseVoucher';
import { downloadVoucherPdf, fmtDate, fmtMoney, shareVoucherPdf } from '@/utils/voucherExport';

const emptyForm = {
    expenseDate: new Date().toISOString().split('T')[0],
    payee: '',
    description: '',
    category: 'other' as ExpenseVoucher['category'],
    amount: '',
    currency: 'GHS',
    paymentMethod: 'cash' as ExpenseVoucher['paymentMethod'],
    referenceNumber: '',
    notes: '',
    signatureName: '',
    signatureTitle: '',
    signatureImage: '',
    status: 'submitted' as ExpenseVoucher['status'],
};

const ExpenseVouchers: React.FC = () => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [vouchers, setVouchers] = useState<ExpenseVoucher[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ExpenseVoucher | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (search.trim()) params.q = search.trim();
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (statusFilter !== 'all') params.status = statusFilter;
            const res = await api.get<ExpenseVoucherListResponse>('/super-admin/vouchers', { params });
            setVouchers(res.data?.data || []);
            setTotalAmount(res.data?.totalAmount || 0);
        } catch {
            toast.error('Could not load expense vouchers.');
            setVouchers([]);
            setTotalAmount(0);
        } finally {
            setLoading(false);
        }
    }, [search, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const categoryTotals = useMemo(() => {
        const map = new Map<string, number>();
        vouchers.forEach((v) => {
            map.set(v.category, (map.get(v.category) || 0) + v.amount);
        });
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
    }, [vouchers]);

    const openCreate = () => {
        setEditing(null);
        setForm({
            ...emptyForm,
            signatureName: agent?.name || '',
            signatureTitle: 'Super Admin',
        });
        setDialogOpen(true);
    };

    const openEdit = (voucher: ExpenseVoucher) => {
        setEditing(voucher);
        setForm({
            expenseDate: voucher.expenseDate
                ? new Date(voucher.expenseDate).toISOString().split('T')[0]
                : emptyForm.expenseDate,
            payee: voucher.payee,
            description: voucher.description,
            category: voucher.category,
            amount: String(voucher.amount),
            currency: voucher.currency || 'GHS',
            paymentMethod: voucher.paymentMethod,
            referenceNumber: voucher.referenceNumber || '',
            notes: voucher.notes || '',
            signatureName: voucher.signatureName || agent?.name || '',
            signatureTitle: voucher.signatureTitle || '',
            signatureImage: voucher.signatureImage || '',
            status: voucher.status,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.payee.trim() || !form.description.trim() || !form.amount) {
            toast.error('Payee, description, and amount are required.');
            return;
        }
        if (!form.signatureImage) {
            toast.error('Please add your e-signature before saving.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                amount: Number(form.amount),
                preparedByName: agent?.name,
            };
            if (editing) {
                await api.put(`/super-admin/vouchers/${editing.id}`, payload);
                toast.success('Voucher updated.');
            } else {
                await api.post('/super-admin/vouchers', payload);
                toast.success('Voucher saved.');
            }
            setDialogOpen(false);
            fetchVouchers();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { msg?: string; message?: string } } })?.response?.data?.msg ||
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Could not save voucher.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (voucher: ExpenseVoucher) => {
        const result = await Swal.fire({
            title: 'Delete voucher?',
            text: `${voucher.voucherNumber} — ${fmtMoney(voucher.amount, voucher.currency)}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Delete',
        });
        if (!result.isConfirmed) return;
        try {
            await api.delete(`/super-admin/vouchers/${voucher.id}`);
            toast.success('Voucher deleted.');
            fetchVouchers();
        } catch {
            toast.error('Could not delete voucher.');
        }
    };

    const handleShare = async (voucher: ExpenseVoucher) => {
        try {
            const result = await shareVoucherPdf(voucher);
            toast.success(result === 'shared' ? 'Voucher shared.' : 'Voucher PDF downloaded.');
        } catch {
            await downloadVoucherPdf(voucher);
            toast.success('Voucher PDF downloaded.');
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#002f37] dark:text-white tracking-tight flex items-center gap-2">
                        <Receipt className="h-7 w-7 text-[#065f46]" />
                        Expense Vouchers
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                        Record every spend with a signed payment voucher. Download or share PDF copies for your finance records.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={openCreate}
                        className="bg-[#065f46] hover:bg-[#054d3a] text-white font-bold h-11 rounded-xl px-5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Voucher
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className={`rounded-2xl border-none shadow-sm ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <CardHeader className="pb-2">
                        <CardDescription>Total recorded</CardDescription>
                        <CardTitle className="text-2xl font-black text-[#065f46]">
                            {fmtMoney(totalAmount)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-gray-500">{vouchers.length} voucher{vouchers.length !== 1 ? 's' : ''}</CardContent>
                </Card>
                <Card className={`rounded-2xl border-none shadow-sm sm:col-span-2 xl:col-span-3 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5" /> Top spending categories
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {categoryTotals.length === 0 ? (
                            <span className="text-sm text-gray-400">No vouchers yet.</span>
                        ) : (
                            categoryTotals.map(([cat, total]) => {
                                const label = EXPENSE_CATEGORY_OPTIONS.find((c) => c.value === cat)?.label || cat;
                                return (
                                    <Badge key={cat} variant="outline" className="text-xs py-1.5 px-3 border-[#7ede56]/40 bg-[#7ede56]/10 text-[#065f46]">
                                        {label}: {fmtMoney(total)}
                                    </Badge>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className={`rounded-2xl border-none shadow-sm ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search payee, description, voucher no…"
                                className="pl-9 h-10 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-[180px] h-10 rounded-xl">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-16 flex flex-col items-center text-gray-400">
                            <Loader2 className="h-8 w-8 animate-spin text-[#7ede56] mb-3" />
                            Loading vouchers…
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="py-16 text-center">
                            <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="font-semibold text-gray-600 dark:text-gray-300">No vouchers yet</p>
                            <p className="text-sm text-gray-400 mt-1">Create your first expense voucher to start tracking spend.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#065f46] hover:bg-[#065f46]">
                                        <TableHead className="text-white">Voucher</TableHead>
                                        <TableHead className="text-white">Date</TableHead>
                                        <TableHead className="text-white">Payee</TableHead>
                                        <TableHead className="text-white">Category</TableHead>
                                        <TableHead className="text-white text-center">Status</TableHead>
                                        <TableHead className="text-right text-white">Amount</TableHead>
                                        <TableHead className="text-right text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vouchers.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-mono text-xs font-bold text-[#065f46]">{v.voucherNumber}</TableCell>
                                            <TableCell className="text-sm">{fmtDate(v.expenseDate)}</TableCell>
                                            <TableCell>
                                                <p className="font-medium text-sm">{v.payee}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{v.description}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[10px] font-semibold">
                                                    {v.categoryLabel || v.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={v.status === 'approved' ? 'default' : v.status === 'submitted' ? 'secondary' : 'outline'} className="text-[10px] uppercase font-bold tracking-wider">
                                                    {v.status || 'DRAFT'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-[#002f37] dark:text-white">
                                                {fmtMoney(v.amount, v.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadVoucherPdf(v)} title="Download PDF">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(v)} title="Share PDF">
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)} title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700" onClick={() => handleDelete(v)} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-right font-bold text-[#002f37] dark:text-white text-base">Total Amount</TableCell>
                                        <TableCell className="text-right font-black text-[#065f46] text-base">
                                            {fmtMoney(vouchers.reduce((acc, v) => acc + Number(v.amount), 0), vouchers[0]?.currency || 'GHS')}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit expense voucher' : 'New expense voucher'}</DialogTitle>
                        <DialogDescription>
                            Fill in the spend details and sign to generate a downloadable payment voucher.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Expense date</Label>
                                <Input
                                    type="date"
                                    required
                                    value={form.expenseDate}
                                    onChange={(e) => setForm((p) => ({ ...p, expenseDate: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount (GHS)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as ExpenseVoucher['category'] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment method</Label>
                                <Select value={form.paymentMethod} onValueChange={(v) => setForm((p) => ({ ...p, paymentMethod: v as ExpenseVoucher['paymentMethod'] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Payee / vendor</Label>
                                <Input
                                    required
                                    placeholder="Who received this payment?"
                                    value={form.payee}
                                    onChange={(e) => setForm((p) => ({ ...p, payee: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Reference / receipt no.</Label>
                                <Input
                                    placeholder="Optional"
                                    value={form.referenceNumber}
                                    onChange={(e) => setForm((p) => ({ ...p, referenceNumber: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as ExpenseVoucher['status'] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="submitted">Submitted</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Purpose / description</Label>
                                <Textarea
                                    required
                                    rows={2}
                                    placeholder="What was this payment for?"
                                    value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes (optional)</Label>
                                <Textarea
                                    rows={2}
                                    placeholder="Any extra context for finance records"
                                    value={form.notes}
                                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#7ede56]/30 bg-[#7ede56]/5 p-4 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <Label className="text-[#065f46]">E-signature</Label>
                                    <p className="text-xs text-gray-500 mt-1">Sign below to authorize this voucher on the PDF.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Signer name</Label>
                                    <Input
                                        value={form.signatureName}
                                        onChange={(e) => setForm((p) => ({ ...p, signatureName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title / role</Label>
                                    <Input
                                        placeholder="e.g. Super Admin"
                                        value={form.signatureTitle}
                                        onChange={(e) => setForm((p) => ({ ...p, signatureTitle: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex-[2] min-w-0">
                                <SignaturePad
                                    value={form.signatureImage}
                                    onChange={(dataUrl) => setForm((p) => ({ ...p, signatureImage: dataUrl }))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-[#065f46] hover:bg-[#054d3a] text-white font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {editing ? 'Update voucher' : 'Save voucher'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseVouchers;
