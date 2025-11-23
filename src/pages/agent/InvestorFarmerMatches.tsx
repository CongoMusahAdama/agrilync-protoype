import React from 'react';
import AgentLayout from './AgentLayout';
import { agentMatches } from './agent-data';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { FileText, Flag } from 'lucide-react';

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-600',
  'Pending Funding': 'bg-amber-500/10 text-amber-600',
  Completed: 'bg-[#6d28d9]/10 text-[#6d28d9]',
  'Under Review': 'bg-orange-500/10 text-orange-600'
};

const InvestorFarmerMatches: React.FC = () => {
  const { darkMode } = useDarkMode();
  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const tableHeaderClass = darkMode ? 'bg-[#0f3a41] text-gray-100' : 'bg-gray-50';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout
      activeSection="investor-farmer-matches"
      title="Investor-Farmer Matches"
      subtitle="Provide accountability updates, escalate risks, and keep investors informed."
    >
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader>
          <CardTitle className={`text-xl ${titleClass}`}>Active Matches</CardTitle>
          <CardDescription className={descClass}>Use this workspace to manage investor communications and track project milestones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderClass}>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Investor</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Farmer</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Farm Type</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Match Date</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Investment Value</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Status</TableHead>
                  <TableHead className={`text-right ${darkMode ? 'text-gray-100' : ''}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentMatches.map((match) => (
                  <TableRow key={`${match.investor}-${match.farmer}`} className={tableRowClass}>
                    <TableCell className={`font-medium ${tableCellClass}`}>{match.investor}</TableCell>
                    <TableCell className={tableCellClass}>{match.farmer}</TableCell>
                    <TableCell className={tableCellClass}>{match.farmType}</TableCell>
                    <TableCell className={tableCellClass}>{match.matchDate}</TableCell>
                    <TableCell className={tableCellClass}>{match.value}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[match.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                        {match.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                          <FileText className="mr-1 h-4 w-4" />
                          Send Update
                        </Button>
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-rose-400 hover:bg-[#0d3036] hover:text-rose-300' : 'text-rose-600 hover:text-rose-700'}>
                          <Flag className="mr-1 h-4 w-4" />
                          Flag Issue
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

export default InvestorFarmerMatches;

