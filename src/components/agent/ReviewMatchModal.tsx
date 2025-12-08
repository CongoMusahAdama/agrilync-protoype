import React, { useState } from 'react';
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
    CheckCircle,
    XCircle,
    FileText,
    User,
    Sprout,
    DollarSign,
    AlertCircle,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ReviewMatchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    match: any;
    onApprove: (matchId: string) => void;
    onReject: (matchId: string) => void;
}

const ReviewMatchModal: React.FC<ReviewMatchModalProps> = ({
    open,
    onOpenChange,
    match,
    onApprove,
    onReject
}) => {
    const { darkMode } = useDarkMode();
    const [notes, setNotes] = useState('');

    if (!match) return null;

    const handleApprove = () => {
        onApprove(match.id);
        onOpenChange(false);
    };

    const handleReject = () => {
        onReject(match.id);
        onOpenChange(false);
    };

    const isFullySigned = match.documents?.farmerSignature && match.documents?.investorSignature;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-2xl ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        <DialogTitle className="text-xl">Review Investment Match</DialogTitle>
                    </div>
                    <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Verify documents and approve the partnership agreement.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">

                    {/* Match Summary */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investor</p>
                                <p className="font-medium text-base">{match.investor}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farmer</p>
                                <p className="font-medium text-base">{match.farmer}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Value</p>
                                <p className="font-medium text-base text-emerald-500">{match.value}</p>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                                <p className="font-medium text-base">{match.matchDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Document Verification Status */}
                    <div>
                        <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Document Verification
                        </h4>
                        <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-[#124b53]' : 'border-gray-200'}`}>

                            {/* Farmer Signature */}
                            <div className={`p-3 flex items-center justify-between border-b ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <User className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <div>
                                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Farmer Signature</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signed by {match.farmer}</p>
                                    </div>
                                </div>
                                {match.documents?.farmerSignature ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> Signed
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Pending
                                    </Badge>
                                )}
                            </div>

                            {/* Investor Signature */}
                            <div className={`p-3 flex items-center justify-between border-b ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <DollarSign className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div>
                                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Investor Signature</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signed by {match.investor}</p>
                                    </div>
                                </div>
                                {match.documents?.investorSignature ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> Signed
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Pending
                                    </Badge>
                                )}
                            </div>

                            {/* Agent Approval (Current Step) */}
                            <div className={`p-3 flex items-center justify-between ${darkMode ? 'bg-[#0b3a42]' : 'bg-emerald-50'}`}>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`} />
                                    <div>
                                        <p className={`font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>Agent Approval</p>
                                        <p className={`text-xs ${darkMode ? 'text-emerald-400/70' : 'text-emerald-700/70'}`}>Awaiting your verification</p>
                                    </div>
                                </div>
                                <Badge className="bg-yellow-500/20 text-yellow-600 flex items-center gap-1 border-yellow-200">
                                    <AlertCircle className="h-3 w-3" /> Action Required
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Agent Notes */}
                    <div>
                        <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Verification Notes (Optional)
                        </h4>
                        <Textarea
                            placeholder="Add any notes regarding this approval..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className={darkMode ? 'bg-[#0b2528] border-[#124b53] text-white placeholder:text-gray-500' : ''}
                            rows={2}
                        />
                    </div>

                    {!isFullySigned && (
                        <div className={`p-3 rounded-lg flex items-center gap-3 ${darkMode ? 'bg-orange-500/10 text-orange-200' : 'bg-orange-50 text-orange-800'}`}>
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm">Cannot approve yet. Both parties must sign the agreement first.</p>
                        </div>
                    )}

                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className={darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : ''}
                    >
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleReject}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Reject Matches
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={!isFullySigned}
                            className="bg-[#1db954] hover:bg-[#17a447] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Approve & Verify
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewMatchModal;
