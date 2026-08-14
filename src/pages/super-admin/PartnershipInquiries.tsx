import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Handshake,
    Search,
    Mail,
    Building2,
    Clock,
    RefreshCw,
} from 'lucide-react';
import api from '@/utils/api';
import { parseApiList } from '@/utils/parseApiList';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { toast } from 'sonner';

interface PartnershipInquiry {
    _id: string;
    name: string;
    email: string;
    organization?: string;
    role: string;
    message: string;
    status: 'New' | 'Contacted' | 'Closed';
    createdAt: string;
}

const STATUS_OPTIONS: PartnershipInquiry['status'][] = ['New', 'Contacted', 'Closed'];

const statusBadgeClass = (status: string) => {
    switch (status) {
        case 'New':
            return 'bg-[#7ede56]/15 text-[#3d8c1c] border-none';
        case 'Contacted':
            return 'bg-blue-500/10 text-blue-600 border-none';
        case 'Closed':
            return 'bg-gray-200 text-gray-600 border-none';
        default:
            return 'bg-gray-100 text-gray-600 border-none';
    }
};

const PartnershipInquiries = () => {
    const { darkMode } = useDarkMode();
    const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | PartnershipInquiry['status']>('All');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/partnership');
            setInquiries(parseApiList<PartnershipInquiry>(res.data));
        } catch (err) {
            console.error('Failed to fetch partnership inquiries:', err);
            toast.error('Could not load partnership inquiries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filtered = useMemo(() => {
        return inquiries.filter((inq) => {
            const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !q ||
                inq.name.toLowerCase().includes(q) ||
                inq.email.toLowerCase().includes(q) ||
                (inq.organization || '').toLowerCase().includes(q) ||
                inq.role.toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [inquiries, searchQuery, statusFilter]);

    const counts = useMemo(
        () => ({
            total: inquiries.length,
            new: inquiries.filter((i) => i.status === 'New').length,
            contacted: inquiries.filter((i) => i.status === 'Contacted').length,
            closed: inquiries.filter((i) => i.status === 'Closed').length,
        }),
        [inquiries]
    );

    const updateStatus = async (id: string, status: PartnershipInquiry['status']) => {
        setUpdatingId(id);
        try {
            await api.patch(`/partnership/${id}/status`, { status });
            setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
            toast.success(`Marked as ${status}`);
        } catch (err) {
            console.error('Failed to update inquiry status:', err);
            toast.error('Could not update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#3d8c1c]">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Partnership Inquiries
                        </h1>
                    </div>
                    <p className={`text-sm ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Institution, investor, and partner messages submitted from the website.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchInquiries}
                    disabled={loading}
                    className="gap-2 w-full md:w-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Summary tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: 'Total', value: counts.total, color: 'text-[#002f37] dark:text-white' },
                    { label: 'New', value: counts.new, color: 'text-[#3d8c1c]' },
                    { label: 'Contacted', value: counts.contacted, color: 'text-blue-600' },
                    { label: 'Closed', value: counts.closed, color: 'text-gray-500' },
                ].map((tile) => (
                    <Card key={tile.label} className={darkMode ? 'bg-gray-900 border-gray-800' : ''}>
                        <CardContent className="p-3 sm:p-4">
                            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 truncate">
                                {tile.label}
                            </p>
                            <p className={`text-xl sm:text-2xl font-bold ${tile.color}`}>{tile.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={darkMode ? 'bg-gray-900 border-gray-800' : ''}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Inbox</CardTitle>
                            <CardDescription>Newest submissions first</CardDescription>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search name, org, email..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 md:mx-0 md:px-0 md:flex-wrap">
                                {(['All', ...STATUS_OPTIONS] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                                            statusFilter === s
                                                ? 'bg-[#002f37] text-white'
                                                : darkMode
                                                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-10 flex items-center justify-center">
                            <div className="animate-spin w-6 h-6 border-2 border-[#7ede56] border-t-transparent rounded-full" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            No partnership inquiries match your filters.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filtered.map((inq) => (
                                <div key={inq._id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className={`font-bold break-words ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                {inq.name}
                                            </span>
                                            <Badge className={statusBadgeClass(inq.status)}>{inq.status}</Badge>
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                                {inq.role}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                                            <a
                                                href={`mailto:${inq.email}`}
                                                className="flex items-center gap-1.5 hover:text-[#3d8c1c] break-all"
                                            >
                                                <Mail className="w-3.5 h-3.5 shrink-0" /> {inq.email}
                                            </a>
                                            {inq.organization && (
                                                <span className="flex items-center gap-1.5 break-words">
                                                    <Building2 className="w-3.5 h-3.5 shrink-0" /> {inq.organization}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                                {new Date(inq.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {inq.message}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 md:flex md:flex-col gap-2 shrink-0 md:w-36">
                                        {STATUS_OPTIONS.filter((s) => s !== inq.status).map((s) => (
                                            <Button
                                                key={s}
                                                size="sm"
                                                variant="outline"
                                                disabled={updatingId === inq._id}
                                                onClick={() => updateStatus(inq._id, s)}
                                                className="text-xs"
                                            >
                                                Mark {s}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PartnershipInquiries;
