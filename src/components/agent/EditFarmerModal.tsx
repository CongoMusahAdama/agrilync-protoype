import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { User, Sprout, MapPin, Edit, Save } from 'lucide-react';
import { regions, farmCategories } from '@/data/mockFarmData';

interface EditFarmerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onSave?: (updatedFarmer: any) => void;
}

const EditFarmerModal: React.FC<EditFarmerModalProps> = ({ open, onOpenChange, farmer, onSave }) => {
    const { darkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState(farmer || {});
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveAll = () => {
        if (onSave) {
            onSave(formData);
        }
        setIsEditing(false);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setFormData(farmer);
        setIsEditing(false);
        onOpenChange(false);
    };

    if (!farmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-5xl h-[75vh] flex flex-col p-0 gap-0 ${darkMode ? 'bg-[#002f37] border-[#124b53]' : 'bg-white border-none'}`}>
                <DialogHeader className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} flex-shrink-0`}>
                    <DialogTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        <Edit className="h-6 w-6 text-[#1db954]" />
                        Edit Farmer Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-6 flex-shrink-0">
                            <TabsList className={`grid w-full grid-cols-3 h-auto p-1 rounded-lg ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-100'}`}>
                                <TabsTrigger
                                    value="personal"
                                    className={`flex flex-col gap-1 py-3 ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white'} data-[state=active]:shadow-sm`}
                                >
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Personal</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    className={`flex flex-col gap-1 py-3 ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white'} data-[state=active]:shadow-sm`}
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Location</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="farm"
                                    className={`flex flex-col gap-1 py-3 ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white'} data-[state=active]:shadow-sm`}
                                >
                                    <Sprout className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Farm Info</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            {/* Personal Information Tab */}
                            <TabsContent value="personal" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'opacity-60' : ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'opacity-60' : ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.status || ''}
                                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className={!isEditing ? 'opacity-60' : ''}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Verified">Verified</SelectItem>
                                                <SelectItem value="Matched">Matched</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email (Optional)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="farmer@example.com"
                                            disabled={!isEditing}
                                            className={!isEditing ? 'opacity-60' : ''}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Location Tab */}
                            <TabsContent value="location" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.region || ''}
                                            onValueChange={(val) => setFormData({ ...formData, region: val })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className={!isEditing ? 'opacity-60' : ''}>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {regions.map((region) => (
                                                    <SelectItem key={region} value={region}>
                                                        {region}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="community">Community <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="community"
                                            value={formData.community || ''}
                                            onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'opacity-60' : ''}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Farm Information Tab */}
                            <TabsContent value="farm" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="farmType">Farm Type <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.farmType || ''}
                                            onValueChange={(val) => setFormData({ ...formData, farmType: val })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className={!isEditing ? 'opacity-60' : ''}>
                                                <SelectValue placeholder="Select farm type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Crop">Crop</SelectItem>
                                                <SelectItem value="Livestock">Livestock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.category || ''}
                                            onValueChange={(val) => setFormData({ ...formData, category: val })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className={!isEditing ? 'opacity-60' : ''}>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formData.farmType === 'Crop'
                                                    ? farmCategories.Crop.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))
                                                    : farmCategories.Livestock.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="lastVisit">Last Visit</Label>
                                        <Input
                                            id="lastVisit"
                                            type="date"
                                            value={formData.lastVisit ? new Date(formData.lastVisit).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'opacity-60' : ''}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                <DialogFooter className={`p-6 border-t ${darkMode ? 'border-gray-800 bg-[#0b2528]' : 'border-gray-100 bg-gray-50'} flex-shrink-0`}>
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className={darkMode ? 'border-gray-600' : 'border-gray-300'}
                        >
                            Cancel
                        </Button>

                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Enable Editing
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSaveAll}
                                className="bg-[#1db954] hover:bg-[#17a447] text-white"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save All Changes
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditFarmerModal;
