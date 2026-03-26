import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
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
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import AgentLayout from './AgentLayout';

const AgentPerformance: React.FC = () => {
  const { toast } = useToast();
  const [activeMetric, setActiveMetric] = useState('onboarding');
  const [timeRange, setTimeRange] = useState('month');
  const [visitFilter, setVisitFilter] = useState('all');
  const [data, setData] = useState<any>(null);
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
    onboarding: { color: 'var(--lgreen)', data: data?.trend ? data.trend.map((t:any)=>t.value) : [0,0,0,0,0,0], target: '100%' },
    visits: { color: 'var(--teal)', data: [0, 0, 0, 0, 0, 0], target: '100%' },
    sync: { color: '#921573', data: [0, 0, 0, 0, 0, 0], target: '95%' },
    training: { color: 'var(--amber)', data: [0, 0, 0, 0, 0, 0], target: '100%' },
  };

  const currentMetric = metricData[activeMetric];

  if (loading) {
    return (
      <AgentLayout activeSection="performance" title="My Performance" subtitle="Your KPI scorecard, farm outcomes, and field impact this season">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002f37]"></div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout 
      activeSection="performance" 
      title="My Performance"
      subtitle="Your KPI scorecard, farm outcomes, and field impact this season"
    >
      <div className="page-performance space-y-8 animate-fade-in">
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-2">
          <div>
            <h1 className="page-title text-[24px] sm:text-[28px] font-black tracking-tight" style={{ color: 'var(--teal)' }}>Performance Dashboard</h1>
            <p className="page-desc text-gray-500 font-semibold" style={{ fontSize: '13px' }}>Real-time field monitoring and agent productivity metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 w-full sm:w-auto">
              <button 
                onClick={() => setTimeRange('month')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${timeRange === 'month' ? 'bg-white shadow-md text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeRange('season')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${timeRange === 'season' ? 'bg-white shadow-md text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Season
              </button>
              <button 
                onClick={() => setTimeRange('all')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${timeRange === 'all' ? 'bg-white shadow-md text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                All
              </button>
            </div>
            <Button 
              onClick={() => toast({ title: "Downloading Report", description: "Your performance report is being prepared." })}
              className="rounded-2xl font-black text-[11px] uppercase tracking-wider h-12 px-8 gap-2 bg-[#002f37] hover:bg-[#002f37]/90 text-white border-none shadow-xl w-full sm:w-auto"
            >
              <DownloadIcon className="h-4 w-4" /> <span className="sm:inline">Download Report</span>
            </Button>
          </div>
        </div>

        {/* 2. AGENT SCORECARD BANNER REMOVED */}

        {/* 3. KPI SCORECARD GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {(data?.kpis || []).map((kpi: any, idx: number) => {
            const isGreen = kpi.status === 'On Track';
            const isAmber = kpi.status === 'In Progress';
            const color = isGreen ? 'bg-[#177209]' : (isAmber ? 'bg-amber-500' : 'bg-gray-500');
            const icon = [Sprout, CheckCircle2, UserCheck, Clock, Activity, FileText][idx % 6] || Sprout;
            const IconComponent = icon;
            return (
            <Card
              key={idx}
              className="bg-white rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden flex flex-col justify-between group border-none h-28 sm:h-auto min-h-[112px] sm:min-h-[160px]"
            >
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <IconComponent className={`h-20 w-20 sm:h-24 sm:w-24 ${color.replace('bg-', 'text-')} -rotate-12`} />
              </div>

              <div className="flex items-center justify-between mb-1 sm:mb-4 relative z-10">
                <div className={`p-1.5 sm:p-2 ${color.replace('bg-', 'bg-').concat('/10')} rounded-lg`}>
                  <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${color.replace('bg-', 'text-')}`} />
                </div>
                <Badge className={`rounded-xl border-none font-bold text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 ${color} text-white uppercase tracking-widest`}>
                  {kpi.status}
                </Badge>
              </div>

              <div className="relative z-10">
                <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">{kpi.label}</p>
                <div className="flex items-baseline gap-1 sm:gap-2 mb-2 sm:mb-4">
                  <h3 className="text-xl sm:text-4xl font-black text-gray-900 leading-none">
                    {kpi.value}
                  </h3>
                  <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.unit}</span>
                </div>

                <div className="space-y-1 sm:space-y-1.5 hidden sm:block">
                  <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold">
                    <span className="text-gray-400">TARGET: {kpi.target}</span>
                    <span className={color.replace('bg-', 'text-')}>{Math.round(kpi.progress)}%</span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${Math.min(kpi.progress, 100)}%`, backgroundColor: color.startsWith('bg-[') ? color.match(/\[(.*?)\]/)?.[1] : 'var(--teal)' }} />
                  </div>
                </div>
              </div>
            </Card>
          )})}
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

              <div className="relative pt-6 pb-2">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] font-black text-gray-300 pointer-events-none">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="ml-10 h-48 border-b border-gray-100 flex items-end justify-between relative group">
                  {/* Target Line (Dashed) */}
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-gray-200" style={{ bottom: currentMetric.target, zIndex: 1 }}>
                    <span className="absolute -top-5 right-0 text-[11px] font-black uppercase text-gray-400">Target Line</span>
                  </div>
                  
                  {currentMetric.data.map((val: number, i: number) => {
                    const monthName = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i];
                    return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 px-2 sm:px-4">
                      <div className="w-full max-w-[40px] rounded-t-lg transition-all duration-700 hover:brightness-110 relative kpi-trend-bar" 
                           style={{ height: `${val}%`, backgroundColor: currentMetric.color, opacity: 0.9 }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#002f37] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {val}%
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {data?.trend?.[i]?.month || monthName}
                      </span>
                    </div>
                  )})}
                </div>
                
                <div className="mt-12 flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm transition-colors duration-500" style={{ backgroundColor: currentMetric.color }} />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actual Performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0 border-t-2 border-dashed border-gray-300" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Target Threshold</span>
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
                  <AvatarFallback className="bg-white/10 font-black text-white">SK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black">Samuel Kwaku</p>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                </div>
              </div>
              <blockquote className="text-sm font-medium italic text-white/80 leading-relaxed mb-6">
                "Good completion rate and solid sync timeliness. Focus area: increase monitoring visit frequency — 11 farms are below the 2/month minimum. Next review: April 1."
              </blockquote>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase">Next review: April 1, 2026</span>
                <button 
                  onClick={() => toast({ title: "Reply Sent", description: "Your feedback has been sent to Samuel Kwaku." })}
                  className="text-[11px] font-black text-[#7ede56] hover:underline flex items-center gap-1"
                >
                  Reply <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* 5. FARM VISIT LOG TABLE */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
            <div>
              <h3 className="section-title text-[#002f37] font-black text-lg">Farm Visit Log</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Detailed field compliance monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                <button 
                  onClick={() => setVisitFilter('all')}
                  className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${visitFilter === 'all' ? 'bg-white shadow-sm text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setVisitFilter('below')}
                  className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${visitFilter === 'below' ? 'bg-white shadow-sm text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Below Min
                </button>
                <button 
                  onClick={() => setVisitFilter('on-track')}
                  className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${visitFilter === 'on-track' ? 'bg-white shadow-sm text-[#002f37]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  On Track
                </button>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => toast({ title: "Export Started", description: "Exporting field compliant data to CSV." })}
                className="rounded-xl font-black text-[10px] tracking-widest h-10 px-4 gap-2 hover:bg-gray-50"
              >
                <FileDown className="h-4 w-4" /> EXPORT
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#065f46]">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Farmer</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Farm</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Region</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Last Visit</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Visits This Month</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Sync Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white border-none">Farm Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold text-sm bg-white">
                {(data?.visitLog || []).filter((row: any) => {
                  if (visitFilter === 'all') return true;
                  if (visitFilter === 'below') return row.status === 'At Risk' || row.status === 'Off Track';
                  if (visitFilter === 'on-track') return row.status === 'On Track';
                  return true;
                }).map((row: any, i: number) => (
                  <tr key={i} className={`group hover:bg-gray-50/80 transition-colors ${row.color === 'amber' ? 'bg-amber-50/30' : row.color === 'red' ? 'bg-rose-50/30' : 'bg-white'}`}>
                    <td className="px-8 py-5 font-black text-[#002f37]">{row.farmer}</td>
                    <td className="px-6 py-5">{row.farm}</td>
                    <td className="px-6 py-5 text-gray-500">{row.region}</td>
                    <td className="px-6 py-5 text-gray-500 font-bold">{row.last}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2].map(j => {
                            const visitsCount = parseInt(row.visits.split('/')[0]);
                            const isFilled = j <= visitsCount;
                            return (
                              <div key={j} className={`h-4 w-4 rounded-sm shadow-sm ${isFilled ? 'bg-[#7ede56]' : 'bg-gray-200'}`} />
                            );
                          })}
                        </div>
                        <span className={`text-[10px] font-black ${row.color === 'red' ? 'text-rose-600' : row.color === 'amber' ? 'text-amber-600' : 'text-[#177209]'}`}>
                          {row.visits} {row.vIcon}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${row.sync !== 'Synced' ? 'text-rose-500' : 'text-gray-400'}`}>{row.sync}</span>
                    </td>
                    <td className="px-8 py-5">
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

        {/* 6. BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Training Delivery Progress */}
          <Card className="p-8 border-none shadow-xl rounded-2xl">
            <div className="mb-8">
              <h3 className="section-title text-[#002f37] font-black text-lg">Training Delivery Progress</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1">Completion per module across your 312 farmers</p>
            </div>
            <div className="space-y-8">
              {[
                { title: 'Financial Literacy', icon: DollarSign, desc: 'Budgeting & Saving for inputs', count: data?.trainingModules?.[0]?.count || '0/0', perc: data?.trainingModules?.[0]?.perc || '0%', color: 'var(--lgreen)', tag: 'Required' },
                { title: 'Farm Planning & GAP', icon: Sprout, desc: 'Agronomy best practices & planning', count: data?.trainingModules?.[1]?.count || '0/0', perc: data?.trainingModules?.[1]?.perc || '0%', color: 'var(--teal)', tag: 'Required' },
                { title: 'AI Advisory Tools', icon: Bot, desc: 'Modern data tools utilization', count: '0/0', perc: '0%', color: 'var(--amber)', tag: 'Should Complete' },
                { title: 'Climate Resilience', icon: Leaf, desc: 'Adapting to environmental changes', count: '0/0', perc: '0%', color: 'var(--gray200)', tag: 'Recommended' },
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
                        <span className="text-[10px] font-bond text-gray-300">({m.perc})</span>
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
                  <span className="text-2xl font-black text-[#002f37]">1.4k</span>
                  <span className="text-[10px] font-bold text-gray-400">Metric Tons</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Repayment Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-teal-600">98.2%</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capital Deployed</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#002f37]">$245k</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-[#065f46] transition-all">
                <p className="text-[10px] font-black text-magenta uppercase tracking-widest mb-1" style={{ color: '#921573' }}>Partner KPIs Met</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black" style={{ color: '#921573' }}>14/15</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#002f37] text-white relative overflow-hidden">
               <div className="flex items-start gap-4">
                 <div className="p-2 bg-rose-500/20 rounded-lg">
                   <AlertTriangle className="h-5 w-5 text-rose-500" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black mb-1">Active Alerts (4)</h4>
                   <ul className="space-y-2">
                     <li className="text-[11px] font-medium text-white/70 flex items-center gap-2">
                        <div className="w-1 h-1 bg-rose-500 rounded-full" /> 
                        8 Farms in Rice North showing pest stress
                     </li>
                     <li className="text-[11px] font-medium text-white/70 flex items-center gap-2">
                        <div className="w-1 h-1 bg-amber-500 rounded-full" /> 
                        Repayment lag in Cassava Cluster #4
                     </li>
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
