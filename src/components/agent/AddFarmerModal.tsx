import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
    User,
    Sprout,
    Wallet,
    FileCheck,
    Upload,
    Plus,
    X,
    MapPin,
    Camera,
    Image as ImageIcon
} from 'lucide-react';
import FarmMap from '@/components/FarmMap';

interface AddFarmerModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ trigger, open, onOpenChange }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [farmType, setFarmType] = useState<string>('');

    // Mock function to handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In a real app, handle file upload
        console.log(e.target.files);
    };

    const nextTab = (current: string) => {
        const tabs = ['personal', 'farm', 'investment', 'verification'];
        const idx = tabs.indexOf(current);
        if (idx < tabs.length - 1) {
            setActiveTab(tabs[idx + 1]);
        }
    };

    const prevTab = (current: string) => {
        const tabs = ['personal', 'farm', 'investment', 'verification'];
        const idx = tabs.indexOf(current);
        if (idx > 0) {
            setActiveTab(tabs[idx - 1]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#002f37] border-none z-[150]">
                <DialogHeader className="p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Plus className="h-6 w-6 text-[#1db954]" />
                        Add New Farmer
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-6 flex-shrink-0">
                            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-[#0b2528] rounded-lg">
                                <TabsTrigger
                                    value="personal"
                                    className="flex flex-col gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#124b53] data-[state=active]:shadow-sm"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Personal</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="farm"
                                    className="flex flex-col gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#124b53] data-[state=active]:shadow-sm"
                                >
                                    <Sprout className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Farm Info</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="investment"
                                    className="flex flex-col gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#124b53] data-[state=active]:shadow-sm"
                                >
                                    <Wallet className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Investment</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="verification"
                                    className="flex flex-col gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-[#124b53] data-[state=active]:shadow-sm"
                                >
                                    <FileCheck className="h-4 w-4" />
                                    <span className="text-xs font-semibold">Verification</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            {/* SECTION 1: Farmer Personal Details */}
                            <TabsContent value="personal" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                                        <Input id="fullName" placeholder="Enter full name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                        <Input id="phone" placeholder="+233 XX XXX XXXX" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                                        <Input id="dob" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region <span className="text-red-500">*</span></Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ashanti">Ashanti</SelectItem>
                                                <SelectItem value="eastern">Eastern</SelectItem>
                                                <SelectItem value="northern">Northern</SelectItem>
                                                <SelectItem value="volta">Volta</SelectItem>
                                                <SelectItem value="western">Western</SelectItem>
                                                <SelectItem value="central">Central</SelectItem>
                                                <SelectItem value="greater-accra">Greater Accra</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District / Community <span className="text-red-500">*</span></Label>
                                        <Input id="district" placeholder="Enter district or community" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Preferred Language <span className="text-red-500">*</span></Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="english">English</SelectItem>
                                                <SelectItem value="twi">Twi</SelectItem>
                                                <SelectItem value="ewe">Ewe</SelectItem>
                                                <SelectItem value="ga">Ga</SelectItem>
                                                <SelectItem value="dagbani">Dagbani</SelectItem>
                                                <SelectItem value="hausa">Hausa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email (Optional)</Label>
                                        <Input id="email" type="email" placeholder="Enter email address" />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SECTION 2: Farm Information */}
                            <TabsContent value="farm" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="farmType">Farm Type <span className="text-red-500">*</span></Label>
                                        <Select onValueChange={setFarmType}>
                                            <SelectTrigger><SelectValue placeholder="Select farm type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="crop">Crop Farming</SelectItem>
                                                <SelectItem value="livestock">Livestock Farming</SelectItem>
                                                <SelectItem value="mixed">Mixed Farming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Conditional Fields based on Farm Type */}
                                    {farmType === 'crop' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="cropCategory">Crop Category <span className="text-red-500">*</span></Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="maize">Maize</SelectItem>
                                                        <SelectItem value="cocoa">Cocoa</SelectItem>
                                                        <SelectItem value="rice">Rice</SelectItem>
                                                        <SelectItem value="tomatoes">Tomatoes</SelectItem>
                                                        <SelectItem value="cassava">Cassava</SelectItem>
                                                        <SelectItem value="yam">Yam</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="farmSize">Farm Size (Acres/Hectares) <span className="text-red-500">*</span></Label>
                                                <Input id="farmSize" type="number" placeholder="e.g. 5" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="irrigation">Irrigation Access</Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Select access" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="no">No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}

                                    {farmType === 'livestock' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="animalType">Animal Type <span className="text-red-500">*</span></Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Select animal" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="poultry">Poultry</SelectItem>
                                                        <SelectItem value="goats">Goats</SelectItem>
                                                        <SelectItem value="sheep">Sheep</SelectItem>
                                                        <SelectItem value="pigs">Pigs</SelectItem>
                                                        <SelectItem value="cattle">Cattle</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="animalCount">Number of Animals <span className="text-red-500">*</span></Label>
                                                <Input id="animalCount" type="number" placeholder="e.g. 100" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="housing">Housing Type</Label>
                                                <Input id="housing" placeholder="e.g. Coop, Pen, Free-range" />
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="productionStage">Production Stage <span className="text-red-500">*</span></Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="planning">Planning</SelectItem>
                                                <SelectItem value="planting">Planting/Breeding</SelectItem>
                                                <SelectItem value="growing">Growing</SelectItem>
                                                <SelectItem value="harvesting">Harvesting</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Farming Experience (Years) <span className="text-red-500">*</span></Label>
                                        <Input id="experience" type="number" placeholder="e.g. 10" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="method">Farming Method</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="organic">Organic</SelectItem>
                                                <SelectItem value="conventional">Conventional</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="landOwnership">Land Ownership</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select ownership" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="owned">Owned</SelectItem>
                                                <SelectItem value="leased">Leased</SelectItem>
                                                <SelectItem value="family">Family Land</SelectItem>
                                                <SelectItem value="sharecropping">Sharecropping</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="block mb-2">Farm Location (GPS + Community) <span className="text-red-500">*</span></Label>
                                        <div className="border rounded-lg overflow-hidden">
                                            <FarmMap
                                                latitude={0}
                                                longitude={0}
                                                onLocationChange={(lat, lng) => console.log(lat, lng)}
                                                onAreaChange={(area) => console.log(area)}
                                                farmSize={0}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Click on the map to pin exact location. Use the ruler tool to measure farm boundaries.
                                        </p>
                                    </div>

                                    {/* Photo Uploads */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="block mb-2">Farm & Product Photos <span className="text-red-500">*</span></Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Farm Photo</span>
                                                <span className="text-xs text-gray-500">Overview of the land/site</span>
                                                <input type="file" className="hidden" accept="image/*" />
                                            </div>
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                                                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Product Photos</span>
                                                <span className="text-xs text-gray-500">Crops, animals, or produce</span>
                                                <input type="file" className="hidden" accept="image/*" multiple />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SECTION 3: Investment & Support */}
                            <TabsContent value="investment" className="mt-0 space-y-6">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Type of Investment Needed</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-input" />
                                                <Label htmlFor="inv-input" className="font-normal">Input Support</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-equip" />
                                                <Label htmlFor="inv-equip" className="font-normal">Equipment Support</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-labour" />
                                                <Label htmlFor="inv-labour" className="font-normal">Labour Support</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-land" />
                                                <Label htmlFor="inv-land" className="font-normal">Land Preparation</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-cash" />
                                                <Label htmlFor="inv-cash" className="font-normal">Cash Support</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="inv-process" />
                                                <Label htmlFor="inv-process" className="font-normal">Processing</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Preferred Partnership Model</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <Checkbox id="part-profit" />
                                                <div className="flex flex-col">
                                                    <Label htmlFor="part-profit" className="font-medium cursor-pointer">Profit Sharing</Label>
                                                    <span className="text-xs text-gray-500">Share profits after harvest</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <Checkbox id="part-buyback" />
                                                <div className="flex flex-col">
                                                    <Label htmlFor="part-buyback" className="font-medium cursor-pointer">Buy-back Agreement</Label>
                                                    <span className="text-xs text-gray-500">Investor buys produce</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <Checkbox id="part-finance" />
                                                <div className="flex flex-col">
                                                    <Label htmlFor="part-finance" className="font-medium cursor-pointer">Input Financing</Label>
                                                    <span className="text-xs text-gray-500">Loan for inputs</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pastPerformance">Past Farm Performance (Optional)</Label>
                                        <Textarea
                                            id="pastPerformance"
                                            placeholder="Describe previous yields, revenue, or successful seasons..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SECTION 4: Verification */}
                            <TabsContent value="verification" className="mt-0 space-y-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">Identity Verification</Label>
                                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/30">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="idType">ID Type</Label>
                                                    <Select>
                                                        <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ghana-card">Ghana Card</SelectItem>
                                                            <SelectItem value="voter-id">Voter ID</SelectItem>
                                                            <SelectItem value="passport">Passport</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Upload ID Document</Label>
                                                    <div className="flex items-center gap-4">
                                                        <Button variant="outline" className="w-full">
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Choose File
                                                        </Button>
                                                        <span className="text-sm text-gray-500">No file chosen</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">Additional Documents (Optional)</Label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Drag and drop or click to upload land papers, certifications, etc.
                                            </p>
                                            <Button variant="ghost" size="sm" className="mt-2 text-[#1db954]">Browse Files</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="agentNotes">Agent Notes</Label>
                                        <Textarea
                                            id="agentNotes"
                                            placeholder="Add any observations or notes about this farmer..."
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                        <div>
                                            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Verification Status</h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">Default status for new farmers</p>
                                        </div>
                                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                            Pending
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                <DialogFooter className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0b2528] flex-shrink-0">
                    <div className="flex justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={() => activeTab === 'personal' ? onOpenChange?.(false) : prevTab(activeTab)}
                            className="border-gray-300 dark:border-gray-600"
                        >
                            {activeTab === 'personal' ? 'Cancel' : 'Back'}
                        </Button>

                        {activeTab === 'verification' ? (
                            <Button className="bg-[#1db954] hover:bg-[#17a447] text-white">
                                Submit & Add Farmer
                            </Button>
                        ) : (
                            <Button
                                onClick={() => nextTab(activeTab)}
                                className="bg-[#002f37] text-white hover:bg-[#003f4a] dark:bg-white dark:text-[#002f37] dark:hover:bg-gray-100"
                            >
                                Next Step
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFarmerModal;
