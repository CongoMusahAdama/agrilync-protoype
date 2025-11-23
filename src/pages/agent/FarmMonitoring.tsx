import React, { useMemo, useState } from 'react';
import AgentLayout from './AgentLayout';
import { agentAssignedFarms } from './agent-data';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2 } from 'lucide-react';

const statusStyles: Record<string, string> = {
  verified: 'bg-emerald-500/10 text-emerald-600',
  scheduled: 'bg-amber-500/10 text-amber-600',
  'needs-attention': 'bg-rose-500/10 text-rose-600'
};

const FarmMonitoring: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [farmStatusFilter, setFarmStatusFilter] = useState<'all' | 'verified' | 'scheduled' | 'needs-attention'>('all');

  const filteredFarms = useMemo(() => {
    return agentAssignedFarms.filter((farm) => {
      if (farmStatusFilter === 'all') return true;
      return farm.status === farmStatusFilter;
    });
  }, [farmStatusFilter]);

  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const selectTriggerClass = darkMode ? 'bg-[#002f37] border-gray-600 text-white' : '';
  const selectContentClass = darkMode ? 'bg-[#002f37] border-gray-600' : '';
  const selectItemClass = darkMode ? 'text-white hover:bg-gray-800' : '';
  const tableHeaderClass = darkMode ? 'bg-[#0f3a41] text-gray-100' : 'bg-gray-50';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout
      activeSection="farm-monitoring"
      title="Farm Monitoring"
      subtitle="Plan field visits, verify farm status, and keep investor reports up to date."
    >
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className={`text-xl ${titleClass}`}>Visit Schedule & Reports</CardTitle>
            <CardDescription className={descClass}>Use filters to prioritise farms that need attention or verification.</CardDescription>
          </div>
          <Select value={farmStatusFilter} onValueChange={(value) => setFarmStatusFilter(value as typeof farmStatusFilter)}>
            <SelectTrigger className={`w-full sm:w-56 ${selectTriggerClass}`}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all" className={selectItemClass}>All Farms</SelectItem>
              <SelectItem value="verified" className={selectItemClass}>Verified</SelectItem>
              <SelectItem value="scheduled" className={selectItemClass}>Scheduled Visits</SelectItem>
              <SelectItem value="needs-attention" className={selectItemClass}>Needs Attention</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderClass}>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Farm ID</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Farmer</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Crop / Livestock</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Status</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Last Visit</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Next Visit</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Report</TableHead>
                  <TableHead className={`text-right ${darkMode ? 'text-gray-100' : ''}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarms.map((farm) => (
                  <TableRow key={farm.id} className={tableRowClass}>
                    <TableCell className={`font-medium ${tableCellClass}`}>{farm.id}</TableCell>
                    <TableCell className={tableCellClass}>{farm.farmer}</TableCell>
                    <TableCell className={tableCellClass}>{farm.crop}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${statusStyles[farm.status]}`}>
                        {farm.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>{farm.lastVisit}</TableCell>
                    <TableCell className={tableCellClass}>{farm.nextVisit}</TableCell>
                    <TableCell>
                      <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                        {farm.reportStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                          <FileText className="mr-1 h-4 w-4" />
                          Upload Report
                        </Button>
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-gray-300 hover:bg-[#0d3036] hover:text-white' : 'text-gray-600 hover:text-emerald-700'}>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Mark Verified
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AgentLayout>
  );
};

export default FarmMonitoring;

