import React from 'react';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import AgriLyncLogo from '@/components/brand/AgriLyncLogo';
import { buildGrowerVerifyUrl, getGrowerDisplayId } from '@/utils/growerId';
import {
    calcGrowerAge,
    experienceStarCount,
    formatCardIssueDate,
    getDigitalCardNumber,
    parseYearsOfExperience,
} from '@/utils/growerCard';

export interface GrowerIdCardVisualProps {
    farmer: any;
    /** Slightly larger layout for print/download capture */
    printMode?: boolean;
    className?: string;
}

const GrowerIdCardVisual = React.forwardRef<HTMLDivElement, GrowerIdCardVisualProps>(
    ({ farmer, printMode = false, className = '' }, ref) => {
        const growerId = getGrowerDisplayId(farmer);
        const cardNumber = getDigitalCardNumber(farmer);
        const verifyUrl = buildGrowerVerifyUrl(growerId);
        const qrSize = printMode ? 160 : 120;
        const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=002f37&margin=1`;

        const profileSrc =
            farmer.profilePicture ||
            farmer.avatar ||
            farmer.photo ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(farmer.name || 'Grower')}`;

        const age = calcGrowerAge(farmer.dob);
        const yearsExp = parseYearsOfExperience(farmer.yearsOfExperience);
        const stars = experienceStarCount(yearsExp ?? 0);
        const issueDate = formatCardIssueDate(farmer.digitalCardIssuedAt);

        const district = farmer.district || farmer.region || '—';
        const community = farmer.community || '—';
        const fieldAgent =
            farmer.agent?.agentId || farmer.agentId || farmer.onboardingAgentId || '—';

        const widthClass = printMode ? 'w-[680px]' : 'w-[min(100vw-2rem,600px)]';

        return (
            <div
                ref={ref}
                className={`grower-id-card-root relative ${widthClass} rounded-2xl overflow-hidden flex flex-col bg-white shadow-2xl shrink-0 border border-gray-200/80 ${className}`}
                style={{ aspectRatio: '1.586 / 1', fontFamily: '"Inter", sans-serif' }}
            >
                <div className="flex items-center justify-between px-5 py-3 bg-[#002f37] shrink-0">
                    <AgriLyncLogo variant="onDark" iconClassName={printMode ? 'h-11 w-11' : 'h-9 w-9'} />
                    <div className="min-w-0 text-right">
                        <p className="card-label text-[9px] font-black text-[#7ede56] uppercase tracking-[0.35em] leading-none">
                            Operational Credential
                        </p>
                        <p className="text-[11px] font-bold text-white/80 mt-1">Grower Digital ID</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7ede56]/15 border border-[#7ede56]/25 shrink-0 ml-3">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#7ede56]" />
                        <span className="card-label text-[8px] font-black text-[#7ede56] uppercase tracking-wider">
                            Secured
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 min-h-0">
                    <div className="w-[32%] bg-gradient-to-br from-[#065f46]/8 to-[#002f37]/5 flex flex-col items-center justify-center px-3 py-4 border-r border-gray-100">
                        <div className="relative">
                            <div
                                className={`${printMode ? 'w-[120px] h-[120px]' : 'w-[96px] h-[96px]'} rounded-2xl border-[3px] border-white shadow-lg overflow-hidden bg-white`}
                            >
                                <img
                                    src={profileSrc}
                                    crossOrigin="anonymous"
                                    alt={farmer.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 bg-[#7ede56] text-[#002f37] p-1 rounded-lg shadow border-2 border-white">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <h2
                            className="mt-3 text-[#002f37] font-black text-xs text-center leading-snug uppercase px-1 break-words max-w-full"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            {farmer.name}
                        </h2>
                        <div className="flex items-center gap-1 mt-2 px-2.5 py-1 bg-[#065f46]/8 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#065f46]" />
                            <span className="card-label text-[8px] font-black text-[#065f46] uppercase tracking-wide">
                                Verified Partner
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="min-w-0">
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Grower ID
                                </span>
                                <span className="card-value text-[11px] font-black text-[#002f37] font-mono leading-tight break-all">
                                    {growerId}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Card Number
                                </span>
                                <span className="card-value text-[11px] font-black text-[#065f46] font-mono leading-tight break-all">
                                    {cardNumber}
                                </span>
                            </div>
                            <div>
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Age
                                </span>
                                <span className="card-value text-[12px] font-black text-[#002f37]">
                                    {age != null ? `${age} Years` : '—'}
                                </span>
                            </div>
                            <div>
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Years of Experience
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="card-value text-[12px] font-black text-[#002f37]">
                                        {yearsExp != null ? `${yearsExp} Yrs` : '—'}
                                    </span>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i < stars
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-gray-100 text-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[7px] font-black text-[#065f46] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#065f46]/10">
                                        Verified
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 col-span-1">
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Zone / District
                                </span>
                                <span className="card-value text-[11px] font-bold text-[#002f37] leading-snug break-words">
                                    {district}
                                </span>
                            </div>
                            <div className="min-w-0 col-span-1">
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Community
                                </span>
                                <span className="card-value text-[11px] font-bold text-[#002f37] leading-snug break-words">
                                    {community}
                                </span>
                            </div>
                            <div>
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Field Agent
                                </span>
                                <span className="card-value text-[11px] font-black text-[#002f37] font-mono">
                                    {fieldAgent}
                                </span>
                            </div>
                            <div>
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                                    Date Issued
                                </span>
                                <span className="card-value text-[11px] font-black text-[#002f37]">{issueDate}</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-end mt-2 pt-2 border-t border-gray-100">
                            <div className="text-right">
                                <span className="card-label text-[8px] font-black text-gray-400 uppercase tracking-widest block">
                                    Scannable Auth
                                </span>
                                <img
                                    src={qrSrc}
                                    crossOrigin="anonymous"
                                    alt={`QR code for ${growerId}`}
                                    className={`${printMode ? 'w-20 h-20' : 'w-16 h-16'} object-contain ml-auto mt-1`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-[#065f46] flex items-center justify-between gap-2 shrink-0">
                    <AgriLyncLogo variant="onDark" showWordmark={false} iconClassName="h-5 w-5" />
                    <span className="card-label text-[8px] font-black text-[#7ede56] uppercase tracking-[0.25em] text-center flex-1">
                        AgriLync Digital Trust Ecosystem
                    </span>
                    <span className="text-[7px] font-bold text-white/50 uppercase shrink-0">v2.4</span>
                </div>
            </div>
        );
    }
);

GrowerIdCardVisual.displayName = 'GrowerIdCardVisual';

export default GrowerIdCardVisual;
