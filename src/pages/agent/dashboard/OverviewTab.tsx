import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, GraduationCap, ClipboardList, UserCheck, Info, TrendingUp, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OverviewTabProps {
  farms: any[];
  activities: any[];
  darkMode: boolean;
  agent: any;
  handleLogVisit: (farmer: any) => void;
  sectionCardClass: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  farms = [],
  activities = [],
  darkMode,
  agent,
  handleLogVisit,
  sectionCardClass
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Today's Priority */}
      <Card className="lg:col-span-2 border-none bg-white shadow-xl rounded-2xl">
        <CardHeader className="hidden md:flex pb-3 border-b border-gray-50 flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#002f37]">Active Field Missions</CardTitle>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks for you today</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {farms.slice(0, 4).map((farm: any) => (
              <div key={farm._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <img src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} alt={farm.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-[#002f37] mb-0.5">{farm.name}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{farm.region || 'Assigned Region'}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg group-hover:bg-[#002f37] group-hover:text-white transition-colors"
                  onClick={() => handleLogVisit(farm.farmer)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Farm Activity Timeline */}
      <Card className={`${sectionCardClass} transition-colors min-h-[400px]`}>
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
            <CardTitle className={`section-title ${darkMode ? 'text-gray-100' : ''}`}>Farm Updates</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-[400px] overflow-y-auto custom-scrollbar">
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
            {activities.filter((a: any) => a.type !== 'match' && a.type !== 'dispute').map((activity: any, index: number) => (
              <div key={activity._id || index} className="relative pl-8 group">
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full z-10 flex items-center justify-center border-4 ${darkMode ? 'bg-[#0b2528] border-gray-800' : 'bg-white border-gray-100'}`}>
                  {activity.type === 'training' ? <GraduationCap className="h-2.5 w-2.5 text-[#065f46]" /> :
                    activity.type === 'report' ? <ClipboardList className="h-2.5 w-2.5 text-blue-500" /> :
                      activity.type === 'verification' ? <UserCheck className="h-2.5 w-2.5 text-[#065f46]" /> :
                        <Info className="h-2.5 w-2.5 text-blue-400" />}
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                  <p className={`text-sm mt-0.5 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900 group-hover:text-[#065f46] transition-colors'}`}>
                    {activity.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-none bg-[#002f37] text-white rounded-2xl shadow-xl overflow-hidden relative p-8 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <TrendingUp className="h-24 w-24" />
          </div>
          <div className="mb-6 relative z-10">
            <p className="text-[10px] font-black text-[#065f46] uppercase tracking-widest mb-1.5">Your Performance Summary</p>
            <h3 className="text-3xl font-black">Elite Agent</h3>
          </div>
          <div className="space-y-4 mb-10 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-bold text-gray-400">Progress to Gold Level</span>
              <span className="text-base font-black">85%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#065f46]" style={{ width: '85%' }}></div>
            </div>
          </div>
          <Button
            onClick={() => {
              navigate('/dashboard/agent/performance');
            }}
            variant="ghost"
            className="w-full justify-between text-[10px] font-black tracking-widest text-[#065f46] p-0 hover:bg-transparent hover:text-white transition-colors uppercase group/btn border-none"
          >
            VIEW FULL PERFORMANCE <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Card>

        <Card className="border-none bg-white shadow-xl rounded-2xl">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-sm font-black text-[#002f37]">Support Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {[1, 2].map(i => (
              <div key={i} className="p-4 border-b border-gray-50 last:border-none flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#065f46]/10 flex items-center justify-center text-[#065f46]">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#002f37]">Issue #{4512 + i}</p>
                    <p className="text-[9px] font-bold text-gray-400">Processing • 2h ago</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#002f37] transition-colors" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
