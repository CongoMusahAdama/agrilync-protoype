import React from 'react';
import { Leaf, Smartphone, Sprout } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    APP_STORE_URL,
    FARMER_MOBILE_ROLE_LABELS,
    isMobileAppLive,
    PLAY_STORE_URL,
    type FarmerMobileRole,
} from '@/constants/mobileAppLinks';
import { WHATSAPP_COMMUNITY_URL } from '@/lib/communityLinks';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: FarmerMobileRole;
};

const FarmerMobileAppDialog: React.FC<Props> = ({ open, onOpenChange, role }) => {
    const roleLabel = FARMER_MOBILE_ROLE_LABELS[role];
    const RoleIcon = role === 'grower' ? Sprout : Leaf;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-3xl border-gray-100 p-0 overflow-hidden font-inter">
                <div className="bg-[#7ede56] px-6 pt-8 pb-10 text-center relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/15" aria-hidden />
                    <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" aria-hidden />
                    <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                        <RoleIcon className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                    <DialogHeader className="space-y-2 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#002f37]/70">
                            {roleLabel}
                        </p>
                        <DialogTitle className="text-xl font-bold text-[#002f37] leading-tight">
                            AgriLync for farmers like you lives in the app
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="px-6 pb-6 -mt-5">
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4 text-center">
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#002f37]/5">
                            <Smartphone className="h-5 w-5 text-[#065f46]" />
                        </div>
                        <DialogDescription className="text-sm text-gray-600 leading-relaxed font-normal">
                            Manage your farm, connect with your field agent, and track your season from
                            your phone. Sign up happens in the app — not on this website.
                        </DialogDescription>
                    </div>

                    {isMobileAppLive ? (
                        <div className="mt-5 grid grid-cols-1 gap-2.5">
                            {APP_STORE_URL ? (
                                <a
                                    href={APP_STORE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#002f37] text-white h-12 text-sm font-medium hover:bg-[#002f37]/90 transition-colors"
                                >
                                    Download on the App Store
                                </a>
                            ) : null}
                            {PLAY_STORE_URL ? (
                                <a
                                    href={PLAY_STORE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#7ede56] text-[#002f37] h-12 text-sm font-medium hover:bg-[#6bcb4b] transition-colors"
                                >
                                    Get it on Google Play
                                </a>
                            ) : null}
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl bg-[#065f46]/5 border border-[#065f46]/10 px-4 py-4 text-center">
                            <p className="text-sm font-semibold text-[#002f37]">Mobile app coming soon</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                We&apos;re putting the finishing touches on iOS and Android. Continue in
                                the app when it launches.
                            </p>
                            {WHATSAPP_COMMUNITY_URL ? (
                                <a
                                    href={WHATSAPP_COMMUNITY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex mt-3 text-xs font-medium text-[#065f46] hover:underline"
                                >
                                    Join our WhatsApp for launch updates
                                </a>
                            ) : null}
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full mt-4 text-gray-500 hover:text-[#002f37] font-medium"
                        onClick={() => onOpenChange(false)}
                    >
                        Back to role selection
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FarmerMobileAppDialog;
