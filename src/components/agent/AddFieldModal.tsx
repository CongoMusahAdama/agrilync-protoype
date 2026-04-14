import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import FarmMap from '@/components/FarmMap';
import { 
    Sprout, X, MapPin, Activity, 
    ChevronRight, Loader2, Leaf, 
    CheckCircle2, Ruler, ClipboardList,
    History, Map 
} from 'lucide-react';
import Swal from 'sweetalert2';

interface FarmerData {
    _id?: string;
    id?: string;
    name?: string;
}

interface AddFieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: FarmerData | null;
    onSuccess?: () => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ open, onOpenChange, farmer, onSuccess }) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        size: '',
        status: 'Pending',
        soilType: '',
        previousCrop: '',
        fieldNotes: '',
        farmingMethod: 'Conventional'
    });

    const [farmLatitude, setFarmLatitude] = useState(0);
    const [farmLongitude, setFarmLongitude] = useState(0);
    const [measuredArea, setMeasuredArea] = useState(0);
    const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (open) {
            setStep(1);
            setFormData({
                name: '',
                crop: '',
                size: '',
                status: 'Pending',
                soilType: '',
                previousCrop: '',
                fieldNotes: '',
                farmingMethod: 'Conventional'
            });
            setMeasuredArea(0);
            
            // Try to get current location for initial map centering
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setFarmLatitude(pos.coords.latitude);
                        setFarmLongitude(pos.coords.longitude);
                        setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    },
                    (err) => console.log('Location error:', err)
                );
            }
        }
    }, [open]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addFieldMutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            return api.post('/farms', payload);
        },
        onSuccess: async () => {
            await Swal.fire({
                icon: 'success',
                title: 'Operation Registered',
                html: `<p style="font-size:18px;color:#065f46;font-weight:800;">New field asset successfully mapped!</p>`,
                confirmButtonText: 'Great',
                confirmButtonColor: '#065f46',
                timer: 2500,
                timerProgressBar: true
            });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            queryClient.invalidateQueries({ queryKey: ['farms'] });
            onSuccess?.();
            onOpenChange(false);
        },
        onError: (error: { response?: { data?: { msg?: string } } }) => {
            Swal.fire({
                icon: 'error',
                title: 'Mapping Failed',
                text: error.response?.data?.msg || 'Failed to add field asset to the registry.',
                confirmButtonColor: '#065f46'
            });
        }
    });

    const handleSubmit = () => {
        if (!formData.name) {
            Swal.fire({
                icon: 'warning',
                title: 'Identification Required',
                text: 'Please provide a unique name for this field operation.',
                confirmButtonColor: '#065f46'
            });
            return;
        }
        if (!formData.crop) {
            Swal.fire({
                icon: 'warning',
                title: 'Asset Metadata Required',
                text: 'Please specify the primary crop for this field.',
                confirmButtonColor: '#065f46'
            });
            return;
        }
        if (measuredArea === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Geospatial Data Missing',
                text: 'Please map the field perimeter on the satellite interface.',
                confirmButtonColor: '#065f46'
            });
            return;
        }

        const payload = {
            farmer: farmer?._id || farmer?.id,
            name: formData.name,
            crop: formData.crop,
            size: measuredArea.toFixed(2),
            status: formData.status,
            location: {
                type: 'Point',
                coordinates: [farmLongitude, farmLatitude]
            },
            soilType: formData.soilType,
            previousCrop: formData.previousCrop,
            fieldNotes: formData.fieldNotes,
            farmingMethod: formData.farmingMethod,
            measuredArea: measuredArea
        };

        addFieldMutation.mutate(payload);
    };

    const steps = [
        { id: 1, label: 'Geography', sub: 'Perimeter & Mapping', icon: MapPin },
        { id: 2, label: 'Analytics', sub: 'Crop & Soil Metadata', icon: ClipboardList }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] md:h-[80vh] p-0 overflow-hidden border-none bg-[#f8fafc] shadow-2xl flex flex-col [&>button]:hidden">
                <div className="sr-only">
                    <DialogTitle>Add New Field Asset</DialogTitle>
                    <DialogDescription>Register a new farming operation for {farmer?.name}</DialogDescription>
                </div>

                {/* Header — Dark & Techy */}
                <div className="bg-[#002f37] text-white px-6 py-5 flex items-center justify-between shrink-0 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#7ede56]/10 flex items-center justify-center border border-[#7ede56]/20">
                            <Sprout className="h-6 w-6 text-[#7ede56]" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black tracking-tight uppercase">Register Field Asset</h2>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mt-0.5">Grower: {farmer?.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="h-9 w-9 rounded-xl hover:bg-red-500/20 text-white/60 flex items-center justify-center transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Step Indicators */}
                <div className="bg-white border-b border-gray-100 flex items-center gap-4 px-6 py-3 shrink-0 scrollbar-hide overflow-x-auto">
                    {steps.map((s, idx) => (
                        <div key={s.id} className="flex items-center gap-2 min-w-max">
                            <div 
                                className={`h-8 px-4 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                    step === s.id ? 'bg-[#002f37] text-white shadow-md' : 'bg-gray-100 text-gray-400'
                                }`}
                                onClick={() => setStep(s.id)}
                            >
                                <s.icon className={`h-3 w-3 ${step === s.id ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                                {s.label}
                            </div>
                            {idx < steps.length - 1 && <ChevronRight className="h-3 w-3 text-gray-200" />}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <ScrollArea className="flex-1 bg-gray-50/50">
                    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
                        
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Operation Name *</Label>
                                        <Input 
                                            placeholder="e.g. North Ridge Plantation" 
                                            className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm focus:ring-2 focus:ring-[#7ede56]/20"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Primary Asset Type</Label>
                                        <Select value={formData.farmingMethod} onValueChange={(v) => handleInputChange('farmingMethod', v)}>
                                            <SelectTrigger className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                <SelectItem value="Conventional" className="py-3 font-bold">Conventional</SelectItem>
                                                <SelectItem value="Organic" className="py-3 font-bold">Organic</SelectItem>
                                                <SelectItem value="Hydroponic" className="py-3 font-bold">Hydroponic</SelectItem>
                                                <SelectItem value="Greenhouse" className="py-3 font-bold">Greenhouse</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Boundary Mapping & Geo-Capture *</Label>
                                    <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl h-[350px]">
                                        <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-[#002f37] flex items-center justify-center text-[#7ede56]">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">GPS LOCK ACTIVE</p>
                                                <p className="text-xs font-black text-[#002f37]">Tap to define corners</p>
                                            </div>
                                        </div>
                                        <FarmMap
                                            latitude={farmLatitude}
                                            longitude={farmLongitude}
                                            onLocationChange={(lat, lng) => { setFarmLatitude(lat); setFarmLongitude(lng); }}
                                            onAreaChange={(area) => setMeasuredArea(area)}
                                            farmSize={measuredArea}
                                        />
                                        <div className="absolute bottom-4 right-4 z-10 bg-[#002f37] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                                            <div className="text-right border-r border-white/10 pr-4">
                                                <p className="text-[8px] font-black text-[#7ede56] uppercase tracking-widest">Calculated Area</p>
                                                <p className="text-xl font-black">{measuredArea.toFixed(2)} <span className="text-[10px] opacity-40 font-bold">acres</span></p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-[#7ede56]/10">
                                                <Ruler className="h-5 w-5 text-[#7ede56]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Target Crop *</Label>
                                        <Select value={formData.crop} onValueChange={(v) => handleInputChange('crop', v)}>
                                            <SelectTrigger className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm">
                                                <SelectValue placeholder="Identify crop type..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {['Cocoa', 'Maize', 'Rice', 'Cashew', 'Cassava', 'Yam', 'Oil Palm', 'Vegetables'].map(c => (
                                                    <SelectItem key={c} value={c} className="py-3 font-bold">{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Soil Taxonomy</Label>
                                        <Input 
                                            placeholder="e.g. Loamy Silt" 
                                            className="h-14 bg-white border-none rounded-2xl font-bold shadow-sm"
                                            value={formData.soilType}
                                            onChange={(e) => handleInputChange('soilType', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Historical Context</Label>
                                        <div className="relative group">
                                            <History className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input 
                                                placeholder="Previous crop harvested" 
                                                className="h-14 pl-11 bg-white border-none rounded-2xl font-bold shadow-sm"
                                                value={formData.previousCrop}
                                                onChange={(e) => handleInputChange('previousCrop', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Initial Status</Label>
                                        <div className="flex gap-2">
                                            {['Pending', 'Verified'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleInputChange('status', s)}
                                                    className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                        formData.status === s ? 'bg-[#002f37] text-white shadow-lg' : 'bg-white text-gray-400'
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Diagnostic Field Notes</Label>
                                    <Textarea 
                                        placeholder="Record slope details, pest pressures, or irrigation access..."
                                        className="min-h-[140px] bg-white border-none rounded-3xl p-6 font-bold shadow-sm resize-none"
                                        value={formData.fieldNotes}
                                        onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                    />
                                </div>

                                <div className="bg-[#7ede56]/5 border border-[#7ede56]/20 p-6 rounded-[2rem] flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#7ede56]/20 flex items-center justify-center text-[#065f46]">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#065f46] uppercase tracking-widest mb-1">Impact Protocol</h4>
                                        <p className="text-[10px] font-bold text-[#065f46]/70 leading-relaxed uppercase">
                                            THIS ASSET WILL BE QUEUED FOR REMOTE SENSING VERIFICATION. ENSURE COORDINATES ARE PRECISE WITHIN 5 METERS FOR OPTIMAL INVESTOR MATCHING.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Controls */}
                <div className="px-6 py-6 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                    <Button 
                        variant="ghost" 
                        onClick={() => step === 1 ? onOpenChange(false) : setStep(1)}
                        className="text-gray-400 font-black text-[10px] uppercase tracking-widest h-12 px-6 rounded-2xl hover:bg-gray-100"
                    >
                        {step === 1 ? <><X className="mr-2 h-4 w-4" /> Cancel</> : 'Previous Phase'}
                    </Button>
                    
                    {step === 1 ? (
                        <Button 
                            onClick={() => setStep(2)}
                            className="bg-[#002f37] hover:bg-[#002f37]/90 text-white font-black text-[10px] uppercase tracking-widest h-12 px-8 rounded-2xl shadow-xl shadow-[#002f37]/20 border-none transition-all active:scale-95"
                        >
                            Configure Asset <ChevronRight className="ml-2 h-4 w-4 text-[#7ede56]" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit}
                            disabled={addFieldMutation.isPending}
                            className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[10px] uppercase tracking-widest h-12 px-10 rounded-2xl shadow-xl shadow-emerald-900/20 border-none transition-all active:scale-95"
                        >
                            {addFieldMutation.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing Registry...</>
                            ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4 text-[#7ede56]" /> Submit Asset Payload</>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddFieldModal;
