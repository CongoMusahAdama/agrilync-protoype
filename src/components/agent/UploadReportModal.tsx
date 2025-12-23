import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Upload, File, X, Calendar } from 'lucide-react';

interface UploadReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onUpload?: (reportData: any) => void;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({ open, onOpenChange, farmer, onUpload }) => {
    const { darkMode } = useDarkMode();
    const [reportType, setReportType] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = () => {
        const reportData = {
            farmerId: farmer?.id,
            farmerName: farmer?.name,
            reportType,
            visitDate,
            notes,
            files: selectedFiles,
            uploadedAt: new Date().toISOString()
        };

        if (onUpload) {
            onUpload(reportData);
        }

        // Reset form
        setReportType('');
        setVisitDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setSelectedFiles(null);
        onOpenChange(false);

        alert(`Report uploaded successfully for ${farmer?.name}!`);
    };

    const handleCancel = () => {
        setReportType('');
        setVisitDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setSelectedFiles(null);
        onOpenChange(false);
    };

    if (!farmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl ${darkMode ? 'bg-[#002f37] border-[#124b53]' : 'bg-white border-none'}`}>
                <DialogHeader>
                    <DialogTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        <Upload className="h-6 w-6 text-purple-500" />
                        Upload Field Report
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Upload field visit report details and attachments for {farmer.name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Farmer Info */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#124b53]/20 border border-[#124b53]' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farmer Name</p>
                                <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.name}</p>
                            </div>
                            <div>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                                <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.region}, {farmer.community}</p>
                            </div>
                            <div>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farm Type</p>
                                <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.farmType}</p>
                            </div>
                            <div>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                                <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Type */}
                    <div className="space-y-2">
                        <Label htmlFor="reportType">Report Type <span className="text-red-500">*</span></Label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger id="reportType">
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="field-visit">Field Visit Report</SelectItem>
                                <SelectItem value="harvest">Harvest Report</SelectItem>
                                <SelectItem value="planting">Planting Report</SelectItem>
                                <SelectItem value="inspection">Farm Inspection</SelectItem>
                                <SelectItem value="monitoring">Progress Monitoring</SelectItem>
                                <SelectItem value="issue">Issue Report</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Visit Date */}
                    <div className="space-y-2">
                        <Label htmlFor="visitDate">Visit Date <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <Input
                                id="visitDate"
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Report Notes <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter your observations, findings, or notes about the visit..."
                            className="min-h-[120px]"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Attach Files (Photos, Documents)</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-700 hover:border-purple-500' : 'border-gray-300 hover:border-purple-400'} transition-colors cursor-pointer`}>
                            <input
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <File className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Click to upload or drag and drop
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Images, PDF, or documents
                                </p>
                            </label>
                        </div>
                        {selectedFiles && selectedFiles.length > 0 && (
                            <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                                <p className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                    {selectedFiles.length} file(s) selected
                                </p>
                                <div className="mt-2 space-y-1">
                                    {Array.from(selectedFiles).map((file, index) => (
                                        <p key={index} className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                            • {file.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'} pt-4`}>
                    <div className="flex justify-end gap-3 w-full">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className={darkMode ? 'border-gray-600' : 'border-gray-300'}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!reportType || !visitDate || !notes}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Report
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadReportModal;
