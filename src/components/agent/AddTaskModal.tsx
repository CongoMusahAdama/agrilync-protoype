import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { toast } from 'sonner';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface AddTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskAdded: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onOpenChange, onTaskAdded }) => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [loading, setLoading] = useState(false);

    // Farmers state
    const [farmers, setFarmers] = useState<any[]>([]);
    const [farmersLoading, setFarmersLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [type, setType] = useState('visit');
    const [selectedFarmerId, setSelectedFarmerId] = useState('');
    const [farmerIdDisplay, setFarmerIdDisplay] = useState('');
    const [location, setLocation] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('normal');

    useEffect(() => {
        if (open) fetchFarmers();
    }, [open]);

    const fetchFarmers = async () => {
        setFarmersLoading(true);
        try {
            const res = await api.get('/farmers', { params: { limit: 100 } });
            const dataRaw = res.data?.data || res.data || [];
            const data = Array.isArray(dataRaw) ? dataRaw : [];
            const effectiveRegion = agent?.region || "Ashanti Region";
            setFarmers(data.filter((f: any) => !effectiveRegion || f.region === effectiveRegion));
        } catch (error) {
            toast.error('Could not load farmers list');
        } finally {
            setFarmersLoading(false);
        }
    };

    const handleFarmerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const fid = e.target.value;
        setSelectedFarmerId(fid);
        if (!fid) {
            setFarmerIdDisplay('');
            return;
        }
        const farmer = farmers.find(f => (f._id || f.id) === fid);
        setFarmerIdDisplay(farmer?.farmerId || farmer?._id?.slice(-8) || fid);
    };

    const selectedFarmer = farmers.find(f => (f._id || f.id) === selectedFarmerId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { toast.error('Please enter a task title'); return; }
        if (!dueDate) { toast.error('Please select a due date'); return; }

        setLoading(true);
        try {
            await api.post('/tasks', {
                title,
                type,
                farmerName: selectedFarmer?.name || 'System',
                farmName: selectedFarmer?.farmType || 'N/A',
                farmer: selectedFarmerId || undefined,
                location: location.trim() || undefined,
                dueDate: new Date(dueDate).toISOString(),
                priority,
                status: 'pending'
            });

            toast.success('Task created successfully!');
            onTaskAdded();
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            const msg = error?.response?.data?.msg || 'Failed to create task';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setType('visit');
        setSelectedFarmerId('');
        setFarmerIdDisplay('');
        setLocation('');
        setDueDate('');
        setPriority('normal');
    };

    const selectClass = `flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : 'bg-white text-gray-900'}`;
    const inputClass = `${darkMode ? 'bg-[#10363d] border-[#1b5b65]' : ''}`;

    return (
        <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
            <DialogContent className={`max-w-xl ${darkMode ? 'bg-[#0b2528] border-[#124b53] text-gray-100' : 'bg-white'}`}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#065f46]/10 rounded-xl">
                            <PlusCircle className="h-6 w-6 text-[#065f46]" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Add New Task</DialogTitle>
                            <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                Create a scheduled task and optionally assign it to a farmer.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-5">

                    {/* Task Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Task Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Farm Monitoring Visit"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Type + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Task Type</Label>
                            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                                <option value="visit">Farm Visit</option>
                                <option value="kyc">KYC Verification</option>
                                <option value="training">Training</option>
                                <option value="media">Media / Photos</option>
                                <option value="harvest">Harvest Log</option>
                                <option value="sync">Data Sync</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Priority</Label>
                            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Farmer Name (dropdown) + auto-filled Farmer ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="farmerSelect" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Farmer Name</Label>
                            {farmersLoading ? (
                                <div className={`flex items-center gap-2 h-10 px-3 rounded-md border text-sm text-gray-400 ${darkMode ? 'border-[#1b5b65] bg-[#10363d]' : 'border-input'}`}>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
                                </div>
                            ) : (
                                <select
                                    id="farmerSelect"
                                    value={selectedFarmerId}
                                    onChange={handleFarmerChange}
                                    className={selectClass}
                                >
                                    <option value="">— Select farmer —</option>
                                    {farmers.map(farmer => (
                                        <option key={farmer._id || farmer.id} value={farmer._id || farmer.id}>
                                            {farmer.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="farmerIdDisplay" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Farmer ID</Label>
                            <Input
                                id="farmerIdDisplay"
                                value={farmerIdDisplay}
                                disabled
                                placeholder="Auto-filled on selection"
                                className={`${inputClass} ${farmerIdDisplay ? 'text-[#065f46] font-semibold opacity-100' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Location / Destination</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">📍</span>
                            <Input
                                id="location"
                                placeholder="e.g. Kumasi, Ejisu District — Mensah Farms"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`pl-8 ${inputClass}`}
                            />
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Due Date *</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            required
                            value={dueDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDueDate(e.target.value)}
                            className={`w-full ${inputClass}`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-bold px-6" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</>
                            ) : (
                                <><PlusCircle className="h-4 w-4 mr-2" /> Add Task</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskModal;
