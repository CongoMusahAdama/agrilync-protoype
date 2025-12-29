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
  }
> = {
  grower: {
    name: 'John Agribusiness',
    location: 'Ejisu, Ashanti',
    avatarUrl: '/lovable-uploads/profile.png'
  },
  investor: {
    name: 'Maria Investment',
    location: 'Airport City, Accra',
    avatarUrl: '/lovable-uploads/profile.png'
  },
  farmer: {
    name: 'Kwame Mensah',
    location: 'Kumasi, Ashanti',
    avatarUrl: '/lovable-uploads/profile.png'
  },
  agent: {
    name: 'Oti Gabriel Wontumi',
    location: 'Ashanti Region',
    avatarUrl: '/lovable-uploads/profile.png',
    id: 'LYA458920',
    contact: '+233 20 987 6543',
    districts: ['Kumasi Metro', 'Ejisu', 'Bosomtwe']
  }
};

const SidebarProfileCard: React.FC<SidebarProfileCardProps> = ({
  sidebarCollapsed,
  isMobile,
  darkMode,
  userType
}) => {
  const { agent } = useAuth(); // Get real user data

  // Use real data if available and userType is agent, otherwise fallback or use mock for other types
  const profile = userType === 'agent' && agent ? {
    name: agent.name,
    location: agent.region || 'Unknown Region',
    avatarUrl: agent.avatar,
    id: agent.agentId,
    contact: agent.contact,
    districts: [] // If needed, can be added to user context
  } : (profileMapping[userType ?? 'grower'] || profileMapping['grower']);

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
            <span className={`text-xs ${sidebarDarkMode ? 'text-[#b8e4e9]' : 'text-[#285d64]'}`}>{profile.location}</span>
            {profile.id && (
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
