import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FarmerExportBundle = {
    farmer?: Record<string, unknown>;
    fieldVisits?: unknown[];
    farms?: unknown[];
    scheduledVisits?: unknown[];
    media?: unknown[];
};

const fmt = (value: unknown) => {
    if (value == null || value === '') return '—';
    if (Array.isArray(value)) return value.filter(Boolean).join(', ') || '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

const profileRows = (farmer: Record<string, unknown>) => [
    ['Full Name', fmt(farmer.name)],
    ['Lync Grower ID', fmt(farmer.id)],
    ['Ghana Card', fmt(farmer.ghanaCardNumber)],
    ['Phone', fmt(farmer.contact)],
    ['Email', fmt(farmer.email)],
    ['Gender', fmt(farmer.gender)],
    ['Date of Birth', fmt(farmer.dob)],
    ['Language', fmt(farmer.language)],
    ['Region', fmt(farmer.region)],
    ['District', fmt(farmer.district)],
    ['Community', fmt(farmer.community)],
    ['Farm Type', fmt(farmer.farmType)],
    ['Farm Size', farmer.farmSize != null ? `${farmer.farmSize} acres` : '—'],
    ['Years of Experience', fmt(farmer.yearsOfExperience)],
    ['Land Ownership', fmt(farmer.landOwnershipStatus)],
    ['Crops', fmt(farmer.cropList || farmer.cropsGrown)],
    ['Livestock', fmt(farmer.livestockType)],
    ['Training Modules', fmt(farmer.trainingModules)],
    ['Investment Interest', fmt(farmer.investmentInterest)],
    ['Status', fmt(farmer.status)],
    ['Onboarding Source', fmt(farmer.onboardingSource)],
    ['Profile Completeness', farmer.profileCompleteness != null ? `${farmer.profileCompleteness}%` : '—'],
    ['Field Agent', fmt((farmer.agent as { name?: string; agentId?: string })?.name)],
    ['Agent ID', fmt((farmer.agent as { agentId?: string })?.agentId)],
    ['Registered', farmer.createdAt ? new Date(String(farmer.createdAt)).toLocaleString('en-GB') : '—'],
];

const journeyRows = (farmer: Record<string, unknown>) => {
    const raw = farmer.stageDetails as Record<string, { status?: string; date?: string; notes?: string }> | undefined;
    if (!raw || typeof raw !== 'object') return [];
    return Object.entries(raw).map(([stage, data]) => [
        stage,
        fmt(data?.status),
        data?.date ? new Date(data.date).toLocaleDateString('en-GB') : '—',
        fmt(data?.notes),
    ]);
};

export function downloadFarmerProfileJson(bundle: FarmerExportBundle, fileName: string) {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function exportFarmerProfilePdf(bundle: FarmerExportBundle) {
    const farmer = (bundle.farmer || {}) as Record<string, unknown>;
    const name = fmt(farmer.name).replace(/[^\w\s-]/g, '').trim() || 'Grower';
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(0, 47, 55);
    doc.rect(0, 0, pageWidth, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AgriLync — Grower Profile Report', 14, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported: ${new Date().toLocaleString('en-GB')}`, 14, 26);

    autoTable(doc, {
        startY: 44,
        head: [['Field', 'Value']],
        body: profileRows(farmer),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [6, 95, 70] },
        columnStyles: { 0: { cellWidth: 52, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
    });

    const journey = journeyRows(farmer);
    if (journey.length) {
        autoTable(doc, {
            startY: (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable!.finalY + 10,
            head: [['Journey Stage', 'Status', 'Date', 'Notes']],
            body: journey,
            theme: 'striped',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [0, 47, 55] },
        });
    }

    const visits = (bundle.fieldVisits || []) as Array<Record<string, unknown>>;
    if (visits.length) {
        autoTable(doc, {
            startY: (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable!.finalY + 10,
            head: [['Date', 'Purpose', 'Status', 'Notes']],
            body: visits.map((v) => [
                v.date ? new Date(String(v.date)).toLocaleDateString('en-GB') : '—',
                fmt(v.purpose),
                fmt(v.status),
                fmt(v.notes || v.observations),
            ]),
            theme: 'striped',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [6, 95, 70] },
        });
    }

    doc.save(`AgriLync_Grower_${name}_${new Date().toISOString().split('T')[0]}.pdf`);
}
