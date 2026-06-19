import React, { useState } from 'react';
import GrowerLayout from '@/components/grower/GrowerLayout';
import GrowerProfileEditForm from '@/components/grower/GrowerProfileEditForm';
import GrowerLyncCardModal from '@/components/grower/GrowerLyncCardModal';
import GrowerMobileSettings from '@/components/grower/mobile/GrowerMobileSettings';
import GrowerMobileShell from '@/components/grower/mobile/GrowerMobileShell';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGrower } from '@/contexts/GrowerContext';

const GrowerSettings: React.FC = () => {
    const isMobile = useIsMobile();
    const { grower } = useGrower();
    const [editMode, setEditMode] = useState(false);
    const [cardModalOpen, setCardModalOpen] = useState(false);

    if (isMobile && !editMode) {
        return (
            <GrowerLayout activeSection="settings" title="Settings" hideTopBar fullWidth>
                <GrowerMobileSettings
                    onEditProfile={() => setEditMode(true)}
                    onViewCard={() => setCardModalOpen(true)}
                />
                <GrowerLyncCardModal open={cardModalOpen} onOpenChange={setCardModalOpen} />
            </GrowerLayout>
        );
    }

    if (isMobile && editMode) {
        return (
            <GrowerLayout activeSection="settings" title="Settings" hideTopBar fullWidth>
                <GrowerMobileShell
                    title="Edit profile"
                    onBack={() => setEditMode(false)}
                    contentClassName="px-2 pt-4"
                >
                    <GrowerProfileEditForm />
                </GrowerMobileShell>
                <GrowerLyncCardModal open={cardModalOpen} onOpenChange={setCardModalOpen} />
            </GrowerLayout>
        );
    }

    return (
        <GrowerLayout
            activeSection="settings"
            title="Settings"
            subtitle="Update your official profile — same fields your agent uses at onboarding"
        >
            <GrowerProfileEditForm />
            {grower?.status === 'active' && (
                <GrowerLyncCardModal open={cardModalOpen} onOpenChange={setCardModalOpen} />
            )}
        </GrowerLayout>
    );
};

export default GrowerSettings;
