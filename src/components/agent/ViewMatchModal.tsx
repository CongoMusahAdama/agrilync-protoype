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
import { Calendar, DollarSign, Sprout, User, FileText, CheckCircle, Clock } from 'lucide-react';

interface ViewMatchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    match: any;
}

const ViewMatchModal: React.FC<ViewMatchModalProps> = ({ open, onOpenChange, match }) => {
    const { darkMode } = useDarkMode();

    if (!match) return null;

    const statusColors: Record<string, string> = {
        Active: 'bg-emerald-500/10 text-emerald-600',
        'Pending Funding': 'bg-amber-500/10 text-amber-600',
        'Under Review': 'bg-orange-500/10 text-orange-600',
        Completed: 'bg-blue-500/10 text-blue-600',
    };

    const darkStatusColors: Record<string, string> = {
        Active: 'bg-emerald-500/20 text-emerald-300',
        'Pending Funding': 'bg-amber-500/20 text-amber-300',
        'Under Review': 'bg-orange-500/20 text-orange-300',
        Completed: 'bg-blue-500/20 text-blue-300',
    };

    const currentStatusColor = darkMode
        ? (darkStatusColors[match.status] || 'bg-gray-500/20 text-gray-300')
        : (statusColors[match.status] || 'bg-gray-100 text-gray-600');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-2xl ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl">Investment Match Details</DialogTitle>
                        <Badge className={currentStatusColor}>{match.status}</Badge>
                    </div>
                    <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Review the details of the partnership between investor and farmer.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <User className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                <h3 className="font-semibold text-lg">Investor</h3>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</p>
                            <p className="font-medium text-base mb-2">{match.investor}</p>
                            <Button variant="link" className={`h-auto p-0 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                View Profile
                            </Button>
                        </div>

                        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Sprout className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                <h3 className="font-semibold text-lg">Farmer</h3>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</p>
                            <p className="font-medium text-base mb-2">{match.farmer}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Farm Type</p>
                            <p className="font-medium text-base">{match.farmType}</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <FileText className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            Investment Terms
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Value</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                    <span className="font-bold text-lg">{match.value}</span>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Match Date</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-4 w-4 text-emerald-500" />
                                    <span className="font-medium">{match.matchDate}</span>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Duration</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-4 w-4 text-emerald-500" />
                                    <span className="font-medium">12 Months</span>
                                </div>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contract</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span className="font-medium">Signed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className={darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : ''}>
                        Close
                    </Button>
                    <Button className="bg-[#1db954] hover:bg-[#17a447] text-white">
                        Manage Investment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewMatchModal;
