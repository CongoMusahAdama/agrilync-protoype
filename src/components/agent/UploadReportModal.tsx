import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    X, Camera, ClipboardList, Sparkles,
    CheckCircle2, ChevronRight, ChevronLeft,
    Download
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { exportToPDF } from '@/utils/reportExport';

interface UploadReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onUpload?: (reportData: any) => void;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({ open, onOpenChange, farmer, onUpload }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [visitData, setVisitData] = useState({
        type: 'Routine Inspection',
        cropStage: 'Vegetative',
        healthScore: '85',
        notes: '',
        media: [] as any[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setVisitData(prev => ({
                        ...prev,
                        media: [...prev.media, {
                            type: file.type.startsWith('image') ? 'image' : 'document',
                            url: reader.result as string,
                            name: file.name
                        }]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                farmerId: farmer?._id || farmer?.id,
                ...visitData,
                agentName: agent?.name
            };
            const res = await api.post('/reports', payload);
            toast.success('Visit report submitted successfully!');
            setStep(4); // Success step
            if (onUpload) onUpload(res.data);
        } catch (error) {
            toast.error('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setVisitData({
            type: 'Routine Inspection',
            cropStage: 'Vegetative',
            healthScore: '85',
            notes: '',
            media: []
        });
        onOpenChange(false);
    };

    if (!farmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl w-[95vw] p-0 overflow-hidden flex flex-col h-[75vh] border-none shrink-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} rounded-[2rem] shadow-2xl`}>

                {/* Custom Multi-step Header */}
                <div className={`px-8 py-6 border-b flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#0b2528]/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-[#065f46]/20' : 'bg-[#065f46]/10'}`}>
                            {step === 1 ? <ClipboardList className="h-6 w-6 text-[#065f46]" /> :
                                step === 2 ? <Camera className="h-6 w-6 text-[#065f46]" /> :
                                    <Sparkles className="h-6 w-6 text-[#065f46]" />}
                        </div>
                        <div>
                            <h2 className="text-base font-black uppercase tracking-widest text-[#002f37] dark:text-white">New Field Audit</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Report Generation Step {step} of 3</p>
                        </div>
                    </div>
                    {step < 4 && (
                        <div className="flex items-center gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#065f46] shadow-[0_0_15px_rgba(6,95,70,0.5)]' : 'bg-gray-200 dark:bg-gray-800'}`} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50/30 dark:bg-transparent">
                    {/* Step 1: Observations */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <DialogTitle className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Audit Observations</DialogTitle>
                                <DialogDescription className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Log detailed field data and operational insights for this grower.</DialogDescription>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Engagement Type</Label>
                                    <Select value={visitData.type} onValueChange={(v) => setVisitData(p => ({ ...p, type: v }))}>
                                        <SelectTrigger className={`h-12 border-none rounded-xl text-base font-bold ${darkMode ? 'bg-white/5 text-white' : 'bg-white shadow-sm'}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            <SelectItem value="Routine Inspection">Routine Inspection</SelectItem>
                                            <SelectItem value="Pest Alert">Pest Alert</SelectItem>
                                            <SelectItem value="Harvest Prep">Harvest Prep</SelectItem>
                                            <SelectItem value="Soil Test">Soil Test</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Growth Cycle Stage</Label>
                                    <Select value={visitData.cropStage} onValueChange={(v) => setVisitData(p => ({ ...p, cropStage: v }))}>
                                        <SelectTrigger className={`h-12 border-none rounded-xl text-base font-bold ${darkMode ? 'bg-white/5 text-white' : 'bg-white shadow-sm'}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            <SelectItem value="Pre-planting">Pre-planting</SelectItem>
                                            <SelectItem value="Vegetative">Vegetative</SelectItem>
                                            <SelectItem value="Flowering">Flowering</SelectItem>
                                            <SelectItem value="Harvest">Harvest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Health Assessment (%)</Label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={visitData.healthScore} 
                                            onChange={(e) => setVisitData(p => ({ ...p, healthScore: e.target.value }))}
                                            className="flex-1 accent-[#065f46] h-1.5 rounded-lg appearance-none bg-gray-200 dark:bg-gray-800"
                                        />
                                        <span className={`text-xl font-black min-w-[3rem] text-center ${darkMode ? 'text-[#065f46]' : 'text-[#065f46]'}`}>{visitData.healthScore}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Detailed Field Notes</Label>
                                <Textarea
                                    placeholder="Log professional field observations, anomalies, or success metrics..."
                                    className={`min-h-[160px] border-none rounded-xl text-base font-bold resize-none ${darkMode ? 'bg-white/5 text-white placeholder:text-gray-600' : 'bg-white shadow-sm'}`}
                                    value={visitData.notes}
                                    onChange={(e) => setVisitData(p => ({ ...p, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Media */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <DialogTitle className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Visual Evidence</DialogTitle>
                                <DialogDescription className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload high-fidelity imagery for Ag-Vision AI processing.</DialogDescription>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${darkMode ? 'border-white/10 hover:border-[#065f46] hover:bg-white/5' : 'border-gray-200 hover:border-[#065f46] hover:bg-[#065f46]/5'}`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />
                                <div className="p-4 rounded-full bg-[#065f46]/10 mb-4">
                                    <Camera className="h-10 w-10 text-[#065f46]" />
                                </div>
                                <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Upload Report Photos</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">Select from gallery or use camera</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {visitData.media.map((item, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#065f46] transition-all group shadow-md">
                                        <img src={item.url} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVisitData(p => ({ ...p, media: p.media.filter((_, i) => i !== idx) }));
                                                }}
                                                className="p-2 bg-rose-500 rounded-xl text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: AI Preview */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className={`p-8 rounded-[2rem] border-none shadow-xl ${darkMode ? 'bg-[#065f46]/20' : 'bg-[#065f46]/5'}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-[#065f46]/20">
                                        <Sparkles className="h-6 w-6 text-[#065f46]" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-widest text-[#065f46] text-sm">AI-Generated Report Summary</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-6 border-b border-[#065f46]/20">
                                        <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Computed Health Score</span>
                                        <span className="text-4xl font-black text-[#065f46] drop-shadow-sm">{visitData.healthScore}%</span>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Synthesis & Strategy</p>
                                        <p className={`text-base font-bold leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            {visitData.notes ? (
                                                <>Based on the field observations of {farmer?.name}'s farm, the crop is currently in the <span className="text-[#065f46] font-black">{visitData.cropStage}</span> stage. {visitData.notes.length > 50 ? visitData.notes : `The assessment indicates a health score of ${visitData.healthScore}%, suggesting ${parseInt(visitData.healthScore) > 80 ? 'optimal growth' : 'a need for closer monitoring'}. ${visitData.notes}`}</>
                                            ) : (
                                                "Analysis summary will be generated once your field notes and visual data are processed."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest opacity-60">
                                This strategic advisory is synthesized using localized agronomic models.
                            </p>
                        </div>
                    )}

                    {/* Success Step */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center text-center py-12 space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 rounded-3xl bg-[#065f46] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(6,95,70,0.5)] rotate-12">
                                <CheckCircle2 className="h-12 w-12 text-white -rotate-12" />
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Insight Captured!</h3>
                                <p className={`text-base font-medium mt-3 max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>The field report has been securely synced to the AgriLync core database.</p>
                            </div>
                            <Button className="w-full max-w-xs h-14 bg-transparent text-[#065f46] border-2 border-[#065f46] font-black rounded-2xl hover:bg-[#065f46]/5 uppercase tracking-widest text-xs border-none" onClick={() => exportToPDF({
                                ...visitData,
                                farmerName: farmer.name,
                                date: new Date().toLocaleDateString()
                            })}>
                                <Download className="h-5 w-5 mr-3" /> Export Strategic PDF
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className={`p-8 border-t flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#0b2528]/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    {step < 4 ? (
                        <>
                            <Button variant="ghost" className={`font-black text-[10px] uppercase tracking-widest h-12 px-6 rounded-xl transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500'}`} onClick={() => step > 1 ? setStep(s => s - 1) : onOpenChange(false)}>
                                {step === 1 ? 'Discard' : <><ChevronLeft className="h-4 w-4 mr-2" /> Previous Step</>}
                            </Button>
                            <Button
                                className="bg-[#065f46] text-white h-12 px-10 rounded-xl hover:bg-[#065f46]/90 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#065f46]/20 border-none"
                                disabled={loading || (step === 1 && !visitData.notes)}
                                onClick={() => step === 3 ? handleSubmit() : setStep(s => s + 1)}
                            >
                                {step === 3 ? (loading ? 'Syncing...' : 'Finalize & Post') : <>Continue <ChevronRight className="h-4 w-4 ml-2" /></>}
                            </Button>
                        </>
                    ) : (
                        <Button className="w-full bg-[#065f46] text-white hover:bg-[#065f46]/90 font-black h-14 rounded-2xl uppercase tracking-widest text-xs shadow-xl border-none" onClick={resetForm}>
                            Return to Command Center
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UploadReportModal;
