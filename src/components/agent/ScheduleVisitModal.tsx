import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    MessageSquare,
    Phone,
    Send,
    Loader2,
    CheckCircle2,
    X,
    Search
} from 'lucide-react';

interface ScheduleVisitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ open, onOpenChange, onSuccess }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const [visitType, setVisitType] = useState<'farm-visit' | 'community-visit' | 'farmer-meeting'>('farm-visit');
    const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [community, setCommunity] = useState('');

    // Fetch farmers
    const { data: summaryData } = useQuery({
        queryKey: ['agentDashboardSummary'],
        queryFn: async () => {
            const response = await api.get('/dashboard/summary');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const farmers = summaryData?.farmers || [];

    // Create scheduled visit mutation
    const createVisitMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/scheduled-visits', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Visit scheduled successfully!');
            queryClient.invalidateQueries({ queryKey: ['scheduledVisits'] });
            handleClose();
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to schedule visit');
        }
    });

    // Send SMS mutation
    const sendSMSMutation = useMutation({
        mutationFn: async ({ visitId, customMessage }: { visitId: string; customMessage?: string }) => {
            const response = await api.post(`/scheduled-visits/${visitId}/send-sms`, { customMessage });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(`SMS sent to ${data.data?.phoneNumbers?.length || 0} farmer(s)`);
            queryClient.invalidateQueries({ queryKey: ['scheduledVisits'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send SMS');
        }
    });

    useEffect(() => {
        if (open) {
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setScheduledDate(tomorrow.toISOString().split('T')[0]);
            setScheduledTime('09:00');
        }
    }, [open]);

    const handleClose = () => {
        setVisitType('farm-visit');
        setSelectedFarmers([]);
        setSelectAll(false);
        setSearchTerm('');
        setScheduledDate('');
        setScheduledTime('');
        setPurpose('');
        setLocation('');
        setNotes('');
        setCommunity('');
        onOpenChange(false);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedFarmers([]);
        } else {
            const filteredFarmers = filteredFarmersList.map((f: any) => f._id || f.id);
            setSelectedFarmers(filteredFarmers);
        }
        setSelectAll(!selectAll);
    };

    const handleFarmerToggle = (farmerId: string) => {
        if (selectedFarmers.includes(farmerId)) {
            setSelectedFarmers(selectedFarmers.filter(id => id !== farmerId));
            setSelectAll(false);
        } else {
            setSelectedFarmers([...selectedFarmers, farmerId]);
        }
    };

    const filteredFarmersList = farmers.filter((farmer: any) =>
        farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.contact?.includes(searchTerm) ||
        farmer.community?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (!scheduledDate || !scheduledTime || !purpose) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (visitType !== 'community-visit' && selectedFarmers.length === 0) {
            toast.error('Please select at least one farmer');
            return;
        }

        if (visitType === 'community-visit' && !community) {
            toast.error('Please enter community name');
            return;
        }

        const visitData = {
            visitType,
            farmerIds: visitType !== 'community-visit' ? selectedFarmers : [],
            community: visitType === 'community-visit' ? community : undefined,
            scheduledDate: new Date(scheduledDate).toISOString(),
            scheduledTime,
            purpose,
            location: location || undefined,
            notes: notes || undefined
        };

        createVisitMutation.mutate(visitData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}`}>
                <DialogHeader>
                    <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Calendar className="h-5 w-5" />
                        </div>
                        Schedule Visit
                    </DialogTitle>
                    <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Schedule a farm visit, community visit, or farmer meeting
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Visit Type */}
                    <div className="space-y-2">
                        <Label className={darkMode ? 'text-gray-300' : ''}>Visit Type *</Label>
                        <Select value={visitType} onValueChange={(value: any) => setVisitType(value)}>
                            <SelectTrigger className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="farm-visit">Farm Visit</SelectItem>
                                <SelectItem value="community-visit">Community Visit</SelectItem>
                                <SelectItem value="farmer-meeting">Farmer Meeting</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Farmer Selection (if not community visit) */}
                    {visitType !== 'community-visit' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className={darkMode ? 'text-gray-300' : ''}>
                                    Select Farmers * ({selectedFarmers.length} selected)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                        id="select-all"
                                    />
                                    <Label htmlFor="select-all" className="text-sm cursor-pointer">
                                        Select All
                                    </Label>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search farmers by name, phone, or community..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`pl-10 ${darkMode ? 'bg-[#01343c] border-gray-600' : ''}`}
                                />
                            </div>

                            {/* Farmer List */}
                            <ScrollArea className="h-48 border rounded-md p-2">
                                <div className="space-y-2">
                                    {filteredFarmersList.length === 0 ? (
                                        <p className={`text-sm text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No farmers found
                                        </p>
                                    ) : (
                                        filteredFarmersList.map((farmer: any) => {
                                            const farmerId = farmer._id || farmer.id;
                                            const isSelected = selectedFarmers.includes(farmerId);
                                            return (
                                                <div
                                                    key={farmerId}
                                                    onClick={() => handleFarmerToggle(farmerId)}
                                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                                        isSelected
                                                            ? darkMode
                                                                ? 'bg-emerald-500/20 border border-emerald-500/50'
                                                                : 'bg-emerald-50 border border-emerald-200'
                                                            : darkMode
                                                                ? 'hover:bg-[#01343c] border border-transparent'
                                                                : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => handleFarmerToggle(farmerId)}
                                                    />
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {farmer.name}
                                                        </p>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {farmer.contact} • {farmer.community || farmer.district}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Community Input (if community visit) */}
                    {visitType === 'community-visit' && (
                        <div className="space-y-2">
                            <Label className={darkMode ? 'text-gray-300' : ''}>Community Name *</Label>
                            <Input
                                placeholder="Enter community name"
                                value={community}
                                onChange={(e) => setCommunity(e.target.value)}
                                className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                            />
                        </div>
                    )}

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className={darkMode ? 'text-gray-300' : ''}>Date *</Label>
                            <Input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={darkMode ? 'text-gray-300' : ''}>Time *</Label>
                            <Input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-2">
                        <Label className={darkMode ? 'text-gray-300' : ''}>Purpose *</Label>
                        <Textarea
                            placeholder="e.g., Crop inspection, Training session, Follow-up visit..."
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            rows={3}
                            className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label className={darkMode ? 'text-gray-300' : ''}>Location (Optional)</Label>
                        <Input
                            placeholder="Enter location or address"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label className={darkMode ? 'text-gray-300' : ''}>Additional Notes (Optional)</Label>
                        <Textarea
                            placeholder="Any additional information..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className={darkMode ? 'bg-[#01343c] border-gray-600' : ''}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className={darkMode ? 'border-gray-600' : ''}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createVisitMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {createVisitMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Scheduling...
                            </>
                        ) : (
                            <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Visit
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleVisitModal;
