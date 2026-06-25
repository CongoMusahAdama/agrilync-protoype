import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    BarChart3,
    Printer,
    Settings,
    Eye,
    FileSpreadsheet,
    Loader2
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import api from '@/utils/api';
import { exportToCSV, exportToPDF } from '@/utils/reportExport';

const REPORT_TYPES = [
    { id: 'expense_vouchers', label: 'Expense Vouchers' },
    { id: 'farmers_directory', label: 'Farmers / Growers Directory' },
    { id: 'disbursements', label: 'Disbursements Report' },
    { id: 'sales_distribution', label: 'Sales / Input Distribution' },
    { id: 'regional_performance', label: 'Regional Performance Metrics' },
    { id: 'escalation_logs', label: 'Escalation Logs' },
    { id: 'system_audits', label: 'System Audit Trails' },
    { id: 'agent_performance', label: 'Agent Performance Tracking' }
];

const ReportsAnalytics = () => {
    const { darkMode } = useDarkMode();
    
    const [reportType, setReportType] = useState('expense_vouchers');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [generatedType, setGeneratedType] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedType(reportType);
        
        try {
            let endpoint = '';
            let dataArray = [];

            if (reportType === 'expense_vouchers') {
                const res = await api.get('/super-admin/vouchers');
                dataArray = res.data?.data || (Array.isArray(res.data) ? res.data : []);
            } else if (reportType === 'farmers_directory') {
                const res = await api.get('/farmers');
                dataArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            } else {
                toast.info('This report type is currently under development.');
                setLoading(false);
                return;
            }

            // Client-side date filtering
            let filtered = dataArray;
            if (startDate || endDate) {
                filtered = dataArray.filter((item: any) => {
                    const itemDate = item.expenseDate || item.createdAt || item.date;
                    if (!itemDate) return true; 
                    if (startDate && new Date(itemDate) < new Date(startDate)) return false;
                    if (endDate && new Date(itemDate) > new Date(endDate)) return false;
                    return true;
                });
            }

            setPreviewData(filtered);
            if (filtered.length === 0) {
                toast.info('No records found for the selected criteria.');
            } else {
                toast.success(`Successfully generated preview with ${filtered.length} records.`);
            }

        } catch (error) {
            console.error('Failed to generate report:', error);
            toast.error('Failed to fetch report data.');
            setPreviewData([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadExcel = () => {
        if (previewData.length === 0) {
            toast.error('No data to export. Generate a report first.');
            return;
        }
        exportToCSV(previewData, generatedType);
    };

    const handleDownloadPDF = async () => {
        if (previewData.length === 0) {
            toast.error('No data to export. Generate a report first.');
            return;
        }
        await exportToPDF(previewData, generatedType, startDate, endDate);
        toast.success('PDF downloaded successfully!');
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shadow-inner">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Reports & Analytics
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Generate, preview, and export system reports
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Panel: Generate Financial Reports */}
                <Card className={`lg:col-span-1 border shadow-sm ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black text-[#002f37] dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-500" /> Generate Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Report Type</Label>
                            <div className="max-h-[250px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                                {REPORT_TYPES.map(report => (
                                    <div 
                                        key={report.id}
                                        onClick={() => setReportType(report.id)}
                                        className={`px-3 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors border shadow-sm ${
                                            reportType === report.id 
                                            ? 'bg-[#002f37] text-white border-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] dark:border-[#7ede56]' 
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#002f37] hover:text-[#002f37] dark:hover:border-[#7ede56] dark:hover:text-[#7ede56]'
                                        }`}
                                    >
                                        {report.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">From</Label>
                            <Input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                className="bg-white dark:bg-gray-800 rounded-xl h-11 border-gray-300 dark:border-gray-700 font-mono text-sm" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">To</Label>
                            <Input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                className="bg-white dark:bg-gray-800 rounded-xl h-11 border-gray-300 dark:border-gray-700 font-mono text-sm" 
                            />
                        </div>
                        
                        <div className="flex justify-end pt-1">
                            <Button 
                                variant="ghost" 
                                className="h-8 px-2 text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase tracking-widest" 
                                onClick={() => { setStartDate(''); setEndDate(''); }}
                            >
                                Clear Dates
                            </Button>
                        </div>
                        
                        <div className="pt-2">
                            <Button 
                                className="w-full h-12 bg-[#065f46] hover:bg-[#054d3a] text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-transform active:scale-95" 
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
                                Generate [F8]
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Panel: Report Preview */}
                <Card className={`lg:col-span-3 border shadow-sm flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                        <CardTitle className="text-lg font-black text-[#002f37] dark:text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-gray-500" /> Report Preview
                        </CardTitle>
                    </CardHeader>
                    
                    <div className="p-4 border-b dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/50 flex flex-wrap gap-3">
                        <Button onClick={handlePrint} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl px-6 h-10 shadow-sm" disabled={previewData.length === 0}>
                            <Printer className="w-4 h-4 mr-2" /> Print Report
                        </Button>
                        <Button onClick={handleDownloadPDF} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl px-6 h-10 shadow-sm" disabled={previewData.length === 0}>
                            <FileText className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button onClick={handleDownloadExcel} className="bg-[#065f46] hover:bg-[#044a36] text-white font-bold rounded-xl px-6 h-10 shadow-sm" disabled={previewData.length === 0}>
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Download Excel
                        </Button>
                    </div>
                    
                    <CardContent className="p-0 flex-1 overflow-auto min-h-[500px] max-h-[800px] report-print-area bg-white dark:bg-gray-900">
                        {/* Print Header - Visible only when printing */}
                        <div className="hidden print:block p-8 border-b-4 border-[#065f46] mb-4 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <img src="/lovable-uploads/agrilync_logo_full.png" alt="Agrilync Nexus" className="h-12 mb-2 object-contain mix-blend-multiply" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accra, Ghana</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">info@agrilync.com</p>
                                    <p className="text-[10px] font-bold text-[#065f46] uppercase tracking-widest mt-1">
                                        Period: {(startDate && endDate) ? `${startDate} TO ${endDate}` : (startDate ? `FROM ${startDate}` : (endDate ? `UNTIL ${endDate}` : 'ALL TIME'))}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h1 className="text-2xl font-black text-[#002f37] uppercase tracking-tighter">System Report</h1>
                                    <p className="text-sm font-black text-[#065f46] uppercase tracking-widest mt-1">
                                        {REPORT_TYPES.find(r => r.id === generatedType)?.label || generatedType.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                        Generated: {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto pb-4">
                            {previewData.length > 0 ? (
                                <Table className="w-full min-w-max">
                                    <TableHeader>
                                        <TableRow className="bg-[#065f46] hover:bg-[#065f46]">
                                            {Object.keys(previewData[0])
                                                .filter(k => !['id', 'signatureImage', 'updatedAt', 'agentId', 'location', 'farmPhotos'].includes(k) && typeof previewData[0][k] !== 'object')
                                                .map(key => (
                                                    <TableHead key={key} className="capitalize text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap px-4 py-3 bg-[#065f46]">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewData.map((row: any, i) => (
                                            <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                {Object.entries(row)
                                                    .filter(([k, v]) => !['id', 'signatureImage', 'updatedAt', 'agentId', 'location', 'farmPhotos'].includes(k) && typeof v !== 'object')
                                                    .map(([k, v]) => {
                                                        let displayVal = String(v ?? '—');
                                                        if (k.toLowerCase().includes('date') && v) {
                                                            try { displayVal = new Date(v as string).toLocaleDateString(); } catch(e) {}
                                                        }
                                                        return (
                                                            <TableCell key={k} className="text-xs font-medium text-gray-700 dark:text-gray-300 px-4 py-3 whitespace-nowrap">
                                                                {displayVal}
                                                            </TableCell>
                                                        );
                                                    })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 space-y-4">
                                    <BarChart3 className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">
                                        {generatedType ? 'No data found for this period.' : 'Select a report type and click Generate to preview.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    
                    {previewData.length > 0 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Showing {previewData.length} records for {REPORT_TYPES.find(r => r.id === generatedType)?.label || generatedType.replace(/_/g, ' ')}
                        </div>
                    )}
                </Card>
            </div>
            
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .report-print-area, .report-print-area * {
                        visibility: visible;
                    }
                    .report-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                        color: black !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .hidden.print\\:block {
                        display: block !important;
                    }
                    /* Ensure table stretches nicely in landscape */
                    table {
                        width: 100% !important;
                        table-layout: auto !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReportsAnalytics;
