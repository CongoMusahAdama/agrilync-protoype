import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    BookOpen,
    ChevronRight,
    CreditCard,
    Globe,
    LogOut,
    Pencil,
    Shield,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import GrowerMobileShell from '@/components/grower/mobile/GrowerMobileShell';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { useAuth } from '@/contexts/AuthContext';
import { useGrower } from '@/contexts/GrowerContext';

type RowProps = {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    trailing?: React.ReactNode;
};

function SettingsRow({ icon: Icon, label, onClick, trailing }: RowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick && !trailing}
            className="flex w-full items-center gap-3 py-3.5 border-b border-gray-100 last:border-0 text-left disabled:cursor-default"
        >
            <Icon className="h-5 w-5 text-[#7ede56] shrink-0" strokeWidth={2} />
            <span className="flex-1 text-[15px] font-medium text-[#002f37]">{label}</span>
            {trailing ?? (onClick ? <ChevronRight className="h-4 w-4 text-gray-300" /> : null)}
        </button>
    );
}

function SettingsGroup({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="h-5 w-5 text-[#002f37]" strokeWidth={2.25} />
                <h2 className="text-lg font-bold text-[#002f37]">{title}</h2>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 px-4">{children}</div>
        </section>
    );
}

type Props = {
    onEditProfile: () => void;
    onViewCard?: () => void;
};

const GrowerMobileSettings: React.FC<Props> = ({ onEditProfile, onViewCard }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { grower } = useGrower();

    return (
        <GrowerMobileShell title="Settings" onBack={() => navigate(GROWER_ROUTES.dashboard)}>
            <SettingsGroup title="Account" icon={Shield}>
                <SettingsRow icon={Pencil} label="Edit profile" onClick={onEditProfile} />
                <SettingsRow icon={CreditCard} label="My Lync ID card" onClick={onViewCard} />
            </SettingsGroup>

            <SettingsGroup title="Notifications" icon={Bell}>
                <SettingsRow
                    icon={Bell}
                    label="Push notifications"
                    trailing={<Switch defaultChecked aria-label="Push notifications" />}
                />
                <SettingsRow
                    icon={Bell}
                    label="Agent visit alerts"
                    trailing={<Switch defaultChecked aria-label="Agent visit alerts" />}
                />
            </SettingsGroup>

            <SettingsGroup title="More" icon={BookOpen}>
                <SettingsRow
                    icon={Globe}
                    label="Language"
                    trailing={
                        <span className="text-sm text-gray-500">{grower?.language || 'English'}</span>
                    }
                />
                <SettingsRow
                    icon={BookOpen}
                    label="Help & feedback"
                    onClick={() => navigate(GROWER_ROUTES.help)}
                />
            </SettingsGroup>

            <button
                type="button"
                onClick={() => {
                    logout();
                    navigate('/');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#002f37] text-white py-4 font-bold text-sm uppercase tracking-wide active:scale-[0.98] transition-transform"
            >
                <LogOut className="h-5 w-5" />
                Logout
            </button>
        </GrowerMobileShell>
    );
};

export default GrowerMobileSettings;
