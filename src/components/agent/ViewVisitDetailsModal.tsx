import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';

interface ViewVisitDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visit: any;
}

const ViewVisitDetailsModal: React.FC<ViewVisitDetailsModalProps> = ({ open, onOpenChange, visit }) => {
    const { darkMode } = useDarkMode();

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(29, 185, 84); // AgriLync Green
        doc.text('Visit Summary - AgriLync', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Farmer: ${visit.farmer?.name || visit.farmer || 'N/A'}`, 14, 35);
        doc.text(`Date: ${visit.date}`, 14, 42);
        doc.text(`Time: ${visit.time}`, 14, 49);
        doc.text(`Purpose: ${visit.purpose}`, 14, 56);
        doc.text(`Status: ${visit.status}`, 14, 63);

        if (visit.notes) {
            doc.setFontSize(14);
            doc.text('Field Notes:', 14, 75);
            doc.setFontSize(11);
            const splitNotes = doc.splitTextToSize(visit.notes, 180);
            doc.text(splitNotes, 14, 82);
        }

        if (visit.challenges) {
            const currentY = visit.notes ? 82 + (doc.splitTextToSize(visit.notes, 180).length * 5) + 10 : 75;
            doc.setFontSize(14);
            doc.text('Challenges:', 14, currentY);
            doc.setFontSize(11);
            const splitChallenges = doc.splitTextToSize(visit.challenges, 180);
            doc.text(splitChallenges, 14, currentY + 7);
        }

        doc.save(`AgriLync_Visit_${visit._id || 'Record'}.pdf`);
    };

    const handleExportExcel = () => {
        const exportData = [{
            'Visit ID': visit._id || 'N/A',
            'Farmer': visit.farmer?.name || visit.farmer || 'N/A',
            'Date': visit.date,
            'Time': visit.time,
            'Purpose': visit.purpose,
            'Status': visit.status,
            'Notes': visit.notes || '',
            'Challenges': visit.challenges || ''
        }];

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visit Detail");
        XLSX.writeFile(wb, `AgriLync_Visit_${visit._id || 'Record'}.xlsx`);
    };

    if (!visit) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-md ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-6 w-6 text-[#1db954]" />
                        <DialogTitle className="text-xl">Visit Details</DialogTitle>
                    </div>
                    <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Scheduled farm visit information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                <Badge className={`mt-1 ${visit.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    {visit.status}
                                </Badge>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit ID</p>
                                <p className="font-medium">#{visit.id?.slice(0, 6) || 'V-2025'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farmer</p>
                                <p className="font-medium">{visit.farmer?.name || visit.farmerName || (typeof visit.farmer === 'string' ? visit.farmer : 'N/A')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farm</p>
                                <p className="font-medium">{visit.name || visit.farmName || (typeof visit.farm === 'string' ? visit.farm : 'N/A')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                                        <p className="font-medium">{visit.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
                                        <p className="font-medium">{visit.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className={`h-5 w-5 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purpose</p>
                                <p className="font-medium">{visit.purpose}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center gap-2">
                    <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                    </Button>
                    <Button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                    </Button>
                    <Button onClick={() => onOpenChange(false)} className="bg-[#1db954] hover:bg-[#17a447] text-white flex-1">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewVisitDetailsModal;
