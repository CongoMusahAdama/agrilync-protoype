import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Lock,
  Bell,
  CheckCircle,
  Upload,
  MapPin,
  Leaf,
  Settings as SettingsIcon,
  UserCheck,
  Moon,
  Sun,
  Edit,
  CreditCard,
  FileText,
  Info,
  Activity,
  BarChart3,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import FarmMap from '@/components/FarmMap';

// Region to Districts/Communities mapping
const regionDistricts: Record<string, string[]> = {
  western: [
    'Sekondi-Takoradi Metropolitan',
    'Ahanta West',
    'Shama',
    'Effia-Kwesimintsim',
    'Wassa East',
    'Wassa Amenfi East',
    'Wassa Amenfi West',
    'Wassa Amenfi Central',
    'Nzema East',
    'Jomoro',
    'Ellembelle',
    'Mpohor',
    'Prestea-Huni Valley',
    'Tarkwa-Nsuaem'
  ],
  ashanti: [
    'Kumasi Metropolitan',
    'Asokwa',
    'Oforikrom',
    'Kwadaso',
    'Suame',
    'Old Tafo',
    'Bantama',
    'Mampong Municipal',
    'Ejisu',
    'Afigya Kwabre North',
    'Afigya Kwabre South',
    'Atwima Kwanwoma',
    'Atwima Mponua',
    'Atwima Nwabiagya North',
    'Atwima Nwabiagya South',
    'Ahafo Ano North',
    'Ahafo Ano South East',
    'Ahafo Ano South West',
    'Bekwai Municipal',
    'Obuasi Municipal',
    'Sekyere East',
    'Sekyere Afram Plains',
    'Sekyere South',
    'Sekyere Central',
    'Sekyere Kumawu',
    'Adansi North',
    'Adansi South'
  ],
  volta: [
    'Ho Municipal',
    'Hohoe Municipal',
    'Keta Municipal',
    'Ketu South',
    'Ketu North',
    'Akatsi South',
    'Akatsi North',
    'Adaklu',
    'Agotime-Ziope',
    'South Dayi',
    'North Dayi',
    'South Tongu',
    'Central Tongu',
    'North Tongu',
    'Afadzato South',
    'Anloga District'
  ],
  eastern: [
    'New Juaben North',
    'New Juaben South',
    'Koforidua',
    'Akuapem North',
    'Akuapem South',
    'Abuakwa North',
    'Abuakwa South',
    'Fanteakwa North',
    'Fanteakwa South',
    'Yilo Krobo',
    'Lower Manya Krobo',
    'Upper Manya Krobo',
    'Suhum',
    'Nsawam-Adoagyiri',
    'Kwahu East',
    'Kwahu West',
    'Kwahu South',
    'Kwahu Afram Plains North',
    'Kwahu Afram Plains South',
    'Akwapim North',
    'Akwapim South',
    'Asuogyaman',
    'Birim Central',
    'Birim North',
    'Birim South',
    'Achiase'
  ],
  northern: [
    'Tamale Metropolitan',
    'Sagnarigu',
    'Savelugu',
    'Nanton',
    'Kumbungu',
    'Tolon',
    'Karaga',
    'Saboba',
    'Zabzugu',
    'Tatale-Sanguli',
    'Mion',
    'Gushegu Municipal',
    'Yendi Municipal',
    'Nanumba North',
    'Nanumba South',
    'Kpandai'
  ],
  central: [
    'Cape Coast Metropolitan',
    'Komenda-Edina-Eguafo-Abirem (KEEA)',
    'Mfantseman Municipal',
    'Abura-Asebu-Kwamankese',
    'Ajumako-Enyan-Essiam',
    'Agona East',
    'Agona West',
    'Gomoa East',
    'Gomoa West',
    'Gomoa Central',
    'Effutu Municipal',
    'Awutu Senya East',
    'Awutu Senya',
    'Assin North',
    'Assin South',
    'Assin Central',
    'Twifo Atti-Morkwa',
    'Twifo-Hemang-Lower-Denkyira',
    'Upper Denkyira East',
    'Upper Denkyira West'
  ],
  bono: [
    'Sunyani Municipal',
    'Sunyani West',
    'Berekum Municipal',
    'Dormaa Central',
    'Dormaa East',
    'Dormaa West',
    'Jaman North',
    'Jaman South',
    'Tain',
    'Wenchi Municipal',
    'Banda',
    'Tano North',
    'Tano South'
  ]
};

