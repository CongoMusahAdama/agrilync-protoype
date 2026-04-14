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
import { MapPin, ShieldCheck, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (region: string) => void;
  assignedRegion: string; 
}

const regions = [
  { value: 'Ashanti Region', label: 'Ashanti', desc: 'Central Agricultural Hub' },
  { value: 'Greater Accra Region', label: 'Greater Accra', desc: 'Capital Command Center' },
  { value: 'Eastern Region', label: 'Eastern', desc: 'Resource & Field Operations' },
  { value: 'Northern Region', label: 'Northern', desc: 'Savannah Data Terminal' },
  { value: 'Western Region', label: 'Western', desc: 'Coastal Supply Management' },
  { value: 'Volta Region', label: 'Volta', desc: 'Lakeside Monitoring Zone' },
  { value: 'Central Region', label: 'Central', desc: 'Regional Logistics Center' },
  { value: 'Bono Region', label: 'Bono', desc: 'Brong-Ahafo Field Office' },
  { value: 'Upper East Region', label: 'Upper East', desc: 'Arid Zone Cultivation' },
  { value: 'Upper West Region', label: 'Upper West', desc: 'Savannah Perimeter' }
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

    setTimeout(() => {
        const normalizedSelected = selectedRegion.toLowerCase().replace(' region', '').trim();
        const normalizedAssigned = (assignedRegion || '').toLowerCase().replace(' region', '').trim();
        
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
      <DialogContent className="sm:max-w-[480px] w-full bg-white border-none shadow-2xl rounded-[1.5rem] overflow-hidden p-0 animate-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onClose}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#002f37] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> BACK
            </button>
            <div className="flex gap-1.5">
              <div className="h-1 w-8 rounded-full bg-[#002f37]" />
              <div className="h-1 w-8 rounded-full bg-[#002f37]" />
              <div className="h-1 w-8 rounded-full bg-gray-100" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-[#002f37] mb-2 tracking-tight">
            Which region are you <br />operating from?
          </h2>
          <p className="text-[13px] font-medium text-gray-400 leading-relaxed max-w-[320px]">
             Specify your assigned jurisdiction. This helps us sync you with the right field logs.
          </p>
        </div>

        {/* Scrollable Gallery of Regions */}
        <div className="px-8 max-h-[400px] overflow-y-auto space-y-3 py-2 scrollbar-hide">
          {errorHeader && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
              <p className="text-[11px] font-bold text-rose-600">{errorHeader}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {regions.map((region) => {
              const isSelected = selectedRegion === region.value;
              return (
                <div 
                  key={region.value}
                  onClick={() => setSelectedRegion(region.value)}
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2
                    ${isSelected 
                      ? 'bg-emerald-50/50 border-[#7ede56] shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`
                    h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isSelected ? 'bg-white text-[#065f46] shadow-sm' : 'bg-gray-50 text-gray-400'}
                  `}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[13px] font-black uppercase tracking-tight ${isSelected ? 'text-[#002f37]' : 'text-gray-600'}`}>
                      {region.label}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                      {region.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-[#7ede56] animate-in zoom-in" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Section */}
        <div className="p-8 pt-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-6">
             <ShieldCheck className="h-4 w-4 text-[#065f46] mt-0.5" />
             <p className="text-[10px] font-bold text-gray-500 uppercase leading-snug tracking-wider">
               ACCESS IS RESTRICTED TO YOUR OFFICIALLY ASSIGNED REGION. SELECTIONS ARE AUDITED FOR COMPLIANCE.
             </p>
          </div>

          <Button
            onClick={handleValidate}
            disabled={isValidating || !selectedRegion}
            className="w-full h-16 rounded-2xl bg-[#002f37] hover:bg-[#001e23] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#002f37]/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {isValidating ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify & Proceed'
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default RegionSelectionModal;
