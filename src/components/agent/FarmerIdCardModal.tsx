import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle2, Leaf, ExternalLink } from 'lucide-react';
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
                    <title>Print ID Card - ${farmer.name}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: #f4f7f9;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    </style>
                </head>
                <body>
                    ${content.outerHTML}
                    <script>
                        // small delay to allow images to load
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
        const link = document.createElement('a');
        link.download = `Grower_ID_${farmer.id || farmer.ghanaCardNumber}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const profileSrc = farmer.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farmer.name}`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=lync_id:${farmer.id || farmer.ghanaCardNumber}`;
    const issueDate = new Date().toLocaleDateString('en-GB');
    const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('en-GB');
    
    // Based on provided design: dark background (#2B2C2E or #1c1c1c), neon green highlights (#C6EB4C or #7ede56)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-6 bg-[#f4f7f9] border-none shadow-2xl flex flex-col items-center z-[200]">
                <DialogTitle className="sr-only">Farmer ID Card</DialogTitle>
                
                {/* ID CARD CONTAINER */}
                <div 
                    ref={cardRef} 
                    className="relative w-[320px] rounded-[30px] overflow-hidden flex flex-col items-center pb-6 shadow-2xl font-inter shrink-0 bg-[#292D30] border-4 border-[#35393C]"
                    style={{ minHeight: '520px', fontFamily: '"Inter", sans-serif' }}
                >
                    {/* Top Hole Punch / Lanyard placeholder */}
                    <div className="absolute top-4 w-16 h-4 bg-[#1C1F21] rounded-full shadow-inner border border-white/5 z-20"></div>

                    {/* Geometric background patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#C6EB4C]" fill="currentColor">
                            <polygon points="100,0 100,50 50,0" />
                            <polygon points="80,10 80,40 50,10" fill="none" stroke="currentColor" strokeWidth="2" />
                            <polygon points="100,60 100,90 70,60" />
                        </svg>
                    </div>

                    {/* Abstract city/farm background bottom */}
                    <div className="absolute bottom-0 w-full h-32 opacity-10 pointer-events-none flex items-end justify-center px-4">
                        <div className="w-full h-24 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=600')] bg-cover bg-bottom opacity-30 grayscale-[1]" style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}></div>
                    </div>

                    {/* Agrilync Logo & Verified Badge */}
                    <div className="w-full px-6 pt-12 flex justify-between items-start z-10 relative">
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1.5 text-[#C6EB4C]">
                                <Leaf className="w-5 h-5" fill="currentColor" />
                                <span className="font-montserrat font-black text-sm tracking-widest text-[#C6EB4C]">AGRILYNC</span>
                            </div>
                            <span className="text-[7.5px] font-bold text-white/50 tracking-widest uppercase ml-1 block mt-0.5">Nexus Command</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-[#C6EB4C]/20 border border-[#C6EB4C]/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#C6EB4C]" />
                                <span className="text-[8px] font-black text-[#C6EB4C] uppercase tracking-wider">Verified</span>
                            </div>
                            <span className="text-[7px] text-white/40 mt-1 uppercase font-bold tracking-widest">ID: {farmer.id || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="mt-6 mb-3 relative z-10">
                        <div className="w-[100px] h-[100px] rounded-full border-[3px] border-[#C6EB4C] p-1 bg-[#1C1F21]">
                            <img src={profileSrc} crossOrigin="anonymous" alt={farmer.name} className="w-full h-full object-cover rounded-full bg-white" />
                        </div>
                    </div>

                    {/* Name & Role */}
                    <div className="text-center w-full px-6 z-10">
                        <h2 className="text-[#C6EB4C] font-black text-3xl leading-none tracking-tight break-words capitalize mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {farmer.name?.split(' ')[0]}
                            <br />
                            <span className="text-white">{farmer.name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                        <div className="bg-[#484A48] inline-block px-3 py-1 mt-1 rounded-full border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C6EB4C]">
                                GROWER
                            </span>
                        </div>
                    </div>

                    {/* Grower Stats */}
                    <div className="w-full px-6 mt-5 z-10 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#C6EB4C] shrink-0" />
                            <p className="text-[10px] text-white/70 font-medium leading-tight">
                                <span className="text-white font-bold block">{farmer.region} • {farmer.district}</span>
                                {farmer.farmType === 'crop' ? farmer.cropsGrown || 'Crop Cultivation' : farmer.livestockType || 'Livestock Farm'} • {farmer.farmSize || 0} Acres
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative"></div>

                    {/* Footer Info & QR */}
                    <div className="w-full px-6 flex justify-between items-end z-10 relative mt-4">
                        <div className="flex flex-col gap-1.5 pb-2">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-[#C6EB4C] uppercase tracking-widest">Valid From</span>
                                <span className="text-[9px] font-bold text-white">{issueDate}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-[#C6EB4C] uppercase tracking-widest">Expires</span>
                                <span className="text-[9px] font-bold text-white/50">{expiryDate}</span>
                            </div>
                            <div className="flex flex-col mt-1">
                                <span className="text-[7px] font-black text-[#C6EB4C] uppercase tracking-widest">Platform Support</span>
                                <span className="text-[8px] font-bold text-white/50">support@agrilync.com</span>
                            </div>
                        </div>

                        {/* QR Box bottom right */}
                        <div className="bg-[#C6EB4C] p-1.5 rounded-xl shadow-lg border-2 border-transparent">
                            <img src={qrSrc} crossOrigin="anonymous" alt="QR" className="w-14 h-14 rounded-lg mix-blend-multiply" />
                            <div className="text-center mt-1">
                                <span className="text-[7px] font-black text-[#292D30] uppercase tracking-widest block">ID CARD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-6 w-full justify-center">
                    <Button onClick={handlePrint} className="bg-[#065f46] hover:bg-[#044e3a] text-white rounded-xl px-6 font-bold shadow-lg shadow-[#065f46]/20 border-none h-12">
                        <Printer className="w-4 h-4 mr-2" />
                        Print ID Card
                    </Button>
                    <Button onClick={handleDownload} className="bg-white hover:bg-gray-50 text-[#002f37] rounded-xl px-6 font-bold shadow-md border border-gray-200 h-12">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF/Image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FarmerIdCardModal;
