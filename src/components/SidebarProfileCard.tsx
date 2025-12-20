import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

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
  const profile = profileMapping[userType ?? 'grower'] || profileMapping['grower'];

  return (
    <div
      className={`px-4 py-3 border-b ${darkMode ? 'border-gray-200/50' : 'border-[#063840]/20'} ${sidebarCollapsed && !isMobile ? 'flex justify-center' : ''
        }`}
    >
      <div
        className={`w-full flex flex-col items-center gap-2.5 rounded-2xl p-3.5 shadow-sm transition-colors ${darkMode ? 'bg-[#f4ffee] text-[#002f37]' : 'bg-[#082b2f] text-white'
          } ${sidebarCollapsed && !isMobile ? 'px-2 py-3' : ''}`}
      >
        <Avatar className={`${sidebarCollapsed && !isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}>
          {profile.avatarUrl ? (
            <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-[#002f37]/90 text-white">
              <UserRound className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold truncate max-w-[150px]">{profile.name}</span>
            <span className={`text-xs ${darkMode ? 'text-[#285d64]' : 'text-[#b8e4e9]'}`}>{profile.location}</span>
            {userType === 'agent' && (
              <div className="mt-1 flex flex-col items-center gap-1 text-[11px]">
                {profile.id && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${darkMode ? 'bg-[#e3f8ed] text-[#045c42]' : 'bg-[#0f3a41] text-white'
                      }`}
                  >
                    ID: {profile.id}
                  </span>
                )}
                {profile.contact && (
                  <span
                    className={`rounded-full px-2 py-0.5 ${darkMode ? 'bg-[#f4ffee] text-[#0c3b38]' : 'bg-[#0f3a41] text-white'
                      }`}
                  >
                    {profile.contact}
                  </span>
                )}
                {profile.districts && (
                  <div
                    className={`flex flex-wrap justify-center gap-1 ${darkMode ? 'text-[#045c42]' : 'text-[#b8e4e9]'
                      }`}
                  >
                    {profile.districts.map((district) => (
                      <span
                        key={district}
                        className={`rounded-full border px-2 py-0.5 ${darkMode ? 'border-[#8cd5b8] text-[#0c3b38]' : 'border-[#0f3a41] text-white'
                          }`}
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfileCard;
