import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, ShieldCheck, ChevronDown, Check, Globe, ArrowRight } from 'lucide-react';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { getGrowerProfile } from '@/utils/authToken';
import { useGrowerOptional } from '@/contexts/GrowerContext';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import RegionSwitcher from './RegionSwitcher';

interface SidebarProfileCardProps {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  darkMode: boolean;
  userType?: string;
}

interface ProfileData {
  name: string;
  location: string;
  id?: string | null;
  title?: string;
  avatar?: string;
  email?: string;
}

const SidebarProfileCard: React.FC<SidebarProfileCardProps> = ({ sidebarCollapsed, isMobile, userType }) => {
  const navigate = useNavigate();
  const { agent } = useAuth();
  const growerCtx = useGrowerOptional();
  const isGrowerView = userType === 'grower';
  const grower = isGrowerView ? growerCtx?.grower ?? getGrowerProfile() : null;

  const isSuperAdmin = userType === 'super-admin';
  const isLoading = isGrowerView ? false : !agent;

  const a = agent as any;
  const profile: ProfileData = isGrowerView
    ? {
        name: grower?.name || 'Lync Grower',
        location:
          [grower?.district, grower?.region].filter(Boolean).join(', ') ||
          grower?.region ||
          'Ghana',
        id: grower?.lyncId || null,
        title: 'LYNC GROWER',
        avatar: grower?.profilePicture ? resolvePublicAssetUrl(grower.profilePicture) : '',
        email: grower?.email || grower?.contact || '',
      }
    : {
        name: a?.name || 'User Profile',
        location: a?.region || a?.district || 'Operational Hub',
        id: a?.agentId || a?.farmerId || a?.id?.substring(0, 8) || null,
        title:
          a?.role?.replace('_', ' ').replace('-', ' ').toUpperCase() ||
          userType?.toUpperCase() ||
          'MEMBER',
        avatar: a?.avatar || a?.profilePicture || '',
        email: a?.email || '',
      };

  const initials = profile.name
    ? profile.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '';

  const goToGrowerProfile = () => navigate(GROWER_ROUTES.account);

  /* ── Collapsed ── */
  if (sidebarCollapsed && !isMobile) {
    return (
      <div className={`flex justify-center py-6 border-b ${isGrowerView ? 'border-white/25 bg-white/10' : 'border-white/5 bg-black/10'}`}>
        <button
          type="button"
          onClick={isGrowerView ? goToGrowerProfile : undefined}
          className={`relative group ${isGrowerView ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={isGrowerView ? 'View profile' : undefined}
        >
          <Avatar className={`h-12 w-12 ring-2 shadow-lg transition-all duration-300 group-hover:scale-105 ${
            isGrowerView ? 'ring-white/50 group-hover:ring-white' : 'ring-[#7ede56]/50 group-hover:ring-[#7ede56]'
          }`}>
            {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />}
            <AvatarFallback className="bg-white text-[#002f37] font-bold text-sm">
              {isLoading ? '...' : initials}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-white border-2 shadow-sm ${
            isGrowerView ? 'border-[#7ede56]' : 'border-[#002f37]'
          }`} />
        </button>
      </div>
    );
  }

  /* ── Expanded ── */
  return (
    <div
      className={`mx-4 mt-2 mb-2 p-0 rounded-t-[2.5rem] rounded-b-2xl transition-all duration-500 overflow-hidden group ${
        isGrowerView
          ? 'bg-white/15 border border-white/30 backdrop-blur-sm shadow-sm'
          : 'bg-[#002f37]'
      }`}
    >
      <div className="pt-4 pb-4 px-6 flex flex-col items-center text-center">
        {/* Centered Avatar */}
        <div className="relative mb-3">
          {!isGrowerView && (
            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
          )}
          {isGrowerView && (
            <div className="absolute inset-0 bg-white/25 blur-md rounded-full group-hover:bg-white/35 transition-all duration-500" />
          )}
          <Avatar
            className={`h-20 w-20 rounded-full border-2 shadow-2xl transition-all duration-500 group-hover:scale-105 relative ${
              isGrowerView ? 'border-white/50' : 'border-[#7ede56]/30'
            }`}
          >
            {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />}
            <AvatarFallback className="bg-white text-[#002f37] font-black text-2xl rounded-full">
              {isLoading ? '...' : initials}
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] shadow-sm ${
              isGrowerView
                ? 'bg-white border-[#6bcb4b]'
                : 'bg-[#7ede56] border-[#002f37] shadow-[0_0_10px_rgba(126,222,86,0.6)]'
            }`}
          />
        </div>

        {/* Centered Name - All Caps */}
        {isLoading ? (
          <div className="space-y-3 w-full flex flex-col items-center">
            <div className="h-6 w-3/4 bg-white/10 animate-pulse rounded-lg" />
            <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded-md" />
          </div>
        ) : (
          <div className="space-y-2 w-full">
            <h3
              className="text-white font-bold text-lg tracking-[0.05em] uppercase leading-tight"
            >
              {profile.name}
            </h3>
            
            <p className={`text-[11px] font-medium tracking-wide lowercase ${isGrowerView ? 'text-white/65' : 'text-gray-400'}`}>
              {isGrowerView
                ? profile.email || 'grower@agrilync.com'
                : agent?.email || profile.email || 'nexus.field.ops@agrilync.com'}
            </p>

            {profile.id && (
              <p
                className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase mt-1 shadow-sm ${
                  isGrowerView
                    ? 'text-[#002f37] bg-white border border-white/60'
                    : 'text-[#065f46] bg-[#7ede56]'
                }`}
              >
                LYNC ID: {profile.id}
              </p>
            )}

            <div className={`pt-2 mt-3 w-full flex flex-col gap-2 ${isGrowerView ? 'border-t border-white/20' : ''}`}>
              <div className={`flex items-center justify-center gap-2 ${isGrowerView ? 'text-white' : 'text-[#7ede56]'}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  {profile.title}
                </span>
              </div>
              
              {userType === 'agent' || isSuperAdmin ? (
                <div className="mt-2 w-full flex flex-col items-center">
                  <RegionSwitcher className="w-full" />
                </div>
              ) : (
                <div className={`flex items-center justify-center gap-2 ${isGrowerView ? 'text-white/85' : 'text-white/70'}`}>
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {profile.location.replace(' Region', '')}
                  </span>
                </div>
              )}
            </div>

            {isGrowerView && (
              <button
                type="button"
                onClick={goToGrowerProfile}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#002f37] shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                View Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfileCard;
