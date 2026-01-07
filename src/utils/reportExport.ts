import jsPDF from 'jspdf';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface ReportData {
  farmerName: string;
  type: string;
  date: string;
  notes: string;
  agentName?: string;
  agentId?: string;
  media?: Array<{ type: string; url: string; name: string }>;
}

export const exportToPDF = async (data: ReportData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoUrl = '/lovable-uploads/logo.png';

    // Header background
    doc.setFillColor(0, 47, 55); // #002f37
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Logo - using a promise to ensure image is loaded if needed, 
    // but jsPDF addImage can handle URLs in most modern browsers if reachable
    try {
      doc.addImage(logoUrl, 'PNG', 15, 10, 25, 25);
    } catch (e) {
      console.warn('Logo could not be loaded for PDF', e);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.text('FIELD REPORT', 45, 25);

    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text(`Report ID: AL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, pageWidth - 20, 20, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 28, { align: 'right' });

    // Metadata Header Section
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 55, pageWidth - 30, 40, 'F');

    doc.setTextColor(0, 47, 55);
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('REPORT PARTICIPANTS', 20, 65);

    doc.setFont('times', 'normal');
    doc.setTextColor(60, 60, 60);

    // Left column
    doc.text('FARMER NAME:', 20, 75);
    doc.setFont('times', 'bold');
    doc.text(data.farmerName.toUpperCase(), 55, 75);

    doc.setFont('times', 'normal');
    doc.text('VISIT DATE:', 20, 85);
    doc.setFont('times', 'bold');
    doc.text(data.date, 55, 85);

    // Right column
    doc.setFont('times', 'normal');
    doc.text('LEAD AGENT:', 110, 72);
    doc.setFont('times', 'bold');
    doc.text((data.agentName || 'AgriLync Representative').toUpperCase(), 145, 72);

    doc.setFont('times', 'normal');
    doc.text('AGENT ID:', 110, 78);
    doc.setFont('times', 'bold');
    let agentId = data.agentId || 'N/A';
    if (agentId !== 'N/A' && !agentId.startsWith('LYC')) {
      agentId = `LYC-${agentId}`;
    }
    doc.text(agentId.toUpperCase(), 145, 78);

    doc.setFont('times', 'normal');
    doc.text('REPORT TYPE:', 110, 87);
    doc.setFont('times', 'bold');
    doc.text(data.type.replace('-', ' ').toUpperCase(), 145, 87);

    // Content
    let y = 110;
    doc.setTextColor(0, 47, 55);
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Observations & Field Notes', 20, y);

    doc.setDrawColor(126, 222, 86); // #7ede56
    doc.setLineWidth(1);
    doc.line(20, y + 2, 80, y + 2);

    y += 12;
    doc.setTextColor(50, 50, 50);
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(splitNotes, 20, y);

    // Media Check
    if (data.media && data.media.length > 0) {
      y += (splitNotes.length * 7) + 20;
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('times', 'bold');
      doc.text(`Attachments (${data.media.length} files logged)`, 20, y);
      y += 10;
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      data.media.forEach((item, i) => {
        doc.text(`- ${item.name} (${item.type})`, 25, y);
        y += 7;
      });
    }

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('Transforming agriculture through AI and easy access to finance.', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
    }

    doc.save(`AgriLync_Report_${data.farmerName.replace(/\s+/g, '_')}_${data.date}.pdf`);
    await Swal.fire({
        icon: 'success',
        title: 'PDF Generated!',
        html: `
            <div style="text-align: center; padding: 10px 0;">
                <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                    Professional PDF report generated!
                </p>
            </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#7ede56',
        timer: 2000,
        timerProgressBar: true
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report.');
  }
};

export const exportToWord = async (data: ReportData) => {
  try {
    const logoUrl = window.location.origin + '/lovable-uploads/logo.png';
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>AgriLync Field Report</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; }
          .header { background-color: #002f37; color: white; padding: 30px; }
          .logo-box { display: inline-block; vertical-align: middle; }
          .title-box { display: inline-block; vertical-align: middle; margin-left: 20px; }
          .container { padding: 40px; }
          h1 { margin: 0; font-size: 24px; text-transform: uppercase; font-family: 'Times New Roman', Times, serif; }
          .meta-box { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #002f37; border-bottom: 2px solid #7ede56; margin-bottom: 15px; padding-bottom: 5px; }
          .table { width: 100%; border-collapse: collapse; }
          .table td { padding: 8px 0; font-size: 12px; }
          .label { font-weight: bold; color: #666; width: 120px; text-transform: uppercase; font-size: 10px; }
          .value { font-weight: bold; color: #002f37; }
          .notes { white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #eee; min-height: 200px; font-size: 13px; }
          .footer { margin-top: 50px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-box">
            <h1>Field Report</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 12px;">AgriLync Official Documentation</p>
          </div>
        </div>
        <div class="container">
          <div class="meta-box">
            <h2 style="font-size: 12px; color: #002f37; margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">REPORT SUMMARY</h2>
            <table class="table">
              <tr>
                <td class="label">Farmer:</td><td class="value">${data.farmerName}</td>
                <td class="label">Agent:</td><td class="value">${data.agentName || 'AgriLync Representative'}</td>
              </tr>
              <tr>
                <td class="label">Visit Date:</td><td class="value">${data.date}</td>
                <td class="label">Agent ID:</td><td class="value">${data.agentId && !data.agentId.startsWith('LYC') ? 'LYC-' + data.agentId : data.agentId || 'N/A'}</td>
              </tr>
              <tr>
                <td class="label">Report Type:</td><td class="value">${data.type.replace('-', ' ').toUpperCase()}</td>
                <td class="label">Generated:</td><td class="value">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="section-title">Field Observations & Notes</div>
          <div class="notes">${data.notes}</div>
          
          <div class="footer">
            <p>Transforming agriculture through AI and easy access to finance.</p>
            <p>This document is confidential and intended solely for the use of the individual or entity to whom it is addressed.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriLync_Report_${data.farmerName.replace(/\s+/g, '_')}_${data.date}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    await Swal.fire({
        icon: 'success',
        title: 'Word Report Generated!',
        html: `
            <div style="text-align: center; padding: 10px 0;">
                <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                    Word report generated successfully!
                </p>
            </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#7ede56',
        timer: 2000,
        timerProgressBar: true
    });
  } catch (error) {
    console.error('Error generating Word doc:', error);
    toast.error('Failed to generate Word report.');
  }
};
