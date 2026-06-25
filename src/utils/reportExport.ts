import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fmtMoney } from './voucherExport';

/**
 * Downloads a CSV file for the given array of objects.
 */
export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    // Extract headers (excluding internal fields like id, signatureImage)
    const excludeKeys = ['id', 'signatureImage', 'updatedAt', 'agentId'];
    const headers = Object.keys(data[0]).filter(k => !excludeKeys.includes(k));
    
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            let strVal = String(val ?? '');
            if (header.toLowerCase().includes('date') && val) {
                try { strVal = new Date(val).toLocaleDateString(); } catch (e) {}
            }
            return `"${strVal.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generates and downloads a formatted PDF report with company headers.
 */
export async function exportToPDF(data: any[], reportType: string, startDate: string, endDate: string) {
    if (data.length === 0) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 16;
    const margin = 16;

    let logoImg: HTMLImageElement | null = null;
    try {
        logoImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = '/lovable-uploads/agrilync_logo_full.png';
        });
    } catch (err) { }

    doc.setFillColor(0, 47, 55); // #002f37
    doc.rect(0, 0, pageWidth, 40, 'F');

    if (logoImg) {
        const w = 40;
        const h = (logoImg.height / logoImg.width) * w;
        doc.addImage(logoImg, 'PNG', margin, 12, w, h);
    } else {
        doc.setTextColor(126, 222, 86);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('AGRILYNC NEXUS', margin, 24);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Accra, Ghana', margin + 50, 16);
    doc.text('info@agrilync.com | +233 (0) 55 123 4567', margin + 50, 22);
    doc.text('www.agrilync.com', margin + 50, 28);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FINANCIAL & ANALYTICS REPORT', pageWidth - margin, 22, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(126, 222, 86); // #7ede56
    
    const formattedReportType = reportType.replace(/_/g, ' ').toUpperCase();
    doc.text(`REPORT TYPE: ${formattedReportType}`, pageWidth - margin, 28, { align: 'right' });
    
    const periodStr = (startDate && endDate) 
        ? `${startDate} TO ${endDate}` 
        : (startDate ? `FROM ${startDate}` : (endDate ? `UNTIL ${endDate}` : 'ALL TIME'));
    doc.text(`PERIOD: ${periodStr}`, pageWidth - margin, 34, { align: 'right' });

    y = 50;

    const excludeKeys = ['id', 'signatureImage', 'updatedAt', 'agentId', 'location', 'farmPhotos', 'image'];
    const columns = Object.keys(data[0]).filter(k => !excludeKeys.includes(k) && typeof data[0][k] !== 'object');
    
    const head = [columns.map(c => c.replace(/([A-Z])/g, ' $1').trim().toUpperCase())];
    
    const body = data.map(row => {
        return columns.map(col => {
            const val = row[col];
            if (col.toLowerCase().includes('date') && val) {
                try { return new Date(val).toLocaleDateString(); } catch(e) {}
            }
            if (typeof val === 'number') {
                return col.toLowerCase().includes('amount') ? fmtMoney(val, row.currency || 'GHS') : val.toString();
            }
            return String(val ?? '—');
        });
    });

    autoTable(doc, {
        startY: y,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [6, 95, 70], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: 50 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: margin, right: margin }
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleString()} by Agrilync Nexus System`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    const safeFilename = `${formattedReportType.replace(/\s+/g, '_')}_REPORT.pdf`;
    doc.save(safeFilename);
}

/**
 * Generates and downloads a Word document report.
 */
export async function exportToWord(data: any[], filename: string) {
    if (data.length === 0) return;
    
    const excludeKeys = ['id', 'signatureImage', 'updatedAt', 'agentId', 'location', 'farmPhotos', 'image'];
    const headers = Object.keys(data[0]).filter(k => !excludeKeys.includes(k) && typeof data[0][k] !== 'object');
    
    let html = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    html += "<h2>" + filename.replace(/_/g, ' ').toUpperCase() + "</h2>";
    html += "<table border='1' style='border-collapse: collapse; width: 100%;'><thead><tr>";
    headers.forEach(h => { html += `<th style='background-color: #065f46; color: white; padding: 5px;'>${h.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</th>`; });
    html += "</tr></thead><tbody>";
    
    data.forEach(row => {
        html += "<tr>";
        headers.forEach(h => { 
            let val = row[h];
            if (h.toLowerCase().includes('date') && val) {
                try { val = new Date(val).toLocaleDateString(); } catch(e) {}
            }
            html += `<td style='padding: 5px;'>${val ?? ''}</td>`; 
        });
        html += "</tr>";
    });
    html += "</tbody></table></body></html>";
    
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_REPORT.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

