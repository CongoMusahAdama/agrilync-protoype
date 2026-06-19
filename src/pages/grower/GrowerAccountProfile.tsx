import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GrowerLayout from '@/components/grower/GrowerLayout';
import GrowerMobileShell from '@/components/grower/mobile/GrowerMobileShell';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGrower } from '@/contexts/GrowerContext';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import { GROWER_ROUTES } from '@/utils/growerRoutes';

function DetailField({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7ede56] mb-1">
                {label}
            </p>
            <p className="text-[15px] font-semibold text-[#002f37] leading-snug break-words">{value}</p>
        </div>
    );
}

const GrowerAccountProfile: React.FC = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { grower } = useGrower();

    const displayName = grower?.name || 'Lync Grower';
    const initials = displayName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    const avatarSrc = grower?.profilePicture
        ? resolvePublicAssetUrl(grower.profilePicture)
        : undefined;
    const location = [grower?.district, grower?.region].filter(Boolean).join(', ');

    const hero = (
        <div className="flex flex-col items-center text-center relative">
            <div className="absolute -top-2 left-6 h-16 w-16 rounded-full bg-white/10" aria-hidden />
            <div className="absolute top-8 right-8 h-10 w-10 rounded-full bg-white/10" aria-hidden />
            <div className="relative mb-4">
                <Avatar className="h-[7.5rem] w-[7.5rem] border-[4px] border-white shadow-xl">
                    <AvatarImage src={avatarSrc} alt={displayName} className="object-cover" />
                    <AvatarFallback className="bg-white text-[#002f37] text-3xl font-black">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <button
                    type="button"
                    onClick={() => navigate(GROWER_ROUTES.settings)}
                    className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#002f37] shadow-md border-2 border-[#7ede56]"
                    aria-label="Edit profile"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    const body = (
        <>
            <DetailField label="Lync ID" value={grower?.lyncId} />
            <DetailField label="Full name" value={displayName} />
            <DetailField label="Email address" value={grower?.email} />
            <DetailField label="Phone" value={grower?.contact} />
            <DetailField label="Location" value={location || 'Ghana'} />
            <DetailField label="Farm type" value={grower?.farmType} />
            <DetailField label="Status" value={grower?.status === 'active' ? 'Verified & active' : grower?.status} />

            <button
                type="button"
                onClick={() => navigate(GROWER_ROUTES.settings)}
                className="mt-4 w-full rounded-2xl border-2 border-[#7ede56] bg-[#7ede56]/10 py-3.5 text-sm font-bold text-[#002f37] uppercase tracking-wide"
            >
                Manage account
            </button>
        </>
    );

    if (!isMobile) {
        return (
            <GrowerLayout activeSection="account" title="My Profile" subtitle="Your Lync Grower account">
                <div className="max-w-lg mx-auto py-8">{hero}{body}</div>
            </GrowerLayout>
        );
    }

    return (
        <GrowerLayout activeSection="account" title="My Profile" hideTopBar fullWidth>
            <GrowerMobileShell
                title={displayName.split(' ')[0] || 'Profile'}
                onBack={() => navigate(GROWER_ROUTES.dashboard)}
                rightAction={
                    <button
                        type="button"
                        onClick={() => navigate(GROWER_ROUTES.settings)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                }
                hero={hero}
            >
                {body}
            </GrowerMobileShell>
        </GrowerLayout>
    );
};

export default GrowerAccountProfile;
