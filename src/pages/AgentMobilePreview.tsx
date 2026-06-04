import React from 'react';
import {
  Bell,
  ChevronDown,
  GraduationCap,
  LayoutGrid,
  Leaf,
  MapPin,
  Menu,
  Plus,
  Search,
  Send,
  TrendingUp,
  UserRoundPlus,
  ClipboardList,
  CheckCircle2,
  Home,
  Image as ImageIcon,
  BarChart3,
  Settings,
  Briefcase,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const AGENT = { name: 'Musah Adams Congo', firstName: 'Musah', agentId: '053 187 8243', initials: 'MA' };

const growers = [
  { name: 'Amina Yakubu', community: 'Bawku West', status: 'Verified', crop: 'Maize' },
  { name: 'Kwame Mensah', community: 'Bolgatanga', status: 'Pending', crop: 'Rice' },
  { name: 'Fatima Ibrahim', community: 'Navrongo', status: 'Verified', crop: 'Sorghum' },
  { name: 'Emmanuel Ayariga', community: 'Bawku', status: 'Active', crop: 'Tomatoes' },
];

const missions = [
  { name: 'Amina Yakubu', sub: 'Bawku West • KYC Verification', time: '09:00', status: 'Scheduled' },
  { name: 'Kwame Mensah', sub: 'Bolgatanga • Field Visit', time: '11:30', status: 'Pending' },
  { name: 'Fatima Ibrahim', sub: 'Navrongo • Harvest Check', time: '14:00', status: 'In Progress' },
];

const metrics = [
  { title: 'Growers Onboarded', value: '48', sub: '+6 this week', color: 'bg-[#065f46]' },
  { title: 'Active Farms', value: '36', sub: '12 verified', color: 'bg-[#002f37]' },
  { title: 'Field Visits', value: '22', sub: '8 scheduled', color: 'bg-emerald-700' },
  { title: 'Reports Filed', value: '17', sub: '85% goal', color: 'bg-teal-800' },
];

const menuSections = [
  {
    section: 'Operations',
    items: [
      { label: 'Home / Overview', icon: Home, active: true },
      { label: 'Manage Your Farm', icon: LayoutGrid },
      { label: 'Media Gallery', icon: ImageIcon },
      { label: 'Tasks', icon: Briefcase },
    ],
  },
  {
    section: 'Performance',
    items: [
      { label: 'My Performance', icon: BarChart3 },
      { label: 'Training Sessions', icon: GraduationCap },
      { label: 'Grower Directory', icon: Users },
    ],
  },
  {
    section: 'Account',
    items: [{ label: 'Settings & Support', icon: Settings }],
  },
];

function MobileHeader() {
  return (
    <div className="sticky top-0 z-10 bg-[#f8fafc] px-4 pt-4 pb-4 border-b border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border-2 border-[#7ede56]/30 shadow-md">
            <AvatarFallback className="bg-[#065f46] text-white text-xs font-bold">{AGENT.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] font-bold text-[#002f37] leading-none">Hello {AGENT.firstName}!</h1>
              <ChevronDown className="h-4 w-4 text-gray-500 mt-0.5" />
            </div>
            <span className="text-[11px] font-medium text-gray-500 mt-0.5">{AGENT.agentId}</span>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-full bg-white shadow-sm border border-gray-100 h-10 w-10 flex items-center justify-center">
            <Bell className="h-6 w-6 text-[#002f37]" />
          </div>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] font-black text-red-600 shadow-sm">
            3
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav({ active = 'dashboard' }: { active?: 'dashboard' | 'training' | 'farm' | 'menu' }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-2 pb-3">
      <div className="flex items-center justify-between px-3 py-1.5 rounded-[1.75rem] shadow-[0_20px_50px_-12px_rgba(0,47,55,0.25)] border bg-white/95 border-gray-100 backdrop-blur-md">
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${active === 'dashboard' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>
          <LayoutGrid className={`h-6 w-6 ${active === 'dashboard' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`} />
          <span className={`text-[10px] font-black uppercase ${active === 'dashboard' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>Home</span>
        </div>
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${active === 'training' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>
          <GraduationCap className={`h-6 w-6 ${active === 'training' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`} />
          <span className={`text-[10px] font-black uppercase ${active === 'training' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>Training</span>
        </div>
        <div className="relative -top-6 px-1 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#7ede56] border-[5px] border-white shadow-[0_15px_30px_-10px_rgba(126,222,86,0.6)] flex flex-col items-center justify-center">
            <UserRoundPlus className="h-6 w-6 text-[#002f37] stroke-[3px] mb-0.5" />
            <span className="text-[7px] font-black text-[#002f37] font-montserrat tracking-tighter">Onboard</span>
          </div>
        </div>
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${active === 'farm' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>
          <Leaf className={`h-6 w-6 ${active === 'farm' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`} />
          <span className={`text-[10px] font-black uppercase ${active === 'farm' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>Farm</span>
        </div>
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${active === 'menu' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>
          <Menu className={`h-6 w-6 ${active === 'menu' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`} />
          <span className={`text-[10px] font-black uppercase ${active === 'menu' ? 'text-[#065f46]' : 'text-[#002f37]/40'}`}>More</span>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div id="screenshot-dashboard" className="relative w-[390px] h-[844px] overflow-hidden bg-[#f8fafc] font-inter">
      <MobileHeader />
      <div className="px-4 pt-5 pb-28 space-y-5 overflow-hidden">
        <div className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl bg-[#ffcc00] border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffcc00] via-[#ffcc00]/30 to-transparent" />
          <div className="relative z-10 flex items-center justify-between h-full px-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-black/80 uppercase tracking-[0.25em]">Personal KPIs</span>
              <h3 className="text-2xl font-black text-black tracking-tight font-montserrat uppercase leading-none">
                Agent
                <br />
                Performance
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-hidden">
          {[
            { label: 'Add record', color: 'from-[#064e3b]', icon: Plus },
            { label: 'Log visit', color: 'from-[#3b0764]', icon: MapPin },
            { label: 'Bulk SMS', color: 'from-[#002f37]', icon: Send },
          ].map(({ label, color, icon: Icon }) => (
            <div key={label} className={`min-w-[120px] h-24 rounded-[1.25rem] bg-gradient-to-br ${color} to-black/20 p-3 flex flex-col justify-between shadow-lg`}>
              <Icon className="h-4 w-4 text-[#7ede56]" />
              <span className="text-[11px] font-black text-white uppercase leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <div className="relative w-full aspect-[22/8] rounded-[1.25rem] overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
            <h3 className="text-white font-bold font-montserrat text-base uppercase tracking-tight leading-tight max-w-[150px]">
              Harvest Season Tracker
            </h3>
            <p className="text-white/70 font-inter font-medium text-[9px] mt-1">Verify farm yields precisely</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#002f37]">Active Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((item) => (
              <Card key={item.title} className={`${item.color} border-none rounded-none h-24 flex flex-col justify-between shadow-lg relative overflow-hidden`}>
                <div className="p-3 flex flex-col h-full justify-between relative z-10">
                  <span className="text-[7.5px] font-black text-white/80 uppercase tracking-widest leading-none">{item.title}</span>
                  <div>
                    <p className="text-[20px] font-black text-white leading-none">{item.value}</p>
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-tight">{item.sub}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#002f37]">Field Missions</h2>
            <span className="text-[11px] font-black text-[#065f46] uppercase border-b-2 border-[#7ede56]">View All</span>
          </div>
          {missions.slice(0, 2).map((mission) => (
            <div key={mission.name} className="flex items-center gap-4 p-4 rounded-[1.75rem] shadow-sm border border-gray-100 bg-white">
              <div className="h-12 w-12 rounded-[1.25rem] flex items-center justify-center bg-emerald-100 text-emerald-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold truncate text-[#002f37]">{mission.name}</h4>
                <p className="text-[11px] font-medium text-gray-400 truncate">{mission.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[13px] font-black text-[#002f37] block">{mission.time}</span>
                <span className="text-[9px] font-black uppercase text-amber-500">{mission.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MobileBottomNav active="dashboard" />
    </div>
  );
}

function MenuScreen() {
  return (
    <div id="screenshot-menu" className="relative w-[390px] h-[844px] overflow-hidden bg-[#f8fafc] font-inter">
      <div className="absolute inset-0 bg-[#f8fafc]">
        <MobileHeader />
        <div className="px-4 pt-5 space-y-4 opacity-50 blur-[1px]">
          <div className="rounded-[2rem] h-32 bg-[#ffcc00] shadow-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-[#065f46] rounded-none" />
            <div className="h-24 bg-[#002f37] rounded-none" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-y-0 left-0 w-[280px] bg-[#002f37] shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-[#7ede56]/30">
              <AvatarFallback className="bg-[#065f46] text-white text-sm font-bold">{AGENT.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-tight">{AGENT.name}</p>
              <p className="text-[#7ede56] text-[10px] font-bold uppercase tracking-widest mt-1">Field Agent</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden py-4">
          {menuSections.map((section) => (
            <div key={section.section} className="mb-5">
              <p className="px-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{section.section}</p>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className={`mx-3 mb-1 flex items-center gap-3 px-4 py-3 rounded-xl ${
                    item.active ? 'bg-[#7ede56]/15 text-[#7ede56]' : 'text-white/80'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? 'text-[#7ede56]' : 'text-white/60'}`} />
                  <span className="text-[13px] font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MobileBottomNav active="menu" />
    </div>
  );
}

function GrowerDirectoryScreen() {
  return (
    <div id="screenshot-growers" className="relative w-[390px] h-[844px] overflow-hidden bg-[#f8fafc] font-inter">
      <MobileHeader />
      <div className="px-4 pt-4 pb-28 space-y-4">
        <div>
          <h2 className="text-xl font-black text-[#002f37] uppercase tracking-tight">Grower Directory</h2>
          <p className="text-[11px] font-bold text-gray-400 mt-1">Manage and verify assigned growers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <div className="h-11 rounded-2xl bg-white border border-gray-100 shadow-sm pl-10 flex items-center text-sm text-gray-400">
            Search growers, farms, or IDs...
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Verified', 'Pending', 'Active'].map((filter, idx) => (
            <span
              key={filter}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap ${
                idx === 0 ? 'bg-[#065f46] text-white' : 'bg-white text-[#002f37] border border-gray-100'
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {growers.map((grower) => (
            <div key={grower.name} className="flex items-center gap-4 p-4 rounded-[1.75rem] shadow-sm border border-gray-100 bg-white">
              <div className="h-12 w-12 rounded-2xl bg-[#002f37]/5 overflow-hidden flex items-center justify-center border border-[#002f37]/10">
                <span className="text-[#002f37] font-black text-sm">
                  {grower.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#002f37]">{grower.name}</p>
                <p className="text-[10px] font-bold text-gray-400">{grower.community} • {grower.crop}</p>
              </div>
              <span
                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                  grower.status === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700'
                    : grower.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-[#065f46]/10 text-[#065f46]'
                }`}
              >
                {grower.status}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-[1.75rem] bg-[#002f37] p-5 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-widest">Quick Action</p>
              <p className="text-lg font-black mt-1">Verify 4 pending growers</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-[#7ede56]" />
          </div>
        </div>
      </div>
      <MobileBottomNav active="farm" />
    </div>
  );
}

const AgentMobilePreview: React.FC = () => {
  React.useEffect(() => {
    localStorage.setItem('agrilync_cookie_consent', 'accepted');
  }, []);

  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');

  if (screen === 'dashboard') return <DashboardScreen />;
  if (screen === 'menu') return <MenuScreen />;
  if (screen === 'growers') return <GrowerDirectoryScreen />;

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-wrap gap-8 justify-center">
      <DashboardScreen />
      <MenuScreen />
      <GrowerDirectoryScreen />
    </div>
  );
};

export default AgentMobilePreview;
