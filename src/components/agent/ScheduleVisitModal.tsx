import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import {
    Calendar,
    MapPin,
    Send,
    Loader2,
    X,
    Clock,
    Camera,
} from 'lucide-react';

interface ScheduleVisitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    farmer?: any;
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ open, onOpenChange, onSuccess, farmer }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        farmerId: '',
        visitType: '',
        visitDate: '',
        visitTime: '',
        hoursSpent: '',
        purpose: '',
        visitStatus: 'Scheduled',
        notes: '',
        challenges: '',
    });
    const [photos, setPhotos] = useState<string[]>([]);

    // Fetch farmers
    const { data: summaryData } = useQuery({
        queryKey: ['agentDashboardSummary'],
        queryFn: async () => {
            const res = await api.get('/dashboard/summary');
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: open,
    });

    const farmersRaw = summaryData?.farmers || [];
    const effectiveRegion = agent?.region || "Ashanti Region";
    const farmers = farmersRaw.filter((f: any) => !effectiveRegion || f.region === effectiveRegion);
    const selectedFarmer = farmers.find((f: any) => (f._id || f.id) === formData.farmerId);

    useEffect(() => {
        if (open) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFormData(prev => ({
                ...prev,
                farmerId: farmer?._id || farmer?.id || prev.farmerId,
                visitDate: tomorrow.toISOString().split('T')[0],
                visitTime: '09:00',
            }));
        }
    }, [open, farmer]);

    const createVisitMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/scheduled-visits', data);
            return res.data;
        },
        onSuccess: async () => {
            await Swal.fire({
                icon: 'success',
                title: 'Visit Scheduled!',
                text: 'The field visit has been synced to the AgriLync system.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true,
            });
            queryClient.invalidateQueries({ queryKey: ['scheduledVisits'] });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            handleClose();
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to schedule visit');
        },
    });

    const handleClose = () => {
        setFormData({
            farmerId: '',
            visitType: '',
            visitDate: '',
            visitTime: '',
            hoursSpent: '',
            purpose: '',
            visitStatus: 'Scheduled',
            notes: '',
            challenges: '',
        });
        setPhotos([]);
        onOpenChange(false);
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => setPhotos(prev => [...prev, reader.result as string]);
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = () => {
        if (!formData.farmerId) { toast.error('Please select a grower'); return; }
        if (!formData.visitDate || !formData.visitTime) { toast.error('Please set the visit date and time'); return; }
        if (!formData.purpose) { toast.error('Please select the visit purpose'); return; }

        createVisitMutation.mutate({
            farmerIds: [formData.farmerId],
            visitType: formData.visitType || 'farm-visit',
            scheduledDate: new Date(formData.visitDate).toISOString(),
            scheduledTime: formData.visitTime,
            purpose: formData.purpose,
            notes: formData.notes || undefined,
        });
    };

    const inputCls = `h-12 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 text-sm font-semibold text-gray-800 dark:text-white outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] placeholder:text-gray-400 transition-all`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden flex flex-col h-[75vh] border-none bg-white dark:bg-[#002f37] rounded-2xl shadow-2xl">

                {/* Header — dark green, same as Log Field Visit */}
                <div className="relative bg-[#065f46] px-7 py-5 flex items-start justify-between shrink-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-white/20">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-black text-white tracking-tight">Schedule Visit</h2>
                        </div>
                        <p className="text-white/60 text-[11px] font-semibold pl-1">Record your planned field deployment for grower oversight</p>
                    </div>
                    <button onClick={handleClose} className="relative z-10 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all mt-0.5">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

                    {/* Grower Name & Lync ID inline */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Grower Name *</Label>
                            <Select value={formData.farmerId} onValueChange={v => setFormData(p => ({ ...p, farmerId: v }))}>
                                <SelectTrigger className="h-12 rounded-xl border-2 border-[#065f46]/40 bg-white dark:bg-white/5 text-sm font-semibold text-gray-800 dark:text-white focus:border-[#065f46]">
                                    <SelectValue placeholder="Select a registered farmer" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl z-[2000]">
                                    {farmers.length === 0
                                        ? <SelectItem value="_none" disabled>No farmers available</SelectItem>
                                        : farmers.map((f: any) => (
                                            <SelectItem key={f._id || f.id} value={f._id || f.id}>{f.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Lync ID Identification</Label>
                            <input
                                readOnly
                                value={selectedFarmer ? (selectedFarmer._id || selectedFarmer.id) : ''}
                                placeholder="Select a registered grower..."
                                className={`${inputCls} cursor-default text-gray-400 bg-gray-50 dark:bg-white/[0.03]`}
                            />
                        </div>
                    </div>

                    {/* Visit Date | Time | Hours */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Visit Date *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    className={`${inputCls} pl-9`}
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.visitDate}
                                    onChange={e => setFormData(p => ({ ...p, visitDate: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Time *</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="time"
                                    className={`${inputCls} pl-9`}
                                    value={formData.visitTime}
                                    onChange={e => setFormData(p => ({ ...p, visitTime: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Hours Spent *</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="number"
                                    min="0.5" max="12" step="0.5"
                                    placeholder="1"
                                    className={`${inputCls} pl-9`}
                                    value={formData.hoursSpent}
                                    onChange={e => setFormData(p => ({ ...p, hoursSpent: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Purpose | Visit Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Primary Inspection Purpose *</Label>
                            <Select value={formData.purpose} onValueChange={v => setFormData(p => ({ ...p, purpose: v }))}>
                                <SelectTrigger className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-gray-800 dark:text-white">
                                    <SelectValue placeholder="Select purpose of this visit" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl z-[2000]">
                                    <SelectItem value="Routine Inspection">Routine Inspection</SelectItem>
                                    <SelectItem value="Crop Assessment">Crop Assessment</SelectItem>
                                    <SelectItem value="Pest & Disease Check">Pest & Disease Check</SelectItem>
                                    <SelectItem value="Soil Testing">Soil Testing</SelectItem>
                                    <SelectItem value="Harvest Readiness">Harvest Readiness</SelectItem>
                                    <SelectItem value="Investment Follow-up">Investment Follow-up</SelectItem>
                                    <SelectItem value="Training Delivery">Training Delivery</SelectItem>
                                    <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Visit Status *</Label>
                            <Select value={formData.visitStatus} onValueChange={v => setFormData(p => ({ ...p, visitStatus: v }))}>
                                <SelectTrigger className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-gray-800 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl z-[2000]">
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Observation Details */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Observation Details & Recommendations *</Label>
                        <Textarea
                            placeholder="Log your observations, any issues identified, and recommended actions for the farmer..."
                            className="min-h-[110px] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-gray-800 dark:text-white resize-none placeholder:text-gray-400 focus:border-emerald-500"
                            value={formData.notes}
                            onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                        />
                    </div>

                    {/* Challenges */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Challenges Encountered (Optional)</Label>
                        <Textarea
                            placeholder="Document any difficulties reaching the location, weather conditions, or other challenges during the visit..."
                            className="min-h-[90px] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-gray-800 dark:text-white resize-none placeholder:text-gray-400 focus:border-emerald-500"
                            value={formData.challenges}
                            onChange={e => setFormData(p => ({ ...p, challenges: e.target.value }))}
                        />
                    </div>

                    {/* Visit Photos */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Visit Photos (Optional)</Label>
                        <div className="flex flex-wrap gap-3">
                            {photos.map((src, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group">
                                    <img src={src} alt="Visit photo" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setPhotos(pp => pp.filter((_, idx) => idx !== i))}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-[#065f46] hover:bg-[#065f46]/5 dark:hover:bg-[#065f46]/5 transition-all group"
                            >
                                <Camera className="h-5 w-5 text-gray-400 group-hover:text-[#065f46] transition-colors" />
                                <span className="text-[9px] font-bold text-gray-400 group-hover:text-[#065f46]">Add Photo</span>
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-7 py-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-[#0b2528]/60">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold text-[11px] uppercase tracking-widest h-11 px-5 rounded-xl"
                    >
                        <X className="h-3.5 w-3.5 mr-2" /> Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createVisitMutation.isPending}
                        className="bg-[#065f46] hover:bg-[#065f46]/90 text-white h-11 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#065f46]/20 border-none"
                    >
                        {createVisitMutation.isPending
                            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Scheduling...</>
                            : <><Send className="h-4 w-4 mr-2" />Save & Schedule</>
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleVisitModal;
