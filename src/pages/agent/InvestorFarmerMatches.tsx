import React, { useState } from 'react';
import { 
  Handshake, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
  FileText,
  DollarSign,
  Briefcase,
  Eye
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import AgentLayout from './AgentLayout';
import { agentMatches } from './agent-data';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const InvestorFarmerMatches: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMatches = agentMatches.filter(match => {
    const matchesSearch = match.farmer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         match.investor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || match.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending approval':
      case 'pending funding':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const stats = [
    { label: 'Total Matches', value: agentMatches.length, icon: Handshake, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approval', value: agentMatches.filter(m => m.approvalStatus === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Funding', value: agentMatches.filter(m => m.status === 'Active').length, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Value', value: '450K', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <AgentLayout 
      activeSection="investor-matches" 
      title="Investor-Farmer Matches" 
      subtitle="Facilitate and oversee partnerships between your farmers and investors"
    >
      <div className="space-y-8 animate-fade-in">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-center justify-between">
                <div className={`p-3 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[#002f37] leading-none">
                    {typeof stat.value === 'number' ? <CountUp end={stat.value} duration={1000} /> : stat.value}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by farmer or investor name..." 
                className="pl-10 h-12 border-none bg-gray-50 rounded-xl focus:ring-[#065f46]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className={statusFilter === 'all' ? 'bg-[#065f46] hover:bg-[#065f46]/90' : 'border-gray-200'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'pending approval' ? 'default' : 'outline'}
                className={statusFilter === 'pending approval' ? 'bg-[#065f46] hover:bg-[#065f46]/90' : 'border-gray-200'}
                onClick={() => setStatusFilter('pending approval')}
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                className={statusFilter === 'active' ? 'bg-[#065f46] hover:bg-[#065f46]/90' : 'border-gray-200'}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </Button>
            </div>
          </div>
        </Card>

        {/* Matches Table */}
        <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-[#002f37]">Active Partnership Portfolio</CardTitle>
                <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking verification & legal fulfillment status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#065f46]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-4 px-6 font-black text-[10px] uppercase tracking-widest text-white">Match ID</TableHead>
                  <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-white">Farmer</TableHead>
                  <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-white">Investor</TableHead>
                  <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-white">Value</TableHead>
                  <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-white">Verification</TableHead>
                  <TableHead className="py-4 font-black text-[10px] uppercase tracking-widest text-white">Status</TableHead>
                  <TableHead className="py-4 px-6 text-right font-black text-[10px] uppercase tracking-widest text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.map((match) => (
                  <TableRow key={match.id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-4 px-6 text-[11px] font-black text-gray-400 font-mono italic">{match.id}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-[#002f37]">{match.farmer}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{match.farmType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        <span className="text-[13px] font-bold text-gray-700">{match.investor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-bold text-[13px] text-emerald-700">{match.value}</TableCell>
                    <TableCell className="py-4 text-[10px]">
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className={`border-none ${match.documents.farmerSignature ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}>
                          FMR
                        </Badge>
                        <Badge variant="outline" className={`border-none ${match.documents.investorSignature ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}>
                          INV
                        </Badge>
                        <Badge variant="outline" className={`border-none ${match.documents.agentApproval ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}>
                          AGT
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 ${getStatusStyle(match.status)}`}>
                        {match.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {match.approvalStatus === 'pending' ? (
                          <Button 
                            className="bg-[#002f37] hover:bg-[#065f46] text-white text-[10px] font-black h-8 px-4 rounded-lg uppercase tracking-wider shadow-lg shadow-[#002f37]/10 transition-all border-none flex items-center gap-2"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            VERIFY NOW
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legal Disclaimer / Notice */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[12px] font-black text-amber-800 uppercase tracking-wide">Fiduciary Responsibility</h4>
            <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
              As a field agent, your verification signature confirms that the farm assets and land titles claimed by the farmer have been physically inspected and matched with the investor's requirements. False verification may lead to account suspension.
            </p>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
};

export default InvestorFarmerMatches;
