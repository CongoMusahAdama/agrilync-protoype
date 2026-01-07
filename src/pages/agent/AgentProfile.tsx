import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentLayout from './AgentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { User, MapPin, Briefcase, FileText, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AgentProfile: React.FC = () => {
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const { agent, loading } = useAuth();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { updateAgent } = useAuth();
    const [formData, setFormData] = useState<any>({});

    React.useEffect(() => {
        if (agent) {
            setFormData(agent);
        }
    }, [agent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            await updateAgent(formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const sectionCardClass = darkMode
        ? 'border border-[#124b53] bg-[#0b2528] text-gray-100'
        : 'border-none bg-white text-gray-900';

    const inputBaseClasses = darkMode
        ? 'bg-[#10363d] border-[#1b5b65] text-gray-100 placeholder:text-gray-400 focus:border-[#1db954]'
        : 'focus:border-[#1db954]';

    const tabTriggerClass = (isActive: boolean) => `
    px-6 py-3 font-medium transition-all duration-200
    ${isActive
            ? 'bg-[#1db954] text-white shadow-md'
            : darkMode
                ? 'text-gray-300 hover:bg-[#0d3036] hover:text-white'
                : 'text-gray-600 hover:bg-gray-100'
        }
  `;

    return (
        <AgentLayout
            activeSection="profile"
            title="Profile & Settings"
        >
            <div className="max-w-5xl mx-auto">
                {/* Header with Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Agent Profile
                        </h2>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Update your personal information and settings
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                            className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-[#0d3036]' : ''}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                        {isEditing && (
                            <Button
                                className="bg-[#1db954] hover:bg-[#17a447] text-white"
                                onClick={handleSave}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabbed Interface */}
                <Card className={`${sectionCardClass} shadow-lg`}>
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className={`${isMobile 
                                ? 'flex w-full overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1' 
                                : 'grid w-full grid-cols-4'} ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-100'} ${isMobile ? 'p-1.5' : 'p-1'} rounded-lg`}>
                                <TabsTrigger
                                    value="personal"
                                    className={`${isMobile 
                                        ? 'flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap' 
                                        : ''} ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                                >
                                    <User className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${isMobile ? 'mr-1.5' : 'mr-2'}`} />
                                    {isMobile ? 'Personal' : 'Personal Info'}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="work"
                                    className={`${isMobile 
                                        ? 'flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap' 
                                        : ''} ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                                >
                                    <Briefcase className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${isMobile ? 'mr-1.5' : 'mr-2'}`} />
                                    {isMobile ? 'Work' : 'Work Details'}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    className={`${isMobile 
                                        ? 'flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap' 
                                        : ''} ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                                >
                                    <MapPin className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${isMobile ? 'mr-1.5' : 'mr-2'}`} />
                                    Location
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documents"
                                    className={`${isMobile 
                                        ? 'flex-shrink-0 text-xs px-3 py-2 whitespace-nowrap' 
                                        : ''} ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                                >
                                    <FileText className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${isMobile ? 'mr-1.5' : 'mr-2'}`} />
                                    {isMobile ? 'Docs' : 'Documents'}
                                </TabsTrigger>
                            </TabsList>

                            {/* Personal Information Tab */}
                            <TabsContent value="personal" className="space-y-6">
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Personal Information
                                    </h3>

                                    {/* Profile Picture */}
                                    <div className="mb-6">
                                        <Label className={`text-sm font-medium mb-3 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Profile Picture
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-[#1db954] overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                {formData.avatar ? (
                                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="profile-picture"
                                                    disabled={!isEditing}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setFormData({ ...formData, avatar: reader.result as string });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="profile-picture"
                                                    className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEditing
                                                        ? darkMode
                                                            ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <Upload className="h-4 w-4 inline mr-2" />
                                                    Upload Photo
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="fullName" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData?.name || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Email Address <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="agent@agrilync.com"
                                                value={formData?.email || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Phone Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="contact"
                                                type="tel"
                                                value={formData?.contact || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Gender
                                            </Label>
                                            <Select disabled={!isEditing}>
                                                <SelectTrigger className={`${inputBaseClasses}`}>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Work Details Tab */}
                            <TabsContent value="work" className="space-y-6">
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Work Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="agentId" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Agent ID
                                            </Label>
                                            <Input
                                                id="agentId"
                                                defaultValue={agent?.agentId}
                                                disabled
                                                className={`${inputBaseClasses} cursor-not-allowed`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="joinDate" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Join Date
                                            </Label>
                                            <Input
                                                id="joinDate"
                                                placeholder="Jan 2024"
                                                disabled
                                                className={`${inputBaseClasses} cursor-not-allowed`}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="specialization" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Specialization
                                            </Label>
                                            <Select disabled={!isEditing}>
                                                <SelectTrigger className={`${inputBaseClasses}`}>
                                                    <SelectValue placeholder="Select specialization" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="crop">Crop Farming</SelectItem>
                                                    <SelectItem value="livestock">Livestock</SelectItem>
                                                    <SelectItem value="mixed">Mixed Farming</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="experience" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Years of Experience
                                            </Label>
                                            <Input
                                                id="experience"
                                                type="number"
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="bio" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Bio
                                            </Label>
                                            <Textarea
                                                id="bio"
                                                rows={4}
                                                placeholder="Tell us about your experience and expertise..."
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Location Tab */}
                            <TabsContent value="location" className="space-y-6">
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Location Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="region" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Region <span className="text-red-500">*</span>
                                            </Label>
                                            <Select disabled={!isEditing}>
                                                <SelectTrigger className={`${inputBaseClasses}`}>
                                                    <SelectValue placeholder={agent?.region} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ashanti">Ashanti</SelectItem>
                                                    <SelectItem value="eastern">Eastern</SelectItem>
                                                    <SelectItem value="northern">Northern</SelectItem>
                                                    <SelectItem value="western">Western</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="district" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                District
                                            </Label>
                                            <Input
                                                id="district"
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="address" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                rows={3}
                                                placeholder="Enter your full address..."
                                                disabled={!isEditing}
                                                className={`${inputBaseClasses}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents" className="space-y-6">
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Documents & Certifications
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className={`text-sm font-medium mb-3 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Identification Document
                                            </Label>
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
                                                <Upload className={`h-10 w-10 mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Upload your ID card or passport
                                                </p>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    id="id-document"
                                                    disabled={!isEditing}
                                                />
                                                <label
                                                    htmlFor="id-document"
                                                    className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEditing
                                                        ? darkMode
                                                            ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Choose File
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className={`text-sm font-medium mb-3 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Certifications
                                            </Label>
                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
                                                <Upload className={`h-10 w-10 mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Upload relevant certifications
                                                </p>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    multiple
                                                    className="hidden"
                                                    id="certifications"
                                                    disabled={!isEditing}
                                                />
                                                <label
                                                    htmlFor="certifications"
                                                    className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEditing
                                                        ? darkMode
                                                            ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Choose Files
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AgentLayout>
    );
};

export default AgentProfile;
