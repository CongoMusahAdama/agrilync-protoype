import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
    UserPlus,
    Users,
    Globe,
    Search,
    UserCircle,
    RotateCcw,
    Settings,
    Camera,
    Upload,
    Check,
    X,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Key,
    Layers,
    FileText,
    TrendingUp,
    Sliders,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/utils/api';

interface UserRecord {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    region: string;
    communities?: string[];
    passwordChanged: 'Yes' | 'No';
    disabled: 'Yes' | 'No';
    staffAccountNumber: string;
    avatar?: string;
    enableMultipleLogin?: boolean;
    authorised: boolean;
}

interface UserPermission {
    menuItem: string;
    module: string;
    menuType: 'Main' | 'Sub' | 'Action';
    enabled: boolean;
}

const communitiesMap: Record<string, string[]> = {
    "Bono Region": ["Sunyani", "Berekum", "Dormaa Ahenkro", "Wenchi", "Techiman", "Duayaw Nkwanta"],
    "Northern Region": ["Tamale", "Yendi", "Savelugu", "Nalerigu", "Walewale", "Damongo"],
    "Upper East Region": ["Bolgatanga", "Navrongo", "Bawku", "Paga", "Sandema", "Garu"],
    "Ashanti Region": ["Kumasi", "Obuasi", "Konongo", "Mampong", "Ejura", "Bekwai"],
    "Western Region": ["Sekondi-Takoradi", "Tarkwa", "Axim", "Elubo", "Prestea"],
    "Volta Region": ["Ho", "Kpando", "Hohoe", "Aflao", "Anloga", "Sogakope"],
    "Central Region": ["Cape Coast", "Winneba", "Mankessim", "Elmina", "Apam", "Kasoa"]
};

