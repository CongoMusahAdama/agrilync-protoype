import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Info,
    Leaf,
    LogOut,
    MapPin,
    Menu,
    Moon,
    Sun,
    Upload,
    User,
    UserCheck,
    BarChart3,
    Users,
    Settings,
} from 'lucide-react';

const GrowerProfile: React.FC = () => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const isMobile = useIsMobile();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [activeStep, setActiveStep] = useState('personal');
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const profileSteps = [
        { id: 'personal', label: 'Personal Information' },
        { id: 'job', label: 'Job Details' },
        { id: 'compensation', label: 'Compensation Budget' },
        { id: 'review', label: 'Review Contract' },
    ];

    const globalSidebarItems = [
        { key: 'dashboard', label: 'Dashboard', icon: Activity },
        { key: 'farm-management', label: 'Farm Management', icon: MapPin },
        { key: 'farm-analytics', label: 'Farm Analytics', icon: BarChart3 },
        { key: 'investor-matches', label: 'Investor Matches', icon: Users },
        { key: 'training-sessions', label: 'Training Sessions', icon: Calendar },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'profile', label: 'Profile & Settings', icon: Settings },
    ];

    const [activeSidebarItem, setActiveSidebarItem] = useState('profile');

    const handleSidebarNavigation = (item: string) => {
        setActiveSidebarItem(item);
        if (isMobile) {
            setMobileSidebarOpen(false);
        }
        const routes: Record<string, string> = {
            dashboard: `/dashboard/grower`,
            profile: `/dashboard/grower/profile`,
            'farm-management': `/dashboard/grower/farm-management`,
            'farm-analytics': `/dashboard/grower/farm-analytics`,
            'investor-matches': `/dashboard/grower/investor-matches`,
            'training-sessions': `/dashboard/grower/training-sessions`,
            notifications: `/dashboard/grower/notifications`,
        };
        if (routes[item]) {
            navigate(routes[item]);
        }
    };

    const SidebarContent = () => (
        <>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'}`}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <img
                            src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                            alt="AgriLync Logo"
                            className="h-8 w-8"
                        />
                        {(!sidebarCollapsed || isMobile) && (
                            <span className={`text-xl font-bold ${darkMode ? 'text-[#002f37]' : 'text-[#f4ffee]'}`}>
                                AgriLync
                            </span>
                        )}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={`p-2 rounded-lg ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'} transition-colors`}
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="h-5 w-5" aria-label="Expand sidebar" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" aria-label="Collapse sidebar" />
                            )}
                        </button>
                    )}
                </div>
            </div>


            <SidebarProfileCard
                sidebarCollapsed={sidebarCollapsed}
                isMobile={isMobile}
                darkMode={darkMode}
                userType="grower"
            />

            <nav className="flex-1 p-4 space-y-2">
                {globalSidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.key}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm ${activeSidebarItem === item.key
                                ? 'bg-[#7ede56] text-[#002f37]'
                                : darkMode
                                    ? 'text-[#002f37] hover:bg-gray-100'
                                    : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
                                }`}
                            onClick={() => handleSidebarNavigation(item.key)}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {(!sidebarCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
                        </div>
                    );
                })}
            </nav>

            <div className={`mt-auto p-4 border-t space-y-2 ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? <Sun className="h-4 w-4 flex-shrink-0 text-yellow-500" /> : <Moon className="h-4 w-4 flex-shrink-0 text-gray-400" />}
                    {(!sidebarCollapsed || isMobile) && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </div>
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
                    onClick={() => navigate('/')}
                >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    {(!sidebarCollapsed || isMobile) && <span className="font-medium">Log Out</span>}
                </div>
            </div>
        </>
    );

    return (
        <div className={`h-screen overflow-hidden ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
            <div className="flex h-full">
                {isMobile && (
                    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                        <SheetContent
                            side="left"
                            className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'} overflow-y-auto`}
                        >
                            <div className="flex h-full flex-col">
                                <SidebarContent />
                            </div>
                        </SheetContent>
                    </Sheet>
                )}

                {!isMobile && (
                    <div
                        className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'
                            } flex-shrink-0 border-r transition-all duration-300 ${darkMode ? 'border-gray-200/60' : 'border-[#00404a]'
                            } fixed left-0 top-0 h-screen z-30`}
                    >
                        <div className="flex h-full flex-col">
                            <SidebarContent />
                        </div>
                    </div>
                )}

                <div className={`flex-1 flex flex-col ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'} ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''} min-h-screen`}>
                    <div
                        className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-3 py-3 sm:px-6 sm:py-4 sticky top-0 z-20`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileSidebarOpen(true)}
                                        className={darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
                                        aria-label="Open sidebar"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                )}
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                        Grower Profile
                                    </p>
                                    <h1 className={`text-lg font-bold sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Preparing your profile
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-2 rounded-full px-3 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    onClick={toggleDarkMode}
                                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                >
                                    {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-gray-600" />}
                                    <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-6 px-3 py-6 sm:px-6">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Input the required details to customize your profile. Ensure all fields are complete for accuracy.
                            </p>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Side - Form Content (2/3 width) */}
                                <div className={`lg:col-span-2 rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} shadow-lg`}>
                                    <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {profileSteps.find(s => s.id === activeStep)?.label}
                                    </h3>

                                    {/* Personal Information Form */}
                                    {activeStep === 'personal' && (
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="clientName" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Client Name <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="clientName"
                                                    placeholder="John Doe"
                                                    className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@gmail.com"
                                                    className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="country" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Country <span className="text-red-500">*</span>
                                                </Label>
                                                <Select>
                                                    <SelectTrigger className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                                                        <SelectValue placeholder="Select Country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ghana">Ghana</SelectItem>
                                                        <SelectItem value="nigeria">Nigeria</SelectItem>
                                                        <SelectItem value="kenya">Kenya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="region" className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Region/Province/State
                                                </Label>
                                                <Select>
                                                    <SelectTrigger className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                                                        <SelectValue placeholder="Select State" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ashanti">Ashanti</SelectItem>
                                                        <SelectItem value="eastern">Eastern</SelectItem>
                                                        <SelectItem value="western">Western</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Details Form */}
                                    {activeStep === 'job' && (
                                        <div className="space-y-4">
                                            <div>
                                                <Label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Job Title
                                                </Label>
                                                <Input
                                                    placeholder="Enter job title"
                                                    className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                                                />
                                            </div>
                                            <div>
                                                <Label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Department
                                                </Label>
                                                <Input
                                                    placeholder="Enter department"
                                                    className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Compensation Budget Form */}
                                    {activeStep === 'compensation' && (
                                        <div className="space-y-4">
                                            <div>
                                                <Label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    Budget Amount
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    className={`${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Review Contract */}
                                    {activeStep === 'review' && (
                                        <div className="space-y-4">
                                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Please review all the information before submitting.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <Button className="bg-[#1db954] hover:bg-[#17a447] text-white w-full sm:w-auto">
                                            Continue
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Side - Step Indicators (1/3 width) */}
                                <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} shadow-lg`}>
                                    <div className="space-y-3">
                                        {profileSteps.map((step, index) => {
                                            const isActive = activeStep === step.id;
                                            const isCompleted = completedSteps.includes(step.id);
                                            const stepNumber = index + 1;

                                            return (
                                                <button
                                                    key={step.id}
                                                    onClick={() => setActiveStep(step.id)}
                                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${isActive
                                                        ? darkMode
                                                            ? 'bg-[#1db954]/20 border-2 border-[#1db954]'
                                                            : 'bg-[#1db954]/10 border-2 border-[#1db954]'
                                                        : darkMode
                                                            ? 'bg-[#0d3036] border-2 border-transparent hover:border-gray-700'
                                                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-semibold ${isActive
                                                            ? 'text-[#1db954]'
                                                            : darkMode
                                                                ? 'text-gray-300'
                                                                : 'text-gray-700'
                                                            }`}>
                                                            {step.label}
                                                        </span>
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive
                                                                ? 'bg-[#1db954] text-white'
                                                                : isCompleted
                                                                    ? 'bg-[#1db954] text-white'
                                                                    : darkMode
                                                                        ? 'bg-gray-700 text-gray-400'
                                                                        : 'bg-gray-200 text-gray-500'
                                                                }`}
                                                        >
                                                            {stepNumber}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowerProfile;
