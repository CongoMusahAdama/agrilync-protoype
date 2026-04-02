import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, FileText, ClipboardList, Activity, Plus } from 'lucide-react';

interface VisitsTabProps {
  activities: any[];
  stats: any;
  setIsUploadReportModalOpen: (val: boolean) => void;
}

const VisitsTab: React.FC<VisitsTabProps> = ({
  activities = [],
  stats = {},
  setIsUploadReportModalOpen
}) => {
  // Compute mission statistics
  const reportCount = stats?.reportsThisMonth || 0;
  const reportGoal = 15;
  const missionProgress = Math.min(Math.round((reportCount / reportGoal) * 100), 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card className="lg:col-span-2 xl:col-span-2 border-none bg-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#002f37] normal-case">Visit log & history</CardTitle>
            <p className="text-[10px] font-bold text-gray-400 normal-case">Complete history of your field missions</p>
          </div>
          <div className="p-2 bg-[#065f46]/10 rounded-xl">
            <ClipboardCheck className="h-5 w-5 text-[#065f46]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {activities.filter((a: any) => a.type === 'report').length > 0 ? (
              activities.filter((a: any) => a.type === 'report').map((report: any) => (
                <div key={report._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-[#002f37] transition-all shrink-0">
                      <FileText className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-[#002f37] normal-case">{report.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{new Date(report.createdAt).toLocaleDateString('en-GB')}</span>
                        <span className="text-[9px] font-black text-[#065f46] tracking-widest">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="h-9 text-[10px] font-black tracking-widest text-[#002f37] border-gray-100 hover:bg-gray-50 rounded-xl px-4 px-6 md:px-8 shrink-0 normal-case">
                    View log
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-400 normal-case">No mission logs archived yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-[#065f46] text-white border-none shadow-xl rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute inset-0 z-0 opacity-10">
              <img src="/metric2.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-2xl mb-2 normal-case leading-tight">Ready for a field mission?</h3>
            <p className="text-[11px] font-bold text-white/70 leading-relaxed mb-8 normal-case">
              Generate instant digital logs and grower audits in seconds.
            </p>
            <Button
              className="w-full bg-[#7ede56] text-[#002f37] hover:bg-[#a8f88c] font-black py-7 rounded-2xl shadow-xl transition-all normal-case border-none"
              onClick={() => setIsUploadReportModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-1" /> Start new audit
            </Button>
          </div>
        </Card>

        <Card className="border-none bg-white shadow-xl rounded-[1.5rem] overflow-hidden p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[12px] text-[#002f37] normal-case">Mission progress</h3>
            <span className="text-[12px] font-black text-[#065f46] tabular-nums">{missionProgress}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#065f46] rounded-full transition-all duration-1000" style={{ width: `${missionProgress}%` }}></div>
          </div>
          <p className="text-[10px] font-medium text-gray-400 italic normal-case">
            {reportCount >= reportGoal 
              ? "Target achieved! Great work this month." 
              : `${reportGoal - reportCount} more audits to reach your monthly goal.`}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default VisitsTab;
