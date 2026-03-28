import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    X, Camera, ClipboardList, Sparkles,
    CheckCircle2, ChevronRight, ChevronLeft,
    Download, Users, Activity, Leaf, TrendingUp,
    FileText, MessageSquare, Image
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { exportToPDF } from '@/utils/reportExport';

interface UploadReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer?: any;
    farmers?: any[];
    onUpload?: (reportData: any) => void;
}

const UploadReportModal: React.FC<UploadReportModalProps> = ({ open, onOpenChange, farmer, farmers = [], onUpload }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [internalFarmerId, setInternalFarmerId] = useState<string>('');
    const [internalFarmer, setInternalFarmer] = useState<any>(null);

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
                farmerId: farmer?._id || farmer?.id || internalFarmerId,
                ...visitData,
                agentName: agent?.name
            };

            if (!payload.farmerId) {
                toast.error('Contextual error: No grower selected.');
                setLoading(false);
                return;
            }
            const res = await api.post('/reports', payload);
            toast.success('Visit report submitted successfully!');
            setStep(4); // Success step
            if (onUpload) onUpload(res.data);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || 'Submission failed. Please try again.';
            toast.error(errorMsg);
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



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl w-[95vw] p-0 overflow-hidden flex flex-col h-[75vh] border-none shrink-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} rounded-[2rem] shadow-2xl`}>

                {/* Premium Multi-step Header */}
                <div className={`px-8 py-7 border-b shrink-0 relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#0b2528] to-[#002f37] border-white/5' : 'bg-gradient-to-r from-gray-50 to-emerald-50 border-gray-100'}`}>
                    <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                            <div className={`p-3.5 rounded-2xl shadow-xl rotate-3 ${darkMode ? 'bg-[#065f46] text-white' : 'bg-[#065f46] text-white'}`}>
                                {step === 1 ? <ClipboardList className="h-6 w-6" /> :
                                    step === 2 ? <Camera className="h-6 w-6" /> :
                                        step === 3 ? <Sparkles className="h-6 w-6" /> :
                                            <CheckCircle2 className="h-6 w-6" />}
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-[#002f37] dark:text-white flex items-center gap-2">
                                    {farmer?.name || internalFarmer?.name ? (
                                        <>
                                            <span className="opacity-50 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded-full">Auditing</span>
                                            {farmer?.name || internalFarmer?.name}
                                        </>
                                    ) : "Strategic Report Discovery"}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">AgriLync Nexus • Phase {step} of 3</p>
                            </div>
                        </div>
                        {step < 4 && (
                            <div className="flex items-center gap-2.5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step === i ? 'w-10 bg-[#065f46] shadow-[0_0_15px_rgba(6,95,70,0.4)]' : step > i ? 'w-4 bg-[#065f46]/40' : 'w-4 bg-gray-200 dark:bg-gray-800'}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50/30 dark:bg-transparent">
                    {/* Common Header for all active steps */}
                    {step < 4 && (
                        <div className="mb-6 space-y-1.5 border-b border-[#065f46]/10 pb-6">
                            <DialogTitle className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {step === 1 ? 'Quick Log Report' : step === 2 ? 'Visual Evidence' : 'AI Analysis Preview'}
                            </DialogTitle>
                            {farmer?._id || farmer?.id || internalFarmerId ? (
                                <DialogDescription className={`font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Logging field insights for <span className="font-black text-[#065f46]">{farmer?.name || internalFarmer?.name || 'Selected Grower'}</span>.
                                </DialogDescription>
                            ) : (
                                <DialogDescription className={`font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Please select a grower to proceed with the report.</DialogDescription>
                            )}
                        </div>
                    )}

                    {/* Step 1: Observations */}
                    {step === 1 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-3xl mx-auto">
                             {!farmer && (
                                <div className="space-y-4 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 shadow-inner relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <Label className="text-[12px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-widest">Assign Grower Context</Label>
                                    </div>
                                    <Select 
                                        value={internalFarmerId} 
                                        onValueChange={(val) => {
                                            setInternalFarmerId(val);
                                            const f = farmers.find(f => (f._id || f.id) === val);
                                            setInternalFarmer(f);
                                        }}
                                    >
                                        <SelectTrigger className={`h-16 border-2 border-transparent transition-all hover:border-emerald-500/30 focus:border-emerald-500/50 rounded-2xl text-base font-bold shadow-2xl ${darkMode ? 'bg-white/5 text-white' : 'bg-white'}`}>
                                            <SelectValue placeholder="Identify the grower for this strategic report..." />
                                        </SelectTrigger>
                                        <SelectContent className={`${darkMode ? 'bg-[#002f37] border-white/5' : 'bg-white'} rounded-[2rem] shadow-2xl border-none p-3 overflow-hidden`}>
                                            <div className="p-3 mb-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Available Growers</p>
                                            </div>
                                            {farmers.map((f) => (
                                                <SelectItem key={f._id || f.id} value={f._id || f.id} className="font-bold py-4 rounded-xl focus:bg-emerald-500 focus:text-white transition-colors cursor-pointer my-1">
                                                    <div className="flex flex-col">
                                                        <span>{f.name}</span>
                                                        <span className="text-[10px] opacity-60 uppercase tracking-tighter">{f.region || 'Registered Network'}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                            {farmers.length === 0 && (
                                                <div className="p-8 text-center">
                                                    <Users className="h-10 w-10 text-gray-200 mx-auto mb-2 opacity-20" />
                                                    <p className="text-xs font-bold text-gray-400">Empty Directory</p>
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                <div className="space-y-3 relative group">
                                    <div className="flex justify-between items-end mb-1">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.15em]">Engagement Type</Label>
                                        {visitData.type && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Required Field</span>}
                                    </div>
                                    <div className="relative">
                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <Input
                                            value={visitData.type}
                                            onChange={(e) => setVisitData(p => ({ ...p, type: e.target.value }))}
                                            placeholder="Audit focus (e.g. Pest Alert)"
                                            className={`h-14 pl-12 border-2 border-transparent focus:border-emerald-500/30 transition-all rounded-2xl text-base font-bold shadow-sm ${darkMode ? 'bg-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50/50 hover:bg-white focus:bg-white'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 relative group">
                                    <div className="flex justify-between items-end mb-1">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.15em]">Growth Cycle Stage</Label>
                                        {visitData.cropStage && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Verified Status</span>}
                                    </div>
                                    <div className="relative">
                                        <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <Input
                                            value={visitData.cropStage}
                                            onChange={(e) => setVisitData(p => ({ ...p, cropStage: e.target.value }))}
                                            placeholder="Current stage (e.g. Flowering)"
                                            className={`h-14 pl-12 border-2 border-transparent focus:border-emerald-500/30 transition-all rounded-2xl text-base font-bold shadow-sm ${darkMode ? 'bg-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50/50 hover:bg-white focus:bg-white'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white/5 dark:bg-emerald-500/5 shadow-inner">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                                        <Label className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">Health Assessment Index</Label>
                                    </div>
                                    <span className={`text-2xl font-black tabular-nums ${darkMode ? 'text-emerald-400 font-mono' : 'text-[#065f46] font-mono'} drop-shadow-sm`}>
                                        {String(visitData.healthScore).padStart(2, '0')}%
                                    </span>
                                </div>
                                <div className="relative py-2 pb-6">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={visitData.healthScore} 
                                        onChange={(e) => setVisitData(p => ({ ...p, healthScore: e.target.value }))}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all accent-[#065f46]"
                                        style={{
                                            background: `linear-gradient(to right, #065f46 0%, #065f46 ${visitData.healthScore}%, ${darkMode ? '#1a2e31' : '#e5e7eb'} ${visitData.healthScore}%, ${darkMode ? '#1a2e31' : '#e5e7eb'} 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between mt-3 text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">
                                      <span>Critical</span>
                                      <span>Optimal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 relative group">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-4 w-4 text-emerald-600 opacity-60" />
                                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.15em]">Strategic Field Notes</Label>
                                </div>
                                <Textarea
                                    placeholder="Synthesize field observations, identify success metrics, or log anomalies for Agri-Vision processing..."
                                    className={`min-h-[200px] p-6 border-2 border-transparent focus:border-emerald-500/30 transition-all rounded-[2rem] text-base font-bold leading-relaxed resize-none shadow-inner ${darkMode ? 'bg-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50/50 hover:bg-white focus:bg-white'}`}
                                    value={visitData.notes}
                                    onChange={(e) => setVisitData(p => ({ ...p, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Media */}
                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-3xl mx-auto">
                            <div className="text-center space-y-2 mb-4">
                                <h1 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Visual Evidence</h1>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload high-fidelity field imagery for localized AI processing and audit verification.</p>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative aspect-[21/9] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${darkMode ? 'border-white/10 hover:border-emerald-500/50 bg-white/5' : 'border-gray-200 hover:border-emerald-600/50 bg-gray-50/50 hover:bg-white active:scale-[0.99] shadow-inner'}`}
                            >
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />
                                <div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="p-5 rounded-3xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 mb-5 rotate-12 group-hover:rotate-0 transition-all duration-500">
                                        <Camera className="h-8 w-8" />
                                    </div>
                                    <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Capture or Upload Assets</p>
                                    <p className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] mt-2">Maximum 10 images • HEIC/JPG/PNG</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar pb-10">
                                {visitData.media.map((item, idx) => (
                                    <div key={idx} className={`group p-4 rounded-[2rem] border transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10 hover:border-emerald-500/50' : 'bg-white border-gray-100 shadow-xl hover:shadow-2xl hover:border-emerald-600/30'}`}>
                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                                            <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVisitData(p => ({ ...p, media: p.media.filter((_, i) => i !== idx) }));
                                                }}
                                                className="absolute top-3 right-3 p-2 bg-rose-500/90 backdrop-blur-md rounded-xl text-white shadow-xl hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all z-20"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Asset Ready</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                          <Input 
                                              placeholder="Add professional context (e.g. Stem leaf health)..."
                                              className={`h-11 pl-10 text-[12px] font-bold border-none rounded-xl transition-all ${darkMode ? 'bg-white/10 text-white placeholder:text-gray-500 focus:bg-white/20' : 'bg-gray-50 text-gray-700 focus:bg-white shadow-inner'}`}
                                              value={item.description || ''}
                                              onChange={(e) => {
                                                  const newMedia = [...visitData.media];
                                                  newMedia[idx].description = e.target.value;
                                                  setVisitData(p => ({ ...p, media: newMedia }));
                                              }}
                                          />
                                        </div>
                                    </div>
                                ))}
                                {visitData.media.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem] opacity-40">
                                        <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-xs font-black uppercase tracking-widest">No assets queued for processing</p>
                                    </div>
                                )}
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
                            <Button className="w-full max-w-xs h-14 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 uppercase tracking-widest text-xs border-none" onClick={() => exportToPDF({
                                ...visitData,
                                farmerName: farmer?.name || internalFarmer?.name || 'AgriLync Grower',
                                date: new Date().toLocaleDateString()
                            })}>
                                <Download className="h-5 w-5 mr-3" /> Export Strategic PDF
                            </Button>
                        </div>
                    )}
                </div>

                {/* Premium Footer Controls */}
                <div className={`p-8 border-t flex items-center justify-between shrink-0 relative overflow-hidden ${darkMode ? 'bg-[#0b2528]/80 border-white/5 backdrop-blur-md' : 'bg-white border-gray-100'}`}>
                    {step < 4 ? (
                        <>
                            <Button 
                                variant="ghost" 
                                disabled={loading}
                                className={`font-black text-[10px] uppercase tracking-widest h-14 px-10 rounded-2xl transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'}`} 
                                onClick={() => step > 1 ? setStep(s => s - 1) : onOpenChange(false)}
                            >
                                {step === 1 ? 'Discard Audit' : <><ChevronLeft className="h-4 w-4 mr-2" /> Back</>}
                            </Button>
                            <Button
                                className={`h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_15px_30px_-10px_rgba(6,95,70,0.4)] border-none transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                                    (loading || (step === 1 && !visitData.notes)) ? 'bg-gray-400 opacity-50' : 'bg-gradient-to-r from-[#065f46] to-[#047857] text-white hover:shadow-emerald-500/40'
                                }`}
                                disabled={loading || (step === 1 && !visitData.notes)}
                                onClick={() => step === 3 ? handleSubmit() : setStep(s => s + 1)}
                            >
                                {step === 3 ? (loading ? 'Syncing Insights...' : 'Finalize Strategy') : <>Continue Insight Phase <ChevronRight className="h-4 w-4 ml-2" /></>}
                            </Button>
                        </>
                    ) : (
                        <Button className="w-full bg-gradient-to-r from-[#065f46] to-[#044e57] text-white hover:shadow-2xl transition-all font-black h-16 rounded-[2rem] uppercase tracking-widest text-xs shadow-xl border-none" onClick={resetForm}>
                            Return to Global Command Center
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UploadReportModal;
