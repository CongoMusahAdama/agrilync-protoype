import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Activity, GraduationCap, ClipboardList, UserCheck, Info, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OverviewTabProps {
  farms: any[];
  activities: any[];
  notifications: any[];
  stats: any;
  darkMode: boolean;
  agent: any;
  handleLogVisit: (farmer: any) => void;
  sectionCardClass: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  farms = [],
  activities = [],
  notifications = [],
  stats = {},
  darkMode,
  agent,
  handleLogVisit,
  sectionCardClass
}) => {
  const navigate = useNavigate();
  
  // Calculate report progress (assumed goal of 20 reports per month)
  const reportCount = stats.reportsThisMonth || 0;
  const reportGoal = 20;
  const reportProgress = Math.min(Math.round((reportCount / reportGoal) * 100), 100);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Today's Priority */}
      <Card className="lg:col-span-2 border-none bg-white shadow-xl rounded-2xl">
        <CardHeader className="hidden md:flex pb-3 border-b border-gray-50 flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-[#002f37] normal-case">Active field missions</CardTitle>
            <p className="text-[11px] font-bold text-gray-400 normal-case mt-1">Priority tasks for your region</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {farms.length > 0 ? farms.slice(0, 4).map((farm: any) => (
              <div key={farm._id} className="p-3 flex items-center justify-between hover:bg-[#002f37]/5 border-b border-[#002f37]/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} alt={farm.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#002f37] mb-0.5 normal-case">{farm.name}</p>
                    <span className="text-[10px] font-bold text-gray-400 normal-case">{farm.farmer?.community || 'Assigned location'}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-xl bg-gray-50 group-hover:bg-[#002f37] group-hover:text-white transition-all shadow-sm border-none"
                  onClick={() => handleLogVisit(farm.farmer)}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )) : (
              <div className="p-10 text-center space-y-2">
                 <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Info className="h-6 w-6" />
                 </div>
                 <p className="text-sm font-bold text-[#002f37]">No active missions found</p>
                 <p className="text-xs text-gray-400">Add a grower to start tracking activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Report Progress Card - Now dynamic */}
        <Card className="border-none bg-[#002f37] text-white rounded-[2.5rem] shadow-xl overflow-hidden relative p-8 group h-64 flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <img src="/metric1.jpg" alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[3s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-[#002f37]/80 to-[#002f37]/30" />
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2 drop-shadow-md">{currentMonthName} missions</p>
                <h3 className="text-3xl font-black text-white font-montserrat uppercase tracking-tight drop-shadow-lg">
                  {reportProgress >= 100 ? 'Mission complete!' : 'Almost done!'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">Digital reports submitted</span>
                  <span className="text-sm font-black text-emerald-400 tabular-nums">{reportProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-1000" style={{ width: `${reportProgress}%` }}></div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 group/link cursor-pointer" onClick={() => navigate('/dashboard/agent?tab=visits')}>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest group-hover/link:text-white transition-colors">View all logs</span>
                <ChevronRight className="h-3 w-3 text-white/30 group-hover/link:translate-x-1 group-hover/link:text-emerald-400 transition-all" />
              </div>
            </div>
        </Card>

        {/* Real-time Field Alerts from Notifications */}
        <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#002f37] normal-case">Operational alerts</CardTitle>
            <Badge className="bg-emerald-50 text-[#065f46] border-none text-[10px] font-black">{notifications.filter(n => !n.read).length} New</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length > 0 ? notifications.slice(0, 3).map((item: any) => (
              <div key={item._id} className="p-4 border-b border-gray-50 last:border-none flex items-start justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg ${item.type === 'alert' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'} flex items-center justify-center shrink-0`}>
                    {item.type === 'alert' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#002f37] line-clamp-1">{item.title}</p>
                    <p className="text-[10px] font-medium text-gray-400 line-clamp-1">{item.message}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-[#002f37] transition-colors shrink-0 mt-1" />
              </div>
            )) : (
              <div className="p-8 text-center bg-gray-50/50">
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No recent alerts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
