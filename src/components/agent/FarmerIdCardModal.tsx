import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';

interface FarmerIdCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

const AGRILYNC_LOGO = resolvePublicAssetUrl('/Frame 74.png');

const FarmerIdCardModal: React.FC<FarmerIdCardModalProps> = ({ open, onOpenChange, farmer }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    if (!farmer) return null;

    const handlePrint = () => {
        const content = cardRef.current;
        if (!content) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>AgriLync ID - ${farmer.name}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
                    <style>
                        @page { size: landscape; margin: 12mm; }
                        body {
                            margin: 0;
                            padding: 24px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: #f8fafc;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    </style>
                </head>
                <body>
                    ${content.outerHTML}
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 800);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 4,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            const link = document.createElement('a');
            link.download = `AgriLync_ID_${farmer.id || farmer.ghanaCardNumber}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const profileSrc =
        farmer.profilePicture ||
        farmer.avatar ||
        farmer.photo ||
        farmer.picture ||
        farmer.image ||
        farmer.profile_picture ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(farmer.name || 'Grower')}`;

    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`agrilync_auth:${farmer.id || farmer.ghanaCardNumber}`)}&bgcolor=ffffff&color=002f37`;

    const issueDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const growerId = farmer.id || farmer.ghanaCardNumber || 'LYNC-PENDING';
    const district = farmer.district || farmer.region || '—';
    const community = farmer.community || '—';
    const fieldAgent = farmer.onboardingAgentId || '—';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col items-center z-[200]">
                <DialogTitle className="sr-only">Official Farmer ID Card</DialogTitle>

                {/* Landscape CR80-style card (~3.375" × 2.125") */}
                <div
                    ref={cardRef}
                    className="relative w-[min(100vw-2rem,560px)] rounded-2xl overflow-hidden flex flex-col bg-white shadow-2xl shrink-0 border border-gray-200/80"
                    style={{ aspectRatio: '1.586 / 1', fontFamily: '"Inter", sans-serif' }}
                >
                    {/* Top header band */}
                    <div className="flex items-center justify-between px-5 py-3 bg-[#002f37] shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src={AGRILYNC_LOGO}
                                alt="AgriLync"
                                crossOrigin="anonymous"
                                className="h-9 w-auto object-contain brightness-0 invert shrink-0"
                            />
                            <div className="min-w-0 border-l border-white/15 pl-3">
                                <p className="text-[8px] font-black text-[#7ede56] uppercase tracking-[0.35em] leading-none">
                                    Operational Credential
                                </p>
                                <p className="text-[10px] font-bold text-white/70 mt-1 truncate">
                                    Grower Digital ID
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7ede56]/15 border border-[#7ede56]/25 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-[#7ede56]" />
                            <span className="text-[7px] font-black text-[#7ede56] uppercase tracking-wider">
                                Secured
                            </span>
                        </div>
                    </div>

                    {/* Main body — landscape three-column */}
                    <div className="flex flex-1 min-h-0">
                        {/* Photo column */}
                        <div className="w-[34%] bg-gradient-to-br from-[#065f46]/8 to-[#002f37]/5 flex flex-col items-center justify-center px-4 py-4 border-r border-gray-100">
                            <div className="relative">
                                <div className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-2xl border-[3px] border-white shadow-lg overflow-hidden bg-white">
                                    <img
                                        src={profileSrc}
                                        crossOrigin="anonymous"
                                        alt={farmer.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1.5 -right-1.5 bg-[#7ede56] text-[#002f37] p-1 rounded-lg shadow border-2 border-white">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <h2
                                className="mt-3 text-[#002f37] font-black text-[11px] sm:text-xs text-center leading-tight uppercase line-clamp-2 px-1"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                {farmer.name}
                            </h2>
                            <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-[#065f46]/8 rounded-full">
                                <CheckCircle2 className="w-2.5 h-2.5 text-[#065f46]" />
                                <span className="text-[6px] sm:text-[7px] font-black text-[#065f46] uppercase tracking-wide">
                                    Verified Partner
                                </span>
                            </div>
                        </div>

                        {/* Details column */}
                        <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 flex flex-col justify-between min-w-0">
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-y-3">
                                <div>
                                    <span className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-widest block">
                                        Regional ID
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#002f37] font-mono leading-tight break-all">
                                        {growerId}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-widest block">
                                        Zone / District
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#002f37] leading-tight line-clamp-2">
                                        {district}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-widest block">
                                        Community
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#002f37] leading-tight line-clamp-2">
                                        {community}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-widest block">
                                        Field Agent
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-black text-[#002f37] font-mono leading-tight">
                                        {fieldAgent}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-gray-100">
                                <div>
                                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest block">
                                        Date Issued
                                    </span>
                                    <span className="text-[9px] font-black text-[#002f37]">{issueDate}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest block">
                                        Scannable Auth
                                    </span>
                                    <img
                                        src={qrSrc}
                                        crossOrigin="anonymous"
                                        alt="Auth QR"
                                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain ml-auto mt-0.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer strip */}
                    <div className="px-5 py-2 bg-[#065f46] flex items-center justify-between gap-2 shrink-0">
                        <img
                            src={AGRILYNC_LOGO}
                            alt=""
                            crossOrigin="anonymous"
                            aria-hidden
                            className="h-4 w-auto object-contain brightness-0 invert opacity-80"
                        />
                        <span className="text-[6px] sm:text-[7px] font-black text-[#7ede56] uppercase tracking-[0.25em] text-center flex-1">
                            AgriLync Digital Trust Ecosystem
                        </span>
                        <span className="text-[6px] font-bold text-white/50 uppercase shrink-0">v2.4</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full px-4">
                    <Button
                        onClick={handlePrint}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95"
                    >
                        <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                        Print Physical Card
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-5 h-12 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_-5px_rgba(126,222,86,0.5)] transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Save Digital ID
                    </Button>
                </div>

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
