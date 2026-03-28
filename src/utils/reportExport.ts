import jsPDF from 'jspdf';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface ReportData {
  farmerName: string;
  type: string;
  date: string;
  notes: string;
  healthScore?: string;
  cropStage?: string;
  agentName?: string;
  agentId?: string;
  media?: Array<{ type: string; url: string; name: string; description?: string }>;
}

export const exportToPDF = async (data: ReportData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoUrl = '/lovable-uploads/favicorn.jpeg';

    // Professional Geometric Header Design
    // Top Left Large Triangle (Brand Teal)
    doc.setFillColor(0, 47, 55); // #002f37
    doc.triangle(0, 0, 80, 0, 0, 45, 'F');
    
    // Top Left Small Triangle (Brand Green)
    doc.setFillColor(126, 222, 86); // #7ede56
    doc.triangle(30, 0, 60, 0, 45, 15, 'F');

    // Top Right Design
    doc.setFillColor(0, 47, 55);
    doc.triangle(pageWidth, 0, pageWidth - 40, 0, pageWidth, 25, 'F');
    doc.setFillColor(126, 222, 86, 0.2); // Light version
    doc.triangle(pageWidth - 20, 0, pageWidth - 60, 0, pageWidth - 40, 10, 'F');

    // Centered Title Section
    doc.setTextColor(0, 47, 55);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text((data.type === 'field-visit' ? 'FIELD JOURNAL' : 'FIELD REPORT').toUpperCase(), pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('AGRILYNC NEXUS - STRATEGIC FIELD INSIGHTS', pageWidth / 2, 68, { align: 'center' });

    // Header Horizontal Line
    doc.setDrawColor(126, 222, 86);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, 72, pageWidth / 2 + 40, 72);

    // Corporate Logo in Header
    try {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(15, 10, 15, 15, 2, 2, 'F');
        doc.addImage(logoUrl, 'PNG', 16, 11, 13, 13);
    } catch (e) {}

    // Metadata Header Section - Centered and Clean
    let currentY = 85;
    doc.setFillColor(245, 250, 248); // Even lighter teal background
    doc.roundedRect(15, currentY, pageWidth - 30, 45, 3, 3, 'F');

    doc.setTextColor(0, 47, 55);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT CORE METADATA', 20, currentY + 10);

    doc.setFont('helvetica', 'normal');
    const metaCol1 = 20;
    const metaCol2 = 110;
    const metaValOffset = 35;

    // Row 1
    doc.text('FARMER:', metaCol1, currentY + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(data.farmerName.toUpperCase(), metaCol1 + metaValOffset, currentY + 22);
    
    doc.setFont('helvetica', 'normal');
    doc.text('LEAD AGENT:', metaCol2, currentY + 22);
    doc.setFont('helvetica', 'bold');
    doc.text((data.agentName || 'Representatives').toUpperCase(), metaCol2 + metaValOffset, currentY + 22);

    // Row 2
    doc.setFont('helvetica', 'normal');
    doc.text('VISIT DATE:', metaCol1, currentY + 32);
    doc.setFont('helvetica', 'bold');
    doc.text(data.date, metaCol1 + metaValOffset, currentY + 32);
    
    doc.setFont('helvetica', 'normal');
    doc.text('AGENT ID:', metaCol2, currentY + 32);
    doc.setFont('helvetica', 'bold');
    let agentId = data.agentId || 'AL-SYS-001';
    doc.text(agentId.toUpperCase(), metaCol2 + metaValOffset, currentY + 32);

    // Row 3
    doc.setFont('helvetica', 'normal');
    doc.text('REPORT TYPE:', metaCol1, currentY + 40);
    doc.setFont('helvetica', 'bold');
    doc.text(data.type.replace('-', ' ').toUpperCase(), metaCol1 + metaValOffset, currentY + 40);

    // Agricultural Performance Bar
    if (data.healthScore || data.cropStage) {
      currentY += 55;
      doc.setFillColor(0, 47, 55);
      doc.roundedRect(15, currentY, pageWidth - 30, 12, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      let agriText = '';
      if (data.cropStage) agriText += `GROWTH STAGE: ${data.cropStage.toUpperCase()}     |     `;
      if (data.healthScore) agriText += `FIELD HEALTH ASSESSMENT: ${data.healthScore}%`;
      doc.text(agriText, 25, currentY + 7.5);
    }

    // Content Section
    currentY += 25;
    doc.setTextColor(0, 47, 55);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Observations & Field Insights', 20, currentY);

    doc.setDrawColor(126, 222, 86);
    doc.setLineWidth(1);
    doc.line(20, currentY + 2, 50, currentY + 2);

    currentY += 12;
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(splitNotes, 20, currentY);

    // Professional Visual Evidence Grid
    if (data.media && data.media.length > 0) {
      currentY += (splitNotes.length * 5) + 20;
      
      // Page break check for header
      if (currentY > 240) {
        doc.addPage();
        currentY = 30;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Visual Evidence Log (${data.media.length} items)`, 20, currentY);
      currentY += 10;

      const imgWidth = 80;
      const imgHeight = 60;
      const margin = 15;
      let col = 0;

      for (const item of data.media) {
        if (item.type === 'image' && item.url) {
          // Check for space (image height + padding)
          if (currentY + imgHeight > 250) {
            doc.addPage();
            currentY = 30;
            col = 0;
          }

          const x = 20 + (col * (imgWidth + 10));
          
          try {
              // Draw image border
              doc.setDrawColor(240);
              doc.setLineWidth(0.1);
              doc.rect(x - 1, currentY - 1, imgWidth + 2, imgHeight + 2);
              
              const imgFormat = item.url.toLowerCase().includes('png') ? 'PNG' : 'JPEG';
              doc.addImage(item.url, imgFormat, x, currentY, imgWidth, imgHeight);
              
              // Image Caption (Description or Name)
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8);
              doc.setTextColor(6, 95, 70); // Theme color
              const caption = item.description || item.name;
              doc.text(caption.substring(0, 45), x, currentY + imgHeight + 6);
              
              if (item.description) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(6);
                doc.setTextColor(120);
                doc.text(`Asset ID: ${item.name.substring(0, 20)}`, x, currentY + imgHeight + 10);
              }
          } catch (e) {
              console.error('Failed to add image to PDF:', e);
          }

          if (col === 1) {
            col = 0;
            currentY += imgHeight + 15;
          } else {
            col = 1;
          }
        }
      }
    }

    // Footer Implementation across all pages
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer Decorative Line
      doc.setDrawColor(240);
      doc.setLineWidth(0.1);
      doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);

      // Logo in footer with white background to handle transparency
      try {
          doc.setFillColor(255, 255, 255);
          doc.rect(15, pageHeight - 22, 10, 10, 'F');
          doc.addImage(logoUrl, 'PNG', 15, pageHeight - 22, 10, 10);
      } catch (e) {}

      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.setFont('helvetica', 'bold');
      doc.text('AGRILYNC NEXUS', 28, pageHeight - 18);
      doc.setFont('helvetica', 'normal');
      doc.text('| Digital Agriculture & Finance Transformation', 65, pageHeight - 18);
      
      // Person exporting & Timestamp
      doc.text(`Exported by: ${data.agentName || 'AgriLync System'}`, 28, pageHeight - 14);
      doc.text(`Timestamp: ${new Date().toLocaleString()}`, 28, pageHeight - 10);

      // Page numbers
      doc.setFont('helvetica', 'bold');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 14, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text('PRIVATE & CONFIDENTIAL', pageWidth - 15, pageHeight - 10, { align: 'right' });
    }

    doc.save(`AgriLync_Report_${data.farmerName.replace(/\s+/g, '_')}_${data.date}.pdf`);
    await Swal.fire({
      icon: 'success',
      title: 'PDF Document Ready',
      html: '<p style="font-size: 14px; color: #666;">Your professional field report has been generated successfully.</p>',
      confirmButtonText: 'Great',
      confirmButtonColor: '#7ede56',
      timer: 2500,
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
          <div class="logo-box">
             <img src="${logoUrl}" width="50" height="50" />
          </div>
          <div class="title-box">
            <h1>${data.type === 'field-visit' ? 'Field Journal' : 'Field Report'}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 11px; font-weight: bold; text-transform: uppercase;">AgriLync Nexus</p>
            <p style="margin: 2px 0 0 0; opacity: 0.7; font-size: 10px;">Accra, Ghana | www.agrilync.com</p>
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
