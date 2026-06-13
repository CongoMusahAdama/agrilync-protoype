import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'agrilync-pwa-install-dismissed';

function isIosSafari(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    return isIos && isSafari;
}

const InstallPwaPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIos, setIsIos] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
        setIsStandalone(standalone);

        if (standalone || localStorage.getItem(DISMISS_KEY) === '1') return;

        const ios = isIosSafari();
        setIsIos(ios);
        if (ios) {
            setVisible(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (!visible || isStandalone) return null;
    if (!isIos && !deferredPrompt) return null;

    const handleInstall = async () => {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        setVisible(false);
        setDeferredPrompt(null);
        if (choice.outcome === 'dismissed') {
            localStorage.setItem(DISMISS_KEY, '1');
        }
    };

    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem(DISMISS_KEY, '1');
    };

    return (
        <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-[300] rounded-2xl border border-[#065f46]/20 bg-white shadow-2xl p-4">
            <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-700"
                aria-label="Dismiss install prompt"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
                <div className="p-2.5 rounded-xl bg-[#065f46]/10 shrink-0">
                    <Download className="h-5 w-5 text-[#065f46]" />
                </div>
                <div>
                    <p className="text-sm font-black text-[#002f37]">Install AgriLync on your phone</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Add to Home Screen for offline field visits in villages without signal.
                    </p>
                </div>
            </div>
            {isIos ? (
                <ol className="mt-3 space-y-1.5 text-[11px] text-gray-600 leading-relaxed list-decimal list-inside">
                    <li>Open AgriLync in Safari</li>
                    <li>
                        Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
                    </li>
                    <li>Open it from the home screen icon</li>
                </ol>
            ) : (
                <Button
                    onClick={() => void handleInstall()}
                    className="w-full mt-3 h-10 bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[10px] uppercase tracking-widest rounded-xl"
                >
                    Add to Home Screen
                </Button>
            )}
            <p className="text-[9px] text-gray-400 text-center mt-2">
                {isIos ? (
                    <>
                        Before going to the field: open from home screen & tap Download field data ·{' '}
                        <Link to="/dashboard/agent/offline-guide" className="text-[#065f46] font-bold underline">
                            Full guide
                        </Link>
                    </>
                ) : (
                    <>
                        On iPhone: Share → Add to Home Screen ·{' '}
                        <Link to="/dashboard/agent/offline-guide" className="text-[#065f46] font-bold underline">
                            Full guide
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
};

export default InstallPwaPrompt;
