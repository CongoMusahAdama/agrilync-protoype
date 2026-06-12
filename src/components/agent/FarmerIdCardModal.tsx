import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import GrowerIdCardVisual from '@/components/agent/GrowerIdCardVisual';
import { getGrowerDisplayId } from '@/utils/growerId';
import api from '@/utils/api';

interface FarmerIdCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    /** When true, fetches saved card payload from API (agent view) */
    fetchSavedCard?: boolean;
}

const PRINT_STYLES = `
    @page { size: landscape; margin: 10mm; }
    body {
        margin: 0;
        padding: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #fff;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    .grower-id-card-root { box-shadow: none !important; }
    .card-label { font-size: 10px !important; }
    .card-value { font-size: 14px !important; line-height: 1.35 !important; }
`;

const FarmerIdCardModal: React.FC<FarmerIdCardModalProps> = ({
    open,
    onOpenChange,
    farmer,
    fetchSavedCard = false,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [cardFarmer, setCardFarmer] = useState<any>(farmer);
    const [loading, setLoading] = useState(false);
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
                // Use onboarding / list payload when API route is not deployed yet
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

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;

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
                    setTimeout(() => { window.print(); window.close(); }, 1400);
                </script>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            const link = document.createElement('a');
            const cardNo = displayFarmer.digitalCardNumber || growerId;
            link.download = `AgriLync_ID_${cardNo}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col items-center z-[250]">
                <DialogTitle className="sr-only">Official Grower ID Card</DialogTitle>

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
                        <div className="sr-only" aria-hidden ref={printRef}>
                            <GrowerIdCardVisual farmer={displayFarmer} printMode />
                        </div>

                        <GrowerIdCardVisual ref={cardRef} farmer={displayFarmer} />

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full px-4">
                            <Button
                                onClick={handlePrint}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95"
                            >
                                <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                                Print Card
                            </Button>
                            <Button
                                onClick={handleDownload}
                                className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_-5px_rgba(126,222,86,0.5)] transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PNG
                            </Button>
                        </div>
                    </>
                )}

                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="mt-2 mb-2 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest"
                >
                    Close Preview
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default FarmerIdCardModal;
