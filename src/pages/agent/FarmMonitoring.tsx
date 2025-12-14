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
import { FileText, CheckCircle2, Eye, Calendar, Activity } from 'lucide-react';

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
  const tableHeaderClass = 'bg-[#1db954] text-white border-[#1db954]';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout
      activeSection="farm-monitoring"
      title="Farm Monitoring"
      subtitle="Plan field visits, verify farm status, and keep investor reports up to date."
    >
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          {/* Mobile Card List View */}
          <div className="block sm:hidden space-y-4">
            {filteredFarms.map((farm) => (
              <div key={farm.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-lg">{farm.farmerName}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{farm.name}</div>
                  </div>
                  <Badge className={`capitalize ${statusStyles[farm.status]}`}>
                    {farm.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
                  <div>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>ID</span>
                    <div className="font-medium">{farm.id}</div>
                  </div>
                  <div>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Crop</span>
                    <div className="font-medium">{farm.crop}</div>
                  </div>
                  <div>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Last Visit</span>
                    <div className="font-medium">{farm.lastVisit}</div>
                  </div>
                  <div>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Next Visit</span>
                    <div className="font-medium">{farm.nextVisit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-sm font-medium ${farm.reportStatus === 'Ready' ? 'text-green-500' : farm.reportStatus === 'Flagged' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {farm.reportStatus}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderClass}>
                  <TableHead className="text-white">Farm ID</TableHead>
                  <TableHead className="text-white">Farmer</TableHead>
                  <TableHead className="text-white">Crop</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Last Visit</TableHead>
                  <TableHead className="text-white">Next Visit</TableHead>
                  <TableHead className="text-white">Report</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarms.map((farm) => (
                  <TableRow key={farm.id} className={tableRowClass}>
                    <TableCell className={`font-medium ${tableCellClass}`}>{farm.id}</TableCell>
                    <TableCell className={tableCellClass}>{farm.farmerName}</TableCell>
                    <TableCell className={tableCellClass}>{farm.crop}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${statusStyles[farm.status]}`}>
                        {farm.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>{farm.lastVisit}</TableCell>
                    <TableCell className={tableCellClass}>{farm.nextVisit}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${farm.reportStatus === 'Ready' ? 'text-green-500' : farm.reportStatus === 'Flagged' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {farm.reportStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}>
                          <FileText className="h-4 w-4" />
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

