import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle2, Leaf, ExternalLink, ShieldCheck, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FarmerIdCardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

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
                        body {
                            margin: 0;
                            padding: 40px;
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
                backgroundColor: null,
                logging: false
            });
            const link = document.createElement('a');
            link.download = `AgriLync_ID_${farmer.id || farmer.ghanaCardNumber}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const profileSrc = farmer.profilePicture || farmer.avatar || farmer.photo || farmer.picture || farmer.image || farmer.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${farmer.name}`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=agriline_auth:${farmer.id || farmer.ghanaCardNumber}&bgcolor=f9fafb&color=002f37`;
    const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col items-center z-[200]">
                <DialogTitle className="sr-only">Official Farmer ID Card</DialogTitle>
                
                {/* ID CARD CONTAINER - Standard CR80 Ratio 3.375" x 2.125" but vertical */}
                <div 
                    ref={cardRef} 
                    className="relative w-[350px] rounded-[32px] overflow-hidden flex flex-col bg-slate-50 shadow-2xl shrink-0"
                    style={{ minHeight: '560px', fontFamily: '"Inter", sans-serif' }}
                >
                    {/* Background Pattern - Subtle Leaves */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
                        <div className="absolute top-20 left-10 rotate-12"><Leaf size={120} /></div>
                        <div className="absolute bottom-40 right-5 -rotate-45"><Leaf size={150} /></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Leaf size={250} /></div>
                    </div>

                    {/* Header - Deep Teal with Profile Integration */}
                    <div className="w-full bg-[#002f37] h-48 relative overflow-hidden flex flex-col items-center pt-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7ede56]/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-2xl flex items-center justify-center">
                            <Leaf className="text-white/10 w-12 h-12" />
                        </div>
                        
                        <div className="z-10 flex flex-col items-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                <Leaf className="w-5 h-5 text-[#7ede56]" fill="#7ede56" />
                                <span className="font-montserrat font-black text-sm tracking-[0.3em] text-[#7ede56]">AGRILYNC</span>
                            </div>
                            <div className="mt-3 flex flex-col items-center">
                                <span className="text-[7px] font-black text-white/40 tracking-[0.5em] uppercase">Operational Credential</span>
                                <div className="h-0.5 w-12 bg-[#7ede56] mt-1 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Picture - Centered Overlap */}
                    <div className="relative mt-[-80px] z-20 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#7ede56] rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="w-[160px] h-[160px] rounded-[3.5rem] border-[8px] border-slate-50 p-1 bg-white shadow-2xl relative overflow-hidden">
                                <img 
                                    src={profileSrc} 
                                    crossOrigin="anonymous" 
                                    alt={farmer.name} 
                                    className="w-full h-full object-cover rounded-[2.8rem]" 
                                />
                            </div>
                            {/* Verification Badge */}
                            <div className="absolute bottom-2 right-2 bg-[#7ede56] text-[#002f37] p-2 rounded-2xl shadow-lg border-4 border-slate-50 scale-110">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Identity Details */}
                    <div className="mt-6 flex flex-col items-center px-8 text-center z-10">
                        <h2 className="text-[#002f37] font-black text-2xl tracking-tighter capitalize font-poppins px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {farmer.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5 px-3 py-1 bg-[#065f46]/5 rounded-full border border-[#065f46]/10">
                            <CheckCircle2 className="w-3 h-3 text-[#065f46]" />
                            <span className="text-[9px] font-black text-[#065f46] uppercase tracking-[0.2em]">Verified Field Partner</span>
                        </div>
                    </div>

                    {/* Data Matrix */}
                    <div className="w-full px-10 grid grid-cols-2 gap-y-6 gap-x-4 text-left mt-8 mb-4 z-10">
                        <div className="space-y-1">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block">Regional ID</span>
                            <span className="text-xs font-black text-[#002f37] font-mono tracking-tighter">{farmer.id || 'LYNC-2024-X'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block">Zone/District</span>
                            <span className="text-xs font-black text-[#002f37] truncate block">{farmer.district || farmer.region}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block">Community</span>
                            <span className="text-xs font-black text-[#002f37] truncate block">{farmer.community || 'Central Hub'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block">Auth Index</span>
                            <span className="text-xs font-black text-[#002f37] font-mono tracking-widest">
                                {String(farmer.id || farmer.ghanaCardNumber).slice(-4)}
                            </span>
                        </div>
                    </div>

                    {/* Secured Footer */}
                    <div className="mt-auto w-full px-10 pb-8 flex items-end justify-between z-10">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Date Issued</span>
                                <span className="text-[10px] font-black text-[#002f37]">{issueDate}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-30">
                                <QrCode className="w-4 h-4 text-[#002f37]" />
                                <span className="text-[6px] font-black text-[#002f37] uppercase tracking-[0.3em]">Scannable Auth</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-50" />
                            <div className="bg-[#f9fafb] p-3 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
                                <img src={qrSrc} crossOrigin="anonymous" alt="Auth QR" className="w-14 h-14 object-contain mix-blend-multiply" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Edge Branding */}
                    <div className="w-full py-3 bg-[#065f46] flex items-center justify-center gap-2">
                        <span className="text-[7px] font-black text-[#7ede56] uppercase tracking-[0.4em]">AgriLync Digital Trust Ecosystem</span>
                        <div className="h-1 w-1 rounded-full bg-[#7ede56]/40" />
                        <span className="text-[7px] font-bold text-white/40 uppercase">v2.4 SECURED</span>
                    </div>
                </div>

                {/* Interactive Controls - Outside the card */}
                <div className="flex items-center gap-4 mt-8 w-full justify-center">
                    <Button 
                        onClick={handlePrint} 
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95"
                    >
                        <Printer className="w-4 h-4 mr-2 text-[#7ede56]" />
                        Print Physical Card
                    </Button>
                    <Button 
                        onClick={handleDownload} 
                        className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_20px_-5px_rgba(126,222,86,0.5)] transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Save Digital ID
                    </Button>
                </div>
                
                <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="mt-4 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest"
                >
                    Close Preview
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default FarmerIdCardModal;
