import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart3 } from 'lucide-react';

interface ReportsTabProps {
  sectionCardClass: string;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ sectionCardClass }) => {
  return (
    <Card className={`${sectionCardClass} border-none shadow-xl rounded-2xl overflow-hidden min-h-[500px] flex flex-col`}>
      <CardHeader className="bg-white border-b border-gray-50">
        <CardTitle className="text-xl font-black text-[#002f37]">Quick Reports Engine</CardTitle>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generate and download standard templates</p>
      </CardHeader>
      <CardContent className="p-8 flex-1 grid md:grid-cols-2 gap-6 bg-gray-50/50">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#065f46]/30 cursor-pointer">
          <CardContent className="p-6 flex flex-col h-full bg-white">
            <div className="h-12 w-12 rounded-2xl bg-[#065f46]/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-[#065f46]" />
            </div>
            <h4 className="text-sm font-black text-[#002f37] mb-2 uppercase tracking-wide">Daily Field Report</h4>
            <p className="text-xs text-gray-500 mb-6 flex-1">Standard summary of all field operations, visits, and challenges recorded today.</p>
            <Button className="w-full bg-[#002f37] hover:bg-[#002f37]/90 text-white font-bold rounded-xl text-xs flex items-center gap-2">
              <Download className="h-4 w-4" /> GENERATE REPORT
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#065f46]/30 cursor-pointer">
          <CardContent className="p-6 flex flex-col h-full bg-white">
            <div className="h-12 w-12 rounded-2xl bg-[#065f46]/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-[#065f46]" />
            </div>
            <h4 className="text-sm font-black text-[#002f37] mb-2 uppercase tracking-wide">Weekly Performance KPI</h4>
            <p className="text-xs text-gray-500 mb-6 flex-1">Aggregated statistics on verification rates, farm onboarding, and agent productivity.</p>
            <Button className="w-full bg-[#002f37] hover:bg-[#002f37]/90 text-white font-bold rounded-xl text-xs flex items-center gap-2">
              <Download className="h-4 w-4" /> GENERATE REPORT
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;
