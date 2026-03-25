import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Eye, Edit, MapPin } from 'lucide-react';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import { useAuth } from '@/contexts/AuthContext';
import { GHANA_REGIONS, GHANA_COMMUNITIES } from '@/data/ghanaRegions';
import api from '@/utils/api';
import { toast } from 'sonner';

const statusStyles: Record<string, string> = {
  active: 'bg-[#065f46]/10 text-[#065f46]',
  pending: 'bg-[#065f46]/10 text-[#065f46]',
  inactive: 'bg-slate-500/10 text-slate-600'
};

const FarmersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const queryClient = useQueryClient();

  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // React Query — same key as DisputeManagement & AddFarmerModal invalidation
  const { data: farmersData = [], isLoading: loading } = useQuery({
    queryKey: ['agentFarmers'],
    queryFn: async () => {
      const res = await api.get('/farmers');
      return Array.isArray(res.data) ? res.data : (res.data.data || []);
    },
    staleTime: 30_000,
  });

  const handleViewFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setViewModalOpen(true);
  };

  const handleEditFarmer = async (farmer: any) => {
    try {
      const res = await api.get(`/farmers/${farmer._id}`);
      setSelectedFarmer(res.data);
      setEditModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching farmer data:', error);
      toast.error('Failed to load farmer data. Using available data.');
      setSelectedFarmer(farmer);
      setEditModalOpen(true);
    }
  };

  // Invalidate all farmer-related caches on add/edit success
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
    queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
  };

  const filteredFarmers = useMemo(() => {
    return farmersData.filter((farmer: any) => {
      const searchValue = farmerSearch.toLowerCase();
      const matchesSearch =
        farmer.name?.toLowerCase().includes(searchValue) ||
        (farmer.contact && farmer.contact.includes(searchValue)) ||
        (farmer.district && farmer.district.toLowerCase().includes(searchValue)) ||
        (farmer.community && farmer.community.toLowerCase().includes(searchValue));
      const effectiveRegion = agent?.region || 'Ashanti Region';
      const matchesRegion = !effectiveRegion || 
        farmer.region?.toLowerCase().includes(effectiveRegion.toLowerCase().replace(' region', '')) ||
        effectiveRegion.toLowerCase().includes(farmer.region?.toLowerCase().replace(' region', ''));
      const matchesDistrict = selectedDistrict === 'all' ? true : farmer.district === selectedDistrict;
      const matchesCommunity = selectedCommunity === 'all' ? true : farmer.community === selectedCommunity;
      const matchesStatus = farmerStatusFilter === 'all' ? true : farmer.status === farmerStatusFilter;
      return matchesSearch && matchesRegion && matchesDistrict && matchesCommunity && matchesStatus;
    });
  }, [farmersData, farmerSearch, selectedDistrict, selectedCommunity, farmerStatusFilter, agent?.region]);

  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const inputClass = darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-400' : '';
  const selectTriggerClass = darkMode ? 'bg-[#002f37] border-gray-600 text-white' : '';
  const selectContentClass = darkMode ? 'bg-[#002f37] border-gray-600' : '';
  const selectItemClass = darkMode ? 'text-white hover:bg-gray-800' : '';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout activeSection="farmers-management" title="Farmers Management">
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className={`section-title ${titleClass}`}>Grower Directory</CardTitle>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
              <Input
                placeholder="Search by name, region, or community"
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                className={`pl-9 ${inputClass}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity('all'); }}>
                <SelectTrigger className={`w-full sm:w-40 ${selectTriggerClass}`}>
                  <MapPin className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all" className={selectItemClass}>All Districts</SelectItem>
                  {GHANA_REGIONS[agent?.region || 'Ashanti Region']?.map(d => (
                    <SelectItem key={d} value={d} className={selectItemClass}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className={`w-full sm:w-40 ${selectTriggerClass}`}>
                  <Filter className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all" className={selectItemClass}>All Communities</SelectItem>
                  {selectedDistrict !== 'all' && GHANA_COMMUNITIES[selectedDistrict]?.map(c => (
                    <SelectItem key={c} value={c} className={selectItemClass}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={farmerStatusFilter} onValueChange={(v) => setFarmerStatusFilter(v as typeof farmerStatusFilter)}>
                <SelectTrigger className={`w-full sm:w-48 ${selectTriggerClass}`}>
                  <Filter className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all" className={selectItemClass}>All Farmers</SelectItem>
                  <SelectItem value="active" className={selectItemClass}>Active</SelectItem>
                  <SelectItem value="pending" className={selectItemClass}>Pending Verification</SelectItem>
                  <SelectItem value="inactive" className={selectItemClass}>Inactive</SelectItem>
                </SelectContent>
              </Select>

              <AddFarmerModal
                trigger={
                  <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-bold h-10 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 whitespace-nowrap border-none">
                    <Plus className="h-4 w-4" />
                    <span>Add Grower</span>
                  </Button>
                }
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#065f46]">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farmer</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Region</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Community</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farm Type</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Status</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Investment Status</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Last Updated</TableHead>
                  <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-400">Loading farmers...</TableCell>
                  </TableRow>
                ) : filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-400">No farmers found</TableCell>
                  </TableRow>
                ) : filteredFarmers.map((farmer: any) => (
                  <TableRow key={farmer._id} className={tableRowClass}>
                    <TableCell className={tableCellClass}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-white/20">
                          {farmer.profilePicture ? (
                            <AvatarImage src={farmer.profilePicture} alt={farmer.name} className="object-cover" />
                          ) : (
                            <AvatarFallback className={`${darkMode ? 'bg-[#065f46]/20 text-[#065f46]' : 'bg-[#065f46]/10 text-[#065f46]'}`}>
                              {farmer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium">{farmer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className={tableCellClass}>{farmer.region}</TableCell>
                    <TableCell className={tableCellClass}>{farmer.community}</TableCell>
                    <TableCell className={tableCellClass}>{farmer.farmType}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${statusStyles[farmer.status]}`}>{farmer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={darkMode ? 'bg-[#065f46]/20 text-[#065f46]' : 'bg-[#065f46]/10 text-[#065f46]'}>
                        {farmer.investmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>{new Date(farmer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={darkMode ? 'text-gray-400 hover:text-[#065f46] hover:bg-[#065f46]/10' : 'text-gray-500 hover:text-[#065f46] hover:bg-[#065f46]/10'}
                          onClick={() => handleViewFarmer(farmer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={darkMode ? 'text-[#065f46] hover:text-[#065f46] hover:bg-[#065f46]/10' : 'text-[#065f46] hover:text-[#065f46] hover:bg-[#065f46]/10'}
                          onClick={() => handleEditFarmer(farmer)}
                        >
                          <Edit className="h-4 w-4" />
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

      <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
      <AddFarmerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        farmer={selectedFarmer}
        isEditMode={true}
        onSuccess={handleSuccess}
      />
    </AgentLayout>
  );
};

export default FarmersManagement;
