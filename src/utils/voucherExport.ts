import jsPDF from 'jspdf';
import type { ExpenseVoucher } from '@/types/expenseVoucher';
import { EXPENSE_CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/types/expenseVoucher';

const BRAND_DARK = '#002f37';
const BRAND_GREEN = '#065f46';
const BRAND_ACCENT = '#7ede56';

const categoryLabel = (v: ExpenseVoucher) =>
    v.categoryLabel ||
    EXPENSE_CATEGORY_OPTIONS.find((c) => c.value === v.category)?.label ||
    v.category;

const paymentLabel = (v: ExpenseVoucher) =>
    v.paymentMethodLabel ||
    PAYMENT_METHOD_OPTIONS.find((p) => p.value === v.paymentMethod)?.label ||
    v.paymentMethod;

const fmtDate = (value?: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const fmtMoney = (amount: number, currency = 'GHS') =>
    `${currency} ${Number(amount).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Simple amount-in-words for voucher PDFs (whole cedis + pesewas). */
export function amountInWords(amount: number, currency = 'GHS'): string {
    const whole = Math.floor(amount);
    const pesewas = Math.round((amount - whole) * 100);
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const chunk = (n: number): string => {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`.trim();
        if (n < 1000) {
            return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${chunk(n % 100)}` : ''}`.trim();
        }
        if (n < 1_000_000) {
            return `${chunk(Math.floor(n / 1000))} Thousand${n % 1000 ? ` ${chunk(n % 1000)}` : ''}`.trim();
        }
        return `${chunk(Math.floor(n / 1_000_000))} Million${n % 1_000_000 ? ` ${chunk(n % 1_000_000)}` : ''}`.trim();
    };

    const unit = currency === 'GHS' ? 'Ghana Cedis' : currency;
    let words = whole === 0 ? `Zero ${unit}` : `${chunk(whole)} ${unit}`;
    if (pesewas > 0) words += ` and ${chunk(pesewas)} Pesewas`;
    return words;
}

export async function buildVoucherPdf(voucher: ExpenseVoucher): Promise<jsPDF> {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let y = 0;

    // Load logo for watermark
    let logoImg: HTMLImageElement | null = null;
    try {
        logoImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            // Trying to use a known logo from public folder
            img.src = '/lovable-uploads/agrilync_logo_full.png';
        });
    } catch (err) {
        // ignore if logo can't be loaded
    }

    if (logoImg) {
        // use setGState if available to lower opacity for watermark
        const gState = doc.GState ? new doc.GState({ opacity: 0.1 }) : null;
        if (gState) {
            doc.setGState(gState);
        }
        
        const watermarkWidth = 140;
        const watermarkHeight = (logoImg.height / logoImg.width) * watermarkWidth;
        const xPos = (pageWidth - watermarkWidth) / 2;
        const yPos = (pageHeight - watermarkHeight) / 2;
        
        doc.addImage(logoImg, 'PNG', xPos, yPos, watermarkWidth, watermarkHeight);
        
        if (gState) {
            doc.setGState(new doc.GState({ opacity: 1.0 }));
        }
    }

    doc.setFillColor(0, 47, 55);
    doc.rect(0, 0, pageWidth, 38, 'F');
    doc.setTextColor(126, 222, 86);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AGRILYNC NEXUS', margin, 14);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('EXPENSE PAYMENT VOUCHER', margin, 24);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voucher No: ${voucher.voucherNumber}`, pageWidth - margin, 14, { align: 'right' });
    doc.text(`Date: ${fmtDate(voucher.expenseDate)}`, pageWidth - margin, 20, { align: 'right' });
    doc.text(`Status: ${(voucher.status || 'submitted').toUpperCase()}`, pageWidth - margin, 26, { align: 'right' });

    y = 48;
    doc.setTextColor(0, 47, 55);

    const row = (label: string, value: string, bold = false) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), margin, y);
        y += 5;
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0, 47, 55);
        const lines = doc.splitTextToSize(value || '—', pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 6;
    };

    row('Payee / Vendor', voucher.payee, true);
    row('Purpose / Description', voucher.description);
    row('Category', categoryLabel(voucher));
    row('Payment Method', paymentLabel(voucher));
    if (voucher.referenceNumber) row('Reference / Receipt No.', voucher.referenceNumber);
    if (voucher.notes) row('Notes', voucher.notes);

    doc.setDrawColor(110, 231, 183);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(6, 95, 70);
    doc.text('AMOUNT PAID', margin + 6, y + 10);
    doc.setFontSize(20);
    doc.text(fmtMoney(voucher.amount, voucher.currency), margin + 6, y + 22);
    y += 36;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    const words = amountInWords(voucher.amount, voucher.currency);
    const wordLines = doc.splitTextToSize(`Amount in words: ${words} only.`, pageWidth - margin * 2);
    doc.text(wordLines, margin, y);
    y += wordLines.length * 4 + 10;

    if (voucher.preparedByName) {
        row('Prepared by', voucher.preparedByName);
    }

    const sigBoxY = Math.max(y, 170);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, sigBoxY, (pageWidth - margin * 2) / 2 - 4, 34);
    doc.rect(margin + (pageWidth - margin * 2) / 2 + 4, sigBoxY, (pageWidth - margin * 2) / 2 - 4, 34);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('AUTHORIZED SIGNATURE', margin + 4, sigBoxY + 6);

    if (voucher.signatureImage) {
        try {
            doc.addImage(voucher.signatureImage, 'PNG', margin + 6, sigBoxY + 8, 50, 18);
        } catch {
            /* ignore invalid image data */
        }
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 47, 55);
    const signer = voucher.signatureName || '—';
    doc.text(signer, margin + 4, sigBoxY + 30);
    if (voucher.signatureTitle) {
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(voucher.signatureTitle, margin + 4, sigBoxY + 34);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DATE SIGNED', margin + (pageWidth - margin * 2) / 2 + 8, sigBoxY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 47, 55);
    doc.text(fmtDate(voucher.signedAt || voucher.expenseDate), margin + (pageWidth - margin * 2) / 2 + 8, sigBoxY + 18);

    const footerY = 285;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
        `Generated ${new Date().toLocaleString('en-GB')} · Agrilync Nexus · Internal expense record`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
    );

    return doc;
}

export async function downloadVoucherPdf(voucher: ExpenseVoucher) {
    const doc = await buildVoucherPdf(voucher);
    const safeName = voucher.voucherNumber.replace(/[^\w-]+/g, '_');
    doc.save(`${safeName}_${voucher.payee.replace(/\s+/g, '_').slice(0, 24)}.pdf`);
}

export async function voucherPdfBlob(voucher: ExpenseVoucher): Promise<Blob> {
    const doc = await buildVoucherPdf(voucher);
    return doc.output('blob');
}

export async function shareVoucherPdf(voucher: ExpenseVoucher): Promise<'shared' | 'downloaded'> {
    const blob = await voucherPdfBlob(voucher);
    const fileName = `${voucher.voucherNumber}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
            title: `Expense Voucher ${voucher.voucherNumber}`,
            text: `${voucher.payee} — ${fmtMoney(voucher.amount, voucher.currency)}`,
            files: [file],
        });
        return 'shared';
    }

    await downloadVoucherPdf(voucher);
    return 'downloaded';
}

export { BRAND_DARK, BRAND_GREEN, BRAND_ACCENT, fmtDate, fmtMoney };
