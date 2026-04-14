import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AlertTriangle,
    MessageSquare,
    User,
    ArrowRight,
    BadgeAlert,
    Clock,
    Filter,
    MoreHorizontal,
    Flag,
    ShieldAlert,
    AlertCircle,
    ArrowUpRight,
    MapPin,
    Zap,
    Building2,
    Activity,
    Bell,
    CheckCircle2,
    Search,
    ChevronDown,
    CircleDot,
    UserPlus,
    FileText,
    History,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { toast } from 'sonner';

const Escalations = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [internalNote, setInternalNote] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/super-admin/escalations');
            if (res.data && res.data.length > 0) {
                setTickets(res.data);
            } else {
                // High-fidelity ticket mock data
                setTickets([
                    { id: 'TKT-10293', category: 'Disbursement', issue: 'Blocked Outbound Payment (GH₵ 12,400)', region: 'Ashanti', agent: 'Kwame Mensah', priority: 'Critical', status: 'Open', date: '2026-04-05T14:30:00Z', notes: [{ sender: 'Agent', text: 'Farmer is expecting disbursement for seedlings.', time: '1 hour ago' }] },
                    { id: 'TKT-10298', category: 'Data Error', issue: 'Identity Verification Collision', region: 'Greater Accra', agent: 'Sister Deborah', priority: 'High', status: 'Assigned', assignee: 'Super Admin Alpha', date: '2026-04-05T10:15:00Z', notes: [] },
                    { id: 'TKT-10302', category: 'Regional Lead', issue: 'Zone A-4 Inspection Failure', region: 'Western', agent: 'Abena Osei', priority: 'Medium', status: 'Open', date: '2026-04-04T16:00:00Z', notes: [] },
                    { id: 'TKT-10305', category: 'Disbursement', issue: 'Invalid Wallet Matrix ID', region: 'Volta', agent: 'John Dumelo', priority: 'Critical', status: 'Resolved', date: '2026-04-03T08:20:00Z', notes: [{ sender: 'System', text: 'Resolved via Root Patch.', time: 'Yesterday' }] },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = (ticketId: string) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
        setIsDetailOpen(false);
        toast.success(`Ticket ${ticketId} marked as resolved.`);
    };

    const handleAddNote = () => {
        if (!internalNote) return;
        toast.success('Internal audit note recorded.');
        setInternalNote('');
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'bg-rose-500 text-white animate-pulse border-none shadow-[0_0_12px_rgba(244,63,94,0.3)]';
            case 'high': return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-none';
            case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-none';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-none';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open': return 'bg-rose-500/10 text-rose-500';
            case 'assigned': return 'bg-blue-500/10 text-blue-500';
            case 'resolved': return 'bg-[#7ede56]/10 text-[#7ede56]';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
        return matchesCategory && matchesStatus;
    });

    const openCount = tickets.filter(t => t.status === 'Open').length;
    const criticalCount = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shadow-inner">
                            <BadgeAlert className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Support Tickets
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage and resolve technical and operational issues
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-black/5">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Open Tickets</p>
                            <p className="text-sm font-black text-rose-500">{openCount}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">High Priority</p>
                            <p className="text-sm font-black text-rose-600 animate-pulse">{criticalCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtering Matrix */}
            <Card className={`border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input placeholder="Search ticket ID, issue, agent..." className="pl-12 h-12 rounded-xl border-none shadow-inner bg-gray-50 dark:bg-gray-800" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select onValueChange={setFilterCategory} defaultValue="All">
                            <SelectTrigger className="h-12 w-[160px] rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-black text-[10px] uppercase tracking-widest shadow-inner">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="border-none shadow-2xl rounded-xl">
                                <SelectItem value="All">All Categories</SelectItem>
                                <SelectItem value="Disbursement">Disbursement</SelectItem>
                                <SelectItem value="Data Error">Data Error</SelectItem>
                                <SelectItem value="Regional Lead">Regional Lead</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setFilterStatus} defaultValue="All">
                            <SelectTrigger className="h-12 w-[160px] rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-black text-[10px] uppercase tracking-widest shadow-inner">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="border-none shadow-2xl rounded-xl">
                                <SelectItem value="All">All Status</SelectItem>
                                <SelectItem value="Open">Unassigned (Open)</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Ticket Feed Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTickets.map(ticket => (
                    <Card 
                        key={ticket.id} 
                        className={`border-none shadow-premium overflow-hidden group hover:translate-x-2 transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}
                        onClick={() => { setSelectedTicket(ticket); setIsDetailOpen(true); }}
                    >
                        <div className={`absolute top-0 left-0 h-full w-1.5 ${ticket.priority === 'Critical' ? 'bg-rose-500' : (ticket.priority === 'High' ? 'bg-rose-400' : 'bg-amber-400')}`}></div>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <Badge className={`px-3 py-0.5 text-[9px] font-black uppercase tracking-widest ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</Badge>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{ticket.id}</span>
                                        <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-widest">{ticket.category}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-2">{ticket.issue}</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {ticket.region}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                <User className="w-3.5 h-3.5 text-[#7ede56]" /> {ticket.agent}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {new Date(ticket.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <Badge className={`border-none rounded-lg font-black text-[9px] px-3 py-1 uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status}
                                        </Badge>
                                        {ticket.assignee && <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase">BY: {ticket.assignee}</p>}
                                    </div>
                                    <Button className="h-14 w-14 rounded-2xl bg-gray-100 hover:bg-[#7ede56] hover:text-[#002f37] dark:bg-gray-800 transition-all p-0">
                                        <ChevronDown className="w-5 h-5 -rotate-90" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ticket Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className={`sm:max-w-[700px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedTicket && (
                        <div className="flex flex-col">
                            <div className="p-8 pb-12 bg-[#002f37] text-white relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Badge className={`${getPriorityStyle(selectedTicket.priority)} text-[9px] px-3 font-black uppercase`}>{selectedTicket.priority}</Badge>
                                    <Badge className={`${getStatusStyle(selectedTicket.status)} border-none text-[9px] px-3 font-black uppercase`}>{selectedTicket.status}</Badge>
                                </div>
                                <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.3em] mb-3">TICKET DETAILS</p>
                                <h2 className="text-3xl font-black uppercase tracking-tighter max-w-lg leading-none">{selectedTicket.issue}</h2>
                            </div>

                            <div className="px-8 -mt-6 rounded-t-[32px] bg-white dark:bg-gray-950 relative z-10 pt-8 pb-8 flex flex-col md:flex-row gap-8 min-h-[450px]">
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><History className="w-4 h-4" /> Notes & Activity</h4>
                                        <div className="space-y-4">
                                            {selectedTicket.notes.length > 0 ? selectedTicket.notes.map((note: any, i: number) => (
                                                <div key={i} className={`p-4 rounded-xl ${note.sender === 'Agent' ? 'bg-gray-50 dark:bg-gray-900 border-l-4 border-blue-500' : 'bg-emerald-500/5 border-l-4 border-[#7ede56]'}`}>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-[9px] font-black uppercase text-gray-500">{note.sender} Observation</span>
                                                        <span className="text-[8px] font-bold text-gray-400">{note.time}</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed">{note.text}</p>
                                                </div>
                                            )) : (
                                                <div className="py-10 text-center opacity-30 text-[10px] font-black tracking-widest uppercase">No preliminary notes recorded</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><MessageSquare className="w-4 h-4" /> Staff Notes (Internal)</h4>
                                        <Textarea 
                                            placeholder="Append internal audit findings..." 
                                            className="h-28 rounded-2xl border-none shadow-inner bg-gray-50 dark:bg-gray-900 text-sm p-4"
                                            value={internalNote}
                                            onChange={(e) => setInternalNote(e.target.value)}
                                        />
                                        <div className="flex items-center justify-between px-1">
                                            <p className="text-[8px] font-bold text-rose-500/50 uppercase tracking-tighter">* Notes here are invisible to field agents</p>
                                            <Button variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest" onClick={handleAddNote}>Commit Observation</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-64 space-y-8 pb-4">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Information</h4>
                                        <div className="space-y-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-black/5">
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">Region Impact</p><p className="text-[10px] font-black">{selectedTicket.region}</p></div>
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">Reporting Agent</p><p className="text-[10px] font-black">{selectedTicket.agent}</p></div>
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">Created On</p><p className="text-[10px] font-black">{new Date(selectedTicket.date).toLocaleString()}</p></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button className="w-full h-12 bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg" onClick={() => handleResolve(selectedTicket.id)}>
                                            Mark Resolved
                                        </Button>
                                        <Button variant="outline" className="w-full h-12 border-blue-500/20 text-blue-500 hover:bg-blue-50 font-black uppercase text-[10px] tracking-widest rounded-xl">
                                            <UserPlus className="w-4 h-4 mr-2" /> Delegate
                                        </Button>
                                        <Button variant="ghost" className="w-full h-12 text-rose-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-50">
                                            Force Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Escalations;
