import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  Download as DownloadIcon, 
  MessageSquareText, 
  ArrowRight, 
  FileDown, 
  Bot, 
  Sprout, 
  Leaf, 
  DollarSign, 
  AlertTriangle,
  Clock,
  GraduationCap,
  Activity,
  CheckCircle2,
  UserCheck,
  FileText,
  Cloud,
  Users,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import AgentLayout from './AgentLayout';
import CountUp from '@/components/CountUp';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface KPI {
  label: string;
  value: string;
  unit: string;
  target: string;
  progress: number;
  status: string;
}

interface VisitLog {
  farmer: string;
  farm: string;
  region: string;
  last: string;
  visits: string;
  color: string;
  vIcon: string;
  sync: string;
  status: string;
}

interface AlertItem {
  id: string | number;
  color: string;
  message: string;
}

interface PerformanceData {
  trend: { value: number; month: string }[];
  kpis: KPI[];
  pendingSync: number | string;
  overallScore: number | string;
  portfolio: {
    total: number;
    onTrack: number;
    atRisk: number;
    offTrack: number;
  };
  supervisor: {
    initials: string;
    name: string;
    rating: number;
    comment: string;
    nextReview: string;
  };
  visitLog: VisitLog[];
  seasonOutcomes: {
    yieldEst: string;
    repaymentRate: string;
    capitalDeployed: string;
    partnerKpiMet: string;
  };
  activeAlerts?: AlertItem[];
}

