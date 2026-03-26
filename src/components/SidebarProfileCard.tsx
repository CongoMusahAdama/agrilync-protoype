import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
}

const profileMapping: Record<string, ProfileData> = {
  grower: { name: 'John Doe', location: 'Ejisu District', title: 'Grower' },
  investor: { name: 'Maria Investment', location: 'Accra HQ', title: 'Investor' },
  farmer: { name: 'Kwame Mensah', location: 'Kumasi Cluster', title: 'Farmer' },
  agent: { name: 'Agent Adams', location: 'Lokoja Region', id: 'AGN-4512', title: 'Field Agent' },
  'super-admin': { name: 'Super Admin', location: 'Global Ops', title: 'Executive' },
};

const SidebarProfileCard: React.FC<SidebarProfileCardProps> = ({ sidebarCollapsed, isMobile, userType }) => {
  const { agent } = useAuth();

  const isSuperAdmin = userType === 'super-admin';
  const isLoading = !agent && (userType === 'agent' || isSuperAdmin);

  const profile: ProfileData =
    (userType === 'agent' || isSuperAdmin) && agent
      ? {
        name: agent.name,
        location: isSuperAdmin ? 'Systems Hub' : agent.region || 'Field Operations',
        id: isSuperAdmin ? null : agent.agentId || agent.id?.substring(0, 8),
        title: isSuperAdmin ? 'Super Admin' : 'Field Agent',
        avatar: agent.avatar
      }
      : profileMapping[userType ?? 'grower'] ?? profileMapping['grower'];

  const initials = profile.name
    ? profile.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '';

  /* ── Collapsed ── */
  if (sidebarCollapsed && !isMobile) {
    return (
      <div className="flex justify-center py-6 border-b border-white/5 bg-black/10">
        <div className="relative group cursor-pointer">
          <Avatar className="h-12 w-12 ring-2 ring-[#7ede56]/50 shadow-lg transition-all duration-300 group-hover:ring-[#7ede56] group-hover:scale-105">
            {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />}
            <AvatarFallback className="bg-white text-[#002f37] font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isLoading ? '...' : initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#7ede56] border-2 border-[#002f37] shadow-[0_0_8px_rgba(126,222,86,0.5)] animate-pulse" />
        </div>
      </div>
    );
  }

  /* ── Expanded ── */
  return (
    <div className="mx-4 mt-2 mb-2 p-0 rounded-t-[2.5rem] rounded-b-2xl bg-[#002f37] transition-all duration-500 overflow-hidden group">
      <div className="pt-4 pb-4 px-6 flex flex-col items-center text-center">
        {/* Centered Avatar */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
          <Avatar className="h-20 w-20 rounded-full border-2 border-[#7ede56]/30 shadow-2xl transition-all duration-500 group-hover:scale-105">
            {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />}
            <AvatarFallback
              className="bg-white text-[#002f37] font-black text-2xl rounded-full"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {isLoading ? '...' : initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-[#7ede56] border-[3px] border-[#002f37] shadow-[0_0_10px_rgba(126,222,86,0.6)]" />
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
              className="text-white font-black text-lg tracking-[0.05em] uppercase leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {profile.name}
            </h3>
            
            <p className="text-gray-400 text-[11px] font-medium tracking-wide lowercase">
              {agent?.email || 'nexus.field.ops@agrilync.com'}
            </p>

            {profile.id && (
              <p className="text-[#065f46] bg-[#7ede56] inline-block px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase mt-1 shadow-sm">
                LYNC ID: {profile.id}
              </p>
            )}

            <div className="pt-2 mt-3 w-full flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-[#7ede56]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  {profile.title}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-white/40">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {profile.location.replace(' Region', '')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfileCard;
