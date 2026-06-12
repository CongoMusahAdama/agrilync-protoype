import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2 } from 'lucide-react';
import GrowerIdCardVisual from '@/components/agent/GrowerIdCardVisual';
import { getGrowerDisplayId } from '@/utils/growerId';
import { preloadCardImages, triggerCardDownloads } from '@/utils/growerCardExport';
import api from '@/utils/api';

interface FarmerIdCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    fetchSavedCard?: boolean;
}

const PRINT_STYLES = `
    @page { size: A4 portrait; margin: 14mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: Inter, sans-serif;
    }
    .grower-id-card-root {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 18mm !important;
        padding: 8mm 0 !important;
    }
    .grower-id-card-face {
        box-shadow: none !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        width: 85.6mm !important;
        min-height: 54mm !important;
        aspect-ratio: 1.586 / 1 !important;
    }
    .card-label { font-size: 7pt !important; }
    .card-value { font-size: 9pt !important; line-height: 1.35 !important; }
`;

const FarmerIdCardModal: React.FC<FarmerIdCardModalProps> = ({
    open,
    onOpenChange,
    farmer,
    fetchSavedCard = false,
}) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [cardFarmer, setCardFarmer] = useState<any>(farmer);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            setError('');
            return;
        }

        setCardFarmer(farmer);

        if (!fetchSavedCard || !farmer?._id) return;

        const loadCard = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/farmers/${farmer._id}/id-card`);
                setCardFarmer(res.data?.farmer || farmer);
            } catch (err: any) {
                const status = err?.response?.status;
                const msg = String(err?.response?.data?.message || '');
                const routeMissing = status === 404 || msg.includes('API route not found');
                if (routeMissing && farmer?.name) {
                    setCardFarmer(farmer);
                    setError('');
                } else {
                    setError(msg || 'Could not load saved ID card.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadCard();
    }, [open, farmer, fetchSavedCard]);

    if (!farmer) return null;

    const growerId = getGrowerDisplayId(cardFarmer || farmer);
    const displayFarmer = cardFarmer || farmer;
    const cardNo = displayFarmer.digitalCardNumber || growerId;
    const exportBaseName = `AgriLync_ID_${cardNo}`.replace(/[^\w.-]+/g, '_');

    const handlePrint = async () => {
        const content = printRef.current;
        if (!content) return;

        await preloadCardImages(content);

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>AgriLync ID - ${displayFarmer.name}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
                    <script src="https://cdn.tailwindcss.com"><\/script>
                    <style>${PRINT_STYLES}</style>
                </head>
                <body>${content.innerHTML}</body>
                <script>
                    (function () {
                        var imgs = Array.prototype.slice.call(document.images || []);
                        var waits = imgs.map(function (img) {
                            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                            return new Promise(function (resolve) {
                                img.onload = img.onerror = resolve;
                                setTimeout(resolve, 5000);
                            });
                        });
                        Promise.all(waits).then(function () {
                            setTimeout(function () { window.print(); window.close(); }, 500);
                        });
                    })();
                </script>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        const content = printRef.current;
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
            <DialogContent className="agent-modal-mobile w-full max-w-4xl max-md:max-w-full max-md:h-full max-md:max-h-[100dvh] md:max-h-[95vh] p-0 overflow-y-auto overflow-x-hidden bg-transparent border-none shadow-none flex flex-col items-center z-[250] max-md:rounded-none">
                <DialogTitle className="sr-only">Official Grower ID Card — Front & Back</DialogTitle>

                {loading && (
                    <div className="flex items-center gap-2 text-white py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-[#7ede56]" />
                        <span className="text-sm font-bold uppercase tracking-widest">Loading saved card…</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-500/10 border border-red-400/30 text-red-100 rounded-xl px-6 py-4 mb-4 text-sm font-medium max-w-md text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* High-res capture + print source (CR80 proportions) */}
                        <div
                            className="fixed -left-[10000px] top-0 w-[680px] pointer-events-none"
                            aria-hidden
                            ref={printRef}
                        >
                            <GrowerIdCardVisual farmer={displayFarmer} printMode />
                        </div>

                        <div className="py-2">
                            <GrowerIdCardVisual farmer={displayFarmer} />
                        </div>

                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 text-center px-4">
                            Official front & back · download saves two PNG files (front + back)
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 mb-4 w-full px-4">
                            <Button
                                onClick={handlePrint}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95"
                            >
                                <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                                Print Front & Back
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={exporting}
                                className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_-5px_rgba(126,222,86,0.5)] transition-all active:scale-95 disabled:opacity-60"
                            >
                                {exporting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                {exporting ? 'Preparing…' : 'Download Cards'}
                            </Button>
                        </div>
                    </>
                )}

                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="mt-2 mb-4 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest"
                >
                    Close Preview
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default FarmerIdCardModal;
