import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
    AlertTriangle,
    User,
    Calendar,
    MessageSquare,
    CheckCircle,
    Clock,
    TrendingUp,
    Plus,
    ChevronRight,
    CalendarDays,
    UserCheck,
    FileText,
    Upload,
    Eye,
    Loader2
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ViewDisputeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dispute: any;
}

const ViewDisputeModal: React.FC<ViewDisputeModalProps> = ({ open, onOpenChange, dispute }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [activeTab, setActiveTab] = React.useState('summary');
    const [note, setNote] = React.useState('');
    const queryClient = useQueryClient();

    React.useEffect(() => {
        setNote('');
    }, [dispute?._id, dispute?.id]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.put(`/disputes/${dispute._id || dispute.id}`, data);
        },
        onSuccess: () => {
            toast.success('Dispute updated successfully');
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            setNote('');
            // Optional: Close modal on resolution or escalation if desired
            // if (activeTab === 'summary' && !note) onOpenChange(false);
        },
        onError: (err: any) => {
            console.error('Update Error:', err);
            toast.error(err.response?.data?.msg || 'Failed to update dispute');
        }
    });

    if (!dispute) return null;

    const isUpdating = updateMutation.isPending;

    const handleAddNote = () => {
        if (!note.trim()) {
            toast.error('Please enter a note');
            return;
        }
        updateMutation.mutate({
            notes: note,
            action: 'Agent added resolution note'
        });
    };

    const handleEscalate = () => {
        Swal.fire({
            title: 'Escalate Case?',
            text: 'This will move the dispute to the Super Admin for higher level review.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Escalate',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#e11d48',
        }).then((result) => {
            if (result.isConfirmed) {
                updateMutation.mutate({
                    status: 'Escalated',
                    action: 'Case escalated for higher review'
                });
            }
        });
    };

    const handleResolve = () => {
        Swal.fire({
            title: 'Resolve Dispute?',
            text: 'Are you sure this case has been satisfactorily settled?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Resolve',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#059669',
        }).then((result) => {
            if (result.isConfirmed) {
                updateMutation.mutate({
                    status: 'Resolved',
                    action: 'Case marked as resolved'
                });
            }
        });
    };

    const handleContact = (role: string, name: string) => {
        toast.info(`Initiating contact with ${role}: ${name}`);
        // Simulate logging contact attempt
        updateMutation.mutate({
            action: `Agent initiated contact with ${role} (${name})`
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Under Review': return 'bg-blue-100 text-blue-700';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700';
            case 'Escalated': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'text-rose-600';
            case 'Medium': return 'text-amber-600';
            case 'Low': return 'text-emerald-600';
            default: return 'text-gray-600';
        }
    };

    const tabs = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'parties', label: 'Parties Involved', icon: User },
        { id: 'timeline', label: 'Activity Log', icon: Clock },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                <VisuallyHidden>
                    <DialogTitle>Dispute Details - {dispute?.id}</DialogTitle>
                    <DialogDescription>Viewing detailed information for dispute {dispute?.id}</DialogDescription>
                </VisuallyHidden>
                {/* Header Section */}
                <div className={`p-6 border-b ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>{dispute.id}</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Case File & Resolution</p>
                            </div>
                        </div>
                        <Badge className={`text-[10px] font-black uppercase px-3 py-1 rounded-sm shadow-none ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                        </Badge>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className={`flex px-6 pt-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id
                                ? 'border-emerald-600 text-emerald-600'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {activeTab === 'summary' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Issue Type', value: dispute.type, icon: FileText },
                                    { label: 'Severity', value: dispute.severity, icon: AlertTriangle, statusStyle: getSeverityColor(dispute.severity) },
                                    { label: 'Date Logged', value: dispute.dateLogged, icon: Calendar },
                                    { label: 'Region', value: dispute.region, icon: TrendingUp },
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50/50 border-gray-100'}`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <item.icon className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                                        </div>
                                        <p className={`text-sm font-bold ${item.statusStyle || (darkMode ? 'text-white' : 'text-gray-900')}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Case Description</h3>
                                <div className={`p-6 rounded-2xl border leading-relaxed text-sm ${darkMode ? 'bg-gray-900/20 border-gray-800 text-gray-300' : 'bg-white border-gray-100 text-gray-700'}`}>
                                    {dispute.description}
                                </div>
                            </section>

                            {/* Existing Notes */}
                            {dispute.notes && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Resolution Notes</h3>
                                    <div className={`p-6 rounded-2xl border leading-relaxed text-sm whitespace-pre-wrap ${darkMode ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-100' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                                        {dispute.notes}
                                    </div>
                                </section>
                            )}

                            {/* Evidence */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Evidence Files</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {dispute.evidence?.map((file: string, i: number) => (
                                        <div key={i} className={`group relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all ${darkMode ? 'border-gray-800 bg-gray-900/40 hover:border-emerald-500/50' : 'border-gray-100 bg-gray-50/50 hover:border-emerald-500/50'}`}>
                                            <FileText className="h-8 w-8 text-gray-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 truncate w-full text-center px-2">{file}</span>
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast.info('Previewing evidence...')}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => toast.info('Evidence upload simulated. Feature requires backend integration.')}
                                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <Plus className="h-6 w-6 text-gray-300 mb-1" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Add More</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'parties' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {[
                                { role: 'Farmer', name: dispute.farmer?.name || 'Unknown Farmer', contact: dispute.farmer?.contact || '+233 24 567 8901', email: 'farmer@example.com' },
                                { role: 'Investor', name: dispute.investor || 'Unknown Investor', contact: '+233 50 123 4567', email: 'investor@lync.com' },
                                { role: 'Handled By', name: agent?.name || 'Agent', contact: agent?.contact || '+233 24 000 0000', email: agent?.email || 'agent@agrilync.com' },
                            ].map((p, i) => (
                                <div key={i} className={`p-4 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold">
                                            {p.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                                                <span className="self-start text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 whitespace-nowrap">{p.role}</span>
                                                <h4 className={`font-bold text-sm sm:text-base truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</h4>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> {p.contact}</span>
                                                <span className="flex items-center gap-1.5 truncate"><FileText className="h-3 w-3" /> {p.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleContact(p.role, p.name)}
                                        className="w-full sm:w-auto h-8 text-[10px] font-bold uppercase tracking-widest border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 hover:border-emerald-200"
                                    >
                                        Contact
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}


                    {activeTab === 'timeline' && (
                        <div className="space-y-8 pl-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {dispute.timeline && dispute.timeline.length > 0 ? (
                                <div className="relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gray-100 dark:before:bg-gray-800">
                                    {[...dispute.timeline].reverse().map((event: any, idx: number) => (
                                        <div key={idx} className="relative pl-8 pb-10 last:pb-0 group">
                                            <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full z-10 border-2 border-white dark:border-gray-950 bg-emerald-500 shadow-sm"></div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{event.date}</span>
                                                    <span className="h-px w-4 bg-gray-100 dark:bg-gray-800"></span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{event.user}</span>
                                                </div>
                                                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Clock className="h-12 w-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No activity log available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions Section */}
                <div className={`p-6 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'bg-gray-50/50 border-gray-100'}`}>
                    <div className="flex-1 w-full max-w-md">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Case Resolution Notes</Label>
                        <div className="relative">
                            <Textarea
                                placeholder="Add follow-up notes or resolution details..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="min-h-[40px] h-12 py-3 resize-none pr-32 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl text-sm"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={isUpdating}
                                className="absolute right-1.5 top-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[9px] px-4 rounded-lg"
                            >
                                {isUpdating && activeTab === 'summary' && note ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : null}
                                Add Note
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleEscalate}
                            disabled={isUpdating || dispute.status === 'Escalated'}
                            className="flex-1 md:flex-none h-11 border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-[10px] items-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        >
                            {isUpdating && dispute.status !== 'Escalated' && !note ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                            Escalate Case
                        </Button>
                        <Button
                            onClick={handleResolve}
                            disabled={isUpdating || dispute.status === 'Resolved'}
                            className="flex-1 md:flex-none h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-emerald-500/20"
                        >
                            {isUpdating && dispute.status !== 'Resolved' && !note ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                            Resolve Dispute
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


export default ViewDisputeModal;
