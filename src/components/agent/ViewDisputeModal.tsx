import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    AlertTriangle,
    User,
    Calendar,
    MessageSquare,
    CheckCircle,
    Clock,
    ChevronRight,
    CalendarDays,
    UserCheck,
    FileText,
    Upload
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ViewDisputeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dispute: any;
}

const ViewDisputeModal: React.FC<ViewDisputeModalProps> = ({ open, onOpenChange, dispute }) => {
    const { darkMode } = useDarkMode();

    if (!dispute) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return darkMode ? 'bg-orange-900/30 text-orange-300 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Under Review':
                return darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Resolved':
                return darkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-300';
            case 'Escalated':
                return darkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-300';
            default:
                return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return darkMode ? 'text-red-400' : 'text-red-600';
            case 'Medium': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
            case 'Low': return darkMode ? 'text-green-400' : 'text-green-600';
            default: return darkMode ? 'text-gray-400' : 'text-gray-600';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl max-h-[85vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                            Dispute Details {dispute.id}
                        </DialogTitle>
                        <Badge className={`border ${getStatusColor(dispute.status)}`}>{dispute.status}</Badge>
                    </div>
                    <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Complete case file and resolution timeline.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Summary Section */}
                    <div className={`p-4 rounded-lg border grid grid-cols-2 md:grid-cols-4 gap-4 ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                        <div>
                            <p className="text-xs opacity-70 mb-1">Type</p>
                            <p className="font-medium">{dispute.type}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-70 mb-1">Severity</p>
                            <p className={`font-semibold ${getSeverityColor(dispute.severity)}`}>{dispute.severity}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-70 mb-1">Date Logged</p>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{dispute.dateLogged}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs opacity-70 mb-1">Region</p>
                            <p className="font-medium">{dispute.region}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-4 w-4" /> Description
                                </h3>
                                <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'bg-white border-gray-200'}`}>
                                    <p className="text-sm leading-relaxed opacity-90">{dispute.description}</p>
                                </div>
                            </div>

                            {/* Parties */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4" /> Involved Parties
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-3 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <p className="text-xs opacity-60">Farmer</p>
                                        <p className="font-medium text-sm">{dispute.parties?.farmer}</p>
                                    </div>
                                    <div className={`p-3 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <p className="text-xs opacity-60">Investor</p>
                                        <p className="font-medium text-sm">{dispute.parties?.investor}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4" /> Activity Timeline
                                </h3>
                                <div className={`border-l-2 ml-2 space-y-4 py-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {dispute.timeline?.map((event: any, idx: number) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                                            <div className="text-sm">
                                                <p className="font-medium">{event.action}</p>
                                                <p className="text-xs opacity-60">{event.date} • {event.user}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Actions & Evidence */}
                        <div className="space-y-6">
                            {/* Agent Actions */}
                            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0f3035] border-[#1b5b65]' : 'bg-blue-50 border-blue-100'}`}>
                                <h3 className="font-semibold mb-3">Resolution Actions</h3>
                                <div className="space-y-2">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9">
                                        Mark Resolved
                                    </Button>
                                    <Button variant="outline" className="w-full h-9">
                                        Request Info
                                    </Button>
                                    <Button variant="ghost" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-9">
                                        Escalate Case
                                    </Button>
                                </div>
                            </div>

                            {/* Agent Notes */}
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">Case Notes</h3>
                                <Textarea
                                    placeholder="Add internal notes..."
                                    className={`text-sm min-h-[100px] ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
                                    defaultValue={dispute.notes}
                                />
                                <Button size="sm" className="mt-2 w-full">Save Note</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDisputeModal;
