import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
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
    Activity,
    UserCheck,
    Briefcase
} from 'lucide-react';

interface ScheduleVisitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    farmer?: { _id?: string; id?: string; name?: string };
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ open, onOpenChange, onSuccess, farmer }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sendSmsNotification = async (count: number) => {
        await Swal.fire({
            title: 'SMS Dispatched',
            html: `<div class="text-left"><p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Automated Protocol</p><p class="text-sm text-gray-700">SMS notification sent to <b>${count}</b> farmer(s) regarding the scheduled field visit.</p></div>`,
            icon: 'info',
            toast: true, 
            position: 'top-end',
            timer: 4000,
            showConfirmButton: false,
            background: '#fff',
            color: '#002f37',
            iconColor: '#7ede56',
            timerProgressBar: true
        });
    };

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

    // Fetch professional directory of saved farmers
    const { data: farmersBatch } = useQuery({
        queryKey: ['agentFarmersDirectory'],
        queryFn: async () => {
            const res = await api.get('/farmers?limit=1000');
            return res.data.data || [];
        },
        staleTime: 5 * 60 * 1000,
        enabled: open,
    });

    const farmers = (farmersBatch || []) as Array<{ _id?: string; id?: string; name?: string; ghanaCardNumber?: string }>;
    const selectedFarmer = farmers.find(f => (f._id || f.id) === formData.farmerId);

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
        mutationFn: async (data: Record<string, unknown>) => {
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
            sendSmsNotification(1);
            queryClient.invalidateQueries({ queryKey: ['scheduledVisits'] });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            handleClose();
            onSuccess?.();
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            Swal.fire({
                icon: 'error',
                title: 'Scheduling Failed',
                text: error.response?.data?.message || 'Failed to sync field visit with the AgriLync system.',
                confirmButtonColor: '#065f46'
            });
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
        if (!formData.farmerId) { 
            Swal.fire({ icon: 'warning', title: 'Grower Required', text: 'Please select a target grower for this visit.', confirmButtonColor: '#065f46' });
            return; 
        }
        if (!formData.visitDate || !formData.visitTime) { 
            Swal.fire({ icon: 'warning', title: 'Schedule Required', text: 'Please set both a visit date and time.', confirmButtonColor: '#065f46' });
            return; 
        }
        if (!formData.purpose) { 
            Swal.fire({ icon: 'warning', title: 'Purpose Required', text: 'Please select the primary objective of this visit.', confirmButtonColor: '#065f46' });
            return; 
        }

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
                <DialogTitle className="sr-only">Schedule Field Visit</DialogTitle>
                <DialogDescription className="sr-only">Log a new field visit for inspection or support.</DialogDescription>

                {/* Header — dark green, same as Log Field Visit */}
                <div className="relative bg-[#065f46] px-6 py-5 flex items-start justify-between shrink-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                    <div className="relative z-10 w-full pr-10">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white tracking-tight uppercase">Field Visit Log</h2>
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Grower Compliance & Support</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose} 
                        className="absolute right-6 top-6 z-10 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-all backdrop-blur-md border border-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

                    {/* Grower Name & Lync ID inline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 transition-all focus-within:border-emerald-500/50">
                            <div className="flex items-center gap-2 mb-1">
                                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 dark:text-gray-400">Target Grower *</Label>
                            </div>
                            <Select value={formData.farmerId} onValueChange={v => setFormData(p => ({ ...p, farmerId: v }))}>
                                <SelectTrigger className="h-10 border-none bg-transparent p-0 text-sm font-black text-gray-800 dark:text-white shadow-none focus:ring-0">
                                    <SelectValue placeholder="Identify farmer..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl z-[2000] p-1">
                                    {farmers.length === 0
                                        ? <SelectItem value="_none" disabled>No farmers found</SelectItem>
                                        : farmers.map((f) => (
                                            <SelectItem key={f._id || f.id} value={(f._id || f.id) as string} className="rounded-xl py-3 font-bold hover:bg-emerald-50">{f.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#065f46]/40 dark:text-gray-400">Operation Lync ID</Label>
                            </div>
                            <p className="text-sm font-black text-[#065f46] tracking-tight truncate">
                                {selectedFarmer ? (selectedFarmer.id || `LYG-${selectedFarmer.ghanaCardNumber || String(selectedFarmer._id).replace(/\D/g, '').padEnd(7, '0').slice(0, 7)}`) : 'No farmer selected'}
                            </p>
                        </div>
                    </div>

                    {/* Visit Date | Time | Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Visit Date *</Label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 transition-transform group-focus-within:scale-110" />
                                <input
                                    type="date"
                                    className={`${inputCls} pl-11 border-gray-100 hover:border-emerald-200 focus:border-emerald-500`}
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.visitDate}
                                    onChange={e => setFormData(p => ({ ...p, visitDate: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Start Time *</Label>
                            <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 transition-transform group-focus-within:scale-110" />
                                <input
                                    type="time"
                                    className={`${inputCls} pl-11 border-gray-100 hover:border-emerald-200 focus:border-emerald-500`}
                                    value={formData.visitTime}
                                    onChange={e => setFormData(p => ({ ...p, visitTime: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Total Hours *</Label>
                            <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 transition-transform group-focus-within:scale-110" />
                                <input
                                    type="number"
                                    min="0.5" max="12" step="0.5"
                                    placeholder="e.g. 2.5"
                                    className={`${inputCls} pl-11 border-gray-100 hover:border-emerald-200 focus:border-emerald-500`}
                                    value={formData.hoursSpent}
                                    onChange={e => setFormData(p => ({ ...p, hoursSpent: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Purpose | Visit Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Primary Inspection Purpose *</Label>
                            <Select value={formData.purpose} onValueChange={v => setFormData(p => ({ ...p, purpose: v }))}>
                                <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-white dark:bg-white/5 text-sm font-black text-emerald-900 focus:border-emerald-500 transition-all">
                                    <SelectValue placeholder="Mission objective..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl z-[2000] p-1">
                                    <SelectItem value="Routine Inspection" className="rounded-xl py-3 font-bold">Routine Inspection</SelectItem>
                                    <SelectItem value="Crop Assessment" className="rounded-xl py-3 font-bold">Crop Assessment</SelectItem>
                                    <SelectItem value="Pest & Disease Check" className="rounded-xl py-3 font-bold">Pest & Disease Check</SelectItem>
                                    <SelectItem value="Soil Testing" className="rounded-xl py-3 font-bold">Soil Testing</SelectItem>
                                    <SelectItem value="Harvest Readiness" className="rounded-xl py-3 font-bold">Harvest Readiness</SelectItem>
                                    <SelectItem value="Investment Follow-up" className="rounded-xl py-3 font-bold">Investment Follow-up</SelectItem>
                                    <SelectItem value="Training Delivery" className="rounded-xl py-3 font-bold">Training Delivery</SelectItem>
                                    <SelectItem value="Community Outreach" className="rounded-xl py-3 font-bold">Community Outreach</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Operational State *</Label>
                            <Select value={formData.visitStatus} onValueChange={v => setFormData(p => ({ ...p, visitStatus: v }))}>
                                <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-white dark:bg-white/5 text-sm font-black text-emerald-900 focus:border-emerald-500 transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl z-[2000] p-1">
                                    <SelectItem value="Scheduled" className="rounded-xl py-3 font-bold">Scheduled (Future)</SelectItem>
                                    <SelectItem value="Completed" className="rounded-xl py-3 font-bold">Completed (Historical)</SelectItem>
                                    <SelectItem value="Cancelled" className="rounded-xl py-3 font-bold text-red-500">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Observation Details */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Detailed Findings & Recommendations *</Label>
                        <Textarea
                            placeholder="Identify crop health, farmer engagement, and corrective measures..."
                            className="min-h-[120px] rounded-2xl border-gray-100 bg-white dark:bg-white/5 text-sm font-bold text-gray-800 dark:text-white resize-none shadow-sm focus:border-emerald-500 p-4 transition-all"
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
                        className="bg-[#065f46] hover:bg-[#065f46]/90 text-white h-12 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 border-none transition-all active:scale-95"
                    >
                        {createVisitMutation.isPending
                            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Syncing Log...</>
                            : <><Send className="h-4 w-4 mr-2" />Finalize Visit Log</>
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleVisitModal;
