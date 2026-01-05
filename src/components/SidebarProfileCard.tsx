import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProfileCardProps {
  sidebarCollapsed: boolean;
  isMobile: boolean;
  darkMode: boolean;
  userType?: string;
}

const profileMapping: Record<
  string,
  {
    name: string;
    location: string;
    avatarUrl?: string;
    id?: string;
    contact?: string;
    districts?: string[];
    title?: string;
  }
> = {
  grower: {
    name: 'John Agribusiness',
    location: 'Ejisu, Ashanti',
    avatarUrl: '/lovable-uploads/profile.png',
    title: 'Grower'
  },
  investor: {
    name: 'Maria Investment',
    location: 'Airport City, Accra',
    avatarUrl: '/lovable-uploads/profile.png',
    title: 'Investor'
  },
  farmer: {
    name: 'Kwame Mensah',
    location: 'Kumasi, Ashanti',
    avatarUrl: '/lovable-uploads/profile.png',
    title: 'Farmer'
  },
  agent: {
    name: 'Lync Agent',
    location: 'Region',
    avatarUrl: '/lovable-uploads/profile.png',
    id: '---',
    contact: '',
    districts: [],
    title: 'Field Agent'
  },
  'super-admin': {
    name: 'Super Admin',
    location: 'Headquarters',
    avatarUrl: '/lovable-uploads/profile.png',
    title: 'Super Admin'
  }
};

const SidebarProfileCard: React.FC<SidebarProfileCardProps> = ({
  sidebarCollapsed,
  isMobile,
  darkMode,
  userType
}) => {
  const { agent } = useAuth(); // Get real user data

  // Use real data if available and userType is agent/super-admin, otherwise fallback or use mock for other types
  const isSuperAdmin = userType === 'super-admin';
  const profile = (userType === 'agent' || isSuperAdmin) && agent ? {
    name: agent.name,
    location: isSuperAdmin ? 'AgriLync Systems' : (agent.region || 'Field Operations'),
    avatarUrl: agent.avatar || '/lovable-uploads/profile.png',
    id: isSuperAdmin ? null : (agent.agentId || agent.id?.substring(0, 8)),
    contact: agent.contact,
    districts: [],
    title: isSuperAdmin ? 'Super Admin' : (userType === 'agent' ? 'Field Agent' : userType)
  } : (profileMapping[userType ?? 'grower'] || profileMapping['grower']);

  // Reset agent mock if it falls back to the mapping, to ensure we don't show Wontumi
  if (userType === 'agent' && !agent) {
    profileMapping['agent'] = {
      name: 'Agent',
      location: 'Region',
      avatarUrl: '/lovable-uploads/profile.png',
      id: '---',
      contact: '',
      districts: []
    }
  }

  // Inverse theming: sidebar is light when app is dark, so profile card should be dark
  const sidebarDarkMode = !darkMode;

  return (
    <div
      className={`px-4 py-3 border-b ${sidebarDarkMode ? 'border-gray-200/50' : 'border-[#063840]/20'} ${sidebarCollapsed && !isMobile ? 'flex justify-center' : ''
        }`}
    >
      <div
        className={`w-full flex flex-col items-center gap-2.5 rounded-2xl p-3.5 shadow-sm transition-colors ${sidebarDarkMode ? 'bg-[#082b2f] text-white' : 'bg-[#f4ffee] text-[#002f37]'
          } ${sidebarCollapsed && !isMobile ? 'px-2 py-3' : ''}`}
      >
        <Avatar className={`${sidebarCollapsed && !isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}>
          <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
          <AvatarFallback className="bg-[#002f37]/90 text-white">
            <UserRound className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold truncate max-w-[150px]">{profile.name}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${sidebarDarkMode ? 'bg-white/10 text-[#7ede56]' : 'bg-[#002f37] text-white'}`}>
              {profile.title || (isSuperAdmin ? 'Super Admin' : 'Staff')}
            </span>
            {!isSuperAdmin && (
              <span className={`text-xs ${sidebarDarkMode ? 'text-[#b8e4e9]' : 'text-[#285d64]'} mt-1`}>{profile.location}</span>
            )}
            {profile.id && !isSuperAdmin && (
              <span className={`text-[10px] font-mono ${sidebarDarkMode ? 'text-[#7ede56]' : 'text-[#1db954]'} font-semibold`}>
                ID: {profile.id}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfileCard;
