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
import { PlusCircle, Loader2, MapPin } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface AddTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskAdded: () => void;
    task?: any; // Add task prop for editing
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onOpenChange, onTaskAdded, task }) => {
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
        if (open && task) {
            setTitle(task.title || '');
            setType(task.type || 'visit');
            const fid = task.farmerId || task.farmer?._id || task.farmer || '';
            
            if (task.isGlobal || task.farmerName === 'All Farmers') {
                setSelectedFarmerId('all_farmers');
                setFarmerIdDisplay('GLOBAL');
            } else {
                setSelectedFarmerId(fid);
                setFarmerIdDisplay(task.farmerIdDisplay || '');
            }
            
            setLocation(task.location || '');
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                setDueDate(date.toISOString().split('T')[0]);
            }
            setPriority(task.priority || 'normal');
        }
    }, [open, task]);

    const fetchFarmers = async () => {
        setFarmersLoading(true);
        try {
            const res = await api.get('/farmers', { params: { limit: 100 } });
            const dataRaw = res.data?.data || res.data || [];
            const data = Array.isArray(dataRaw) ? dataRaw : [];
            
            // Normalize region comparison
            const agentRegion = (agent?.region || "").toLowerCase().replace(' region', '').trim();
            
            const filtered = data.filter((f: any) => {
                if (!agentRegion) return true;
                const farmerRegion = (f.region || "").toLowerCase().replace(' region', '').trim();
                return farmerRegion === agentRegion;
            });
            
            setFarmers(filtered);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Could not load farmers list from the central registry.',
                confirmButtonColor: '#065f46'
            });
        } finally {
            setFarmersLoading(false);
        }
    };

    const selectedFarmer = farmers.find(f => (f._id || f.id) === selectedFarmerId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Required',
                text: 'Please enter a task title to continue.',
                confirmButtonColor: '#065f46'
            });
            return;
        }
        if (!dueDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Timeline Missing',
                text: 'Please select a due date for this objective.',
                confirmButtonColor: '#065f46'
            });
            return;
        }

        setLoading(true);
        const isAllGroups = selectedFarmerId === 'all_farmers';
        
        try {
            const payload = {
                title,
                type,
                farmerName: isAllGroups ? 'All Farmers' : (selectedFarmer?.name || 'System'),
                farmName: isAllGroups ? 'Global Distribution' : (selectedFarmer?.farmType || 'N/A'),
                farmer: isAllGroups ? undefined : (selectedFarmerId || undefined),
                location: isAllGroups ? 'Regional Network' : (location.trim() || undefined),
                dueDate: new Date(dueDate).toISOString(),
                priority,
                status: task?.status || 'pending',
                isGlobal: isAllGroups
            };

            if (task?._id || task?.id) {
                await api.put(`/tasks/${task._id || task.id}`, payload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Task Updated',
                    text: 'The field task has been successfully refined.',
                    confirmButtonColor: '#065f46',
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                await api.post('/tasks', payload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Task Created',
                    text: 'A new high-priority objective has been added to the field ledger.',
                    confirmButtonColor: '#065f46',
                    timer: 2000,
                    timerProgressBar: true
                });
            }

            onTaskAdded();
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            const msg = error?.response?.data?.msg || 'Failed to process task';
            Swal.fire({
                icon: 'error',
                title: 'Registry Error',
                text: msg,
                confirmButtonColor: '#065f46'
            });
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
                            <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {task ? 'Update Field Task' : 'Add New Task'}
                            </DialogTitle>
                            <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {task ? 'Refine task details and assignment.' : 'Create a scheduled task and optionally assign it to a farmer.'}
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
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-11 border-gray-100 rounded-xl text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="visit">Farm Visit</SelectItem>
                                    <SelectItem value="kyc">KYC Verification</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="media">Media / Photos</SelectItem>
                                    <SelectItem value="harvest">Harvest Log</SelectItem>
                                    <SelectItem value="sync">Data Sync</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="h-11 border-gray-100 rounded-xl text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Farmer Selection + Farmer ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="farmerSelect" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Assign to Farmer</Label>
                            {farmersLoading ? (
                                <div className={`flex items-center gap-2 h-11 px-3 rounded-xl border text-sm text-gray-400 ${darkMode ? 'border-[#1b5b65] bg-[#10363d]' : 'border-gray-100'}`}>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading farmers...
                                </div>
                            ) : (
                                <Select 
                                    value={selectedFarmerId || 'none'} 
                                    onValueChange={(fid) => {
                                        if (fid === 'none') {
                                            setSelectedFarmerId('');
                                            setFarmerIdDisplay('');
                                            return;
                                        }
                                        if (fid === 'all_farmers') {
                                            setSelectedFarmerId('all_farmers');
                                            setFarmerIdDisplay('GLOBAL');
                                            return;
                                        }
                                        
                                        setSelectedFarmerId(fid);
                                        const farmer = farmers.find(f => (f._id || f.id) === fid);
                                        setFarmerIdDisplay(farmer?.farmerId || farmer?._id?.slice(-8) || fid);
                                    }}
                                >
                                    <SelectTrigger className="h-11 border-gray-100 rounded-xl text-sm font-medium">
                                        <SelectValue placeholder="Select a farmer" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                        <SelectItem value="none">No Farmer Assigned</SelectItem>
                                        <SelectItem value="all_farmers" className="font-black text-[#065f46]">ASSIGN TO ALL FARMERS</SelectItem>
                                        {farmers.map(farmer => (
                                            <SelectItem key={farmer._id || farmer.id} value={farmer._id || farmer.id}>
                                                {farmer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="farmerIdDisplay" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Farmer ID</Label>
                            <Input
                                id="farmerIdDisplay"
                                value={farmerIdDisplay}
                                disabled
                                placeholder="Auto-filled"
                                className={`h-11 border-gray-100 rounded-xl text-sm font-medium ${darkMode ? 'bg-[#10363d] border-[#1b5b65]' : 'bg-gray-50'} ${farmerIdDisplay ? 'text-[#065f46] font-black opacity-100' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location" className="font-bold text-xs uppercase text-gray-500 tracking-wider">Location / Destination</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 pointer-events-none" />
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
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {task ? 'Updating...' : 'Creating...'}</>
                            ) : (
                                <><PlusCircle className="h-4 w-4 mr-2" /> {task ? 'Update Task' : 'Add Task'}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskModal;
