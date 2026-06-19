import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/DashboardLayout';
import { Bell, ChevronDown } from 'lucide-react';
import { getGrowerProfile } from '@/utils/authToken';
import { useGrowerOptional } from '@/contexts/GrowerContext';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import { cn } from '@/lib/utils';

interface GrowerLayoutProps {
  activeSection: string;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  hideTopBar?: boolean;
  /** Use full content width on desktop (Farm Profile, etc.) */
  fullWidth?: boolean;
}

const GrowerLayout: React.FC<GrowerLayoutProps> = ({
  activeSection,
  title,
  subtitle,
  headerActions,
  children,
  hideTopBar = false,
  fullWidth = false,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const growerFromContext = useGrowerOptional()?.grower;
  const grower = growerFromContext ?? getGrowerProfile();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const displayName = grower?.name || 'Lync Grower';
  const firstName = displayName.split(' ')[0] || 'Grower';
  const avatarSrc = grower?.profilePicture
    ? resolvePublicAssetUrl(grower.profilePicture)
    : undefined;

  return (
    <DashboardLayout
      userType="grower"
      activeSidebarItem={activeSection}
      title={title}
      description={subtitle}
      headerActions={headerActions}
      hideHeaderOnMobile
    >
      <div
        className={cn(
          'space-y-6 py-4 pb-24 sm:py-8 sm:pb-8 font-inter',
          fullWidth ? 'w-full px-1 sm:px-2 lg:px-4' : 'px-2 sm:px-6'
        )}
      >
        {isMobile && !hideTopBar && (
          <div className="sticky top-[-1px] z-50 bg-[#f8fafc]/95 backdrop-blur-md px-1 py-4 mb-6 -mx-2 border-b border-gray-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3 ml-2">
              <Avatar
                className="h-11 w-11 border-2 border-[#7ede56]/30 shadow-md cursor-pointer"
                onClick={() => setProfileSheetOpen(true)}
              >
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="bg-[#065f46] text-white text-xs font-bold">
                  {firstName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => setProfileSheetOpen(true)}
                >
                  <h1 className="text-[17px] font-bold text-[#002f37] leading-none font-inter">
                    Hello {firstName}!
                  </h1>
                  <ChevronDown className="h-4 w-4 text-gray-500 mt-0.5" />
                </div>
                <span className="text-[11px] font-medium text-gray-500 mt-0.5">
                  {grower?.lyncId || 'Lync Grower'}
                </span>
              </div>
            </div>
            <div className="relative mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white shadow-sm border border-gray-100 h-10 w-10"
                onClick={() => navigate(GROWER_ROUTES.help)}
              >
                <Bell className="h-6 w-6 text-[#002f37]" />
              </Button>
            </div>

            <div
              className={`absolute top-0 left-0 right-0 z-[60] bg-white rounded-b-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 transform ${
                profileSheetOpen
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-full opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-5 pb-2">
                <div
                  className="w-12 h-1 bg-gray-100 rounded-full mb-2 cursor-pointer"
                  onClick={() => setProfileSheetOpen(false)}
                />
                <Avatar className="h-20 w-20 border-[4px] border-[#7ede56]/20 shadow-xl">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-[#065f46] text-white text-2xl font-bold">
                    {firstName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#002f37] leading-tight uppercase tracking-tight font-inter">
                    {displayName}
                  </h3>
                  <p className="text-sm font-mono font-bold text-[#065f46]">{grower?.lyncId || '—'}</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest">
                    {[grower?.region, grower?.district].filter(Boolean).join(' · ') || 'Ghana'}
                  </p>
                </div>
                <Button
                  className="w-full bg-white hover:bg-gray-50 text-[#002f37] border border-gray-200 rounded-full h-12 font-bold text-[14px] shadow-sm font-inter"
                  onClick={() => {
                    setProfileSheetOpen(false);
                    navigate(GROWER_ROUTES.settings);
                  }}
                >
                  MANAGE YOUR ACCOUNT
                </Button>
              </div>
            </div>

            {profileSheetOpen && (
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]"
                onClick={() => setProfileSheetOpen(false)}
              />
            )}
          </div>
        )}
        {children}
      </div>
    </DashboardLayout>
  );
};

export default GrowerLayout;
