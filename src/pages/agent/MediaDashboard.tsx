import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  ImageIcon, 
  FileText, 
  Video, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  MoreVertical,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  FolderPlus,
  Folder,
  ArrowUpRight,
  HardDrive,
  Sprout,
  Cloud,
  RefreshCcw,
  MapPin
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import AgentLayout from './AgentLayout';
import CountUp from '@/components/CountUp';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import { GHANA_REGIONS, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';

const MediaDashboard: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'Photo', farm: '', album: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Album modal state
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  // Fetch Media Stats from Backend
  const { data: statsData, refetch: refreshStats } = useQuery({
    queryKey: ['mediaStats'],
    queryFn: async () => {
      const res = await api.get('/media/stats');
      return res.data;
    }
  });

  // Fetch Media Items from Backend with Search/Filter support
  const { data: mediaItems = [], isLoading: itemsLoading, refetch: refreshItems } = useQuery({
    queryKey: ['mediaItems', activeTab, searchQuery, selectedDistrict, selectedCommunity],
    queryFn: async () => {
      const res = await api.get('/media', {
        params: {
          type: activeTab === 'Albums' ? 'All' : activeTab,
          search: searchQuery,
          district: selectedDistrict,
          community: selectedCommunity
        }
      });
      return Array.isArray(res.data) ? res.data : (res.data.data || []);
    }
  });

  // Sync Mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/media/sync');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg || 'Sync completed!');
      refreshItems();
      refreshStats();
    },
    onError: () => {
      toast.error('Sync failed. Please check your connection.');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
      queryClient.invalidateQueries({ queryKey: ['mediaStats'] });
      toast.success('Media deleted successfully');
      setSelectedMedia(null);
    },
    onError: () => {
      toast.error('Failed to delete media');
    }
  });

  const handleOpenMedia = (item: any) => {
    const url = item.url;
    if (!url || url === 'album-placeholder') return;

    if (url.startsWith('data:')) {
      try {
        // Convert base64 to Blob to avoid browser URL length limits
        const parts = url.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        
        // Open the blob URL
        const win = window.open(blobUrl, '_blank');
        if (win) {
          win.focus();
          // Clean up the URL after a short delay (once the tab has likely loaded)
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } else {
          toast.error('Pop-up blocked. Please allow pop-ups for this site.');
        }
      } catch (err) {
        console.error('Error opening base64 media:', err);
        toast.error('Failed to open document. The file may be corrupted.');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  const handleDelete = async (item: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#065f46',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(item._id || item.id);
    }
  };

  const albums = useMemo(() => {
    const albumMap = new Map();
    (mediaItems || []).forEach((item: any) => {
      // Robustly identify album name - prioritize explicit album field
      const albumName = item.album || (item.name.startsWith('[Album] ') ? item.name.replace('[Album] ', '') : null);
      if (albumName) {
        if (!albumMap.has(albumName)) {
          albumMap.set(albumName, {
            name: albumName,
            count: 0,
            thumbnail: (item.url !== 'album-placeholder' && item.type === 'Photo') ? (item.thumbnail || item.url) : null,
            latest: item.createdAt || new Date().toISOString()
          });
        }
        const album = albumMap.get(albumName);
        
        // Count actual assets (excluding the album placeholder itself)
        if (item.url !== 'album-placeholder') {
            album.count++;
        }
        
        // Update thumbnail with latest actual photo
        const itemDate = new Date(item.createdAt || 0);
        const albumDate = new Date(album.latest || 0);
        
        if (item.url !== 'album-placeholder' && item.type === 'Photo' && (item.thumbnail || item.url)) {
            if (!album.thumbnail || itemDate >= albumDate) {
                album.thumbnail = item.thumbnail || item.url;
            }
        }
        
        if (itemDate > albumDate) {
            album.latest = item.createdAt;
        }
      }
    });
    return Array.from(albumMap.values());
  }, [mediaItems]);

  const filteredMedia = useMemo(() => {
    return (mediaItems || []).filter((item: any) => {
      // If we are currently browsing an album...
      if (currentAlbum) {
          // Hide all placeholders for the album itself...
          if (item.url === 'album-placeholder') return false;
          // Only show items that match this album name exactly (ignoring case)
          const albumName = item.album || item.name.replace('[Album] ', '');
          if (albumName.toLowerCase() !== currentAlbum.toLowerCase()) return false;
          return true;
      }

      const matchesTab = activeTab === 'All' || 
                         (activeTab === 'KYC Docs' ? item.type === 'KYC Doc' : 
                          activeTab === 'Harvests' ? item.type === 'Harvest' :
                          activeTab === 'Photos' ? (item.type === 'Photo' && !item.name.startsWith('[Album]')) :
                          activeTab === 'Videos' ? item.type === 'Video' : false);
      
      // If Albums tab is active, we handle it separately in the render
      if (activeTab === 'Albums') return false;

      const farmName = typeof item.farm === 'object' ? item.farm?.name : item.farm;
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(lowerQuery) || 
                            (farmName && String(farmName).toLowerCase().includes(lowerQuery)) ||
                            (item.album && item.album.toLowerCase().includes(lowerQuery));
      
      const effectiveRegion = (agent?.region || "Ashanti").toLowerCase().replace(' region', '').trim();
      const itemRegion = (item.region || "").toLowerCase().replace(' region', '').trim();
      
      // Lenient filtering: If item has no region set, we show it (it belongs to the agent who uploaded it)
      const matchesRegion = !itemRegion || !effectiveRegion || itemRegion === effectiveRegion;
      const matchesDistrict = selectedDistrict === 'all' || !item.district || item.district === selectedDistrict;
      const matchesCommunity = selectedCommunity === 'all' || !item.community || item.community === selectedCommunity;

      return matchesTab && matchesSearch && matchesRegion && matchesDistrict && matchesCommunity;
    });
  }, [mediaItems, activeTab, searchQuery, agent?.region, selectedDistrict, selectedCommunity, currentAlbum]);

  const stats = [
    { label: 'Total Files', value: statsData?.totalFiles || '0', icon: HardDrive, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Photos', value: statsData?.photos || '0', icon: ImageIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Documents', value: statsData?.documents || '0', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Storage Used', value: statsData?.storageUsed || '0.0 MB', icon: Upload, color: 'text-magenta', bg: 'bg-magenta/10' },
  ];

  const handleOptimize = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Optimizing storage and thumbnails...',
      success: 'Storage optimized by 15.4%. Thumbnails regenerated.',
      error: 'Optimization failed.'
    });
  };

  const handleSync = () => {
    syncMutation.mutate();
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/media', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
      queryClient.invalidateQueries({ queryKey: ['mediaStats'] });
      toast.success('File uploaded successfully!');
      setUploadOpen(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadForm({ name: '', type: 'Photo', farm: '', album: '' });
    },
    onError: () => toast.error('Upload failed. Please try again.')
  });

  // Album creation mutation (saves a placeholder media item tagged with album)
  const albumMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/media', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
      toast.success('Album created!');
      setAlbumOpen(false);
      setAlbumName('');
      setAlbumDesc('');
    },
    onError: () => toast.error('Failed to create album.')
  });

  const handleFileSelect = useCallback((file: File) => {
    setUploadFile(file);
    // Auto-detect type
    let autoType = 'Photo';
    if (file.type.startsWith('video/')) autoType = 'Video';
    else if (file.type === 'application/pdf' || file.type.includes('document')) autoType = 'KYC Doc';
    const sizeKB = file.size / 1024;
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
    setUploadForm(f => ({ ...f, name: f.name || file.name, type: autoType }));
    // Preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setUploadPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmitUpload = async () => {
    if (!uploadFile) { toast.error('Please select a file first'); return; }
    if (!uploadForm.name) { toast.error('Please enter a file name'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const sizeKB = uploadFile.size / 1024;
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
      uploadMutation.mutate({
        name: uploadForm.name,
        type: uploadForm.type,
        url: base64,
        thumbnail: uploadFile.type.startsWith('image/') ? base64 : undefined,
        size: sizeStr,
        format: uploadFile.name.split('.').pop()?.toUpperCase(),
        farm: uploadForm.farm || undefined,
        album: uploadForm.album || undefined,
        status: 'Synced',
        community: agent?.community,
        district: agent?.district,
        region: agent?.region
      });
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleCreateAlbum = () => {
    if (!albumName.trim()) { toast.error('Please enter an album name'); return; }
    albumMutation.mutate({
      name: `[Album] ${albumName}`,
      type: 'Photo',
      url: 'album-placeholder',
      album: albumName,
      size: '0 KB',
      status: 'Synced'
    });
  };

  const statusBadge = (status: string) => {
    const isSynced = status === 'Synced';
    return (
      <Badge className={`${isSynced ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} border-none flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider`}>
        {isSynced ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  const typeBadge = (type: string) => {
    const config: any = {
      'Photo': { icon: ImageIcon, color: 'bg-blue-100 text-blue-700' },
      'KYC Doc': { icon: FileText, color: 'bg-violet-100 text-violet-700' },
      'Video': { icon: Video, color: 'bg-rose-100 text-rose-700' },
      'Harvest': { icon: Sprout, color: 'bg-emerald-100 text-emerald-700' },
    };
    const { icon: Icon, color } = config[type] || { icon: FileText, color: 'bg-gray-100 text-gray-700' };
    return (
      <Badge className={`${color} border-none flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider`}>
        <Icon className="h-3 w-3" /> {type}
      </Badge>
    );
  };

  return (
    <AgentLayout 
      activeSection="media-gallery" 
      title="Media" 
      subtitle="Farm visit photos, field evidence, and uploaded documents"
    >
      <div className="space-y-8 animate-fade-in">
        
        {/* Top Header Section: Actions + Metrics (Non-sticky) */}
        <div className="space-y-6 pt-2">
          {/* Media Quick Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#002f37] tracking-tight">Media Library</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Centralized repository for all field telemetry</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button 
                className="bg-[#065f46] hover:bg-[#054d39] text-white font-black text-[12px] tracking-wider px-8 h-12 rounded-[1.2rem] shadow-xl shadow-[#065f46]/20 transition-all active:scale-95 border-none w-full sm:w-auto flex items-center justify-center"
                onClick={() => setUploadOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> UPLOAD FILES
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white font-black text-[12px] tracking-wider px-8 h-12 rounded-[1.2rem] transition-all bg-white w-full sm:w-auto flex items-center justify-center"
                onClick={() => setAlbumOpen(true)}
              >
                <FolderPlus className="mr-2 h-4 w-4" /> NEW ALBUM
              </Button>
            </div>
          </div>

          {/* Summary Stats Row - Optimized for Mobile (2 Columns) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => {
              const isFirst = i === 0;
              const bgClass = isFirst ? 'bg-[#065f46]' : 'bg-white';
              const iconColorClass = isFirst ? 'text-white' : stat.color.replace('bg-', 'text-');
              const textColorClass = isFirst ? 'text-white' : 'text-[#002f37]';
              const subtextColorClass = isFirst ? 'text-white/40' : 'text-gray-400';
              const iconBgClass = isFirst ? 'bg-white/10' : stat.color.replace('text-', 'bg-').concat('/10');
              
              return (
                <Card 
                  key={i} 
                  className={`${bgClass} rounded-2xl p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none`}
                >
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <stat.icon className={`h-20 w-20 sm:h-24 sm:w-24 ${iconColorClass} -rotate-12`} />
                  </div>

                  <div className="flex items-center justify-between mb-1 sm:mb-4">
                    <div className={`p-1.5 sm:p-2 ${iconBgClass} rounded-lg`}>
                      <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColorClass}`} />
                    </div>
                    <span className={`text-[8px] sm:text-[10px] font-black ${subtextColorClass} uppercase tracking-widest`}>
                      {isFirst ? 'LIFETIME' : 'ACTIVE'}
                    </span>
                  </div>

                  <div>
                    <p className={`text-[8px] sm:text-[10px] font-black ${isFirst ? 'text-white/60' : 'text-gray-500'} uppercase tracking-widest mb-0.5 sm:mb-1`}>{stat.label}</p>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <h3 className={`text-xl sm:text-4xl font-black ${textColorClass} leading-none`}>
                        {stat.label.includes('Storage') ? (
                          stat.value
                        ) : (
                          <CountUp end={parseInt(String(stat.value).replace(/,/g, '')) || 0} duration={1000} />
                        )}
                      </h3>
                      <span className={`text-[8px] sm:text-[10px] font-bold ${isFirst ? 'text-white/80' : 'text-gray-500'}`}>
                        {stat.label.includes('Files') ? (stat.label.includes('Photos') ? 'Photos' : 'Docs') : (stat.label.includes('Storage') ? '' : 'Files')}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Slim Sticky Filters Bar - Sticks to top of main container */}
        <div className="sticky top-[-1px] z-30 bg-white/95 backdrop-blur-md pt-2 pb-4 -mx-1 px-1 border-b border-gray-100 shadow-xl shadow-gray-200/5">
          <div className="bg-white/50 border border-gray-100/50 rounded-2xl overflow-hidden p-2 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-4 p-4 lg:p-2">
              <div className="flex-1 w-full lg:w-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-gray-100/50 p-1 rounded-xl w-full lg:w-max flex overflow-x-auto scrollbar-hide">
                    {['All', 'Photos', 'Videos', 'KYC Docs', 'Harvests', 'Albums'].map((tab) => (
                      <TabsTrigger 
                        key={tab} 
                        value={tab}
                        className="px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all data-[state=active]:bg-[#065f46] data-[state=active]:text-white data-[state=active]:shadow-md border-none"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search files or farms..." 
                    className="pl-10 h-11 border-none bg-gray-50 rounded-xl focus:ring-[#065f46] text-xs font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity('all'); }}>
                    <SelectTrigger className="h-11 w-full sm:w-40 border-none bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-500 shadow-none">
                      <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5" />
                        <SelectValue placeholder="District" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">All Districts</SelectItem>
                      {GHANA_REGIONS[getRegionKey(agent?.region)]?.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger className="h-11 w-full sm:w-40 border-none bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-500 shadow-none">
                      <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5" />
                        <SelectValue placeholder="Community" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="all">All Communities</SelectItem>
                      {selectedDistrict !== 'all' && GHANA_COMMUNITIES[selectedDistrict]?.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="ghost" className="h-11 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-none shadow-none">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <h3 className="text-[11px] font-black text-[#002f37] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#065f46]"></div>
                Gallery Preview
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredMedia.length} assets found</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Gallery Grid Section with Internal Scroll */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="overflow-y-auto h-[calc(100vh-34rem)] min-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 transition-colors animate-in fade-in duration-700">
            
            {currentAlbum && (
              <div className="flex items-center gap-2 mb-6 animate-in slide-in-from-left-4 duration-500 sticky top-0 bg-white/80 backdrop-blur-md z-10 py-2 -mx-2 px-2 rounded-xl">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setCurrentAlbum(null);
                    setSearchQuery('');
                  }}
                  className="p-0 h-auto font-black text-[#065f46] uppercase tracking-widest text-[10px] hover:bg-transparent flex items-center gap-1 group"
                >
                  <ArrowUpRight className="h-4 w-4 rotate-225 group-hover:-translate-x-1 transition-transform" />
                  BACK TO ALL ASSETS
                </Button>
                <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  <Folder className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{currentAlbum}</span>
                </div>
              </div>
            )}

            {activeTab === 'Albums' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {albums.map((album: any) => (
                  <div 
                    key={album.name} 
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() => {
                       setSearchQuery(album.name);
                       setActiveTab('All');
                    }}
                  >
                    <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
                      {album.thumbnail ? (
                        <img 
                          src={album.thumbnail} 
                          alt={album.name} 
                          className="w-full h-full object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-[#065f46]/20 group-hover:text-[#065f46]/40 transition-colors">
                          <FolderPlus className="h-20 w-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white border-t border-gray-50">
                      <h4 className="text-[12px] font-black text-[#002f37] uppercase tracking-wider truncate mb-1">
                        {album.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{album.count} Assets</span>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#065f46] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    {/* Folder Tab Effect */}
                    <div className="absolute top-0 left-0 w-12 h-2 bg-white/40 -mt-2 rounded-t-lg hidden group-hover:block transition-all"></div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40">
                    <FolderPlus className="h-16 w-16 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">No Albums Created Yet</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {filteredMedia.map((item: any) => {
                  const itemType = (item.type || 'Photo').toLowerCase();
                  const itemName = (item.name || '').toLowerCase();
                  const isAlbum = item.url === 'album-placeholder' || itemName.startsWith('[album]') || itemType === 'album';
                  const isPdf = itemName.endsWith('.pdf') || item.format === 'PDF';
                  const isExcel = itemName.endsWith('.xlsx') || itemName.endsWith('.xls') || itemName.endsWith('.csv') || item.format?.includes('XLS');
                  const isWord = itemName.endsWith('.docx') || itemName.endsWith('.doc') || item.format?.includes('DOC');
                  const isDocument = isPdf || isExcel || isWord || itemType === 'kyc doc' || itemType === 'document' || item.format === 'PDF';

                  const handleItemClick = () => {
                        if (isAlbum) {
                          const albumName = item.album || item.name.replace('[Album] ', '');
                          setCurrentAlbum(albumName);
                          setActiveTab('All');
                          toast.info(`Opening folder: ${albumName}`, { position: 'bottom-right' });
                        } else if (isDocument) {
                          handleOpenMedia(item);
                        } else {
                          setSelectedMedia(item);
                        }
                  };

                  return (
                    <div 
                      key={item._id || item.id} 
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      onClick={handleItemClick}
                    >
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        (() => {
                          let bgColorClass = "bg-gradient-to-br from-gray-50 to-gray-200";
                          let iconColorClass = "text-gray-400";
                          
                          if (isAlbum) {
                            bgColorClass = "bg-gradient-to-br from-emerald-50 to-emerald-100";
                            iconColorClass = "text-emerald-500/50";
                          } else if (isPdf) {
                            bgColorClass = "bg-gradient-to-br from-rose-50 to-rose-100";
                            iconColorClass = "text-rose-500/50";
                          } else if (isExcel) {
                            bgColorClass = "bg-gradient-to-br from-emerald-50 to-emerald-100";
                            iconColorClass = "text-emerald-600/50";
                          } else if (isWord) {
                            bgColorClass = "bg-gradient-to-br from-blue-50 to-blue-100";
                            iconColorClass = "text-blue-500/50";
                          }

                          return (
                            <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${bgColorClass}`}>
                              {isAlbum ? (
                                <Folder className={`h-12 w-12 ${iconColorClass} mb-2 group-hover:scale-110 transition-transform`} />
                              ) : isDocument ? (
                                <FileText className={`h-10 w-10 ${iconColorClass} mb-2 group-hover:scale-110 transition-transform`} />
                              ) : (
                                <ImageIcon className={`h-10 w-10 ${iconColorClass} mb-2 group-hover:scale-110 transition-transform`} />
                              )}
                              <p className={`text-[10px] font-black uppercase tracking-tighter line-clamp-2 ${iconColorClass.replace('/50', '')}`}>{item.name}</p>
                            </div>
                          );
                        })()
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002f37]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 flex flex-col justify-end">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-white text-[11px] font-black leading-tight line-clamp-1">
                              {typeof item.farm === 'object' ? item.farm?.name : (item.farm || 'General')}
                            </p>
                            {typeBadge(isAlbum ? 'Photo' : item.type)}
                          </div>
                          <p className="text-[#95f0a1] text-[9px] font-bold uppercase tracking-widest">
                            {isAlbum ? 'FOLDER' : (item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'Recently')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-100">
                        <Button size="icon" variant="secondary" className="h-7 w-7 rounded-lg bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-[#065f46] hover:border-transparent border-none">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
                </div>
            </div>
            
            {/* Recent Uploads Table */}
            <Card className="border-none bg-white shadow-xl rounded-2xl overflow-hidden mt-12 border-t-4 border-[#065f46]">
              <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg font-black text-[#002f37]">Recent Uploads</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage your most recently captured field evidence</CardDescription>
                </div>
                <Button variant="ghost" className="text-[10px] font-black tracking-widest text-[#065f46] hover:bg-emerald-50 border-none">
                  EXPORT LOG <Download className="h-4 w-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-200/50 hover:scrollbar-thumb-gray-300 transition-colors">
                <Table className="relative border-collapse w-full">
                  <TableHeader className="bg-[#065f46] sticky top-0 z-30 shadow-md">
                    <TableRow className="border-none hover:bg-transparent !bg-[#065f46]">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 px-6 bg-[#065f46]">File Name</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 bg-[#065f46]">Farm / Entity</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 bg-[#065f46]">Type</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 bg-[#065f46]">Upload Date</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 bg-[#065f46]">Size</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-white py-4 bg-[#065f46]">Status</TableHead>
                      <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white py-4 px-6 bg-[#065f46]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedia.slice(0, 5).map((item: any) => (
                      <TableRow key={item._id || item.id} className="hover:bg-gray-50/50 transition-colors group">
                        <TableCell className="py-4 px-6 font-bold text-[12px] text-[#002f37]">
                          <div className="flex items-center gap-3">
                            {item.thumbnail ? (
                              <div className="h-8 w-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                              </div>
                            ) : (
                              (() => {
                                const itemName = (item.name || '').toLowerCase();
                                const isAlbum = item.url === 'album-placeholder' || itemName.startsWith('[album]') || item.type?.toLowerCase() === 'album';
                                const isPdf = itemName.endsWith('.pdf') || item.format === 'PDF';
                                const isExcel = itemName.endsWith('.xlsx') || itemName.endsWith('.xls') || itemName.endsWith('.csv') || item.format?.includes('XLS');
                                const isWord = itemName.endsWith('.docx') || itemName.endsWith('.doc') || item.format?.includes('DOC');
                                
                                let bg = "bg-gray-100";
                                let tc = "text-gray-400";
                                if (isAlbum) { bg = "bg-emerald-50"; tc = "text-emerald-500"; }
                                else if (isPdf) { bg = "bg-rose-50"; tc = "text-rose-500"; }
                                else if (isExcel) { bg = "bg-emerald-50"; tc = "text-emerald-500"; }
                                else if (isWord) { bg = "bg-blue-50"; tc = "text-blue-500"; }
                                
                                return (
                                  <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center ${tc}`}>
                                    {isAlbum ? <Folder className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                  </div>
                                );
                              })()
                            )}
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-[11px] font-medium text-gray-500">
                          {typeof item.farm === 'object' ? item.farm?.name : (item.farm || 'General')}
                        </TableCell>
                        <TableCell className="py-4">{typeBadge(item.type)}</TableCell>
                        <TableCell className="py-4 text-[11px] font-medium text-gray-500">
                          {item.createdAt ? format(new Date(item.createdAt), 'dd MMM, yyyy') : 'Recently'}
                        </TableCell>
                        <TableCell className="py-4 text-[11px] font-medium text-gray-500">{item.size}</TableCell>
                        <TableCell className="py-4">{statusBadge(item.status)}</TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const itemName = (item.name || '').toLowerCase();
                                const isAlbum = item.url === 'album-placeholder' || itemName.startsWith('[album]') || item.type?.toLowerCase() === 'album';
                                const isPdf = itemName.endsWith('.pdf') || item.format === 'PDF';
                                const isExcel = itemName.endsWith('.xlsx') || itemName.endsWith('.xls') || itemName.endsWith('.csv') || item.format?.includes('XLS');
                                const isWord = itemName.endsWith('.docx') || itemName.endsWith('.doc') || item.format?.includes('DOC');
                                const isDocument = isPdf || isExcel || isWord || item.type?.toLowerCase() === 'kyc doc' || item.type?.toLowerCase() === 'document' || item.format === 'PDF';
                                
                                if (isAlbum) {
                                  const albumName = item.album || item.name.replace('[Album] ', '');
                                  setSearchQuery(albumName);
                                  setActiveTab('All');
                                } else if (isDocument) {
                                  handleOpenMedia(item);
                                } else {
                                  setSelectedMedia(item);
                                }
                              }}
                              className="h-8 px-3 rounded-lg flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              className="h-8 px-3 rounded-lg flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
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
          </div>

          {/* Sidebar Area - Sticky */}
          <div className="space-y-6 lg:sticky lg:top-[390px] self-start transition-all duration-300">
            
            <Card className="border-none bg-[#002f37] text-white shadow-xl rounded-2xl overflow-hidden p-6 relative">
              <div className="absolute -right-4 top-0 opacity-10">
                <Upload className="h-24 w-24 text-white" />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest">Sync Queue</h3>
                <Badge className="bg-[#177209] text-white border-none text-[9px] font-extrabold px-2 uppercase">{statsData?.pendingSync || '0'} PENDING</Badge>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-[#177209] hover:bg-[#125a07] text-white font-black text-[11px] uppercase tracking-widest py-6 rounded-xl border-none shadow-lg shadow-[#177209]/20 group disabled:opacity-50"
                    onClick={handleSync}
                    disabled={syncMutation.isPending || statsData?.pendingSync === 0}
                  >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
                    {syncMutation.isPending ? 'SYNCING DATA...' : 'SYNC NOW'}
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3 min-h-[80px]">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last heartbeat: 2 mins ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40">
                    <Cloud className="h-3.5 w-3.5" />
                    <span>Cloud Storage: {statsData?.storageUsed || '0.0 MB'}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black text-[11px] uppercase tracking-widest py-6 rounded-xl border border-white/10 group"
                  onClick={handleOptimize}
                >
                  OPTIMIZE STORAGE <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </Card>

            <Card className="border-none bg-white shadow-xl rounded-2xl p-6 border-l-4 border-amber-500">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[12px] font-black text-[#002f37] uppercase tracking-wide mb-1">Offline Resilience</h4>
                  <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                    Captured media is securely indexed and will auto-sync once you reach a zone with edge connectivity.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-none bg-gradient-to-br from-[#124b53] to-[#002f37] text-white shadow-xl rounded-2xl p-6 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-magenta animate-pulse"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#95f0a1]">AI Analysis</h3>
                </div>
                <h4 className="text-sm font-black mb-3">Health Detection Beta</h4>
                <p className="text-[10px] font-medium text-white/70 mb-6 leading-relaxed">
                  Your last 10 photos of Northern Maize Cluster suggest early signs of Fall Armyworm. We've flagged these for regional experts.
                </p>
                <Button variant="ghost" className="w-full justify-between p-0 text-[10px] font-black uppercase tracking-widest text-[#95f0a1] hover:bg-transparent hover:text-white transition-colors">
                  VIEW FULL THREAT REPORT <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

          </div>
        </div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl p-0 border-none bg-black/80 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500">
          <div className="sr-only">
            <DialogTitle>{selectedMedia?.name || 'Media Preview'}</DialogTitle>
            <DialogDescription>Viewing details for {selectedMedia?.name}</DialogDescription>
          </div>
          {selectedMedia && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              <div className="flex-1 bg-black flex items-center justify-center group relative min-h-[300px] lg:min-h-auto">
                {selectedMedia.thumbnail ? (
                  <img src={selectedMedia.thumbnail} alt={selectedMedia.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="h-24 w-24 text-gray-600 mb-4" />
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Document Preview Not Available</p>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-[#065f46]">
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-[#065f46]">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full lg:w-[360px] bg-white/5 backdrop-blur-3xl p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute -right-20 -top-20 h-40 w-40 bg-[#065f46]/20 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                       <h3 className="text-white text-2xl font-black leading-tight tracking-tight break-all pr-4">{selectedMedia.name}</h3>
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-[#95f0a1] animate-pulse" />
                         <p className="text-[#95f0a1] text-[11px] font-black uppercase tracking-[0.2em]">
                           {typeof selectedMedia.farm === 'object' ? selectedMedia.farm?.name : (selectedMedia.farm || 'General Portfolio')}
                         </p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10 py-8 border-y border-white/10">
                    <div className="space-y-1.5">
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Format</p>
                      <p className="text-white text-[13px] font-black">{selectedMedia.type || 'Photo'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Filesize</p>
                      <p className="text-white text-[13px] font-black">{selectedMedia.size || 'N/A'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Capture Date</p>
                      <p className="text-white text-[13px] font-black">
                        {selectedMedia.createdAt ? format(new Date(selectedMedia.createdAt), 'dd MMM yyyy') : 'Recently'}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Sync Status</p>
                      <div className="mt-1">{statusBadge(selectedMedia.status)}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Automated Meta Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {['Maize', 'Growth', 'Region #7', 'Field Evidence'].map(tag => (
                        <Badge key={tag} className="bg-white/5 hover:bg-[#065f46]/30 text-white/50 border border-white/10 text-[9px] font-black uppercase py-1.5 px-3 transition-colors">
                          #{tag.replace(' ', '')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-12 relative z-10">
                  <Button className="w-full bg-[#065f46] hover:bg-[#054d39] text-white font-black text-[12px] uppercase tracking-[0.15em] py-7 rounded-2xl border-none shadow-2xl shadow-[#065f46]/20 group">
                    <Download className="mr-3 h-4 w-4 transition-transform group-hover:translate-y-1" /> DOWNLOAD ORIGINAL
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-rose-400 hover:text-white hover:bg-rose-500 font-extrabold text-[11px] uppercase tracking-[0.15em] py-7 rounded-2xl transition-all"
                    onClick={() => handleDelete(selectedMedia)}
                  >
                    <Trash2 className="mr-3 h-4 w-4" /> DELETE ASSET
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== UPLOAD FILE MODAL ===== */}
      <Dialog 
        open={uploadOpen} 
        onOpenChange={(o) => { 
          setUploadOpen(o); 
          if (o) {
            // Auto-tag with current folder if browsing
            setUploadForm(f => ({ ...f, album: currentAlbum || f.album || '' }));
          } else { 
            setUploadFile(null); 
            setUploadPreview(null); 
            setUploadForm({ name: '', type: 'Photo', farm: '', album: '' }); 
          } 
        }}
      >
        <DialogContent className="max-w-2xl border-none rounded-3xl bg-white p-0 overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">Upload File</DialogTitle>
          <DialogDescription className="sr-only">Upload a media file to the library</DialogDescription>
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#002f37] tracking-tight">Upload Media</h2>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add photos, videos, or documents to the library</p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragging ? 'border-[#065f46] bg-emerald-50 scale-[1.01]' : 'border-gray-200 hover:border-[#065f46] hover:bg-gray-50'
              } ${uploadPreview ? 'h-48' : 'h-48'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,application/pdf,.doc,.docx"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
              {uploadPreview ? (
                <img src={uploadPreview} alt="preview" className="h-full w-full object-contain rounded-2xl" />
              ) : uploadFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-12 w-12 text-[#065f46]" />
                  <p className="text-sm font-bold text-[#002f37]">{uploadFile.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{(uploadFile.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-8">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-[#065f46]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-[#002f37]">Drop files here or click to browse</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Images, Videos, PDFs — up to 50MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">File Name *</label>
                <Input
                  placeholder="e.g. Farm_Visit_Photo_01"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(f => ({ ...f, name: e.target.value }))}
                  className="h-11 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#065f46] focus:border-[#065f46]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Media Type</label>
                <Select value={uploadForm.type} onValueChange={(v) => setUploadForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="h-11 border-gray-200 rounded-xl text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="Photo">Photo</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="KYC Doc">KYC Document</SelectItem>
                    <SelectItem value="Harvest">Harvest Record</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Farm / Entity (optional)</label>
                <Input
                  placeholder="e.g. Kwame's Maize Farm"
                  value={uploadForm.farm}
                  onChange={(e) => setUploadForm(f => ({ ...f, farm: e.target.value }))}
                  className="h-11 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#065f46] focus:border-[#065f46]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Assign to Album (optional)</label>
                <Select 
                  value={uploadForm.album || 'none'} 
                  onValueChange={(v) => setUploadForm(f => ({ ...f, album: v === 'none' ? '' : v }))}
                >
                  <SelectTrigger className="h-11 border-gray-200 rounded-xl text-sm font-medium">
                    <SelectValue placeholder="Select an album" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-2xl max-h-[200px]">
                    <SelectItem value="none">No Album</SelectItem>
                    {albums.map((album: any) => (
                      <SelectItem key={album.name} value={album.name}>
                        {album.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 font-black text-[12px] uppercase tracking-wider text-gray-500 hover:bg-gray-50"
                onClick={() => setUploadOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-[#065f46] hover:bg-[#054d39] text-white font-black text-[12px] uppercase tracking-wider border-none shadow-lg shadow-[#065f46]/20 disabled:opacity-60"
                onClick={handleSubmitUpload}
                disabled={uploadMutation.isPending || !uploadFile}
              >
                {uploadMutation.isPending ? (
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 animate-spin" /> Uploading...</span>
                ) : (
                  <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload File</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== NEW ALBUM MODAL ===== */}
      <Dialog open={albumOpen} onOpenChange={(o) => { setAlbumOpen(o); if (!o) { setAlbumName(''); setAlbumDesc(''); } }}>
        <DialogContent className="max-w-md border-none rounded-3xl bg-white p-0 overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">New Album</DialogTitle>
          <DialogDescription className="sr-only">Create a new media album</DialogDescription>
          <div className="p-8">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <FolderPlus className="h-8 w-8 text-[#065f46]" />
            </div>
            <h2 className="text-2xl font-black text-[#002f37] tracking-tight mb-1">New Album</h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Organise your media into a named collection</p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Album Name *</label>
                <Input
                  placeholder="e.g. Q1 Field Visits"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="h-11 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#065f46] focus:border-[#065f46]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Description (optional)</label>
                <Input
                  placeholder="Short note about this album"
                  value={albumDesc}
                  onChange={(e) => setAlbumDesc(e.target.value)}
                  className="h-11 border-gray-200 rounded-xl text-sm font-medium focus:ring-[#065f46] focus:border-[#065f46]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 font-black text-[12px] uppercase tracking-wider text-gray-500 hover:bg-gray-50"
                onClick={() => setAlbumOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-[#065f46] hover:bg-[#054d39] text-white font-black text-[12px] uppercase tracking-wider border-none shadow-lg shadow-[#065f46]/20 disabled:opacity-60"
                onClick={handleCreateAlbum}
                disabled={albumMutation.isPending || !albumName.trim()}
              >
                {albumMutation.isPending ? (
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 animate-spin" /> Creating...</span>
                ) : (
                  <span className="flex items-center gap-2"><FolderPlus className="h-4 w-4" /> Create Album</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AgentLayout>
  );
};

export default MediaDashboard;
