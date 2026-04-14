import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Activity, GraduationCap, ClipboardList, UserCheck, Info, ChevronRight, AlertTriangle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface OverviewTabProps {
  farms: any[];
  activities: any[];
  notifications: any[];
  stats: any;
  darkMode: boolean;
  agent: any;
  handleLogVisit: (farmer: any) => void;
  handleOpenBulkSms: () => void;
  sectionCardClass: string;
  tasks: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  farms = [],
  activities = [],
  notifications = [],
  stats = {},
  darkMode,
  agent,
  handleLogVisit,
  handleOpenBulkSms,
  sectionCardClass,
  tasks = []
}) => {
  const navigate = useNavigate();

  // Calculate report progress (assumed goal of 20 reports per month)
  const reportCount = stats.reportsThisMonth || 0;
  const reportGoal = 20;
  const reportProgress = Math.min(Math.round((reportCount / reportGoal) * 100), 100);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  // Identify almost due tasks (due within 48 hours)
  const almostDueTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    const dueDate = new Date(t.dueDate);
    const diffTime = dueDate.getTime() - new Date().getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  });

  return (
    <>
      {almostDueTasks.length > 0 && (
        <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl shadow-sm animate-pulse flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-200/50 flex items-center justify-center text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[#002f37] font-black text-sm uppercase tracking-widest">Urgent Field Briefing</h3>
              <p className="text-[13px] font-bold text-amber-900/60 mt-0.5">
                You have {almostDueTasks.length} {almostDueTasks.length === 1 ? 'task' : 'tasks'} reaching its deadline in less than 48 hours!
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-amber-800 font-black text-[11px] uppercase tracking-widest hover:bg-amber-100"
            onClick={() => navigate('/dashboard/agent?tab=tasks')}
          >
            Review Now <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3 pb-8">
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
                    <div className="h-12 w-12 rounded-2xl bg-[#002f37]/5 overflow-hidden shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center border border-[#002f37]/10">
                      {farm.farmer?.profilePicture || farm.farmer?.avatar || farm.farmer?.photo || farm.farmer?.picture || farm.farmer?.image || farm.farmer?.profile_picture ? (
                        <img src={farm.farmer?.profilePicture || farm.farmer?.avatar || farm.farmer?.photo || farm.farmer?.picture || farm.farmer?.image || farm.farmer?.profile_picture} alt={farm.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#002f37] font-black text-sm">
                          {farm.name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                      )}
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

          {/* Performance Snapshot */}
          <Card className="border-none bg-emerald-50 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#002f37] uppercase tracking-widest">Performance Insights</h3>
              <GraduationCap className="h-5 w-5 text-[#065f46]" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                  <span>Training Impact</span>
                  <span>{stats.trainingCompletionRate || 85}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#065f46] rounded-full" style={{ width: `${stats.trainingCompletionRate || 85}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                  <span>Verification Accuracy</span>
                  <span>{stats.verificationAccuracy || 98}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.verificationAccuracy || 98}%` }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Tasks Summary */}
          <Card className="border-none bg-amber-50 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-[#002f37] uppercase tracking-widest">Task Queue</h3>
              <ClipboardList className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-[#002f37]">{tasks.filter(t => t.status !== 'done').length}</div>
              <div className="text-[10px] font-bold text-[#002f37]/60 uppercase leading-tight">Pending Tasks<br/>Requires Action</div>
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 w-full justify-between h-9 text-[10px] font-black uppercase text-amber-900 bg-amber-200/30 hover:bg-amber-200/50 rounded-xl px-4"
                onClick={() => navigate('/dashboard/agent?tab=tasks')}
            >
              View Full Registry <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
