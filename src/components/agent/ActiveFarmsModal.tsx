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
import { Badge } from '@/components/ui/badge';
import { MapPin, Sprout, Activity, User, Search } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Input } from '@/components/ui/input';

interface ActiveFarmsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farms: any[];
    onTrackJourney: (farmer: any) => void;
}

const ActiveFarmsModal: React.FC<ActiveFarmsModalProps> = ({
    open,
    onOpenChange,
    farms,
    onTrackJourney
}) => {
    const { darkMode } = useDarkMode();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredFarms = farms.filter(farm => {
        const farmerName = farm.farmer?.name || '';
        const farmType = farm.farmType || '';
        const region = farm.region || '';
        const search = searchQuery.toLowerCase();

        return farmerName.toLowerCase().includes(search) ||
            farmType.toLowerCase().includes(search) ||
            region.toLowerCase().includes(search);
    });

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'verified':
                return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300';
            case 'pending':
                return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300';
            default:
                return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#0b2528] border-[#124b53] text-gray-100' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Sprout className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">Active Farms Repository</DialogTitle>
                            <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                                Manage and track the progress of all registered farming projects.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by farmer, farm type, or region..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 ${darkMode ? 'bg-[#10363d] border-[#1b5b65]' : ''}`}
                        />
                    </div>

                    <div className={`rounded-xl border ${darkMode ? 'border-[#124b53]' : 'border-gray-200'} overflow-hidden`}>
                        <Table>
                            <TableHeader className={darkMode ? 'bg-[#124b53]/30' : 'bg-gray-50'}>
                                <TableRow className={darkMode ? 'border-[#124b53] hover:bg-transparent' : 'hover:bg-transparent'}>
                                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Farmer</TableHead>
                                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Farm Details</TableHead>
                                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Location</TableHead>
                                    <TableHead className={darkMode ? 'text-gray-300' : ''}>Status</TableHead>
                                    <TableHead className={`text-right ${darkMode ? 'text-gray-300' : ''}`}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFarms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                            No farms found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFarms.map((farm) => (
                                        <TableRow key={farm._id} className={darkMode ? 'border-[#124b53] hover:bg-[#124b53]/20' : 'hover:bg-gray-50'}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="font-medium">{farm.farmer?.name || 'Unknown Farmer'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{farm.farmType}</span>
                                                    <span className="text-xs text-gray-500 uppercase">{farm.scale || 'Small Scale'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="h-3 w-3" />
                                                    {farm.region}, {farm.community || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getStatusStyle(farm.status)}>
                                                    {farm.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        onTrackJourney(farm.farmer);
                                                        onOpenChange(false);
                                                    }}
                                                    className={`gap-2 ${darkMode ? 'border-[#1b5b65] hover:bg-[#1b5b65]/30' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}
                                                >
                                                    <Activity className="h-4 w-4" />
                                                    Track Journey
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ActiveFarmsModal;
