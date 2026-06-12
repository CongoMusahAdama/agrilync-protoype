import React from 'react';
import { CheckCircle2, Globe, Mail, MapPin, ShieldCheck, Star } from 'lucide-react';
import AgriLyncLogo, { AgriLyncLogoWatermark } from '@/components/brand/AgriLyncLogo';
import { buildGrowerVerifyUrl, getGrowerDisplayId } from '@/utils/growerId';
import { buildGrowerCardData, type GrowerCardData } from '@/utils/growerCard';
import { CONTACT_EMAIL } from '@/lib/communityLinks';

const SUPPORT_EMAIL = 'agrilync@gmail.com';
const CARD_SUPPORT_EMAIL = CONTACT_EMAIL || SUPPORT_EMAIL;

export interface GrowerIdCardVisualProps {
    farmer: any;
    className?: string;
    /** Show only front or back (default: both) */
    side?: 'front' | 'back' | 'both';
    /** Hide Front/Back labels above each face (used in capture context) */
    hideFaceLabels?: boolean;
}

const CARD_BG: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(
        127deg,
        transparent,
        transparent 10px,
        rgba(0, 47, 55, 0.025) 10px,
        rgba(0, 47, 55, 0.025) 11px
    )`,
};

const HeaderBand = () => (
    <div className="relative z-[1] shrink-0 bg-[#002f37] overflow-hidden h-[52px]">
        <div className="absolute inset-0 opacity-50">
            <div className="absolute -left-6 top-0 h-full w-28 bg-[#065f46] skew-x-[-14deg]" />
            <div className="absolute left-16 top-0 h-full w-20 bg-[#7ede56]/25 skew-x-[-14deg]" />
            <div className="absolute left-32 top-0 h-full w-16 bg-[#065f46]/40 skew-x-[-14deg]" />
        </div>
        <div className="relative z-[1] h-full flex items-center justify-between px-4 gap-2">
            <div className="min-w-0">
                <p className="text-[7px] font-black text-[#7ede56] uppercase tracking-[0.28em] leading-none">
                    Operational Credential
                </p>
                <p className="text-[10px] font-bold text-white/90 mt-0.5 leading-none">Grower Identity Card</p>
            </div>
            <AgriLyncLogo variant="onDark" iconClassName="h-9" className="shrink-0 origin-right scale-105" />
        </div>
    </div>
);

const FooterBand = () => (
    <div className="relative shrink-0 h-[22px] bg-[#065f46] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
            <div className="absolute -right-4 top-0 h-full w-24 bg-[#7ede56]/30 skew-x-[-12deg]" />
            <div className="absolute right-16 top-0 h-full w-16 bg-[#002f37]/50 skew-x-[-12deg]" />
        </div>
        <span className="relative z-[1] text-[6px] font-black text-[#7ede56] uppercase tracking-[0.22em]">
            AgriLync Digital Trust Ecosystem · v2.4
        </span>
    </div>
);

const DetailRow = ({
    label,
    value,
    mono,
    accent,
}: {
    label: string;
    value: string;
    mono?: boolean;
    accent?: boolean;
}) => (
    <div className="min-w-0">
        <p className="card-label text-[7px] font-black text-[#065f46]/60 uppercase tracking-widest leading-none mb-0.5">
            {label}
        </p>
        <p
            className={`card-value text-[10px] font-bold text-[#002f37] leading-snug break-words ${
                mono ? 'font-mono' : ''
            } ${accent ? 'text-[#065f46] font-black' : ''}`}
        >
            {value}
        </p>
    </div>
);

const CardShell = ({
    children,
    hideFaceLabels,
    label,
    faceId,
}: {
    children: React.ReactNode;
    hideFaceLabels?: boolean;
    label?: string;
    faceId?: 'front' | 'back';
}) => (
    <div className="flex flex-col items-center gap-1.5">
        {label && !hideFaceLabels && (
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50">{label}</span>
        )}
        <div
            data-card-face={faceId}
            className="grower-id-card-face relative w-[min(100vw-2rem,580px)] rounded-xl flex flex-col bg-white border border-gray-200/90 shadow-xl overflow-hidden"
            style={{
                aspectRatio: '1.586 / 1',
                minHeight: 378,
                fontFamily: '"Inter", sans-serif',
                ...CARD_BG,
            }}
        >
            {children}
        </div>
    </div>
);

const GrowerIdCardFront = ({ data, hideFaceLabels }: { data: GrowerCardData; hideFaceLabels?: boolean }) => {
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(data.verifyUrl)}&bgcolor=ffffff&color=002f37&margin=2`;

    return (
        <CardShell hideFaceLabels={hideFaceLabels} label="Front" faceId="front">
            <HeaderBand />
            <div className="relative z-[2] flex-1 grid min-h-0 overflow-hidden items-stretch grid-cols-[31%_1fr_68px] px-3 pt-3">
                <AgriLyncLogoWatermark className="absolute inset-0 z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center self-start pb-1 pr-0.5">
                    <div className="relative shrink-0 mb-2.5">
                        <div className="w-[100px] h-[100px] rounded-full border-[4px] border-white shadow-lg overflow-hidden bg-[#eef3f1] ring-2 ring-[#065f46]/25">
                            <img
                                src={data.profileSrc}
                                crossOrigin="anonymous"
                                alt={data.name}
                                className="w-full h-full object-cover block scale-[1.02]"
                                style={{ objectPosition: '50% 22%' }}
                                onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.dataset.fallback) {
                                        img.dataset.fallback = '1';
                                        img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`;
                                    }
                                }}
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 z-10 bg-[#7ede56] text-[#002f37] p-1 rounded-full border-2 border-white shadow-md">
                            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center gap-1 px-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#065f46]/10 rounded-full border border-[#065f46]/15">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#065f46] shrink-0" strokeWidth={2.5} />
                            <span className="text-[7px] font-black text-[#065f46] uppercase tracking-wide leading-none">
                                Lync Grower
                            </span>
                        </div>
                        <span className="text-[7px] font-black text-[#002f37]/80 uppercase tracking-wide text-center leading-tight">
                            {data.farmTypeLabel}
                        </span>
                    </div>

                    <div className="w-full space-y-1 px-1.5 text-left mt-2.5">
                        <DetailRow label="D.O.B." value={data.dobLabel} />
                        <DetailRow label="Date Issued" value={data.issueDate} />
                        <DetailRow label="Gender" value={data.gender} />
                    </div>
                </div>

                <div className="relative z-10 flex min-w-0 self-stretch py-1">
                    <div className="flex flex-1 flex-col justify-center items-center min-w-0 px-1 gap-2.5">
                        <div className="w-full flex flex-col items-center">
                            <h2
                                className="text-[#002f37] font-black text-sm uppercase leading-tight break-words text-center max-w-[15rem]"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                {data.name}
                            </h2>
                            <p className="font-bold text-[#065f46] uppercase tracking-wide mt-1 text-center text-[9px]">
                                {data.farmTypeLabel}
                            </p>

                            <div className="w-full grid grid-cols-2 mx-auto text-left mt-3 max-w-[15rem] gap-x-3 gap-y-2">
                                <DetailRow label="Grower ID" value={data.growerId} mono accent />
                                <DetailRow label="Card No." value={data.cardNumber} mono accent />
                                <DetailRow
                                    label="Age"
                                    value={data.age != null ? `${data.age} Years` : '—'}
                                />
                                <DetailRow label="Region" value={data.region} />
                                <DetailRow label="District" value={data.district} />
                                <DetailRow label="Community" value={data.community} />
                            </div>
                        </div>

                        <div className="w-full max-w-[15rem] mx-auto border-t border-dashed border-[#065f46]/20 text-center pt-2">
                            <p className="text-[6px] text-gray-500 uppercase tracking-widest">Authorized Issue</p>
                            <p className="font-black text-[#065f46] italic text-[8px]">AgriLync Field Network</p>
                            <p className="font-semibold text-[#065f46]/85 mt-0.5 text-[7px]">{CARD_SUPPORT_EMAIL}</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 shrink-0 flex flex-col items-center self-end pb-1">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#7ede56]/10 border border-[#7ede56]/20 mb-1.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#065f46] shrink-0" />
                        <span className="text-[6px] font-black text-[#065f46] uppercase leading-none">Secured</span>
                    </div>
                    <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">
                        Scan to Verify
                    </p>
                    <div className="bg-white p-1 rounded-md border border-gray-200 shadow-sm">
                        <img
                            src={qrSrc}
                            crossOrigin="anonymous"
                            alt={`QR ${data.growerId}`}
                            className="block w-[52px] h-[52px]"
                        />
                    </div>
                </div>
            </div>
            <FooterBand />
        </CardShell>
    );
};

const GrowerIdCardBack = ({ data, hideFaceLabels }: { data: GrowerCardData; hideFaceLabels?: boolean }) => {
    const barcodeSrc = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(
        data.cardNumber
    )}&scale=2&height=8&includetext=false&backgroundcolor=ffffff`;

    return (
        <CardShell hideFaceLabels={hideFaceLabels} label="Back" faceId="back">
            <HeaderBand />
            <div className="relative flex-1 flex min-h-0 overflow-hidden z-[2]">
                <AgriLyncLogoWatermark className="z-0" />

                <div className="relative z-10 flex flex-1 min-w-0 min-h-0">
                    <div className="w-[55%] border-r border-dashed border-[#065f46]/25 px-3 py-2.5 flex flex-col min-w-0 min-h-0 text-left">
                        <div className="mb-2">
                            <p className="text-[11px] font-black text-[#002f37] uppercase leading-tight">{data.name}</p>
                            <p className="text-[8px] font-bold text-[#065f46] uppercase">{data.farmTypeLabel}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-y-2 flex-1 content-start text-left">
                            <DetailRow label="Grower ID" value={data.growerId} mono />
                            <DetailRow label="Card Number" value={data.cardNumber} mono accent />
                            <DetailRow label="Phone" value={data.contact} mono />
                            <DetailRow
                                label="Years of Experience"
                                value={
                                    data.yearsExp != null
                                        ? `${data.yearsExp} Yrs · Verified`
                                        : '—'
                                }
                            />
                            <DetailRow
                                label="Field Agent"
                                value={
                                    data.fieldAgentName !== '—'
                                        ? `${data.fieldAgentName} (${data.fieldAgent})`
                                        : data.fieldAgent
                                }
                            />
                            <DetailRow label="Zone / District" value={data.district} />
                            <DetailRow label="Community" value={data.community} />
                            <DetailRow label="Date Issued" value={data.issueDate} />
                        </div>

                        <div className="shrink-0 mt-2 pt-2 border-t border-[#065f46]/10">
                            <img
                                src={barcodeSrc}
                                crossOrigin="anonymous"
                                alt={`Barcode ${data.cardNumber}`}
                                className="h-8 w-full max-w-[200px] object-contain object-left"
                            />
                            <p className="text-[6px] font-mono text-gray-400 mt-0.5">{data.cardNumber}</p>
                        </div>
                    </div>

                    <div className="flex-1 px-3 py-2.5 flex flex-col min-w-0 min-h-0 text-left">
                        <div className="flex justify-end mb-3">
                            <AgriLyncLogo variant="onLight" iconClassName="h-8" />
                        </div>

                        <p className="text-[7px] font-black text-[#065f46] uppercase tracking-widest mb-2">
                            Verification & Support
                        </p>

                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2">
                                <Globe className="w-3 h-3 text-[#065f46] shrink-0 mt-0.5" />
                                <div className="min-w-0 text-left">
                                    <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Website</p>
                                    <p className="text-[8px] font-bold text-[#002f37] leading-snug mt-0.5">www.agrilync.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-3 h-3 text-[#065f46] shrink-0 mt-0.5" />
                                <div className="min-w-0 text-left">
                                    <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Support Email</p>
                                    <p className="text-[8px] font-bold text-[#002f37] break-all leading-snug mt-0.5">
                                        {CARD_SUPPORT_EMAIL}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 text-[#065f46] shrink-0 mt-0.5" />
                                <div className="min-w-0 text-left">
                                    <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Region</p>
                                    <p className="text-[8px] font-bold text-[#002f37] leading-snug mt-0.5">{data.region}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto rounded-lg bg-[#065f46]/5 border border-[#065f46]/10 p-2">
                            <div className="flex items-center gap-1 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-2.5 h-2.5 ${
                                            i < data.stars
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-gray-100 text-gray-200'
                                        }`}
                                    />
                                ))}
                                <span className="text-[6px] font-black text-[#065f46] uppercase ml-1">Verified</span>
                            </div>
                            <p className="text-[6px] text-[#002f37]/70 leading-relaxed">
                                This card is issued by AgriLync. Scan the QR on the front to confirm grower{' '}
                                <span className="font-mono font-bold">{data.growerId}</span>. Report suspected
                                forgery to your field agent or {CARD_SUPPORT_EMAIL}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <FooterBand />
        </CardShell>
    );
};

const GrowerIdCardVisual = React.forwardRef<HTMLDivElement, GrowerIdCardVisualProps>(
    ({ farmer, className = '', side = 'both', hideFaceLabels = false }, ref) => {
        const growerId = getGrowerDisplayId(farmer);
        const verifyUrl = buildGrowerVerifyUrl(growerId);
        const data = buildGrowerCardData(farmer, growerId, verifyUrl);

        if (side === 'front') {
            return (
                <div ref={ref} className={className}>
                    <GrowerIdCardFront data={data} hideFaceLabels={hideFaceLabels} />
                </div>
            );
        }

        if (side === 'back') {
            return (
                <div ref={ref} className={className}>
                    <GrowerIdCardBack data={data} hideFaceLabels={hideFaceLabels} />
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={`grower-id-card-root flex flex-col items-center gap-6 ${className}`}
            >
                <GrowerIdCardFront data={data} hideFaceLabels={hideFaceLabels} />
                <GrowerIdCardBack data={data} hideFaceLabels={hideFaceLabels} />
            </div>
        );
    }
);

GrowerIdCardVisual.displayName = 'GrowerIdCardVisual';

export default GrowerIdCardVisual;
