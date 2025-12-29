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
import { UserCheck, Calendar, Eye, Edit } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';

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
    const handleApprove = async (farmer: any) => {
        try {
            await api.put(`/farmers/${farmer._id}`, { status: 'active' });
            toast.success('Grower verified successfully!');
            onSuccess();
        } catch (err) {
            toast.error('Failed to verify grower');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl p-0 overflow-hidden border-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
                <div className="bg-emerald-600 p-6 text-white relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <UserCheck className="h-6 w-6" />
                            Regional Verification Queue
                        </DialogTitle>
                        <DialogDescription className="text-emerald-100/80 mt-1">
                            Review and approve pending growers in {agent?.region}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-0 max-h-[70vh] overflow-y-auto">
                    <Table>
                        <TableHeader className={darkMode ? 'bg-white/5' : 'bg-gray-50'}>
                            <TableRow>
                                <TableHead className={darkMode ? 'text-gray-400' : ''}>Grower</TableHead>
                                <TableHead className={darkMode ? 'text-gray-400' : ''}>Community</TableHead>
                                <TableHead className={darkMode ? 'text-gray-400' : ''}>Request Date</TableHead>
                                <TableHead className={`text-right ${darkMode ? 'text-gray-400' : ''}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingFarmers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                                        No pending growers in your region.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingFarmers.map((f: any) => (
                                    <TableRow key={f._id} className={`${darkMode ? 'border-white/5 hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500'}`}>
                                                    {f.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'G'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{f.name}</span>
                                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.contact}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{f.community}</span>
                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.district}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {new Date(f.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className={`h-9 w-9 p-0 rounded-xl ${darkMode ? 'hover:bg-emerald-500/10 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600'}`}
                                                    onClick={() => onView(f)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className={`h-9 w-9 p-0 rounded-xl ${darkMode ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-amber-50 text-amber-600'}`}
                                                    onClick={() => onEdit(f)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 rounded-xl shadow-lg shadow-emerald-500/20"
                                                    onClick={() => handleApprove(f)}
                                                >
                                                    Approve & Activate
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VerificationQueueModal;