const AgentManagement = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();

    // Main Page Tabs: UserCreation OR AccessControl
    const [mainTab, setMainTab] = useState<'UserCreation' | 'AccessControl'>('UserCreation');

    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/super-admin/users');
                if (res.data) {
                    setUsers(res.data);
                    if (res.data.length > 0) {
                        setSelectedAccessUserId(res.data[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Operational Regions
    const regionsList = [
        "Bono Region",
        "Northern Region",
        "Upper East Region",
        "Ashanti Region",
        "Western Region",
        "Volta Region",
        "Central Region"
    ];

    // ==========================================
    // TAB 1: USER ACCOUNT PROFILE CREATION STATE
    // ==========================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [formValues, setFormValues] = useState<{
        region: string;
        communities: string[];
        name: string;
        email: string;
        phone: string;
        role: string;
        staffAccountNumber: string;
        isDisabled: boolean;
        enableMultipleLogin: boolean;
        resetPassword: boolean;
        deleteUser: boolean;
        avatar: string;
    }>({
        region: 'Bono Region',
        communities: [],
        name: '',
        email: '',
        phone: '',
        role: 'Lync Agent',
        staffAccountNumber: '',
        isDisabled: false,
        enableMultipleLogin: false,
        resetPassword: false,
        deleteUser: false,
        avatar: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');
    const [entriesCount, setEntriesCount] = useState(10);

    // ==========================================
    // TAB 2: ACCESS CONTROL STATE (USER ACCESS CONTROL)
    // ==========================================
    const [accessRegion, setAccessRegion] = useState('Bono Region');
    const [selectedAccessUserId, setSelectedAccessUserId] = useState<string>(''); // Dynamic selection fallback

    // Access Control Module Checkboxes
    const [accessModules, setAccessModules] = useState({
        farmersManagement: true,
        farmManagement: true,
        farmMonitoring: true,
        tasksDashboard: true,
        mediaDashboard: true,
        disputeManagement: false,
        agentPerformance: true,
        trainingPerformance: true,
        investorMatches: false,
        notifications: true,
        profileConfig: true,
        allowedViewFarmerBiodata: true
    });

    // Permissions Grid (Table mapping Menu Items to Modules)
    const [permissionsGrid, setPermissionsGrid] = useState<UserPermission[]>([
        { menuItem: 'Dashboard Overview', module: 'AgentLayout', menuType: 'Main', enabled: true },
        { menuItem: 'Farmer Registration', module: 'FarmersManagement', menuType: 'Sub', enabled: true },
        { menuItem: 'Farm Boundary Mapping', module: 'FarmManagement', menuType: 'Sub', enabled: true },
        { menuItem: 'Conduct Farm Inspection', module: 'FarmMonitoring', menuType: 'Action', enabled: true },
        { menuItem: 'Log Pest Observations', module: 'FarmMonitoring', menuType: 'Action', enabled: true },
        { menuItem: 'Assigned Tasks List', module: 'TasksDashboard', menuType: 'Main', enabled: true },
        { menuItem: 'Upload Farm Recordings', module: 'MediaDashboard', menuType: 'Action', enabled: true },
        { menuItem: 'Dispute & Linkage Management', module: 'DisputeManagement', menuType: 'Main', enabled: false },
        { menuItem: 'Investor Match Linkage', module: 'InvestorFarmerMatches', menuType: 'Sub', enabled: false },
        { menuItem: 'Tutorials & Audio Library', module: 'TrainingPerformance', menuType: 'Sub', enabled: true },
        { menuItem: 'Performance Analytics', module: 'AgentPerformance', menuType: 'Main', enabled: true },
        { menuItem: 'Change Password Security', module: 'ChangePassword', menuType: 'Action', enabled: true }
    ]);

    // Sync Operational Region when user selection changes in access control
    useEffect(() => {
        const activeUser = users.find(u => u.id === selectedAccessUserId);
        if (activeUser) {
            setAccessRegion(activeUser.region);
            
            // Render specific mock variations for supervisor vs agent role permissions
            const isSupervisor = activeUser.role === 'Supervisor';
            setAccessModules({
                farmersManagement: true,
                farmManagement: true,
                farmMonitoring: true,
                tasksDashboard: true,
                mediaDashboard: true,
                disputeManagement: isSupervisor,
                agentPerformance: true,
                trainingPerformance: true,
                investorMatches: isSupervisor,
                notifications: true,
                profileConfig: true,
                allowedViewFarmerBiodata: true
            });

            setPermissionsGrid(prev => prev.map(p => {
                if (p.module === 'DisputeManagement' || p.module === 'InvestorFarmerMatches') {
                    return { ...p, enabled: isSupervisor };
                }
                return p;
            }));
        }
    }, [selectedAccessUserId, users]);

    // Handle Check/Uncheck All access modules
    const handleToggleAllAccessModules = (value: boolean) => {
        setAccessModules({
            farmersManagement: value,
            farmManagement: value,
            farmMonitoring: value,
            tasksDashboard: value,
            mediaDashboard: value,
            disputeManagement: value,
            agentPerformance: value,
            trainingPerformance: value,
            investorMatches: value,
            notifications: value,
            profileConfig: value,
            allowedViewFarmerBiodata: value
        });
        toast.info(value ? "Checked all access modules" : "Unchecked all access modules");
    };

    // Toggle individual permissions grid row checkbox
    const handleToggleGridRow = (index: number) => {
        setPermissionsGrid(prev => prev.map((p, idx) => idx === index ? { ...p, enabled: !p.enabled } : p));
    };

    const handleUpdateAccessControl = () => {
        const activeUser = users.find(u => u.id === selectedAccessUserId);
        if (!activeUser) return;
        toast.success(`Access permissions updated successfully for "${activeUser.name}"!`);
    };

    const handleDeletePreviousProfile = () => {
        const activeUser = users.find(u => u.id === selectedAccessUserId);
        if (!activeUser) return;

        Swal.fire({
            title: 'Reset Permissions?',
            text: `Are you sure you want to reset all permissions for ${activeUser.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reset'
        }).then((result) => {
            if (result.isConfirmed) {
                handleToggleAllAccessModules(false);
                toast.success(`Permissions cleared for ${activeUser.name}`);
            }
        });
    };

    // ==========================================
    // MODAL STATE CONTROLS FOR USER CREATION
    // ==========================================
    const handleSelectUser = (user: UserRecord) => {
        setSelectedUser(user);
        setFormValues({
            region: user.region,
            communities: user.communities || [],
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            staffAccountNumber: user.staffAccountNumber,
            isDisabled: user.disabled === 'Yes',
            enableMultipleLogin: user.enableMultipleLogin || false,
            resetPassword: user.passwordChanged === 'No',
            deleteUser: false,
            avatar: user.avatar || ''
        });
        setIsModalOpen(true);
    };

    const handleAddNewUser = () => {
        setSelectedUser(null);
        const autoAC = 'LYC' + Math.floor(10000 + Math.random() * 90000);
        setFormValues({
            region: 'Bono Region',
            communities: [],
            name: '',
            email: '',
            phone: '',
            role: 'Lync Agent',
            staffAccountNumber: autoAC,
            isDisabled: false,
            enableMultipleLogin: false,
            resetPassword: false,
            deleteUser: false,
            avatar: ''
        });
        setIsModalOpen(true);
    };

    const handleSaveRecord = async () => {
        if (!formValues.name || !formValues.email || !formValues.phone) {
            toast.error("Required details (Name, Email, Phone Number) are missing.");
            return;
        }

        if (formValues.communities.length === 0) {
            toast.error("Please select at least one community for this agent.");
            return;
        }

        if (selectedUser) {
            if (formValues.deleteUser) {
                Swal.fire({
                    title: 'Delete Profile?',
                    text: `Are you sure you want to completely delete ${selectedUser.name}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, Delete'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await api.delete(`/super-admin/users/${selectedUser.id}`);
                            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
                            setIsModalOpen(false);
                            toast.success("Personnel account deleted successfully");
                        } catch (err: any) {
                            console.error('Delete failed:', err);
                            toast.error(err.response?.data?.msg || 'Failed to delete user');
                        }
                    }
                });
                return;
            }

            try {
                const res = await api.put(`/super-admin/users/${selectedUser.id}`, {
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    role: formValues.role,
                    region: formValues.region,
                    communities: formValues.communities,
                    disabled: formValues.isDisabled ? 'Yes' : 'No',
                    resetPassword: formValues.resetPassword,
                    staffAccountNumber: formValues.staffAccountNumber,
                    enableMultipleLogin: formValues.enableMultipleLogin,
                    avatar: formValues.avatar
                });
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? res.data : u));
                toast.success(`Profile update for "${formValues.name}" saved!`);
                setIsModalOpen(false);
            } catch (err: any) {
                console.error('Update failed:', err);
                toast.error(err.response?.data?.msg || 'Failed to update user profile');
            }
        } else {
            try {
                const res = await api.post('/super-admin/users', {
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    role: formValues.role,
                    region: formValues.region,
                    communities: formValues.communities,
                    staffAccountNumber: formValues.staffAccountNumber,
                    enableMultipleLogin: formValues.enableMultipleLogin,
                    avatar: formValues.avatar
                });
                setUsers(prev => [res.data, ...prev]);
                Swal.fire({
                    title: 'Personnel Onboarded!',
                    html: `<b>${formValues.name}</b> has been successfully provisioned.<br/><br/>A secure random password has been generated and sent via SMS to the user.<br/><br/><i>They must update their password on first login.</i>`,
                    icon: 'success',
                    confirmButtonColor: '#7ede56',
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
            } catch (err: any) {
                console.error('Onboarding failed:', err);
                toast.error(err.response?.data?.msg || 'Failed to onboard new personnel');
            }
        }
    };

    const handleResetSession = async () => {
        if (!selectedUser) {
            setFormValues(prev => ({
                ...prev,
                name: '',
                email: '',
                phone: '',
                communities: [],
                isDisabled: false,
                enableMultipleLogin: false,
                resetPassword: false,
                deleteUser: false,
                avatar: ''
            }));
            toast.info("Form values reset");
            return;
        }

        try {
            await api.put(`/super-admin/users/${selectedUser.id}`, {
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                role: formValues.role,
                region: formValues.region,
                communities: formValues.communities,
                disabled: formValues.isDisabled ? 'Yes' : 'No',
                staffAccountNumber: formValues.staffAccountNumber,
                resetSession: true
            });
            toast.success(`Active sessions for ${selectedUser.name} have been cleared. They can now log in again.`);
        } catch (err: any) {
            console.error('Session reset failed:', err);
            toast.error(err.response?.data?.msg || 'Failed to clear user sessions');
        }
    };

    const handleAvatarUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormValues(prev => ({ ...prev, avatar: reader.result as string }));
                    toast.success("Profile photo attached!");
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Filter Directory listing
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.phone.includes(searchQuery) ||
                              u.staffAccountNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = regionFilter === 'All' || u.region === regionFilter;
        return matchesSearch && matchesRegion;
    });

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Settings className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Admin Setup
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Personnel provisioning and advanced system access control management node
                    </p>
                </div>
            </div>

            {/* TWO PRIMARY STAGE TABS: User Account Creation VS User Access Control */}
            <div className="flex border-b-2 border-gray-200 dark:border-gray-800 gap-2">
                <button
                    onClick={() => setMainTab('UserCreation')}
                    className={`flex items-center gap-2 px-8 py-4 font-black uppercase text-[12px] tracking-widest border-t-4 transition-all rounded-t-xl ${
                        mainTab === 'UserCreation'
                            ? 'bg-[#002f37] text-white border-t-[#7ede56] shadow-md'
                            : 'bg-transparent text-gray-450 border-t-transparent hover:text-gray-600 dark:hover:text-white'
                    }`}
                >
                    <UserPlus className="w-4.5 h-4.5" /> User Account Creation
                </button>
                <button
                    onClick={() => setMainTab('AccessControl')}
                    className={`flex items-center gap-2 px-8 py-4 font-black uppercase text-[12px] tracking-widest border-t-4 transition-all rounded-t-xl ${
                        mainTab === 'AccessControl'
                            ? 'bg-[#002f37] text-white border-t-[#7ede56] shadow-md'
                            : 'bg-transparent text-gray-450 border-t-transparent hover:text-gray-600 dark:hover:text-white'
                    }`}
                >
                    <Lock className="w-4.5 h-4.5" /> User Access Control
                </button>
            </div>

            {/* ========================================================
                TAB 1: USER ACCOUNT PROFILE CREATION STAGE
                ======================================================== */}
            {mainTab === 'UserCreation' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* Header Panel with Title and Action Button: Removed unauthorized tabs as requested */}
                    <div className="flex justify-between items-center gap-4 flex-wrap border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#7ede56]" />
                            <h2 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                Onboarded Personnel Directory
                            </h2>
                        </div>

                        <Button 
                            onClick={handleAddNewUser}
                            className="bg-[#eab308] hover:bg-[#ca8a04] text-black h-11 px-6 font-black uppercase text-[10px] tracking-widest shadow-md rounded-none flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" /> Add New User
                        </Button>
                    </div>

                    {/* Directory Search & Filter options */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-440">Show</span>
                            <Select 
                                value={entriesCount.toString()} 
                                onValueChange={(val) => setEntriesCount(parseInt(val))}
                            >
                                <SelectTrigger className={`w-16 h-9 rounded-lg border-none shadow-inner ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-none shadow-2xl">
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-440">entries</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-[11px] font-black uppercase tracking-wider text-gray-440 shrink-0">Region:</span>
                                <Select 
                                    value={regionFilter} 
                                    onValueChange={(val) => setRegionFilter(val)}
                                >
                                    <SelectTrigger className={`w-full sm:w-44 h-10 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                        <SelectValue placeholder="All Regions" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                        <SelectItem value="All">All Regions</SelectItem>
                                        {regionsList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="relative w-full sm:w-64 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                                <Input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search directory..."
                                    className={`pl-10 h-10 text-xs border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-100 focus:bg-white bg-gray-100'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clean Directory Table */}
                    <Card className={`border-none shadow-premium overflow-hidden rounded-none ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[12px] md:text-[13px] font-black uppercase tracking-wider text-white bg-[#002f37]">
                                        <th className="px-6 py-6 w-10">#</th>
                                        <th className="px-6 py-6 w-14 text-center">Avatar</th>
                                        <th className="px-6 py-6">Full name</th>
                                        <th className="px-6 py-6">Phone No</th>
                                        <th className="px-6 py-6">Email</th>
                                        <th className="px-6 py-6">Role</th>
                                        <th className="px-6 py-6">Operational region</th>
                                        <th className="px-6 py-6 text-center">Password Changed</th>
                                        <th className="px-6 py-6 text-center">Disabled</th>
                                        <th className="px-6 py-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.slice(0, entriesCount).map((user, idx) => (
                                            <tr 
                                                key={user.id} 
                                                className="transition-colors group hover:bg-[#7ede56]/5"
                                            >
                                                <td className="px-6 py-5 text-xs font-black text-gray-400">{idx + 1}</td>
                                                <td className="px-6 py-5">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserCircle className="w-7 h-7 text-gray-300" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`text-[13px] font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                        {user.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 font-mono text-xs text-gray-500">{user.phone}</td>
                                                <td className="px-6 py-5 text-xs text-gray-400 lowercase">{user.email}</td>
                                                <td className="px-6 py-5">
                                                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest border-2 ${
                                                        user.role === 'Lync Agent' 
                                                            ? 'border-sky-500/30 text-sky-500' 
                                                            : 'border-[#7ede56]/30 text-[#7ede56]'
                                                    } rounded-lg px-2 py-0.5`}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4 text-blue-500/50" />
                                                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                                                                {user.region}
                                                            </span>
                                                        </div>
                                                        {user.communities && user.communities.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.communities.map((c) => (
                                                                    <span key={c} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-gray-100 dark:bg-gray-805 text-gray-400 border border-gray-200 dark:border-gray-700 rounded-none">
                                                                        {c}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`text-xs font-black uppercase ${user.passwordChanged === 'Yes' ? 'text-[#7ede56]' : 'text-amber-500'}`}>
                                                        {user.passwordChanged}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`text-xs font-black uppercase ${user.disabled === 'Yes' ? 'text-rose-500' : 'text-gray-400'}`}>
                                                        {user.disabled}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button 
                                                        onClick={() => handleSelectUser(user)}
                                                        className="h-8 px-4 bg-[#eab308] hover:bg-[#ca8a04] text-black font-black uppercase text-[10px] tracking-widest rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 ml-auto"
                                                    >
                                                        SELECT
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Users className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                                        No staff profiles found matching these parameters
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Pagination indicators */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>
                            Showing 1 to {Math.min(filteredUsers.length, entriesCount)} of {filteredUsers.length} entries
                        </span>
                        <div className="flex gap-2">
                            <Button disabled variant="outline" className="h-9 px-4 text-[10px] uppercase font-black tracking-wider rounded-xl">
                                Previous
                            </Button>
                            <Button className="h-9 w-9 text-[10px] uppercase font-black bg-[#002f37] text-white rounded-xl">
                                1
                            </Button>
                            <Button disabled variant="outline" className="h-9 px-4 text-[10px] uppercase font-black tracking-wider rounded-xl">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                TAB 2: USER PROFILE & ACCESS CONTROL MANAGEMENT STAGE
                ======================================================== */}
            {mainTab === 'AccessControl' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    
                    {/* Access Control Top Filter Panel: Replicating User Access Control banner */}
                    <Card className={`border-none shadow-sm rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-gray-55'} overflow-hidden`}>
                        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800" style={{ backgroundColor: '#002f37' }}>
                            <div className="flex items-center gap-2 text-white">
                                <Lock className="w-4 h-4 text-[#7ede56]" />
                                <span className="text-xs font-black uppercase tracking-wider">
                                    User Access Control Provisioning
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                                
                                {/* Branch / Operational Region Selector */}
                                <div className="md:col-span-4 space-y-2.5">
                                    <Label className="text-[11px] font-black uppercase tracking-wider text-gray-450">
                                        Branch Name (Operational Region)
                                    </Label>
                                    <Select 
                                        value={accessRegion} 
                                        onValueChange={(val) => setAccessRegion(val)}
                                    >
                                        <SelectTrigger className={`h-11 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            {regionsList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* User Profile Name Selection Selector */}
                                <div className="md:col-span-5 space-y-2.5">
                                    <Label className="text-[11px] font-black uppercase tracking-wider text-gray-450">
                                        User Name (Active Onboarded Staff)
                                    </Label>
                                    <Select 
                                        value={selectedAccessUserId} 
                                        onValueChange={(val) => setSelectedAccessUserId(val)}
                                    >
                                        <SelectTrigger className={`h-11 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.name} ({u.role} - {u.region})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Toggle All Controls */}
                                <div className="md:col-span-3 flex gap-2">
                                    <Button 
                                        onClick={() => handleToggleAllAccessModules(true)}
                                        className="flex-1 h-11 bg-[#002f37] hover:bg-[#001d22] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md"
                                    >
                                        Check All
                                    </Button>
                                    <Button 
                                        onClick={() => handleToggleAllAccessModules(false)}
                                        className="flex-1 h-11 bg-gray-400 hover:bg-gray-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md"
                                    >
                                        Uncheck All
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION A: ACCESS MODULE CHECKBOXES */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-855 pb-2">
                            <Sliders className="w-4 h-4 text-[#7ede56]" />
                            <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                User Access Modules
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Checkbox fields styled exactly like the screenshot but mapped to the Agent Dashboard modules */}
                            {[
                                { key: 'farmersManagement', label: 'Farmers Management' },
                                { key: 'farmManagement', label: 'Farm Management' },
                                { key: 'farmMonitoring', label: 'Farm Monitoring' },
                                { key: 'tasksDashboard', label: 'Tasks Dashboard' },
                                { key: 'mediaDashboard', label: 'Media & Recordings Hub' },
                                { key: 'disputeManagement', label: 'Dispute Resolution' },
                                { key: 'agentPerformance', label: 'Performance Insights' },
                                { key: 'trainingPerformance', label: 'Training & Resources' },
                                { key: 'investorMatches', label: 'Investor Linkages' },
                                { key: 'notifications', label: 'Notifications Dispatch' },
                                { key: 'profileConfig', label: 'Profile Config' },
                                { key: 'allowedViewFarmerBiodata', label: 'Allowed to view Farmer Bio-data' }
                            ].map((item) => (
                                <Card key={item.key} className={`border border-gray-150 dark:border-gray-800 p-4 rounded-xl flex items-center space-x-3.5 transition-all hover:bg-gray-50 dark:hover:bg-gray-900 ${
                                    accessModules[item.key as keyof typeof accessModules] ? 'bg-[#7ede56]/5 border-[#7ede56]/30' : ''
                                }`}>
                                    <Checkbox
                                        id={item.key}
                                        checked={accessModules[item.key as keyof typeof accessModules]}
                                        onCheckedChange={(checked) => setAccessModules(prev => ({ ...prev, [item.key]: !!checked }))}
                                        className="h-4 w-4 border-2 border-gray-300 data-[state=checked]:bg-[#7ede56] data-[state=checked]:border-[#7ede56]"
                                    />
                                    <Label htmlFor={item.key} className="text-xs font-black uppercase tracking-wider text-gray-550 dark:text-gray-300 cursor-pointer select-none">
                                        {item.label}
                                    </Label>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* SECTION C: SAVED USER PERMISSIONS DYNAMIC TABLE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-855 pb-2">
                            <Layers className="w-4 h-4 text-[#7ede56]" />
                            <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                Saved User System Permissions Grid
                            </h3>
                        </div>

                        <Card className="border-none shadow-md overflow-hidden rounded-none">
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[12px] md:text-[13px] font-black uppercase tracking-wider text-white bg-[#002f37]">
                                            <th className="px-6 py-5.5 w-12 text-center">#</th>
                                            <th className="px-6 py-5.5 w-12 text-center">Access Status</th>
                                            <th className="px-6 py-5.5">Menu Item</th>
                                            <th className="px-6 py-5.5">Module Scope</th>
                                            <th className="px-6 py-5.5">Menu Node Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {permissionsGrid.map((p, idx) => (
                                            <tr key={idx} className="transition-colors group hover:bg-[#7ede56]/5">
                                                <td className="px-6 py-4.5 text-center text-xs font-black text-gray-400">{idx + 1}</td>
                                                <td className="px-6 py-4.5 text-center">
                                                    <Checkbox
                                                        checked={p.enabled}
                                                        onCheckedChange={() => handleToggleGridRow(idx)}
                                                        className="h-4.5 w-4.5 border-2 border-gray-300 data-[state=checked]:bg-[#7ede56] data-[state=checked]:border-[#7ede56]"
                                                    />
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <span className={`text-[12px] font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                        {p.menuItem}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5 text-xs font-bold text-gray-500 uppercase">{p.module}</td>
                                                <td className="px-6 py-4.5">
                                                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-2 ${
                                                        p.menuType === 'Main' 
                                                            ? 'border-sky-500/20 text-sky-500' 
                                                            : 'border-amber-500/20 text-amber-500'
                                                    } rounded-md px-2 py-0.5`}>
                                                        {p.menuType}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* FOOTER ACTIONS - Replicating exactly the bottom row in the screenshots */}
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            onClick={handleUpdateAccessControl}
                            className="w-full sm:w-auto h-12 px-8 bg-[#eab308] hover:bg-[#ca8a04] text-black font-black uppercase text-[11px] tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" /> Update User Profile
                        </Button>
                        
                        <Button
                            onClick={handleDeletePreviousProfile}
                            className="w-full sm:w-auto h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[11px] tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" /> Delete Previous Profile
                        </Button>
                        
                        <Button
                            onClick={() => setMainTab('UserCreation')}
                            className="w-full sm:w-auto h-12 px-8 bg-gray-500 hover:bg-gray-600 text-white font-black uppercase text-[11px] tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Back to Creation
                        </Button>
                    </div>
                </div>
            )}

            {/* BOTTOM SECURE AUDIT BANNER */}
            <div className={`p-6 rounded-none border border-dashed ${darkMode ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50 border-rose-200'} flex flex-col md:flex-row items-center justify-between gap-6 mt-12 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-rose-500/5 rotate-12 blur-3xl group-hover:bg-rose-500/10 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 rounded-none bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-rose-950 dark:text-rose-400">Security Node Audit</h3>
                        <p className="text-[10px] max-w-md font-bold uppercase tracking-wide text-rose-700/60 dark:text-rose-400/60 mt-1 leading-relaxed">
                            Administrative account created by <strong>Super Admin</strong>. All staff are subject to system security policies.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="font-black text-[9px] px-8 tracking-widest h-10 uppercase border-2 border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-none relative z-10">
                    Personnel Safety Audit
                </Button>
            </div>

            {/* ========================================================
                GORGEOUS DIALOG MODAL ONBOARDING WORKSPACE - MAX-H & SCROLL OVERRIDES
                ======================================================== */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className={`md:max-w-[1150px] p-0 border-none rounded-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'} max-h-[96vh] overflow-y-auto [&>button]:text-white [&>button]:opacity-85 [&>button:hover]:opacity-100 [&>button]:top-5 [&>button]:right-6 [&>button]:z-50 [&>button]:scale-110`}>
                    <DialogTitle className="sr-only">User Account Management</DialogTitle>
                    
                    {/* Header bar in deep pine brand color - with taller py-6.5 for premium spacing */}
                    <div className="px-8 py-6 flex items-center justify-between relative border-b border-white/10" style={{ backgroundColor: '#002f37' }}>
                        <div className="flex items-center gap-2.5 text-[#7ede56]">
                            <UserCircle className="w-5.5 h-5.5" />
                            <span className="text-[13px] font-black uppercase tracking-wider text-white">
                                {selectedUser ? "User Account Profile Editing" : "User Account Profile Creation"}
                            </span>
                        </div>
                        {selectedUser && (
                            <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px] px-2.5 py-1 rounded-none mr-8">
                                EDIT ACTIVE PROFILE
                            </Badge>
                        )}
                    </div>

                    <div className="p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* LEFT COLUMN: Input Fields */}
                            <div className="lg:col-span-9 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    
                                    {/* Operational Region field */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                                            Operational Region <span className="text-rose-500">*</span>
                                        </Label>
                                        <Select 
                                            value={formValues.region} 
                                            onValueChange={(val) => setFormValues(prev => ({ ...prev, region: val, communities: [] }))}
                                        >
                                            <SelectTrigger className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-855 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none border-none shadow-2xl max-h-[300px]">
                                                {regionsList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Full Name field */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                                            Full Name <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input 
                                            value={formValues.name}
                                            onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter full name"
                                            className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-850' : 'bg-gray-50'}`}
                                        />
                                    </div>

                                    {/* Email field */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                                            Email <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input 
                                            type="email"
                                            value={formValues.email}
                                            onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="e.g. name@domain.com"
                                            className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-850' : 'bg-gray-50'}`}
                                        />
                                    </div>

                                    {/* Phone Number field */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                                            Phone Number <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input 
                                            value={formValues.phone}
                                            onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="e.g. 0550259458"
                                            className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-850' : 'bg-gray-50'}`}
                                        />
                                    </div>

                                    {/* User Role field */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450">
                                            User Role <span className="text-rose-500">*</span>
                                        </Label>
                                        <Select 
                                            value={formValues.role} 
                                            onValueChange={(val) => {
                                                let updatedAC = formValues.staffAccountNumber;
                                                if (!selectedUser) { // only autogenerate for new user creation
                                                    if (val === 'agent') {
                                                        updatedAC = 'LYC' + Math.floor(10000 + Math.random() * 90000);
                                                    } else if (val === 'supervisor') {
                                                        updatedAC = 'SUP-' + Math.floor(1000 + Math.random() * 9000);
                                                    } else if (val === 'super_admin') {
                                                        updatedAC = 'SA-' + Math.floor(100 + Math.random() * 900);
                                                    } else {
                                                        updatedAC = 'LYC' + Math.floor(10000 + Math.random() * 90000);
                                                    }
                                                }
                                                setFormValues(prev => ({ 
                                                    ...prev, 
                                                    role: val,
                                                    staffAccountNumber: updatedAC
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-855 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none border-none shadow-2xl">
                                                <SelectItem value="agent">Lync Agent</SelectItem>
                                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Staff A/C Number */}
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-gray-455">
                                            Staff A/C Number <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input 
                                            value={formValues.staffAccountNumber}
                                            readOnly
                                            placeholder="Auto-generated ID"
                                            className={`h-11 rounded-none text-sm border-none shadow-inner ${darkMode ? 'bg-gray-855' : 'bg-gray-50'} font-mono text-[#7ede56] cursor-not-allowed`}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Communities Selector based on selected Region */}
                                <div className="space-y-3.5 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-gray-450 block">
                                        Operational Communities (Select Multiple) <span className="text-[#7ede56] font-bold">({formValues.communities.length} selected)</span>
                                    </Label>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {(communitiesMap[formValues.region] || []).map((community) => {
                                            const isSelected = formValues.communities.includes(community);
                                            return (
                                                <button
                                                    type="button"
                                                    key={community}
                                                    onClick={() => {
                                                        setFormValues(prev => {
                                                            const exists = prev.communities.includes(community);
                                                            const newCommunities = exists
                                                                ? prev.communities.filter(c => c !== community)
                                                                : [...prev.communities, community];
                                                            return { ...prev, communities: newCommunities };
                                                        });
                                                    }}
                                                    className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 border-2 rounded-none ${
                                                        isSelected 
                                                            ? 'bg-[#7ede56] border-[#7ede56] text-[#002f37] shadow-md'
                                                            : 'bg-transparent border-gray-200 dark:border-gray-850 text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                                                    }`}
                                                >
                                                    {community}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {formValues.communities.length === 0 && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                                            * Please select at least one community of operation for this agent
                                        </p>
                                    )}
                                </div>

                                {/* Checkbox Action Toggles */}
                                <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="modalIsDisabled" 
                                            checked={formValues.isDisabled}
                                            onCheckedChange={(checked) => setFormValues(prev => ({ ...prev, isDisabled: !!checked }))}
                                            className="h-4 w-4 border-2 border-gray-300 rounded-none data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                        />
                                        <Label htmlFor="modalIsDisabled" className="text-xs font-black uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-600">
                                            Is Disabled?
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="modalEnableMultipleLogin" 
                                            checked={formValues.enableMultipleLogin}
                                            onCheckedChange={(checked) => setFormValues(prev => ({ ...prev, enableMultipleLogin: !!checked }))}
                                            className="h-4 w-4 border-2 border-gray-300 rounded-none data-[state=checked]:bg-[#7ede56] data-[state=checked]:border-[#7ede56]"
                                        />
                                        <Label htmlFor="modalEnableMultipleLogin" className="text-xs font-black uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-600">
                                            Enable Multiple Login?
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="modalResetPassword" 
                                            checked={formValues.resetPassword}
                                            onCheckedChange={(checked) => setFormValues(prev => ({ ...prev, resetPassword: !!checked }))}
                                            className="h-4 w-4 border-2 border-gray-300 rounded-none data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                        />
                                        <Label htmlFor="modalResetPassword" className="text-xs font-black uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-600">
                                            Reset Password
                                        </Label>
                                    </div>

                                </div>
                            </div>

                            {/* RIGHT COLUMN: Photo Upload Options */}
                            <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 border-l border-gray-150 dark:border-l-gray-800 space-y-4">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-none overflow-hidden border-4 border-[#7ede56] shadow-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                                        {formValues.avatar && !formValues.avatar.includes('lovable-uploads/profile.png') ? (
                                            <img 
                                                src={formValues.avatar} 
                                                alt="Preview avatar" 
                                                className="w-full h-full object-cover animate-in fade-in rounded-none"
                                            />
                                        ) : (
                                            <UserCircle className="w-16 h-16 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 w-full">
                                    <Button 
                                        type="button"
                                        onClick={handleAvatarUpload}
                                        className="flex-1 h-9 bg-[#002f37] hover:bg-[#001c21] text-white text-[10px] font-black uppercase tracking-widest rounded-none flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Camera className="w-3.5 h-3.5" /> Photo
                                    </Button>
                                    <Button 
                                        type="button"
                                        onClick={handleAvatarUpload}
                                        className="flex-1 h-9 bg-gray-500 hover:bg-gray-600 text-white text-[10px] font-black uppercase tracking-widest rounded-none flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                    </Button>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase text-center leading-relaxed">
                                    Choose an option to add profile picture
                                </span>
                            </div>
                        </div>

                        {/* Modal Action buttons */}
                        <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                            {/* Left group: Delete + Reset */}
                            <div className="flex items-center gap-3">
                                {selectedUser && (
                                    <Button 
                                        type="button"
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Delete User?',
                                                text: `This will permanently remove ${selectedUser.name}'s account. This cannot be undone.`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#ef4444',
                                                cancelButtonColor: '#6b7280',
                                                confirmButtonText: 'Yes, Delete',
                                                target: '[role="dialog"]',
                                                customClass: {
                                                    container: 'z-[99999]'
                                                }
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    try {
                                                        await api.delete(`/super-admin/users/${selectedUser.id}`);
                                                        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
                                                        setIsModalOpen(false);
                                                        toast.success('User deleted successfully');
                                                    } catch (error) {
                                                        toast.error('Failed to delete user');
                                                    }
                                                }
                                            });
                                        }}
                                        className="h-11 px-6 bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[11px] tracking-widest rounded-none transition-all shadow-md flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </Button>
                                )}
                                <Button 
                                    type="button"
                                    onClick={handleResetSession}
                                    className="h-11 px-6 bg-slate-500 hover:bg-slate-600 text-white font-black uppercase text-[11px] tracking-widest rounded-none transition-all shadow-md"
                                >
                                    {selectedUser ? 'Reset Session' : 'Reset Form'}
                                </Button>
                            </div>

                            {/* Right: Save / Update */}
                            <Button 
                                type="button"
                                onClick={handleSaveRecord}
                                className="h-11 px-8 bg-[#eab308] hover:bg-[#ca8a04] text-black font-black uppercase text-[11px] tracking-widest rounded-none transition-all shadow-md flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" /> {selectedUser ? 'Update Record' : 'Save Record'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgentManagement;