// Farm Type to Category mapping
const farmTypeCategories: Record<string, string[]> = {
  crop: [
    'Maize',
    'Rice',
    'Cocoa',
    'Cassava',
    'Yam',
    'Plantain',
    'Tomato',
    'Pepper',
    'Onion',
    'Groundnut',
    'Soybean',
    'Cowpea',
    'Sorghum',
    'Millet',
    'Cotton',
    'Palm Oil',
    'Cashew',
    'Mango',
    'Pineapple',
    'Banana',
    'Other Crops'
  ],
  livestock: [
    'Cattle',
    'Goats',
    'Sheep',
    'Pigs',
    'Poultry (Chickens)',
    'Ducks',
    'Turkeys',
    'Guinea Fowls',
    'Rabbits',
    'Fish (Aquaculture)',
    'Snails',
    'Bees (Apiculture)',
    'Other Livestock'
  ],
  mixed: [
    'Maize',
    'Rice',
    'Cocoa',
    'Cassava',
    'Yam',
    'Plantain',
    'Tomato',
    'Pepper',
    'Onion',
    'Groundnut',
    'Soybean',
    'Cowpea',
    'Sorghum',
    'Millet',
    'Cotton',
    'Palm Oil',
    'Cashew',
    'Mango',
    'Pineapple',
    'Banana',
    'Cattle',
    'Goats',
    'Sheep',
    'Pigs',
    'Poultry (Chickens)',
    'Ducks',
    'Turkeys',
    'Guinea Fowls',
    'Rabbits',
    'Fish (Aquaculture)',
    'Snails',
    'Bees (Apiculture)',
    'Other'
  ],
  other: []
};

// Region to Languages mapping
const regionLanguages: Record<string, string[]> = {
  western: [
    'English',
    'Fante',
    'Nzema',
    'Twi'
  ],
  ashanti: [
    'English',
    'Twi (Asante)',
    'Fante'
  ],
  eastern: [
    'English',
    'Twi (Akuapem)',
    'Ga',
    'Ewe'
  ],
  volta: [
    'English',
    'Ewe',
    'Twi'
  ],
  northern: [
    'English',
    'Dagbani',
    'Twi'
  ],
  central: [
    'English',
    'Fante',
    'Twi'
  ],
  bono: [
    'English',
    'Twi (Bono)',
    'Fante'
  ],
  other: [
    'English',
    'Twi',
    'Fante',
    'Ewe',
    'Ga',
    'Dagbani',
    'Other'
  ]
};

const regionCoordinates: Record<string, [number, number]> = {
  ashanti: [6.7470, -1.5209],
  eastern: [6.4468, -0.3424],
  northern: [9.5439, -0.9057],
  western: [5.3216, -2.1887],
  volta: [6.5781, 0.4502],
  central: [5.5571, -1.3489],
  bono: [7.5766, -2.3392],
  other: [7.9465, -1.0232]
};

