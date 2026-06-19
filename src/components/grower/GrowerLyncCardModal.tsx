import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import GrowerIdCardVisual from '@/components/agent/GrowerIdCardVisual';
import { getGrowerDisplayId } from '@/utils/growerId';
import { buildFarmerForCard } from '@/utils/growerCardFarmer';
import {
    preloadCardImages,
    triggerCardDownloads,
    captureCardFace,
} from '@/utils/growerCardExport';
import api from '@/utils/api';
import type { GrowerProfile } from '@/utils/authToken';
import type { GrowerAssignedAgent } from '@/contexts/GrowerContext';
import { isGrowerLocalhostBypass } from '@/utils/devGrower';
import { getGrowerToken } from '@/utils/authToken';
import {
    GD_BODY_SM,
    GD_BTN_PILL,
    GD_EYEBROW,
    GD_FONT,
    GD_H3,
} from '@/constants/growerDashboardTypography';

const PRINT_STYLES = `
    @page { size: A4 portrait; margin: 12mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body {
        margin: 0;
        padding: 8mm 0;
        background: #fff;
        font-family: Inter, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10mm;
    }
    .card-print-img {
        width: 85.6mm;
        height: 53.98mm;
        object-fit: contain;
        display: block;
        page-break-inside: avoid;
        break-inside: avoid;
    }
`;

interface GrowerLyncCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    grower: GrowerProfile | null;
    assignedAgent?: GrowerAssignedAgent | null;
}

const GrowerLyncCardModal: React.FC<GrowerLyncCardModalProps> = ({
    open,
    onOpenChange,
    grower,
    assignedAgent,
}) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const [cardFarmer, setCardFarmer] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open || !grower) {
            setError('');
            return;
        }

        const useLocal = isGrowerLocalhostBypass() && !getGrowerToken();
        if (useLocal) {
            setCardFarmer(buildFarmerForCard(grower, assignedAgent));
            setLoading(false);
            setError('');
            return;
        }

        const loadCard = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/grower/me/id-card');
                setCardFarmer(res.data?.farmer || buildFarmerForCard(grower, assignedAgent));
            } catch (err: any) {
                const msg = String(err?.response?.data?.message || err?.response?.data?.msg || '');
                if (grower.status !== 'active') {
                    setError(msg || 'Your Lync card is available after verification.');
                } else {
                    setCardFarmer(buildFarmerForCard(grower, assignedAgent));
                    setError(msg && !msg.includes('API route') ? msg : '');
                }
            } finally {
                setLoading(false);
            }
        };

        loadCard();
    }, [open, grower, assignedAgent]);

    if (!grower) return null;

    const displayFarmer = cardFarmer || buildFarmerForCard(grower, assignedAgent);
    const growerId = getGrowerDisplayId(displayFarmer);
    const cardNo = displayFarmer.digitalCardNumber || growerId;
    const exportBaseName = `AgriLync_ID_${cardNo}`.replace(/[^\w.-]+/g, '_');

    const handlePrint = async () => {
        const content = captureRef.current;
        if (!content) return;

        await preloadCardImages(content);

        const faces = Array.from(content.querySelectorAll<HTMLElement>('[data-card-face]'));
        const images: string[] = [];
        for (const face of faces) {
            const canvas = await captureCardFace(face);
            images.push(canvas.toDataURL('image/png', 1.0));
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const cardsHtml = images
            .map((src) => `<img src="${src}" class="card-print-img" alt="AgriLync Grower ID Card" />`)
            .join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>AgriLync ID - ${displayFarmer.name}</title>
                    <style>${PRINT_STYLES}</style>
                </head>
                <body>${cardsHtml}</body>
                <script>
                    window.onload = function () {
                        setTimeout(function () { window.print(); window.close(); }, 450);
                    };
                </script>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        const content = captureRef.current;
        if (!content) return;
        setExporting(true);
        try {
            await triggerCardDownloads(content, exportBaseName);
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`w-full max-w-4xl max-h-[95vh] p-0 overflow-y-auto overflow-x-hidden bg-[#002f37] border-none shadow-2xl flex flex-col items-center z-[250] ${GD_FONT}`}>
                <DialogTitle className="sr-only">My Lync Grower ID Card</DialogTitle>

                <div className="w-full px-4 pt-5 pb-2 text-center">
                    <p className={`${GD_EYEBROW} text-[#7ede56] tracking-[0.3em]`}>
                        Digital Credential
                    </p>
                    <h2 className={`${GD_H3} text-lg text-white mt-1`}>
                        Lync Grower ID Card
                    </h2>
                    <p className={`${GD_BODY_SM} text-white/60 mt-1`}>
                        Issued after agent onboarding — same card your field agent sees
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-white py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-[#7ede56]" />
                        <span className={`${GD_BTN_PILL} text-white`}>Loading your card…</span>
                    </div>
                )}

                {error && !loading && (
                    <div className={`bg-amber-500/15 border border-amber-400/30 text-amber-50 rounded-xl px-6 py-4 mb-4 ${GD_BODY_SM} font-normal max-w-md text-center mx-4`}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div ref={captureRef} className="py-2 px-2">
                            <GrowerIdCardVisual farmer={displayFarmer} hideFaceLabels />
                        </div>

                        <p className={`${GD_BTN_PILL} text-white/40 mb-2 text-center px-4`}>
                            Print or download front & back · scan QR to verify
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 mb-4 w-full px-4">
                            <Button
                                onClick={handlePrint}
                                className={`bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-5 h-11 ${GD_BTN_PILL} text-[10px]`}
                            >
                                <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                                Print
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={exporting}
                                className={`bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-5 h-11 ${GD_BTN_PILL} text-[10px] disabled:opacity-60`}
                            >
                                {exporting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                {exporting ? 'Preparing…' : 'Download'}
                            </Button>
                        </div>
                    </>
                )}

                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className={`mb-4 text-white/50 hover:text-white ${GD_BTN_PILL} text-[10px]`}
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default GrowerLyncCardModal;
