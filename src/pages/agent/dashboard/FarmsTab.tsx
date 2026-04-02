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

        {/* MOBILE: Card Stack */}
        <div className="md:hidden divide-y divide-gray-50">
          {filteredFarms.length > 0 ? (
            filteredFarms.map((farm: any) => (
              <div key={farm._id} className="p-5 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm shrink-0">
                    <img 
                      src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} 
                      alt={farm.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-black text-[#002f37] truncate leading-tight">{farm.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">{farm.farmer?.name || 'Assigned Grower'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Mission status</p>
                    <div className="flex items-center gap-2">
                       <span className={`h-2 w-2 rounded-full ${farm.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                       <span className="text-[12px] font-black text-[#002f37] normal-case">{farm.status || 'Active'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Last visit</p>
                    <p className="text-[12px] font-bold text-[#002f37] normal-case">{farm.lastVisit || 'No visit yet'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl border-gray-200 text-[#002f37] font-black text-[10px] uppercase tracking-widest gap-2"
                    onClick={() => handleViewFarmer(farm.farmer)}
                  >
                    <Users className="h-4 w-4" /> Profile
                  </Button>
                  <Button
                    className="flex-1 h-11 rounded-xl bg-[#065f46] hover:bg-[#002f37] text-white font-black text-[10px] uppercase tracking-widest gap-2 border-none shadow-lg shadow-[#065f46]/20"
                    onClick={() => handleLogVisit(farm.farmer)}
                  >
                    <ClipboardList className="h-4 w-4" /> Start Visit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No farms found</p>
            </div>
          )}
        </div>

        {/* DESKTOP: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#002f37]">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-2 px-6 border-r border-white/10">Farm Information</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-2 text-center border-r border-white/10">Operational Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-2 border-r border-white/10">Next Visit</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white py-2 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#002f37]/10">
              {filteredFarms.map((farm: any) => (
                <TableRow key={farm._id} className="hover:bg-[#002f37]/5 transition-colors group">
                  <TableCell className="py-2.5 px-6 border-r border-[#002f37]/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 overflow-hidden shadow-sm">
                        <img src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} alt={farm.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[#002f37] mb-0.5 normal-case">{farm.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 normal-case">{farm.farmer?.name || 'Grower not assigned'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 border-r border-[#002f37]/10">
                    <div className="flex flex-col items-center gap-1.5 px-4 w-32 mx-auto">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${farm.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[11px] font-black text-[#002f37] normal-case">{farm.status || 'Active'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 border-r border-[#002f37]/10">
                    <div className="flex flex-col">
                      <p className="text-[11px] font-black text-[#002f37] mb-0.5">{farm.nextVisit || 'TBD'}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Scheduled</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2.5 px-6">
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