const Settings = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [language, setLanguage] = useState('english');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedFarmType, setSelectedFarmType] = useState<string>('');
  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [farmSize, setFarmSize] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeProfileSection, setActiveProfileSection] = useState<string>('personal');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('settings');

  const handleSidebarNavigation = (item: string) => {
    setActiveSidebarItem(item);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    const routes: Record<string, string> = {
      dashboard: `/dashboard/${userType}`,
      settings: `/dashboard/${userType}/settings`,
      'farm-management': `/dashboard/${userType}/farm-management`,
      'farm-analytics': `/dashboard/${userType}/farm-analytics`,
      'investor-matches': `/dashboard/${userType}/investor-matches`,
      'training-sessions': `/dashboard/${userType}/training-sessions`,
      notifications: `/dashboard/${userType}/notifications`
    };
    if (routes[item]) {
      navigate(routes[item]);
    }
  };

  const globalSidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Activity },
    { key: 'settings', label: 'Profile & Settings', icon: SettingsIcon },
    { key: 'farm-management', label: 'Farm Management', icon: MapPin },
    { key: 'farm-analytics', label: 'Farm Analytics', icon: BarChart3 },
    { key: 'investor-matches', label: 'Investor Matches', icon: Users },
    { key: 'training-sessions', label: 'Training Sessions', icon: Calendar },
    { key: 'notifications', label: 'Notifications', icon: Bell }
  ];

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
        userType={userType}
      />

      <nav className="flex-1 p-4 space-y-2">
        {globalSidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeSidebarItem === item.key
                ? 'bg-[#7ede56] text-[#002f37]'
                : darkMode
                  ? 'text-[#002f37] hover:bg-gray-100'
                  : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
                }`}
              onClick={() => handleSidebarNavigation(item.key)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {(!sidebarCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
            </div>
          );
        })}
      </nav>

      <div className={`mt-auto p-4 border-t ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
          onClick={() => navigate('/')}
        >
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Log Out</span>}
        </div>
      </div>
    </>
  );

  const renderProfileSettings = () => {
    if (userType === 'farmer' || userType === 'grower') {
      const profileSections = [
        { id: 'personal', label: 'Personal Details', icon: UserCheck, color: '#7ede56' }, // Green
        { id: 'identification', label: 'Valid Identification', icon: CreditCard, color: '#ffa500' }, // Orange
        { id: 'location', label: 'Farm Location', icon: MapPin, color: '#ff6347' }, // Red/Coral
        { id: 'farm', label: 'Farm Details', icon: Leaf, color: '#921573' }, // Deep Magenta
        { id: 'investment', label: 'Investment & Support', icon: Wallet, color: '#ffa500' }, // Orange
        { id: 'additional', label: 'Additional Information', icon: Info, color: '#7ede56' }, // Green
      ];

      const getSectionIndex = (sectionId: string) => {
        return profileSections.findIndex(s => s.id === sectionId);
      };

      const isSectionCompleted = (sectionId: string) => {
        return completedSections.includes(sectionId);
      };

      const isSectionActive = (sectionId: string) => {
        return activeProfileSection === sectionId;
      };

      const getProgressPercentage = () => {
        const currentIndex = getSectionIndex(activeProfileSection);
        return ((currentIndex + 1) / profileSections.length) * 100;
      };

      return (
        <div className="space-y-6">
          {/* Section Title */}
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Information</h2>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={`h-9 ${darkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Edit className={`h-4 w-4 mr-2 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                <span className={darkMode ? 'text-white' : 'text-gray-700'}>{isEditing ? 'Cancel' : 'Edit'}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  // Handle save logic here
                  setIsEditing(false);
                }}
                disabled={!isEditing}
                className={`h-9 px-4 font-semibold ${isEditing
                  ? 'bg-[#7ede56] hover:bg-[#6bc947] text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                UPDATE PROFILE
              </Button>
            </div>
          </div>

          {/* Main Content Grid - Form on Left, Steps on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Form Content (2/3 width) */}
            <div className={`lg:col-span-2 rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} shadow-lg`}>
              {/* Active Section Title */}
              <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {profileSections.find(s => s.id === activeProfileSection)?.label}
              </h3>

              {/* Active Section Fields */}
              <div>
                {/* Personal Details Section */}
                {activeProfileSection === 'personal' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <UserCheck className="h-5 w-5" style={{ color: '#7ede56' }} />
                      Personal Details
                    </h3>

                    {/* Profile Picture */}
                    <div className="mb-6">
                      <Label className={`text-sm font-semibold mb-3 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Profile Picture <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                            <User className={`h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="profile-picture"
                          />
                          <label
                            htmlFor="profile-picture"
                            className={`inline-block px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${darkMode
                              ? 'bg-gray-800 text-white hover:bg-gray-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            Choose File
                          </label>
                          <span className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No file chosen
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Gender <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="male" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Male</SelectItem>
                            <SelectItem value="female" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Female</SelectItem>
                            <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dob" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Valid Identification Document Section */}
                {activeProfileSection === 'identification' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <CreditCard className="h-5 w-5" style={{ color: '#ffa500' }} />
                      Valid Identification Document
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Please upload a valid identity card. This can be your Ghana Card or any other valid identification document.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="idType" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ID Type <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="ghana-card" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Ghana Card</SelectItem>
                            <SelectItem value="passport" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Passport</SelectItem>
                            <SelectItem value="drivers-license" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Driver's License</SelectItem>
                            <SelectItem value="voters-id" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Voter's ID</SelectItem>
                            <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="idNumber" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ID Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="idNumber"
                          placeholder="Enter your ID number"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>

                      <div>
                        <Label className={`text-sm font-semibold mb-3 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload ID Document <span className="text-red-500">*</span>
                        </Label>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
                          <Upload className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Upload a clear photo or scan of your ID document
                          </p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="id-document"
                          />
                          <label
                            htmlFor="id-document"
                            className={`inline-block px-6 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${darkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            Choose File
                          </label>
                          <span className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No file chosen
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Farm Location Section */}
                {activeProfileSection === 'location' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <MapPin className="h-5 w-5" style={{ color: '#ff6347' }} />
                      Farm Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="region" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Region <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedRegion}
                          onValueChange={(value) => {
                            setSelectedRegion(value);
                            setSelectedDistrict('');
                            const coords = regionCoordinates[value];
                            if (coords) {
                              setLatitude(coords[0]);
                              setLongitude(coords[1]);
                            }
                          }}
                        >
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'} z-[1001]`}>
                            <SelectItem value="ashanti" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Ashanti</SelectItem>
                            <SelectItem value="eastern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Eastern</SelectItem>
                            <SelectItem value="northern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Northern</SelectItem>
                            <SelectItem value="western" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Western</SelectItem>
                            <SelectItem value="volta" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Volta</SelectItem>
                            <SelectItem value="central" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Central</SelectItem>
                            <SelectItem value="bono" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Bono</SelectItem>
                            <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="district" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          District/Community <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={setSelectedDistrict}
                          disabled={!selectedRegion || selectedRegion === 'other'}
                        >
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={
                              !selectedRegion || selectedRegion === 'other'
                                ? "Select region first"
                                : "Select district/community"
                            } />
                          </SelectTrigger>
                          <SelectContent className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'} z-[1001]`}>
                            {selectedRegion && selectedRegion !== 'other' && regionDistricts[selectedRegion]?.map((district) => (
                              <SelectItem key={district} value={district.toLowerCase().replace(/\s+/g, '-')} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label className={`text-sm font-semibold mb-3 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Pin Farm Location & Measure Area
                      </Label>
                      <FarmMap
                        latitude={latitude}
                        longitude={longitude}
                        onLocationChange={(lat, lng) => {
                          setLatitude(lat);
                          setLongitude(lng);
                        }}
                        onAreaChange={(area) => setFarmSize(area)}
                        farmSize={farmSize}
                      />
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click on the map to pin your exact farm location. Use the ruler tool to measure your farm boundaries and automatically calculate size.
                      </p>
                    </div>
                  </div>
                )}

                {/* Farm Details Section */}
                {activeProfileSection === 'farm' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Leaf className="h-5 w-5" style={{ color: '#921573' }} />
                      Farm Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="farmType" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Farm Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedFarmType}
                          onValueChange={(value) => {
                            setSelectedFarmType(value);
                            setSelectedCropCategory('');
                          }}
                        >
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select farm type" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="crop" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Crop</SelectItem>
                            <SelectItem value="livestock" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Livestock</SelectItem>
                            <SelectItem value="mixed" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Mixed</SelectItem>
                            <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cropCategory" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Crop/Animal Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedCropCategory}
                          onValueChange={setSelectedCropCategory}
                          disabled={!selectedFarmType || selectedFarmType === 'other'}
                        >
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={
                              !selectedFarmType || selectedFarmType === 'other'
                                ? "Select farm type first"
                                : selectedFarmType === 'crop'
                                  ? "Select crop"
                                  : selectedFarmType === 'livestock'
                                    ? "Select livestock"
                                    : "Select crop or livestock"
                            } />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            {selectedFarmType && selectedFarmType !== 'other' && farmTypeCategories[selectedFarmType]?.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="farmSize" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Farm Size (acres/hectares) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="farmSize"
                          type="number"
                          placeholder="Enter farm size"
                          value={farmSize > 0 ? farmSize : ''}
                          onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmingExperience" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Years of Farming Experience <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="farmingExperience"
                          type="number"
                          placeholder="Years of experience"
                          className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                    </div>

                    {/* Conditional Fields based on Farm Type */}
                    {selectedFarmType === 'crop' && (
                      <div className="mt-4">
                        <Label htmlFor="irrigation" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Irrigation Access
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select access" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="yes" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Yes</SelectItem>
                            <SelectItem value="no" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedFarmType === 'livestock' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="animalCount" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Number of Animals <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="animalCount"
                            type="number"
                            placeholder="e.g. 100"
                            className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="housing" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Housing Type
                          </Label>
                          <Input
                            id="housing"
                            placeholder="e.g. Coop, Pen, Free-range"
                            className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="productionStage" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Production Stage <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="planning" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planning</SelectItem>
                            <SelectItem value="planting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planting/Breeding</SelectItem>
                            <SelectItem value="growing" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Growing</SelectItem>
                            <SelectItem value="harvesting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Harvesting</SelectItem>
                            <SelectItem value="processing" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Processing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="method" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Farming Method
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="organic" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Organic</SelectItem>
                            <SelectItem value="conventional" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Conventional</SelectItem>
                            <SelectItem value="mixed" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="landOwnership" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Land Ownership
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select ownership" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            <SelectItem value="owned" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Owned</SelectItem>
                            <SelectItem value="leased" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Leased</SelectItem>
                            <SelectItem value="family" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Family Land</SelectItem>
                            <SelectItem value="sharecropping" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Sharecropping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Photo Uploads */}
                    <div className="mt-6">
                      <Label className={`text-sm font-semibold mb-3 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Farm & Product Photos (Optional)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-300 hover:bg-gray-50'}`}>
                          <Camera className={`h-8 w-8 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Farm Photo</span>
                          <span className="text-xs text-gray-500">Overview of the land/site</span>
                          <input type="file" className="hidden" accept="image/*" />
                        </div>
                        <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-300 hover:bg-gray-50'}`}>
                          <ImageIcon className={`h-8 w-8 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Product Photos</span>
                          <span className="text-xs text-gray-500">Crops, animals, or produce</span>
                          <input type="file" className="hidden" accept="image/*" multiple />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment & Support Section */}
                {activeProfileSection === 'investment' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Wallet className="h-5 w-5" style={{ color: '#ffa500' }} />
                      Investment & Support
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Type of Investment Needed</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-input" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-input" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Input Support</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-equip" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-equip" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Equipment Support</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-labour" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-labour" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Labour Support</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-land" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-land" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Land Preparation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-cash" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-cash" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cash Support</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="inv-process" className={darkMode ? 'border-gray-500' : ''} />
                            <Label htmlFor="inv-process" className={`font-normal ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Processing</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preferred Partnership Model</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className={`flex items-center space-x-2 border p-3 rounded-md transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <Checkbox id="part-profit" className={darkMode ? 'border-gray-500' : ''} />
                            <div className="flex flex-col">
                              <Label htmlFor="part-profit" className={`font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profit Sharing</Label>
                              <span className="text-xs text-gray-500">Share profits after harvest</span>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-2 border p-3 rounded-md transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <Checkbox id="part-buyback" className={darkMode ? 'border-gray-500' : ''} />
                            <div className="flex flex-col">
                              <Label htmlFor="part-buyback" className={`font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Buy-back Agreement</Label>
                              <span className="text-xs text-gray-500">Investor buys produce</span>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-2 border p-3 rounded-md transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <Checkbox id="part-finance" className={darkMode ? 'border-gray-500' : ''} />
                            <div className="flex flex-col">
                              <Label htmlFor="part-finance" className={`font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Input Financing</Label>
                              <span className="text-xs text-gray-500">Loan for inputs</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pastPerformance" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Past Farm Performance (Optional)
                        </Label>
                        <Textarea
                          id="pastPerformance"
                          placeholder="Describe previous yields, revenue, or successful seasons..."
                          className={`min-h-[100px] ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}



                {/* Additional Information Section */}
                {activeProfileSection === 'additional' && (
                  <div className="space-y-6">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Info className="h-5 w-5" style={{ color: '#7ede56' }} />
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredLanguage" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Preferred Language <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedLanguage}
                          onValueChange={setSelectedLanguage}
                          disabled={!selectedRegion}
                        >
                          <SelectTrigger className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={!selectedRegion ? "Select region first" : "Select language"} />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}>
                            {selectedRegion && regionLanguages[selectedRegion]?.map((lang) => (
                              <SelectItem key={lang} value={lang.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentIndex = getSectionIndex(activeProfileSection);
                    if (currentIndex > 0) {
                      setActiveProfileSection(profileSections[currentIndex - 1].id);
                    }
                  }}
                  disabled={getSectionIndex(activeProfileSection) === 0}
                  className={`${darkMode ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300'}`}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = getSectionIndex(activeProfileSection);
                    if (currentIndex < profileSections.length - 1) {
                      if (!completedSections.includes(activeProfileSection)) {
                        setCompletedSections([...completedSections, activeProfileSection]);
                      }
                      setActiveProfileSection(profileSections[currentIndex + 1].id);
                    }
                  }}
                  disabled={getSectionIndex(activeProfileSection) === profileSections.length - 1}
                  className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Side - Step Indicators (1/3 width) */}
            <div className="lg:col-span-1">
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'} shadow-lg sticky top-6`}>
                <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Progress
                </h3>
                <div className="space-y-4">
                  {profileSections.map((section, index) => {
                    const isActive = isSectionActive(section.id);
                    const isCompleted = isSectionCompleted(section.id);
                    const Icon = section.icon;

                    return (
                      <div
                        key={section.id}
                        onClick={() => setActiveProfileSection(section.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isActive
                          ? 'bg-[#7ede56] bg-opacity-10 border-2 border-[#7ede56]'
                          : 'border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                            ? 'bg-[#7ede56]'
                            : isActive
                              ? 'bg-[#7ede56]'
                              : darkMode
                                ? 'bg-gray-700'
                                : 'bg-gray-200'
                            }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <span className={`text-sm font-bold ${isActive || isCompleted ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isActive ? 'text-[#7ede56]' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {section.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default profile settings for other user types
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Profile settings for {userType}</p>
      </div>
    );
  };

  const renderPassword = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
        <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 h-9 text-sm font-semibold">
          Update Password
        </Button>
      </div>
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentPassword" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
        <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 h-9 text-sm font-semibold">
          Save Settings
        </Button>
      </div>
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emailNotifications" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Address</Label>
            <Input
              id="emailNotifications"
              type="email"
              placeholder="you@example.com"
              className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
            />
          </div>
          <div>
            <Label htmlFor="phoneNotifications" className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone Number</Label>
            <Input
              id="phoneNotifications"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              className={`h-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500 focus:border-[#7ede56]' : 'bg-white border-gray-300 focus:border-[#7ede56]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Verification</h2>

      <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <CheckCircle className={`h-6 w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#7ede56]'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verification Status</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your account verification is currently pending review.
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Why get verified?</h4>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• Better access to investor matches and funding opportunities</li>
            <li>• Enhanced credibility and trust with potential partners</li>
            <li>• Priority support and resources from AgriLync</li>
            <li>• Access to exclusive training programs and workshops</li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Verification Requirements</h4>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#7ede56]'}`} />
              <span>Complete profile information</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#7ede56]'}`} />
              <span>Valid identification document</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#7ede56]'}`} />
              <span>Farm location and details</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setActiveSection('profile')}
            className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 font-semibold"
          >
            Complete Profile →
          </Button>
          <Button
            variant="outline"
            className={`px-6 py-2 ${darkMode ? 'border-gray-700 text-white hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'verification', label: 'Verification', icon: CheckCircle },
  ];

  return (
    <div className={`h-screen overflow-hidden transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {isMobile && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
              side="left"
              className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'} overflow-y-auto`}
            >
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}

        {!isMobile && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'} flex-shrink-0 transition-all duration-300 border-r ${darkMode ? 'border-gray-200/60' : 'border-[#00404a]'}`}>
            <div className="flex flex-col h-full sticky top-0 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
          <div className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-3 sm:px-6 py-3 sm:py-4 transition-colors sticky top-0 z-20`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/dashboard/${userType}`)}
                  className={`flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : ''}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <img
                  src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                  alt="AgriLync Logo"
                  className="h-8 w-8"
                />
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AgriLync</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 rounded-full p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="hidden sm:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 rounded-full p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => navigate('/')}
                  title="Log Out"
                >
                  <ArrowRight className="h-5 w-5" />
                  <span className="hidden sm:inline">Log Out</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
              <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your profile, security, and preferences</p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Horizontal Navigation */}
              <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                <nav className="flex gap-2 min-w-max">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${isActive
                          ? 'bg-[#7ede56] text-[#002f37] shadow-sm'
                          : darkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 text-[#002f37]'
                          } border ${isActive ? 'border-[#7ede56]' : darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-[#002f37]' : ''}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <Card className={`border-none shadow-none ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
                  <CardContent className="p-0">
                    {activeSection === 'profile' && renderProfileSettings()}
                    {activeSection === 'password' && renderPassword()}
                    {activeSection === 'notifications' && renderNotifications()}
                    {activeSection === 'verification' && renderVerification()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
