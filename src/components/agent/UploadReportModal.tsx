import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Upload, File, X, Calendar, FileText, Image as ImageIcon, Video, Paperclip } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { exportToPDF, exportToWord } from '@/utils/reportExport';
import { CheckCircle2, Download } from 'lucide-react';

interface UploadReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onUpload?: (reportData: any) => void;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({ open, onOpenChange, farmer, onUpload }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [media, setMedia] = useState<Array<{ type: 'image' | 'video' | 'document'; url: string; name: string }>>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastReport, setLastReport] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    let type: 'image' | 'video' | 'document' = 'document';

                    if (file.type.startsWith('image')) type = 'image';
                    else if (file.type.startsWith('video')) type = 'video';

                    setMedia(prev => [...prev, { type, url: base64String, name: file.name }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!reportType || !visitDate || !notes) return;

        setLoading(true);
        try {
            const reportData = {
                farmerId: farmer?._id || farmer?.id,
                type: reportType,
                date: visitDate,
                notes,
                media
            };

            const response = await api.post('/reports', reportData);

            toast.success(`Report uploaded successfully for ${farmer?.name}!`);

            setLastReport({
                ...reportData,
                farmerName: farmer?.name,
                agentName: agent?.name || 'AgriLync Agent'
            });
            setShowSuccess(true);

            if (onUpload) onUpload(response.data);
        } catch (error) {
            console.error('Failed to upload report:', error);
            toast.error('Failed to upload report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setReportType('');
        setVisitDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setMedia([]);
        setLoading(false);
        setShowSuccess(false);
        setLastReport(null);
        onOpenChange(false);
    };

    if (!farmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-3xl w-full p-0 overflow-hidden flex flex-col sm:flex-row ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}`}>

                {/* Content */}
                {!showSuccess ? (
                    <>
                        {/* Left Column: Form Fields */}
                        <div className="flex-1 p-6 space-y-4">
                            <DialogHeader>
                                <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    Upload Report
                                </DialogTitle>
                                <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    Submit a field report for <strong>{farmer.name}</strong>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reportType" className={darkMode ? 'text-gray-300' : ''}>Type</Label>
                                        <Select value={reportType} onValueChange={setReportType}>
                                            <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="field-visit">Field Visit</SelectItem>
                                                <SelectItem value="harvest">Harvest</SelectItem>
                                                <SelectItem value="planting">Planting</SelectItem>
                                                <SelectItem value="inspection">Inspection</SelectItem>
                                                <SelectItem value="issue">Issue</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="visitDate" className={darkMode ? 'text-gray-300' : ''}>Date</Label>
                                        <Input
                                            id="visitDate"
                                            type="date"
                                            value={visitDate}
                                            onChange={(e) => setVisitDate(e.target.value)}
                                            className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes" className={darkMode ? 'text-gray-300' : ''}>Observations / Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Enter detailed observations..."
                                        className={`min-h-[120px] resize-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media Upload */}
                        <div className={`w-full sm:w-[300px] p-6 border-l ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex flex-col`}>
                            <div className="mb-4">
                                <Label className={darkMode ? 'text-gray-300' : ''}>Attachments</Label>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Photos, videos, or docs</p>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer transition-colors mb-4
                                    ${darkMode
                                        ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-800'
                                        : 'border-gray-200 hover:border-purple-400 hover:bg-white'}
                                `}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    multiple
                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                    className="hidden"
                                />
                                <Paperclip className={`h-8 w-8 mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <p className={`text-xs font-medium text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Click to attach files
                                </p>
                            </div>

                            {/* File List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[150px] mb-4">
                                {media.map((item, index) => (
                                    <div key={index} className={`flex items-center gap-2 p-2 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                        <div className="h-8 w-8 shrink-0 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt="Preview" className="h-full w-full object-cover" />
                                            ) : item.type === 'video' ? (
                                                <Video className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <File className="h-4 w-4 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[10px] font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</p>
                                        </div>
                                        <button
                                            onClick={() => removeMedia(index)}
                                            className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {media.length === 0 && (
                                    <p className={`text-[10px] text-center italic mt-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>No files attached</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="ghost" size="sm" onClick={handleCancel} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500'}>
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSubmit}
                                    disabled={loading || !reportType || !visitDate || !notes}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {loading ? 'Uploading...' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Report Submitted!</h3>
                            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                The report for <strong>{farmer.name}</strong> has been successfully saved.
                                <br />You can now download a copy for your records.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4">
                            <Button
                                onClick={() => exportToPDF(lastReport)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2 h-12"
                            >
                                <Download className="h-4 w-4" /> Download PDF
                            </Button>
                            <Button
                                onClick={() => exportToWord(lastReport)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12"
                            >
                                <Download className="h-4 w-4" /> Download Word
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className={`mt-4 ${darkMode ? 'border-gray-700 text-gray-400' : 'text-gray-500'}`}
                        >
                            Done & Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UploadReportModal;
