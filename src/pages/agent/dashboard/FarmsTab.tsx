import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Filter, TrendingUp, Users, ClipboardList } from 'lucide-react';

interface FarmsTabProps {
  filteredFarms: any[];
  farmerSearch: string;
  setFarmerSearch: (val: string) => void;
  handleViewFarmer: (farmer: any) => void;
  handleLogVisit: (farmer: any) => void;
}

const FarmsTab: React.FC<FarmsTabProps> = ({
  filteredFarms = [],
  farmerSearch,
  setFarmerSearch,
  handleViewFarmer,
  handleLogVisit
}) => {
  return (
    <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50">
        <div>
          <CardTitle className="text-lg font-black text-[#002f37]">Grower Network Overview</CardTitle>
          <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Real-time health & productivity monitoring
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search farms..."
              className="pl-10 border-none bg-gray-50 rounded-xl focus:ring-[#065f46]"
              value={farmerSearch}
              onChange={(e) => setFarmerSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-[10px] font-black tracking-widest text-[#002f37] hover:bg-gray-100">
              <Filter className="h-4 w-4 mr-2" /> FILTER
            </Button>
            <Button variant="ghost" className="text-[10px] font-black tracking-widest text-[#002f37] hover:bg-gray-100">
              <TrendingUp className="h-4 w-4 mr-2" /> SORT
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#065f46]">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 px-6">Farm Information</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 text-center">Health Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4">Next Visit</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white py-4 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFarms.map((farm: any) => (
                <TableRow key={farm._id} className="hover:bg-gray-50 transition-colors group">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 overflow-hidden shadow-sm">
                        <img src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} alt={farm.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[#002f37] mb-0.5">{farm.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{farm.farmer?.name || 'Assigned Grower'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col items-center gap-1.5 px-4 w-32 mx-auto">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] font-black text-[#002f37]">85%</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Health</span>
                      </div>
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#065f46]" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <p className="text-[11px] font-black text-[#002f37] mb-0.5">{farm.nextVisit || 'TBD'}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Scheduled</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 rounded-lg text-gray-400 hover:bg-[#002f37] hover:text-white transition-all shadow-sm flex items-center gap-2"
                        onClick={() => handleViewFarmer(farm.farmer)}
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                      </Button>
                      <Button
                        className="bg-[#065f46] hover:bg-[#002f37] text-white h-8 text-[9px] font-black rounded-lg px-4 transition-all shadow-lg shadow-[#065f46]/20 uppercase tracking-widest border-none flex items-center gap-2"
                        onClick={() => handleLogVisit(farm.farmer)}
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        Start Visit
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
  );
};

export default FarmsTab;
