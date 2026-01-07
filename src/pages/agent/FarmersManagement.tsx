import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Search, Filter, CheckCircle2, NotebookPen, Plus, Eye, Edit } from 'lucide-react';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  inactive: 'bg-slate-500/10 text-slate-600'
};

import api from '@/utils/api';
import { toast } from 'sonner';

const FarmersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await api.get('/farmers');
        setFarmers(res.data);
      } catch (err) {
        toast.error('Failed to load farmers');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const handleViewFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setViewModalOpen(true);
  };

  const handleEditFarmer = async (farmer: any) => {
    try {
      // Fetch full farmer data including Ghana card images
      const res = await api.get(`/farmers/${farmer._id}`);
      setSelectedFarmer(res.data);
      setEditModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching farmer data:', error);
      toast.error('Failed to load farmer data. Using available data.');
      // Fallback to available data if fetch fails
      setSelectedFarmer(farmer);
      setEditModalOpen(true);
    }
  };

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const searchValue = farmerSearch.toLowerCase();
      const matchesSearch =
        farmer.name?.toLowerCase().includes(searchValue) ||
        (farmer.region && farmer.region.toLowerCase().includes(searchValue)) ||
        (farmer.community && farmer.community.toLowerCase().includes(searchValue));
      const matchesStatus =
        farmerStatusFilter === 'all' ? true : farmer.status === farmerStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, farmerSearch, farmerStatusFilter]);

  const headerActions = null;

  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const inputClass = darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-400' : '';
  const selectTriggerClass = darkMode ? 'bg-[#002f37] border-gray-600 text-white' : '';
  const selectContentClass = darkMode ? 'bg-[#002f37] border-gray-600' : '';
  const selectItemClass = darkMode ? 'text-white hover:bg-gray-800' : '';
  const tableHeaderClass = 'bg-[#1db954] text-white border-[#1db954]';
  const tableRowClass = darkMode ? 'border-b border-gray-700 hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <AgentLayout
      activeSection="farmers-management"
      title="Farmers Management"
      headerActions={headerActions}
    >
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
                onChange={(event) => setFarmerSearch(event.target.value)}
                className={`pl-9 ${inputClass}`}
              />
            </div>
            <Select value={farmerStatusFilter} onValueChange={(value) => setFarmerStatusFilter(value as typeof farmerStatusFilter)}>
              <SelectTrigger className={`w-full sm:w-56 ${selectTriggerClass}`}>
                <Filter className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="all" className={selectItemClass}>All Farmers</SelectItem>
                <SelectItem value="active" className={selectItemClass}>Active</SelectItem>
                <SelectItem value="pending" className={selectItemClass}>Pending Verification</SelectItem>
                <SelectItem value="inactive" className={selectItemClass}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderClass}>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Farmer</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Region</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Community</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Farm Type</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Status</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Investment Status</TableHead>
                  <TableHead className="text-white uppercase whitespace-nowrap font-bold">Last Updated</TableHead>
                  <TableHead className="text-right text-white uppercase whitespace-nowrap font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer) => (
                  <TableRow key={farmer._id} className={tableRowClass}>
                    <TableCell className={tableCellClass}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-white/20">
                          {farmer.profilePicture ? (
                            <AvatarImage src={farmer.profilePicture} alt={farmer.name} className="object-cover" />
                          ) : (
                            <AvatarFallback className={`${darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
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
                      <Badge className={`capitalize ${statusStyles[farmer.status]}`}>
                        {farmer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                        {farmer.investmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>{new Date(farmer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={darkMode ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'}
                          onClick={() => handleViewFarmer(farmer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={darkMode ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'}
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
        onSuccess={() => {
          // Re-fetch data on success
          const fetchFarmers = async () => {
            try {
              const res = await api.get('/farmers');
              setFarmers(res.data);
            } catch (err) {
              toast.error('Failed to update farmers list');
            }
          };
          fetchFarmers();
        }}
      />
    </AgentLayout>
  );
};

export default FarmersManagement;

