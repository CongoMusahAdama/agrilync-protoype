import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
    User,
    Sprout,
    FileText,
    Upload,
    Plus,
    X,
    MapPin,
    Camera,
    ChevronRight,
    ChevronLeft,
    UserCheck,
    CheckCircle2
} from 'lucide-react';
import FarmMap from '@/components/FarmMap';

interface AddFarmerModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ trigger, open, onOpenChange }) => {
    const [step, setStep] = useState(1);
    const [farmType, setFarmType] = useState<string>('');

    const ghanaRegions = [
        'Ashanti', 'Eastern', 'Northern', 'Western', 'Volta', 'Central', 'Bono',
        'Greater Accra', 'Upper East', 'Upper West', 'Western North', 'Ahafo',
        'Bono East', 'Oti', 'Savannah', 'North East'
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-4xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#002f37] border-none overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl z-[150]">
                {/* Header with Progress Bar */}
                <div className="relative pt-6 px-6 pb-2 border-b dark:border-gray-800">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
                                <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold dark:text-white">Grower Onboarding</DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                                    Directly register a new farmer into the system.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <UserCheck className="h-4 w-4" />
                                Personal Details
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Full Name *</Label>
                                    <Input placeholder="Enter grower's full name" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Phone Number *</Label>
                                    <Input placeholder="+233 XX XXX XXXX" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Gender *</Label>
                                    <Select>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Date of Birth *</Label>
                                    <Input type="date" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Preferred Language</Label>
                                    <Select>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="English" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="twi">Twi</SelectItem>
                                            <SelectItem value="ewe">Ewe</SelectItem>
                                            <SelectItem value="dagbani">Dagbani</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Email Address (Optional)</Label>
                                    <Input type="email" placeholder="example@gmail.com" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Set Temporary Password *</Label>
                                    <Input type="password" placeholder="••••••••" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                    <p className="text-[10px] text-gray-400">Farmer will be prompted to change this on first login</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Farm Information */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <MapPin className="h-4 w-4" />
                                Farm & Location Info
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Region *</Label>
                                    <Select>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ghanaRegions.map(region => (
                                                <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">District / Community *</Label>
                                    <Input placeholder="Enter community name" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Farm Type *</Label>
                                    <Select onValueChange={setFarmType}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select farm type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="crop">Crop Farming</SelectItem>
                                            <SelectItem value="livestock">Livestock Farming</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Farm Size (Acres) *</Label>
                                    <Input type="number" placeholder="e.g. 5" className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500">Interactive Location Mapping</Label>
                                <div className="h-[200px] border rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                    {/* Map component placeholder or simple interactive area */}
                                    <div className="flex flex-col items-center gap-2">
                                        <MapPin className="h-8 w-8 text-emerald-500" />
                                        <span className="text-xs uppercase font-bold text-gray-500">Click to pin farm exact location</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents & Verification */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <FileText className="h-4 w-4" />
                                Documents & Final Review
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50 dark:bg-white/5">
                                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                                    <div className="text-sm font-bold dark:text-white uppercase tracking-tight">Upload National ID (Ghana Card)</div>
                                    <div className="text-xs text-gray-500 mt-1">Front and back photos required for verification</div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Agent Field Observations</Label>
                                    <Textarea placeholder="Enter any additional notes about the farm visit..." className="min-h-[100px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10" />
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                    <Checkbox id="terms" className="mt-1" />
                                    <Label htmlFor="terms" className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed cursor-pointer">
                                        I certify that I have verified the location and identity of this grower according to AgriLync's field protocols. All provided data is accurate to the best of my knowledge.
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="p-6 border-t dark:border-gray-800 bg-gray-50 dark:bg-[#0b2528] flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                        {step === 1 ? <X className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                        {step === 1 ? 'Cancel' : 'Previous'}
                    </Button>

                    <div className="flex items-center gap-2">
                        {step < 3 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/20"
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    // Simulation of success
                                    alert('Farmer Onboarded Successfully!');
                                    onOpenChange?.(false);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/20 animate-pulse"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Complete Registration
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFarmerModal;
