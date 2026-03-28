import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, FileText, ClipboardList, Activity, Plus } from 'lucide-react';

interface VisitsTabProps {
  activities: any[];
  setIsUploadReportModalOpen: (val: boolean) => void;
}

const VisitsTab: React.FC<VisitsTabProps> = ({
  activities = [],
  setIsUploadReportModalOpen
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card className="lg:col-span-2 xl:col-span-2 border-none bg-white shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#002f37]">Visit Log & History</CardTitle>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complete history of field audits</p>
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
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-[#002f37] transition-all">
                      <FileText className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-[#002f37]">{report.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full">{new Date(report.createdAt).toLocaleDateString('en-GB')}</span>
                        <span className="text-[9px] font-black text-[#065f46] uppercase tracking-widest">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="h-10 text-[10px] font-black tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl px-6">
                    VIEW PDF
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No reports archived yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-[#065f46] text-white border-none shadow-xl rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Activity className="h-24 w-24 -rotate-12" />
          </div>
          <h3 className="font-black text-xl mb-2">Ready for a Visit?</h3>
          <p className="text-[11px] font-bold text-white/70 leading-relaxed mb-8 uppercase tracking-wider">
            Generate instant field audits with AI-powered diagnostics.
          </p>
          <Button
            className="w-full bg-[#002f37] text-white hover:bg-[#003c47] font-black py-7 rounded-2xl shadow-xl transition-all"
            onClick={() => setIsUploadReportModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-1" /> START NEW AUDIT
          </Button>
        </Card>

        <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-[#002f37]">Weekly Progress</h3>
            <span className="text-[10px] font-black text-emerald-600">80%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#065f46]" style={{ width: '80%' }}></div>
          </div>
          <p className="text-[9px] font-bold text-gray-400 italic">2 audits remaining for your weekly goal.</p>
        </Card>
      </div>
    </div>
  );
};

export default VisitsTab;
