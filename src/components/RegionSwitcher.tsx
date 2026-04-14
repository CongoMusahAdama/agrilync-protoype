import React, { useState } from 'react';
import { ChevronDown, Check, Globe, ArrowRight, MapPin } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';

interface RegionSwitcherProps {
  className?: string;
}

const regions = [
  'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 
  'Greater Accra', 'Northern', 'North East', 'Oti', 
  'Savannah', 'Upper East', 'Upper West', 'Volta', 
  'Western', 'Western North', 'Ahafo'
];

const RegionSwitcher: React.FC<RegionSwitcherProps> = ({ className }) => {
  const { agent, updateAgent } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);
  const queryClient = useQueryClient();

  const handleRegionChange = async (newRegion: string) => {
    const assigned = (agent as any)?.assignedRegions || ['Ashanti', 'Bono', 'Northern'];
    
    if (!assigned.includes(newRegion)) {
      Swal.fire({
        title: '<span class="text-[#002f37] font-black uppercase text-xl">Access Denied</span>',
        html: `<p class="text-gray-500 font-bold text-sm leading-relaxed">You are not currently deployed to the <span class="text-[#065f46] font-black">${newRegion.toUpperCase()}</span> zone. Please contact your supervisor for deployment access.</p>`,
        icon: 'error',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#002f37',
        customClass: {
          container: 'rounded-[2rem]',
          popup: 'rounded-[2.5rem] p-8',
          confirmButton: 'rounded-xl px-10 py-3 font-black uppercase text-[11px] tracking-widest'
        }
      });
      return;
    }

    try {
      setIsSwitching(true);
      
      // Use updateAgent from context which handles headers and global state
      await updateAgent({ region: newRegion });
      
      // Invalidate all relevant queries to refresh dashboard data without a full reload
      await queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
      await queryClient.invalidateQueries({ queryKey: ['farmers'] });
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
      await queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
      
      setIsSwitching(false);
      toast.success(`Operations context shifted to ${newRegion}.`);
    } catch (err) {
      setIsSwitching(false);
      toast.error('Strategic switch failed.');
      console.error(err);
    }
  };

  const currentRegion = agent?.region || 'Ashanti';

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
        <p className="text-[9px] font-black text-[#7ede56]/60 uppercase tracking-[0.2em] animate-pulse">Switch Deployment Zone</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between gap-3 px-6 py-3 bg-[#f8fafc] hover:bg-[#7ede56]/10 border border-gray-100 hover:border-[#7ede56]/30 rounded-2xl transition-all duration-300 group/region outline-none min-w-[180px] shadow-sm active:scale-95">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#7ede56] shadow-[0_0_8px_rgba(126,222,86,0.8)]" />
                <span className="text-[13px] font-black text-[#002f37] uppercase tracking-wider">
                  {currentRegion.replace(' Region', '')}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover/region:text-[#7ede56] transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="center" 
            side="bottom"
            sideOffset={10}
            className="w-64 bg-white border-gray-100 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-3 animate-in zoom-in-95 duration-200"
          >
            <div className="px-4 py-3 mb-2 flex items-center gap-3 bg-gray-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <MapPin className="h-4 w-4 text-[#7ede56]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#002f37]/40 uppercase tracking-widest leading-none">Regional Hubs</span>
                <span className="text-[11px] font-bold text-[#002f37] mt-1">Select Operations Center</span>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-50 mx-2 mb-2" />
            <div className="max-h-[300px] overflow-y-auto px-1 space-y-1 custom-scrollbar">
              {regions.map((r) => (
                <DropdownMenuItem 
                  key={r} 
                  onClick={() => handleRegionChange(r)}
                  className={`rounded-[1rem] px-4 py-3.5 cursor-pointer hover:bg-[#7ede56]/5 focus:bg-[#7ede56]/5 transition-all text-[13px] font-bold flex items-center justify-between group/item ${currentRegion.includes(r) ? 'bg-[#7ede56]/10 text-[#065f46]' : 'text-gray-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`h-4 w-4 transition-transform group-hover/item:rotate-12 ${currentRegion.includes(r) ? 'text-[#065f46]' : 'text-gray-300'}`} />
                    <span>{r}</span>
                  </div>
                  {currentRegion.includes(r) ? (
                      <div className="h-6 w-6 rounded-full bg-[#7ede56] flex items-center justify-center shadow-lg shadow-[#7ede56]/20">
                        <Check className="h-3 w-3 text-white stroke-[4]" />
                      </div>
                  ) : (
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[#7ede56]" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
};

export default RegionSwitcher;
