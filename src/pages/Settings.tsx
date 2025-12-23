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
import DashboardLayout from '@/components/DashboardLayout';
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
  const sidebarDarkMode = !darkMode;
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('settings');



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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Information</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Complete your details to get verified</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 sm:flex-none h-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={!isEditing}
                className={`flex-1 sm:flex-none h-10 px-6 font-bold ${isEditing
                  ? 'bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] shadow-lg shadow-[#7ede56]/20'
                  : 'bg-gray-700/50 text-gray-400'
                  }`}
              >
                SAVE CHANGES
              </Button>
            </div>
          </div>

          {/* Mobile Stepper - Only visible on small screens */}
          {isMobile && (
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-[#003c47]/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-[#7ede56]' : 'text-[#002f37]'}`}>
                  Step {getSectionIndex(activeProfileSection) + 1} of {profileSections.length}
                </span>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {Math.round(getProgressPercentage())}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7ede56] transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-[#7ede56]/10' : 'bg-[#7ede56]/20'}`}>
                  {React.createElement(profileSections.find(s => s.id === activeProfileSection)?.icon || UserCheck, {
                    className: "h-4 w-4 text-[#7ede56]"
                  })}
                </div>
                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileSections.find(s => s.id === activeProfileSection)?.label}
                </span>
              </div>
            </div>
          )}

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
                    <div className="mb-8">
                      <Label className={`text-sm font-bold mb-4 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Profile Picture <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                          <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 group-hover:border-[#7ede56]' : 'bg-gray-50 border-gray-200 group-hover:border-[#7ede56]'}`}>
                            <User className={`h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                          </div>
                          <label
                            htmlFor="profile-picture"
                            className="absolute -right-2 -bottom-2 h-10 w-10 bg-[#7ede56] rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all text-[#002f37]"
                          >
                            <Camera className="h-5 w-5" />
                          </label>
                        </div>
                        <div className="flex flex-col gap-2 text-center sm:text-left">
                          <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload a new photo</h4>
                          <p className={`text-xs max-w-[200px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            JPG, PNG or GIF. Max size of 2MB. A square image works best.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="profile-picture"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Your complete name"
                          className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56] focus:ring-[#7ede56]/20' : 'bg-white border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/20'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56] focus:ring-[#7ede56]/20' : 'bg-white border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/20'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="farmer@example.com"
                          className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56] focus:ring-[#7ede56]/20' : 'bg-white border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/20'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Gender <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="male" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Male</SelectItem>
                            <SelectItem value="female" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Female</SelectItem>
                            <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56] focus:ring-[#7ede56]/20' : 'bg-white border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/20'}`}
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

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="idType" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ID Type <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-12 rounded-xl border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="ghana-card">Ghana Card</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="drivers-license">Driver's License</SelectItem>
                            <SelectItem value="voters-id">Voter's ID</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idNumber" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ID Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="idNumber"
                          placeholder="e.g. GHA-123456789-0"
                          className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56] focus:ring-[#7ede56]/20' : 'bg-white border-gray-200 focus:border-[#7ede56] focus:ring-[#7ede56]/20'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Upload ID Document <span className="text-red-500">*</span>
                        </Label>
                        <div className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 group hover:border-[#7ede56] ${darkMode ? 'border-gray-700 bg-[#003c47]/30 hover:bg-[#003c47]/50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                          <div className={`h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-800 group-hover:bg-[#7ede56]/10' : 'bg-white group-hover:bg-[#7ede56]/10'}`}>
                            <Upload className={`h-7 w-7 transition-colors ${darkMode ? 'text-gray-500 group-hover:text-[#7ede56]' : 'text-gray-400 group-hover:text-[#7ede56]'}`} />
                          </div>
                          <h4 className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Drag & Drop or click to upload</h4>
                          <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            PDF, PNG or JPG (max. 10MB)
                          </p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            id="id-document"
                          />
                          <label
                            htmlFor="id-document"
                            className={`inline-block px-8 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-95 ${darkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-white border border-gray-200 text-[#002f37] hover:bg-gray-50 shadow-sm'
                              }`}
                          >
                            Browse Files
                          </label>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="region" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent className={`${darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'} z-[1001]`}>
                            <SelectItem value="ashanti">Ashanti</SelectItem>
                            <SelectItem value="eastern">Eastern</SelectItem>
                            <SelectItem value="northern">Northern</SelectItem>
                            <SelectItem value="western">Western</SelectItem>
                            <SelectItem value="volta">Volta</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="bono">Bono</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          District/Community <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={setSelectedDistrict}
                          disabled={!selectedRegion || selectedRegion === 'other'}
                        >
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={
                              !selectedRegion || selectedRegion === 'other'
                                ? "Select region first"
                                : "Select district"
                            } />
                          </SelectTrigger>
                          <SelectContent className={`${darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'} z-[1001]`}>
                            {selectedRegion && selectedRegion !== 'other' && regionDistricts[selectedRegion]?.map((district) => (
                              <SelectItem key={district} value={district.toLowerCase().replace(/\s+/g, '-')} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pin Farm Location & Measure Area
                      </Label>
                      <div className={`h-[400px] w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${darkMode ? 'border-gray-700 hover:border-[#7ede56]' : 'border-gray-200 hover:border-[#7ede56]'}`}>
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
                      </div>
                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click on the map to pin your exact farm location. Use the <strong className="text-[#7ede56]">ruler tool</strong> to measure boundaries and automatically calculate farm size.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="farmType" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Farm Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedFarmType}
                          onValueChange={(value) => {
                            setSelectedFarmType(value);
                            setSelectedCropCategory('');
                          }}
                        >
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select farm type" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="crop">Crop</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cropCategory" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Crop/Animal Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedCropCategory}
                          onValueChange={setSelectedCropCategory}
                          disabled={!selectedFarmType || selectedFarmType === 'other'}
                        >
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={
                              !selectedFarmType || selectedFarmType === 'other'
                                ? "Select farm type first"
                                : "Select category"
                            } />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            {selectedFarmType && selectedFarmType !== 'other' && farmTypeCategories[selectedFarmType]?.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmSize" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Farm Size (acres) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="farmSize"
                          type="number"
                          placeholder="0.00"
                          value={farmSize > 0 ? farmSize : ''}
                          onChange={(e) => setFarmSize(parseFloat(e.target.value) || 0)}
                          className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmingExperience" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Years of Experience <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="farmingExperience"
                          type="number"
                          placeholder="e.g. 5"
                          className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="animalCount" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Number of Animals <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="animalCount"
                            type="number"
                            placeholder="e.g. 100"
                            className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="housing" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Housing Type
                          </Label>
                          <Input
                            id="housing"
                            placeholder="e.g. Coop, Pen, Free-range"
                            className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="productionStage" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Production Stage <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="planting">Planting/Breeding</SelectItem>
                            <SelectItem value="growing">Growing</SelectItem>
                            <SelectItem value="harvesting">Harvesting</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="method" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Farming Method
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="conventional">Conventional</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="landOwnership" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Land Ownership
                        </Label>
                        <Select>
                          <SelectTrigger className={`h-12 rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder="Select ownership" />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="leased">Leased</SelectItem>
                            <SelectItem value="family">Family Land</SelectItem>
                            <SelectItem value="sharecropping">Sharecropping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Photo Uploads */}
                    <div className="mt-8 space-y-4">
                      <Label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Farm & Product Media (Optional)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:border-[#7ede56] ${darkMode ? 'border-gray-700 bg-[#003c47]/30 hover:bg-[#003c47]/50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                          <Camera className={`h-10 w-10 mb-3 transition-colors ${darkMode ? 'text-gray-500 group-hover:text-[#7ede56]' : 'text-gray-400 group-hover:text-[#7ede56]'}`} />
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Upload Farm Photo</span>
                          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Overview of the land/site</span>
                          <input type="file" className="hidden" accept="image/*" />
                        </div>
                        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:border-[#7ede56] ${darkMode ? 'border-gray-700 bg-[#003c47]/30 hover:bg-[#003c47]/50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                          <ImageIcon className={`h-10 w-10 mb-3 transition-colors ${darkMode ? 'text-gray-500 group-hover:text-[#7ede56]' : 'text-gray-400 group-hover:text-[#7ede56]'}`} />
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Upload Product Media</span>
                          <span className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Crops, animals, or produce</span>
                          <input type="file" className="hidden" accept="image/*,video/*" multiple />
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

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Label className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Type of Investment Needed
                        </Label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {[
                            { id: 'inv-input', label: 'Input Support' },
                            { id: 'inv-equip', label: 'Equipment' },
                            { id: 'inv-labour', label: 'Labour' },
                            { id: 'inv-land', label: 'Land Prep' },
                            { id: 'inv-cash', label: 'Cash' },
                            { id: 'inv-process', label: 'Processing' }
                          ].map((item) => (
                            <div key={item.id} className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/30 border-gray-700 hover:bg-[#003c47]/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50'}`}>
                              <Checkbox id={item.id} className={darkMode ? 'border-gray-500 data-[state=checked]:bg-[#7ede56]' : 'data-[state=checked]:bg-[#7ede56]'} />
                              <Label htmlFor={item.id} className={`text-sm font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Preferred Partnership Model
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { id: 'part-profit', label: 'Profit Sharing', desc: 'Share final harvest' },
                            { id: 'part-buyback', label: 'Buy-back', desc: 'Guaranteed purchase' },
                            { id: 'part-finance', label: 'Financing', desc: 'Credit for inputs' }
                          ].map((model) => (
                            <div key={model.id} className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/30 border-gray-700 hover:bg-[#003c47]/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50'}`}>
                              <div className="flex items-center gap-3">
                                <Checkbox id={model.id} className={darkMode ? 'border-gray-500' : ''} />
                                <Label htmlFor={model.id} className={`font-bold cursor-pointer ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{model.label}</Label>
                              </div>
                              <span className={`text-[10px] sm:text-xs leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{model.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pastPerformance" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Past Farm Performance (Optional)
                        </Label>
                        <Textarea
                          id="pastPerformance"
                          placeholder="Describe previous yields, revenue, or successful seasons..."
                          className={`min-h-[120px] rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="preferredLanguage" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Preferred Language <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedLanguage}
                          onValueChange={setSelectedLanguage}
                          disabled={!selectedRegion}
                        >
                          <SelectTrigger className={`h-12 rounded-xl border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}>
                            <SelectValue placeholder={!selectedRegion ? "Select region first" : "Select language"} />
                          </SelectTrigger>
                          <SelectContent className={darkMode ? 'bg-[#003c47] border-gray-700' : 'bg-white'}>
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
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={getSectionIndex(activeProfileSection) === profileSections.length - 1}
                  className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] font-bold px-8"
                >
                  {getSectionIndex(activeProfileSection) === profileSections.length - 1 ? 'Finish' : 'Next Step'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Side - Step Indicators (1/3 width) - Hidden on mobile */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <div className={`rounded-xl p-6 ${darkMode ? 'bg-[#003c47]/50 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg sticky top-6`}>
                  <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Progress Indicator
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
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isActive
                            ? 'bg-[#7ede56]/10 border-2 border-[#7ede56]'
                            : 'border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
                              <CheckCircle className="h-5 w-5 text-[#002f37]" />
                            ) : (
                              <span className={`text-sm font-bold ${isActive || isCompleted ? 'text-[#002f37]' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            )}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your security credentials</p>
        </div>
        <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] font-bold px-8 h-12 rounded-xl shadow-lg shadow-[#7ede56]/20">
          Update Security
        </Button>
      </div>
      <div className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Current Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>How would you like to stay updated?</p>
        </div>
        <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] font-bold px-8 h-12 rounded-xl shadow-lg shadow-[#7ede56]/20">
          Save Preferences
        </Button>
      </div>
      <div className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="emailNotifications" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email Address</Label>
            <Input
              id="emailNotifications"
              type="email"
              placeholder="you@example.com"
              className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNotifications" className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone Number</Label>
            <Input
              id="phoneNotifications"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              className={`h-12 text-base rounded-xl transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#7ede56]' : 'bg-white border-gray-200 focus:border-[#7ede56]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Verification</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unlock full platform potential</p>
      </div>

      <div className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${darkMode ? 'bg-[#003c47]/50 border-gray-700' : 'bg-white border-gray-200 shadow-xl shadow-black/5'}`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
          <div className={`p-4 rounded-2xl flex-shrink-0 ${darkMode ? 'bg-[#7ede56]/10' : 'bg-[#7ede56]/20'}`}>
            <CheckCircle className={`h-10 w-10 ${darkMode ? 'text-[#7ede56]' : 'text-[#002f37]'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Verification Status: Pending</h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our team is currently reviewing your application. This usually takes 24-48 hours. We'll notify you once the process is complete.
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`}>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#002f37]'}`}>Why get verified?</h4>
            <ul className={`text-sm space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] mt-1.5 flex-shrink-0" />
                <span>Better access to investor matches and funding</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] mt-1.5 flex-shrink-0" />
                <span>Enhanced credibility with potential partners</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] mt-1.5 flex-shrink-0" />
                <span>Priority support and resources from AgriLync</span>
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#002f37]'}`}>Requirements</h4>
            <div className="space-y-3">
              {[
                'Complete profile information',
                'Valid identification document',
                'Farm location and details'
              ].map((text) => (
                <div key={text} className={`flex items-center gap-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className={`p-1 rounded-full ${darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10'}`}>
                    <CheckCircle className="h-3.5 w-3.5 text-[#7ede56]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setActiveSection('profile')}
            className="flex-1 bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] h-12 rounded-xl font-bold shadow-lg shadow-[#7ede56]/20"
          >
            Update Your Profile
          </Button>
          <Button
            variant="outline"
            className={`flex-1 h-12 rounded-xl font-bold ${darkMode ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Download Status Report
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
    <DashboardLayout activeSidebarItem="settings" title="Profile & Settings" description="Manage your profile, security, and preferences">


      <div className="flex flex-col gap-6">
        {/* Horizontal Navigation - Fixed for better mobile experience */}
        <div className="w-full relative">
          <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <nav className="flex gap-2 min-w-max">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                      ? 'bg-[#7ede56] text-[#002f37] shadow-lg shadow-[#7ede56]/20'
                      : darkMode
                        ? 'bg-[#003c47]/50 text-gray-400 hover:text-white border-gray-700'
                        : 'bg-white text-gray-600 hover:text-[#002f37] border-gray-200'
                      } border ${isActive ? 'border-[#7ede56]' : ''}`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          {/* Subtle gradient for horizontal scroll indication on mobile */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#002f37] to-transparent pointer-events-none sm:hidden opacity-50" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Card className={`border-none shadow-none bg-transparent`}>
            <CardContent className="p-0">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSection === 'profile' && renderProfileSettings()}
                {activeSection === 'password' && renderPassword()}
                {activeSection === 'notifications' && renderNotifications()}
                {activeSection === 'verification' && renderVerification()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
