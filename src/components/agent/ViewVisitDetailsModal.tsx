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
import { Calendar, Clock, MapPin, User, FileText, CheckCircle } from 'lucide-react';

interface ViewVisitDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visit: any;
}

const ViewVisitDetailsModal: React.FC<ViewVisitDetailsModalProps> = ({ open, onOpenChange, visit }) => {
    const { darkMode } = useDarkMode();

    if (!visit) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-md ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-6 w-6 text-[#1db954]" />
                        <DialogTitle className="text-xl">Visit Details</DialogTitle>
                    </div>
                    <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Scheduled farm visit information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-[#0b2528] border-[#124b53]' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                <Badge className={`mt-1 ${visit.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    {visit.status}
                                </Badge>
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit ID</p>
                                <p className="font-medium">#{visit.id?.slice(0, 6) || 'V-2025'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farmer</p>
                                <p className="font-medium">{visit.farmer}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farm</p>
                                <p className="font-medium">{visit.farm}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                                        <p className="font-medium">{visit.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
                                        <p className="font-medium">{visit.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className={`h-5 w-5 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purpose</p>
                                <p className="font-medium">{visit.purpose}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="bg-[#1db954] hover:bg-[#17a447] text-white">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewVisitDetailsModal;
