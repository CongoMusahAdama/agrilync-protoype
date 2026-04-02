import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserCheck, Calendar, Eye, Edit, Loader2, X } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface VerificationQueueModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pendingFarmers: any[];
    agent: any;
    darkMode: boolean;
    onSuccess: () => void;
    onView: (farmer: any) => void;
    onEdit: (farmer: any) => void;
}

const VerificationQueueModal: React.FC<VerificationQueueModalProps> = ({
    open,
    onOpenChange,
    pendingFarmers,
    agent,
    darkMode,
    onSuccess,
    onView,
    onEdit
}) => {
    const [isVerifying, setIsVerifying] = React.useState<string | null>(null);

    const handleApprove = async (farmer: any) => {
        setIsVerifying(farmer._id);
        try {
            await api.put(`/farmers/${farmer._id}`, { status: 'active' });
            await Swal.fire({
                icon: 'success',
                title: 'Grower Verified!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            Grower verified successfully!
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });
            onSuccess();
        } catch (err) {
            toast.error('Failed to verify grower');
        } finally {
            setIsVerifying(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-5xl p-0 overflow-hidden border-0 shadow-2xl ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
                <div className="bg-gradient-to-r from-[#065f46] to-[#044a36] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
                    
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <UserCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                    Regional Verification Queue
                                </DialogTitle>
                                <DialogDescription className="text-emerald-100/90 mt-1 font-medium italic">
                                    Strategic approval portal for the {agent?.region} agricultural sector
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>

                <div className="p-6">
                    <div className={`rounded-2xl border ${darkMode ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white'} overflow-hidden shadow-sm`}>
                        <Table className="border-collapse">
                            <TableHeader className="bg-[#002f37] sticky top-0 z-10">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-2 px-6 border-r border-white/10">Grower Information</TableHead>
                                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-2 px-6 border-r border-white/10">Operational Zone</TableHead>
                                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-2 px-6 border-r border-white/10">Onboarding Date</TableHead>
                                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-2 px-6 border-r border-white/10">Verification Status</TableHead>
                                    <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-2 px-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingFarmers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-24">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="h-20 w-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-2 border-2 border-dashed border-gray-200 dark:border-white/10">
                                                    <Loader2 className="h-8 w-8 text-gray-200" />
                                                </div>
                                                <p className="font-black text-gray-400 uppercase tracking-widest text-sm">No pending growers discovered</p>
                                                <p className="text-[10px] text-gray-400 max-w-xs mx-auto">Your regional verification queue is currently clear. New registrations will appear here for audit.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingFarmers.map((f: any) => (
                                        <TableRow key={f._id} className={`${darkMode ? 'border-[#002f37]/20 hover:bg-white/5' : 'border-[#002f37]/10 hover:bg-[#002f37]/5'} transition-all duration-300 group`}>
                                            <TableCell className={`py-2 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white dark:border-white/10 transform group-hover:scale-110 transition-transform ${darkMode ? 'bg-[#065f46]/20 text-[#065f46]' : 'bg-[#065f46] text-white'}`}>
                                                        {f.profilePicture ? (
                                                            <img src={f.profilePicture} alt={f.name} className="w-full h-full object-cover rounded-2xl" />
                                                        ) : (
                                                            <span className="font-black text-sm uppercase">{f.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`font-black tracking-tight text-sm ${darkMode ? 'text-gray-100' : 'text-[#002f37]'}`}>{f.name}</span>
                                                        <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-tighter`}>{f.contact}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={`py-2 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-black ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{f.community}</span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.district}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={`py-2 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-black ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {new Date(f.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Recorded</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={`py-2 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Awaiting Agent Audit</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-2 px-6">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className={`h-10 w-10 rounded-xl ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}
                                                        onClick={() => onView(f)}
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className={`h-10 w-10 rounded-xl ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}
                                                        onClick={() => onEdit(f)}
                                                        title="Edit Profile"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        disabled={isVerifying === f._id}
                                                        className="bg-[#065f46] hover:bg-indigo-900 text-white h-10 text-[10px] font-black rounded-xl px-5 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest border-none"
                                                        onClick={() => handleApprove(f)}
                                                    >
                                                        {isVerifying === f._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Verify & Onboard'
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className={`p-4 border-t flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#002f37] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#065f46] animate-ping" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LIVE Verification Portal</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onOpenChange(false)}
                        className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Close Portal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VerificationQueueModal;




