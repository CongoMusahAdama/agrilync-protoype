import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RegionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (region: string) => void;
  assignedRegion: string; // The region the agent is actually assigned to in DB
}

const regions = [
  { value: 'Ashanti Region', label: 'Ashanti' },
  { value: 'Eastern Region', label: 'Eastern' },
  { value: 'Northern Region', label: 'Northern' },
  { value: 'Western Region', label: 'Western' },
  { value: 'Volta Region', label: 'Volta' },
  { value: 'Central Region', label: 'Central' },
  { value: 'Bono Region', label: 'Bono' },
  { value: 'Greater Accra Region', label: 'Greater Accra' },
  { value: 'Upper East Region', label: 'Upper East' },
  { value: 'Upper West Region', label: 'Upper West' }
];

const RegionSelectionModal: React.FC<RegionSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  assignedRegion 
}) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const handleValidate = () => {
    if (!selectedRegion) {
      toast.error('Please select an operational region');
      return;
    }

    setIsValidating(true);

    // Simulate a brief validation delay for professional feel
    setTimeout(() => {
        const normalizedSelected = selectedRegion.toLowerCase().replace(' region', '').trim();
        const normalizedAssigned = (assignedRegion || '').toLowerCase().replace(' region', '').trim();
        
        // Strict but flexible matching to avoid string suffix issues
        if (normalizedSelected === normalizedAssigned || normalizedAssigned.includes(normalizedSelected)) {
          toast.success('Region Verified Successfully');
          setErrorHeader(null);
          onSuccess(selectedRegion);
        } else {
          setErrorHeader(`Access Denied: You are not assigned to the ${selectedRegion} region.`);
          toast.error(`Access Denied: Not assigned to ${selectedRegion}`);
        }
        setIsValidating(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] w-[95vw] bg-white border-none shadow-3xl rounded-[2.5rem] overflow-hidden p-0 animate-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-[#002f37] via-[#001e23] to-[#000d10] p-8 pb-10 text-white flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle background texture or glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-[#7ede56]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="h-20 w-20 bg-white/5 backdrop-blur-md rounded-[1.75rem] flex items-center justify-center mb-6 shadow-2xl relative border border-white/10 group transition-all duration-500 hover:scale-110">
            <div className="absolute inset-1.5 border border-white/5 rounded-[1.25rem] opacity-50" />
            <MapPin className="h-8 w-8 text-[#7ede56] filter drop-shadow-[0_0_15px_rgba(126,222,86,0.5)] transition-all duration-500 group-hover:rotate-12" />
          </div>
          
          <DialogTitle className="text-[28px] font-black mb-3 tracking-[-0.03em] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Regional <span className="text-[#7ede56]">Verification</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-[13px] font-medium max-w-[400px] leading-relaxed opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
            Confirm your assigned jurisdiction to access the regional command center.
          </DialogDescription>
        </div>

        <div className="p-8 pb-4 space-y-6">
          {errorHeader && (
            <div className="bg-red-50 border-2 border-red-100 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-[13px] font-black text-red-900 leading-tight">Verification Failed</h4>
                <p className="text-[11px] font-bold text-red-700/80 mt-0.5">{errorHeader}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <Label htmlFor="region" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">
                  Official Jurisdiction
              </Label>
              <Select onValueChange={setSelectedRegion} value={selectedRegion}>
                <SelectTrigger className="h-16 rounded-2xl border-none bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-[#7ede56] text-lg font-bold text-[#002f37] px-6 shadow-inner transition-all hover:bg-gray-100">
                  <SelectValue placeholder="Identify your region..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[10001] rounded-[1.5rem] p-2 overflow-hidden">
                  {regions.map((region) => (
                    <SelectItem 
                      key={region.value} 
                      value={region.value}
                      className="h-14 text-[#002f37] font-bold text-base rounded-xl transition-all data-[highlighted]:bg-emerald-50 data-[highlighted]:text-[#065f46] px-4 my-0.5"
                    >
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex gap-4 items-center h-16 mt-auto">
              <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="h-4 w-4 text-[#065f46]" />
              </div>
              <p className="text-[11px] font-semibold text-emerald-800 leading-tight">
                  Access is restricted to your officially assigned region. Selections are audited.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-2 flex flex-col sm:flex-row gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-none w-40 h-16 rounded-[1.25rem] text-gray-400 hover:text-gray-900 font-bold hover:bg-gray-50 transition-all text-[11px] tracking-widest"
          >
            EXIT SESSION
          </Button>
          <Button
            onClick={handleValidate}
            disabled={isValidating}
            className="flex-1 h-16 rounded-[1.25rem] bg-[#002f37] hover:bg-[#001e23] text-white font-black shadow-[0_10px_30px_rgba(0,47,55,0.2)] flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {isValidating ? (
              <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <ShieldCheck className="h-5 w-5 text-[#7ede56]" />
            )}
            <span className="text-sm">VERIFY & PROCEED</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegionSelectionModal;
