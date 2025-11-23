import React from 'react';
import AgentLayout from './AgentLayout';
import { agentDisputes } from './agent-data';
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
import { Plus } from 'lucide-react';

const statusStyles: Record<string, string> = {
  Ongoing: 'bg-orange-500/10 text-orange-600',
  Resolved: 'bg-emerald-500/10 text-emerald-600',
  'Under Review': 'bg-amber-500/10 text-amber-600'
};

const DisputeManagement: React.FC = () => {
  const { darkMode } = useDarkMode();
  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const tableHeaderClass = darkMode ? 'bg-[#0f3a41] text-gray-100' : 'bg-rose-50';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout
      activeSection="dispute-management"
      title="Dispute Management"
      subtitle="Log new disputes, collaborate on resolutions, and keep stakeholders informed."
      headerActions={
        <Button className="bg-rose-600 hover:bg-rose-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Dispute
        </Button>
      }
    >
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader>
          <CardTitle className={`text-xl ${titleClass}`}>Dispute Tracker</CardTitle>
          <CardDescription className={descClass}>Monitor resolution progress and document follow-up actions for each case.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderClass}>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>ID</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Parties</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Type</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Date Logged</TableHead>
                  <TableHead className={darkMode ? 'text-gray-100' : ''}>Status</TableHead>
                  <TableHead className={`text-right ${darkMode ? 'text-gray-100' : ''}`}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentDisputes.map((dispute) => (
                  <TableRow key={dispute.id} className={tableRowClass}>
                    <TableCell className={`font-medium ${tableCellClass}`}>{dispute.id}</TableCell>
                    <TableCell className={tableCellClass}>{dispute.parties}</TableCell>
                    <TableCell className={tableCellClass}>{dispute.type}</TableCell>
                    <TableCell className={tableCellClass}>{dispute.logged}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[dispute.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'text-emerald-700 hover:text-emerald-800'}>
                        View Details
                      </Button>
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

export default DisputeManagement;

