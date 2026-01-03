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
        const farmType = farm.crop || '';
        const region = farm.farmer?.region || '';
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

                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-4">
                        {filteredFarms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                    <Search className="h-8 w-8 opacity-50" />
                                </div>
                                <p className="text-gray-500 font-medium">No farms matching your search.</p>
                            </div>
                        ) : (
                            filteredFarms.map((farm) => (
                                <div
                                    key={farm._id}
                                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${darkMode
                                            ? 'bg-gradient-to-br from-[#0b2528] to-[#06181a] border-[#1b5b65]'
                                            : 'bg-white border-gray-100 shadow-lg shadow-gray-200/50'
                                        }`}
                                >
                                    {/* Card Header / Status Strip */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${farm.status === 'Verified' ? 'bg-emerald-500' :
                                            farm.status === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />

                                    <div className="p-5 pt-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-inner ${darkMode ? 'bg-[#124b53] text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-lg leading-tight mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {farm.farmer?.name || 'Unknown Farmer'}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-xs opacity-70">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{farm.farmer?.community}, {farm.farmer?.region}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className={`${getStatusStyle(farm.status)} text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold shadow-sm`}>
                                                {farm.status || 'Active'}
                                            </Badge>
                                        </div>

                                        <div className={`grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 block">Main Crop</span>
                                                <div className="flex items-center gap-2 font-semibold text-sm">
                                                    <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                                                    {farm.crop}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 block">Farm Type</span>
                                                <div className="flex items-center gap-2 font-semibold text-sm">
                                                    <Activity className="h-3.5 w-3.5 text-blue-500" />
                                                    {farm.farmer?.farmType}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => {
                                                onTrackJourney(farm.farmer);
                                                onOpenChange(false);
                                            }}
                                            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                                        >
                                            <Activity className="h-5 w-5 mr-2" />
                                            Track Farm Journey
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className={`hidden sm:block rounded-xl border ${darkMode ? 'border-[#124b53]' : 'border-gray-200'} overflow-hidden`}>
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
                                                    <span className="text-sm font-semibold">{farm.crop}</span>
                                                    <span className="text-xs text-gray-500 uppercase">{farm.farmer?.farmType || 'General Farming'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="h-3 w-3" />
                                                    {farm.farmer?.region || 'N/A'}, {farm.farmer?.community || 'N/A'}
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