const AgentPerformance: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState('onboarding');
  const [timeRange, setTimeRange] = useState('month');
  const [visitFilter, setVisitFilter] = useState('all');
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get('/agents/performance');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch performance data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);
  
  const metricData: Record<string, any> = {
    onboarding: { color: 'var(--lgreen)', data: data?.trend ? data.trend.map((t:any)=>t.value) : [0,0,0,0,0,0], target: '250+' },
    visits: { color: 'var(--teal)', data: [0, 0, 0, 0, 0, 0], target: '20' },
    training: { color: 'var(--amber)', data: [0, 0, 0, 0, 0, 0], target: '80%' },
    gender: { color: '#921573', data: [0, 0, 0, 0, 0, 0], target: '60% F' },
  };

  const currentMetric = metricData[activeMetric];

  const stats = [
    { label: 'Total Onboarded', value: data?.kpis?.[0]?.value || '0', unit: 'Farmers', icon: UserCheck, color: 'text-emerald-500', isLifetime: true },
    { label: 'Field visits', value: data?.kpis?.[1]?.value || '0', unit: 'Visits', icon: MapPin, color: 'text-teal-500', isLifetime: false },
    { label: 'Compliance', value: data?.kpis?.[2]?.value || '0', unit: '% Rate', icon: CheckCircle2, color: 'text-amber-500', isLifetime: false },
    { label: 'Pending Sync', value: data?.pendingSync || '0', unit: 'Items', icon: Cloud, color: 'text-rose-500', isLifetime: false },
  ];

  return (
    <AgentLayout 
      activeSection="performance" 
      title="My Performance"
      subtitle="Your KPI scorecard, farm outcomes, and field impact this season"
    >
      <div className="page-performance space-y-8 animate-fade-in">
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col gap-4 py-2">
          <div>
            <h1 className="text-[20px] sm:text-[28px] font-black tracking-tight" style={{ color: 'var(--teal)' }}>Performance Dashboard</h1>
            <p className="text-gray-500 font-semibold text-[12px] sm:text-[13px] mt-0.5">Real-time field monitoring and agent productivity metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Time Range Tabs */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 flex-1">
              {['month', 'season', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all min-h-[44px] ${timeRange === range ? 'bg-white shadow-md text-[#002f37]' : 'text-gray-500'}`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <Button
              onClick={() => Swal.fire({
                icon: 'info',
                title: 'Report Generation',
                text: 'Your regional performance report is being synthesized. You will be notified once it is ready for download.',
                confirmButtonColor: '#002f37'
              })}
              className="rounded-2xl font-black text-[11px] uppercase tracking-wider min-h-[48px] px-6 gap-2 bg-[#002f37] hover:bg-[#002f37]/90 text-white border-none shadow-xl"
            >
              <DownloadIcon className="h-4 w-4" /> Download Report
            </Button>
          </div>
        </div>

        {/* 2. KPI SCORECARD GRID — Unified Pilot Targets */}
        <div className="pt-2 mb-8">
           <h3 className="text-[11px] font-black text-[#002f37] uppercase tracking-[0.2em] mb-4 flex items-center justify-between gap-2">
             <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#065f46]"></div>
               Pilot KPI Scorecard
             </div>
             <Badge className="bg-[#7ede56]/10 text-[#065f46] border-none font-bold text-[9px] uppercase tracking-widest px-3">
               Target Score: {data?.overallScore || '82'}%
             </Badge>
           </h3>           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {(data?.kpis || [
              { label: 'Pilot Onboarding', value: '312', unit: 'Farmers', target: '500', progress: 62, status: 'Active' },
              { label: 'Gender Balance', value: '64/36', unit: 'F/M %', target: '60/40', progress: 100, status: 'Met' },
              { label: 'Training Rate', value: '78', unit: '%', target: '80%', progress: 97, status: 'Near' },
              { label: 'Monthly Visits', value: '14', unit: 'Visits', target: '10-20', progress: 70, status: 'On-Track' },
              { label: 'Group Meetings', value: '2', unit: 'Meetings', target: '2/Mo', progress: 100, status: 'Met' },
              { label: 'Media Compliance', value: '100', unit: '%', target: '100%', progress: 100, status: 'Verified' }
            ]).map((kpi: KPI, idx: number) => {
              const bgColors = ['bg-[#002f37]', 'bg-[#124b53]', 'bg-[#004d4d]', 'bg-[#006666]', 'bg-[#008080]', 'bg-[#065f46]'];
              const bgColor = bgColors[idx % bgColors.length];
              const getKpiIcon = (label: string) => {
                const lower = label.toLowerCase();
                if (lower.includes('onboarding')) return UserCheck;
                if (lower.includes('gender')) return Users;
                if (lower.includes('training')) return GraduationCap;
                if (lower.includes('visit') || lower.includes('monitoring')) return MapPin;
                if (lower.includes('data sync') || lower.includes('timeliness')) return Calendar;
                if (lower.includes('harvest') || lower.includes('yield')) return Sprout;
                if (lower.includes('media')) return ImageIcon;
                return Sprout;
              };
              const IconComponent = getKpiIcon(kpi.label);
              
              return (
              <Card
                key={idx}
                className={`${bgColor} rounded-2xl p-4 shadow-sm border-none text-white relative overflow-hidden flex flex-col justify-between group min-h-[120px]`}
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 border-[12px] border-white/5 rounded-full" />
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="p-2 rounded-xl bg-white/10">
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="bg-white/10 text-[8px] font-black uppercase text-white/70 border-none">
                    {kpi.status}
                  </Badge>
                </div>

                <div className="relative z-10">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1 leading-tight">{kpi.label}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <h2 className="text-xl font-black text-white tracking-tight leading-none group-hover:scale-105 transition-transform origin-left font-montserrat">
                      {kpi.value}
                    </h2>
                    <span className="text-[9px] font-bold text-white/50 uppercase">{kpi.unit}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#7ede56] transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(kpi.progress, 100)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[7px] font-black text-white/40 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>Target: {kpi.target}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )})}
           </div>
        </div>

        {/* 3. NEW: INCENTIVES & EARNINGS TRACKER */}
        <div className="mb-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {/* Main Incentive Card */}
             <Card className="md:col-span-3 p-6 sm:p-8 border-none shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-64 h-64 bg-[#7ede56]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-[#effcea] flex items-center justify-center">
                       <DollarSign className="h-5 w-5 text-[#065f46]" />
                     </div>
                     <div>
                       <h3 className="text-xl font-black text-[#002f37] tracking-tight">Active Monthly Incentives</h3>
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pilot Program Rewards Structure</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                           <span>High Volume Onboarding</span>
                           <span className="text-[#065f46]">GH¢300</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                           <span className="text-[12px] font-bold text-[#002f37]">312 / 250 Farmers</span>
                           <Badge className="bg-[#065f46] text-white text-[8px] font-black uppercase">Earned</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                           <span>Training Completion</span>
                           <span className="text-[#065f46]">GH¢200</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                           <span className="text-[12px] font-bold text-[#002f37]">78% / 80% Rate</span>
                           <Badge className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-tighter">GH¢100 Matched</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                           <span>Reporting & Media</span>
                           <span className="text-[#065f46]">GH¢200 Total</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                           <span className="text-[12px] font-bold text-[#002f37]">All Verified</span>
                           <Badge className="bg-[#065f46] text-white text-[8px] font-black uppercase">Earned</Badge>
                        </div>
                      </div>
                   </div>
                 </div>

                 <div className="lg:w-48 p-6 rounded-[2rem] bg-[#002f37] text-white flex flex-col justify-center items-center text-center shadow-2xl relative">
                    <div className="absolute top-4 left-4 h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Est. Bonus</p>
                    <h4 className="text-3xl font-black font-montserrat tracking-tighter">GH¢600</h4>
                    <p className="text-[9px] font-bold text-[#7ede56] mt-1 italic">Potential: GH¢700</p>
                    <button className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10" onClick={() => Swal.fire({title:'Payout Details', text: 'Your incentives are processed on the 5th of every month following supervisor verification.', icon: 'info'})}>
                      View Breakdown
                    </button>
                 </div>
               </div>
             </Card>

             {/* Support Allowances */}
             <Card className="p-6 border-none shadow-xl rounded-[2.5rem] bg-[#effcea] flex flex-col justify-between">
               <div>
                 <h4 className="text-[11px] font-black text-[#065f46] uppercase tracking-[0.2em] mb-4">Operational Support</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                            <MapPin className="h-3 w-3 text-[#065f46]" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-[#002f37]">Transport</p>
                            <p className="text-[8px] font-bold text-[#065f46]/60">Verified Route</p>
                          </div>
                       </div>
                       <Badge className="bg-[#065f46] text-white text-[8px] font-black uppercase">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                            <Cloud className="h-3 w-3 text-[#065f46]" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-[#002f37]">Data Bundle</p>
                            <p className="text-[8px] font-bold text-[#065f46]/60">Reporting Needs</p>
                          </div>
                       </div>
                       <Badge className="bg-[#065f46] text-white text-[8px] font-black uppercase">Active</Badge>
                    </div>
                 </div>
               </div>
               <div className="pt-4 border-t border-[#065f46]/10">
                  <p className="text-[9px] font-medium text-[#065f46] italic leading-tight">
                    "Allowances are disbursed based on approved field schedules."
                  </p>
               </div>
             </Card>
           </div>
        </div>

        {/* 4. TWO-COLUMN ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* LEFT — KPI Trend Chart */}
          <div className="lg:col-span-2 xl:col-span-2">
            <Card className="p-6 sm:p-8 border-none shadow-xl rounded-2xl h-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h3 className="section-title text-[#002f37] font-black text-lg">KPI Trend — Last 6 Months</h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Operational performance stability</p>
                </div>
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1 self-stretch md:self-auto overflow-x-auto scrollbar-hide">
                  {Object.keys(metricData).map(key => {
                    const tab = { id: key, label: key === 'sync' ? 'Sync' : key.charAt(0).toUpperCase() + key.slice(1) };
                    const isActive = activeMetric === tab.id;
                    return (
                      <button 
                        key={tab.id} 
                        onClick={() => setActiveMetric(tab.id)}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all whitespace-nowrap ${isActive ? 'bg-white shadow-sm text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative pt-12 pb-2">
                {/* Advanced Y-axis & Gridlines */}
                <div className="absolute left-0 top-0 bottom-10 w-full flex flex-col justify-between pointer-events-none">
                  {[100, 75, 50, 25, 0].map(val => (
                    <div key={val} className="flex items-center gap-4 w-full">
                      <span className="text-[10px] font-black text-gray-300 w-6 text-right">{val}</span>
                      <div className="flex-1 border-t border-gray-100/60 h-[1px]" />
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="ml-10 h-64 flex items-end justify-between relative group z-10 px-4">
                  {/* Target Line (Dashed) */}
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-rose-200/50 transition-all duration-500" 
                       style={{ bottom: `calc(${currentMetric.target} + 40px)`, zIndex: 5 }}>
                    <div className="absolute -top-5 right-0 bg-white px-2 text-[9px] font-black uppercase text-rose-500 tracking-widest border border-rose-100 rounded-full">
                      STATED TARGET: {currentMetric.target}
                    </div>
                  </div>
                  
                  {currentMetric.data.map((val: number, i: number) => {
                    const monthName = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i];
                    return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-6 h-full justify-end relative group/bar">
                      <div className="w-full max-w-[48px] rounded-t-xl transition-all duration-700 hover:scale-x-105 relative cursor-pointer" 
                           style={{ 
                             height: `${Math.max(val, 2)}%`, 
                             background: `linear-gradient(to top, ${currentMetric.color}, ${currentMetric.color}dd)`,
                             boxShadow: `0 10px 30px -10px ${currentMetric.color}66`
                           }}>
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#002f37] text-white text-[11px] font-black py-2 px-3 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 shadow-2xl pointer-events-none transform translate-y-2 group-hover/bar:translate-y-0 z-20">
                          {val}%
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#002f37]" />
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] transition-colors group-hover/bar:text-gray-900">
                        {data?.trend?.[i]?.month || monthName}
                      </span>
                    </div>
                  )})}
                </div>
                
                <div className="mt-12 flex justify-center items-center gap-12 bg-gray-50/50 py-4 rounded-2xl border border-gray-100/50 mx-10">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-4 rounded-full transition-colors duration-500" style={{ backgroundColor: currentMetric.color }} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ACTUAL PERFORMANCE</span>
                  </div>
                  <div className="w-[1px] h-4 bg-gray-200" />
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-0 border-t-2 border-dashed border-rose-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SEASON THRESHOLD</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT — stacked cards */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Portfolio Health */}
            <Card className="p-6 sm:p-8 border-none shadow-xl rounded-2xl">
              <h3 className="section-label mb-6">Portfolio Health</h3>
              <div className="donut-wrap mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--lgreen)" strokeWidth="12" strokeDasharray={`${((data?.portfolio?.onTrack||0)/(data?.portfolio?.total||1))*251.2} 251.2`} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--amber)" strokeWidth="12" strokeDasharray={`${((data?.portfolio?.atRisk||0)/(data?.portfolio?.total||1))*251.2} 251.2`} strokeDashoffset={`-${((data?.portfolio?.onTrack||0)/(data?.portfolio?.total||1))*251.2}`} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--red)" strokeWidth="12" strokeDasharray={`${((data?.portfolio?.offTrack||0)/(data?.portfolio?.total||1))*251.2} 251.2`} strokeDashoffset={`-${(((data?.portfolio?.onTrack||0)+(data?.portfolio?.atRisk||0))/(data?.portfolio?.total||1))*251.2}`} />
                </svg>
                <div className="donut-center">
                  <p className="text-2xl font-black leading-none" style={{ color: 'var(--teal)' }}>{data?.portfolio?.total || 0}</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 text-nowrap">Total Farms</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--lgreen)' }} />
                    <span className="text-xs font-bold text-gray-700">On Track</span>
                  </div>
                  <span className="text-xs font-black">{data?.portfolio?.onTrack || 0} ({Math.round(((data?.portfolio?.onTrack||0)/(data?.portfolio?.total||1))*100)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--amber)' }} />
                    <span className="text-xs font-bold text-gray-700">At Risk</span>
                  </div>
                  <span className="text-xs font-black">{data?.portfolio?.atRisk || 0} ({Math.round(((data?.portfolio?.atRisk||0)/(data?.portfolio?.total||1))*100)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--red)' }} />
                    <span className="text-xs font-bold text-gray-700">Off Track</span>
                  </div>
                  <span className="text-xs font-black">{data?.portfolio?.offTrack || 0} ({Math.round(((data?.portfolio?.offTrack||0)/(data?.portfolio?.total||1))*100)}%)</span>
                </div>
              </div>
            </Card>

            {/* Supervisor Feedback */}
            <Card className="p-6 sm:p-8 border-none shadow-xl rounded-2xl text-white relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, #002f37 0%, #004d4d 100%)' }}>
              <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                <MessageSquareText className="h-20 w-20" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#7ede56] mb-6">Supervisor Feedback</h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 font-black text-white">{data?.supervisor?.initials || 'FS'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black">{data?.supervisor?.name || 'Field Supervisor'}</p>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-3 w-3 ${i <= (data?.supervisor?.rating || 0) ? 'fill-current' : 'opacity-20'}`} />)}
                  </div>
                </div>
              </div>
              <blockquote className="text-sm font-medium italic text-white/80 leading-relaxed mb-6">
                {data?.supervisor?.comment || '"No supervisor feedback has been recorded for this period."'}
              </blockquote>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase">Next review: {data?.supervisor?.nextReview || 'Awaiting Schedule'}</span>
                <button 
                  onClick={() => Swal.fire({
                    icon: 'success',
                    title: 'Feedback Recorded',
                    text: 'Your response has been transmitted to your regional supervisor.',
                    confirmButtonColor: '#002f37',
                    timer: 2000,
                    timerProgressBar: true
                  })}
                  className="text-[11px] font-black text-[#7ede56] hover:underline flex items-center gap-1"
                >
                  Reply <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* 5. FARM VISIT LOG */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-8 border-b border-gray-100 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-[#002f37] font-black text-[15px] sm:text-lg">Farm Visit Log</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Detailed field compliance monitoring</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Scrollable filter tabs */}
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
                  {[['all','All'],['below','At Risk'],['on-track','On Track']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setVisitFilter(val)}
                      className={`flex-1 min-w-[64px] py-2.5 text-[10px] font-black uppercase rounded-lg transition-all whitespace-nowrap min-h-[44px] ${visitFilter === val ? 'bg-white shadow-sm text-[#002f37]' : 'text-gray-500'}`}
                    >{label}</button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => Swal.fire({
                    icon: 'info',
                    title: 'Export Initialization',
                    text: 'Compiling field logs into a secure CSV format. The download will initiate shortly.',
                    confirmButtonColor: '#002f37'
                  })}
                  className="rounded-xl font-black text-[10px] tracking-widest min-h-[44px] px-3 gap-1.5 hover:bg-gray-50 shrink-0"
                >
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline">EXPORT</span>
                </Button>
              </div>
            </div>
          </div>

          {/* MOBILE: Card Stack */}
          <div className="md:hidden divide-y divide-gray-50 bg-white">
            {(data?.visitLog || []).filter((row: VisitLog) => {
              if (visitFilter === 'all') return true;
              if (visitFilter === 'below') return row.status === 'At Risk' || row.status === 'Off Track';
              if (visitFilter === 'on-track') return row.status === 'On Track';
              return true;
            }).length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">No visit records match this filter</p>
              </div>
            ) : (
              (data?.visitLog || []).filter((row: VisitLog) => {
                if (visitFilter === 'all') return true;
                if (visitFilter === 'below') return row.status === 'At Risk' || row.status === 'Off Track';
                if (visitFilter === 'on-track') return row.status === 'On Track';
                return true;
              }).map((row: VisitLog, i: number) => (
                <div key={i} className={`p-5 ${row.color === 'amber' ? 'bg-amber-50/30' : row.color === 'red' ? 'bg-rose-50/30' : 'bg-white'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-[14px] font-black text-[#002f37] leading-tight">{row.farmer}</h4>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">{row.farm} · {row.region}</p>
                    </div>
                    <Badge className={`rounded-xl border-none font-bold text-[9px] px-2.5 py-1 shrink-0 ${row.status === 'On Track' ? 'bg-green-100 text-green-700' : row.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {row.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Last Visit</p>
                      <p className="text-[11px] font-bold text-[#002f37]">{row.last || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Visits / Mo</p>
                      <p className={`text-[11px] font-black ${row.color === 'red' ? 'text-rose-600' : row.color === 'amber' ? 'text-amber-600' : 'text-[#177209]'}`}>{row.visits || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sync</p>
                      <p className={`text-[11px] font-bold ${row.sync !== 'Synced' ? 'text-rose-500' : 'text-gray-400'}`}>{row.sync || '—'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP: Full Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#002f37]">
                <tr>
                  <th className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10 last:border-r-0">Farmer</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10">Farm</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10">Region</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10">Last Visit</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10">Visits This Month</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white border-r border-white/10">Sync Status</th>
                  <th className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white">Farm Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#002f37]/10 font-semibold text-sm bg-white">
                {(data?.visitLog || []).filter((row: VisitLog) => {
                  if (visitFilter === 'all') return true;
                  if (visitFilter === 'below') return row.status === 'At Risk' || row.status === 'Off Track';
                  if (visitFilter === 'on-track') return row.status === 'On Track';
                  return true;
                }).map((row: VisitLog, i: number) => (
                  <tr key={i} className={`group hover:bg-gray-50/80 transition-colors ${row.color === 'amber' ? 'bg-amber-50/30' : row.color === 'red' ? 'bg-rose-50/30' : 'bg-white'}`}>
                    <td className="px-8 py-2.5 font-black text-[#002f37] border-r border-[#002f37]/5">{row.farmer}</td>
                    <td className="px-6 py-2.5 border-r border-[#002f37]/5">{row.farm}</td>
                    <td className="px-6 py-2.5 text-gray-500 border-r border-[#002f37]/5">{row.region}</td>
                    <td className="px-6 py-2.5 text-gray-500 font-bold border-r border-[#002f37]/5">{row.last}</td>
                    <td className="px-6 py-2.5 border-r border-[#002f37]/5">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2].map(j => {
                            const visitsCount = parseInt(row.visits.split('/')[0]);
                            const isFilled = j <= visitsCount;
                            return <div key={j} className={`h-4 w-4 rounded-sm shadow-sm ${isFilled ? 'bg-[#7ede56]' : 'bg-gray-200'}`} />;
                          })}
                        </div>
                        <span className={`text-[10px] font-black ${row.color === 'red' ? 'text-rose-600' : row.color === 'amber' ? 'text-amber-600' : 'text-[#177209]'}`}>
                          {row.visits} {row.vIcon}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 border-r border-[#002f37]/5">
                      <span className={`${row.sync !== 'Synced' ? 'text-rose-500' : 'text-gray-400'}`}>{row.sync}</span>
                    </td>
                    <td className="px-8 py-2.5">
                      <Badge className={`rounded-xl border-none font-bold text-[10px] px-3 py-1 ${row.status === 'On Track' ? 'bg-green-100 text-green-700' : row.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 6. PILOT INCENTIVE FRAMEWORK */}
        <div className="mb-10">
          <h3 className="text-[11px] font-black text-[#002f37] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56]"></div>
            Proposed Incentive Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#002f37] text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-16 w-16" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#7ede56] mb-1">Activity Allowance</p>
              <h4 className="text-xl font-black mb-4">Training Delivery</h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-white">GH¢200</p>
                  <p className="text-[9px] font-bold text-white/60 uppercase mt-1">Per Manual Completion</p>
                </div>
                <Badge className="bg-[#7ede56] text-[#002f37] border-none font-black text-[10px]">PILOT RATE</Badge>
              </div>
            </Card>

            <Card className="bg-white border-2 border-[#002f37]/5 p-6 rounded-2xl shadow-xl hover:border-[#065f46]/20 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#065f46] mb-1">Target Incentive A</p>
              <h4 className="text-xl font-black text-[#002f37] mb-4">Monthly Goal Achievement</h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-[#002f37]">GH¢600</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">On reaching 500 farmer onboarding</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#065f46]" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border-2 border-[#7ede56]/20 p-6 rounded-2xl shadow-xl hover:border-[#7ede56]/40 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#065f46] mb-1">Target Incentive B</p>
              <h4 className="text-xl font-black text-[#002f37] mb-4">Excellence Bonus</h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-[#065f46]">GH¢700</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Top tier regional performance</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#7ede56]/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-[#065f46]" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 8. COMPLIANCE & VERIFICATION TRACKERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Card className="p-8 border-none shadow-xl rounded-2xl bg-white">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-[#002f37] font-black text-lg">Seasonal Compliance</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol adherence monitoring</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-[#065f46]" />
            </div>
            <div className="space-y-6">
              {[
                { label: 'Soil Test Completion', value: '92%', status: 'Compliant' },
                { label: 'GAP Training Attendance', value: '88%', status: 'Compliant' },
                { label: 'Harvest Reporting', value: '45%', status: 'Ongoing' },
                { label: 'Repayment Schedule Sync', value: '96%', status: 'Excellent' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 bg-gray-100 rounded-full group-hover:bg-[#7ede56] transition-colors"></div>
                    <span className="text-[13px] font-bold text-gray-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-black text-[#002f37]">{item.value}</span>
                    <Badge className={`text-[8px] font-black uppercase px-2 py-0.5 border-none ${item.status === 'Ongoing' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-700'}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl rounded-2xl bg-[#002f37] text-white">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-[#7ede56] font-black text-lg">Verification Snapshots</h4>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Digital identity check integrity</p>
              </div>
              <Activity className="h-6 w-6 text-[#7ede56]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Ghana Card OCR Accuracy</p>
                <p className="text-2xl font-black text-[#7ede56]">94.2%</p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7ede56]" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">GPS Perimeter Validation</p>
                <p className="text-2xl font-black text-[#7ede56]">100%</p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7ede56]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Quality Assurance Rating</span>
                <span className="text-[12px] font-black text-white">ELITE AGENT STATUS</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 9. BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Training Delivery Progress */}
          <Card className="p-8 border-none shadow-xl rounded-2xl">
            <div className="mb-8">
              <h3 className="section-title text-[#002f37] font-black text-lg">Training Delivery Progress</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Completion per module across your 312 farmers</p>
            </div>
            <div className="space-y-8">
              {[
                { title: 'Climate-Smart Agriculture', icon: Leaf, desc: 'Adapting to environmental changes', count: '243/312', perc: '78%', color: 'var(--lgreen)', tag: 'Required' },
                { title: 'Financial Literacy', icon: DollarSign, desc: 'Budgeting & Saving for inputs', count: '180/312', perc: '58%', color: 'var(--teal)', tag: 'Required' },
                { title: 'Agricultural Management', icon: GraduationCap, desc: 'Crop lifecycle & farm governance', count: '290/312', perc: '93%', color: 'var(--amber)', tag: 'Required' },
                { title: 'AI Advisory Tools', icon: Bot, desc: 'Modern data tools utilization', count: '112/312', perc: '36%', color: 'var(--gray200)', tag: 'Advanced' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#065f46]/10">
                        <m.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#002f37]">{m.title}</p>
                        <p className="text-[10px] text-gray-500 font-semibold">{m.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-transparent px-2 mb-1 ${m.tag === 'Required' ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                        {m.tag}
                      </Badge>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-black text-[#002f37]">{m.count}</span>
                        <span className="text-[10px] font-bold text-gray-300">({m.perc})</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: m.perc, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* RIGHT — Season Outcomes */}
          <Card className="p-8 border-none shadow-xl rounded-2xl bg-white">
            <div className="mb-8">
              <h3 className="section-title text-[#002f37] font-black text-lg">Season Outcomes</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Direct impact of your field interventions</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Yield Est.</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#002f37]">{data?.seasonOutcomes?.yieldEst || '0.0'}</span>
                  <span className="text-[10px] font-bold text-gray-400">Metric Tons</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Repayment Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-teal-600">{data?.seasonOutcomes?.repaymentRate || '0%'}</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capital Deployed</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#002f37]">{data?.seasonOutcomes?.capitalDeployed || '$0'}</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-magenta uppercase tracking-widest mb-1" style={{ color: '#921573' }}>Partner KPIs Met</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black" style={{ color: '#921573' }}>{data?.seasonOutcomes?.partnerKpiMet || '0/0'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#002f37] text-white relative overflow-hidden">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-rose-500/20 rounded-lg">
                   <AlertTriangle className="h-5 w-5 text-rose-500" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black mb-1">Active Alerts ({data?.activeAlerts?.length || 0})</h4>
                   <ul className="space-y-2">
                     {(data?.activeAlerts || []).map((alert: any) => (
                       <li key={alert.id} className="text-[11px] font-medium text-white/70 flex items-center gap-2">
                          <div className={`w-1 h-1 rounded-full ${alert.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`} /> 
                          {alert.message}
                       </li>
                     ))}
                     {(!data?.activeAlerts || data.activeAlerts.length === 0) && (
                       <li className="text-[11px] font-medium text-white/40 italic">No active field alerts at this time.</li>
                     )}
                   </ul>
                 </div>
               </div>
            </div>
          </Card>
        </div>

        {/* 7. MOTIVATIONAL FOOTER NOTE */}
        <Card className="mt-12 p-8 border-2 border-dashed border-[#F4FFEE] bg-[#F4FFEE]/30 rounded-[32px] text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6">
              <Sprout className="h-6 w-6 text-[#065f46]" />
            </div>
            <h3 className="text-xl font-black text-[#002f37] mb-3">Your Field Work Builds Future Investment</h3>
            <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
              "Accurate KPI reporting today directly impacts the credit scores and funding opportunities for your farmers. 
              The transparency you provide ensures our community grows stronger every season."
            </p>
          </div>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentPerformance;
