import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, User, MapPin, Sprout, Phone, AlertCircle } from 'lucide-react';
import AgriLyncLogo from '@/components/brand/AgriLyncLogo';
import api from '@/utils/api';

type PublicGrower = {
    name: string;
    lyncId: string;
    digitalCardNumber?: string | null;
    age?: number | null;
    yearsOfExperience?: number | null;
    region: string;
    district: string;
    community: string;
    farmType: string;
    status: string;
    profilePicture?: string;
    fieldAgent?: string;
    fieldAgentId?: string;
    verified: boolean;
    cardIssuedAt?: string | null;
    memberSince?: string;
};

const GrowerVerify: React.FC = () => {
    const { lyncId } = useParams<{ lyncId: string }>();
    const [grower, setGrower] = useState<PublicGrower | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrower = async () => {
            if (!lyncId) {
                setError('Invalid verification link.');
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/farmers/public/verify/${encodeURIComponent(lyncId)}`);
                setGrower(res.data?.grower || null);
                if (!res.data?.grower) setError('Grower record not found.');
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Could not verify this grower ID.');
            } finally {
                setLoading(false);
            }
        };
        fetchGrower();
    }, [lyncId]);

    const profileSrc =
        grower?.profilePicture ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(grower?.name || 'Grower')}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#eef3f1] to-[#f8fafc] flex flex-col">
            <header className="bg-[#002f37] px-6 py-5">
                <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
                    <AgriLyncLogo variant="onDark" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ede56]">
                        ID Verification
                    </span>
                </div>
            </header>

            <main className="flex-1 px-4 py-8">
                <div className="max-w-lg mx-auto">
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="h-10 w-10 border-4 border-[#7ede56]/20 border-t-[#7ede56] rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h1 className="text-xl font-black text-[#002f37] mb-2">Verification Failed</h1>
                            <p className="text-sm text-gray-500">{error}</p>
                            <Link
                                to="/"
                                className="inline-block mt-6 text-sm font-bold text-[#065f46] hover:underline"
                            >
                                Return to AgriLync
                            </Link>
                        </div>
                    )}

                    {!loading && grower && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                            <div className="bg-[#065f46] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <ShieldCheck className="h-5 w-5 text-[#7ede56]" />
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        Verified Grower Profile
                                    </span>
                                </div>
                                {grower.verified && (
                                    <span className="text-[10px] font-black uppercase bg-[#7ede56] text-[#002f37] px-3 py-1 rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>

                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={profileSrc}
                                        alt={grower.name}
                                        className="h-20 w-20 rounded-2xl object-cover border-4 border-[#7ede56]/20 shadow-md"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-[#065f46] uppercase tracking-widest">
                                            Grower Name
                                        </p>
                                        <h1 className="text-xl font-black text-[#002f37] uppercase leading-tight">
                                            {grower.name}
                                        </h1>
                                        <p className="text-sm font-mono font-bold text-[#065f46] mt-1">{grower.lyncId}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Detail icon={User} label="Card number" value={grower.digitalCardNumber || '—'} mono />
                                    <Detail icon={User} label="Age" value={grower.age != null ? `${grower.age} years` : '—'} />
                                    <Detail
                                        icon={Sprout}
                                        label="Years of experience"
                                        value={grower.yearsOfExperience != null ? `${grower.yearsOfExperience} yrs (verified)` : '—'}
                                    />
                                    <Detail icon={MapPin} label="Region" value={grower.region} />
                                    <Detail icon={MapPin} label="District" value={grower.district} />
                                    <Detail icon={MapPin} label="Community" value={grower.community} />
                                    <Detail icon={Sprout} label="Farm type" value={grower.farmType} />
                                    <Detail icon={User} label="Field agent" value={grower.fieldAgent || '—'} />
                                    <Detail icon={Phone} label="Agent ID" value={grower.fieldAgentId || '—'} mono />
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl bg-[#eefcf0] border border-[#7ede56]/20 px-4 py-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#065f46] shrink-0" />
                                    <p className="text-xs font-medium text-[#065f46] leading-relaxed">
                                        This profile was issued by AgriLync. Scan authenticity is confirmed for grower{' '}
                                        <span className="font-mono font-bold">{grower.lyncId}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const Detail: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    mono?: boolean;
}> = ({ icon: Icon, label, value, mono }) => (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-1">
            <Icon className="h-3.5 w-3.5 text-[#065f46]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
        </div>
        <p className={`text-sm font-bold text-[#002f37] ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
    </div>
);

export default GrowerVerify;
