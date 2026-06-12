/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Calendar,
    Image as ImageIcon,
    ClipboardList,
    GraduationCap,
    Search,
    Filter,
    ArrowUpRight,
    User,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Eye,
    Download,
    MoreHorizontal,
    Camera,
    FileText,
    Activity,
    Info,
    LayoutGrid,
    LayoutList,
    Compass,
    Smartphone,
    Check
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const FieldOperationsAudit = () => {
    const { darkMode } = useDarkMode();
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'visits';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [visits, setVisits] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [training, setTraining] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const [visitsRes, mediaRes, trainingRes, tasksRes] = await Promise.all([
                    api.get('/super-admin/visits').catch(() => ({ data: [] })),
                    api.get('/super-admin/media').catch(() => ({ data: [] })),
                    api.get('/super-admin/training').catch(() => ({ data: [] })),
                    api.get('/super-admin/tasks').catch(() => ({ data: [] }))
                ]);
                setVisits(visitsRes.data || []);
                setMedia(mediaRes.data || []);
                setTraining(trainingRes.data || []);
                setTasks(tasksRes.data || []);
            } catch (err) {
                console.error('Failed to fetch field operations audit data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAuditData();
    }, []);

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Field Operations Audit
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        God-View Oversight of Global Field Activities, Media & Training
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input
                            placeholder="Find Agent, Farmer or Region..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                        />
                    </div>
                    <Button className="bg-[#002f37] text-[#7ede56] border border-[#7ede56]/20 font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-none shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Global Export
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={initialTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl h-14 mb-8">
                    <TabsTrigger value="visits" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-2">
                        <MapPin className="w-4 h-4" /> Visit Logs
                    </TabsTrigger>
                    <TabsTrigger value="media" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-2">
                        <Camera className="w-4 h-4" /> Global Media
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-2">
                        <ClipboardList className="w-4 h-4" /> Agent Missions
                    </TabsTrigger>
                    <TabsTrigger value="training" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-2">
                        <GraduationCap className="w-4 h-4" /> Training Audit
                    </TabsTrigger>
                </TabsList>

                {/* VISITS TAB */}
                <TabsContent value="visits" className="mt-0 space-y-4">
                    <Card className={`border-none shadow-premium overflow-hidden rounded-none ${darkMode ? 'bg-gray-955' : 'bg-white'}`}>
                        <CardContent className="p-0 overflow-x-auto">
                            {visits.length === 0 && !loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">No field visits recorded yet</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mt-1">Visits logged by agents will appear here</p>
                                </div>
                            ) : (
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-[#002f37] text-white text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4">Visit Date</th>
                                        <th className="p-4">Staff & Farmer</th>
                                        <th className="p-4">Operation Type</th>
                                        <th className="p-4">Status & Outcome</th>
                                        <th className="p-4 text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {visits.map(visit => (
                                        <tr key={visit.id} className="hover:bg-[#7ede56]/5 transition-colors group">
                                            <td className="p-4">
                                                <p className="font-black text-sm uppercase">{new Date(visit.date).toLocaleDateString()}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">SYNCED LIVE</p>
                                            </td>
                                            <td className="p-4 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                                <div className="flex flex-col">
                                                    <span className="font-black uppercase tracking-tight text-sm">{visit.agent}</span>
                                                    <span className="text-[9px] font-bold text-[#7ede56] uppercase tracking-widest leading-none mt-1">For {visit.farmer} ({visit.region})</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[9px] px-3">{(visit.purpose || '').toUpperCase()}</Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${visit.status === 'Completed' ? 'bg-[#7ede56]' : 'bg-rose-500'}`}></div>
                                                        <span className="text-[10px] font-black uppercase">{visit.status}</span>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-gray-400 truncate max-w-[200px]">{visit.notes}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-[#002f37] dark:text-[#7ede56]" onClick={() => { setSelectedItem(visit); setIsDetailsOpen(true); }}><Eye className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MEDIA TAB */}
                <TabsContent value="media" className="mt-0">
                    {media.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                            <Camera className="w-12 h-12 mb-4 opacity-30" />
                            <p className="text-sm font-black uppercase tracking-widest">No media files uploaded yet</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">Agents upload photos and videos from the field</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {media.map((item: any) => {
                                const isVideo = item.isVideo || item.type === 'Video';
                                const FALLBACK = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600';
                                return (
                                    <Card key={item.id} className={`border-none shadow-premium overflow-hidden group cursor-pointer rounded-none ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {isVideo ? (
                                                <>
                                                    {item.thumbnail ? (
                                                        <img
                                                            src={item.thumbnail}
                                                            className="w-full h-full object-cover"
                                                            alt={item.caption}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                                                        />
                                                    ) : (
                                                        <video
                                                            src={item.url}
                                                            className="w-full h-full object-cover"
                                                            preload="metadata"
                                                            muted
                                                            playsInline
                                                            onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                                                        />
                                                    )}
                                                    {/* Play button overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                                                            <svg className="w-4 h-4 text-[#002f37] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <img
                                                    src={item.url}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={item.caption}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                                                />
                                            )}
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                                                <Badge className={`w-fit font-black text-[7px] mb-2 ${isVideo ? 'bg-blue-500 text-white' : 'bg-[#7ede56] text-[#002f37]'}`}>{item.type}</Badge>
                                                <p className="text-white font-black text-[9px] uppercase leading-tight line-clamp-2">{item.caption}</p>
                                                {item.album && <p className="text-[#7ede56] font-bold text-[8px] uppercase tracking-wider mt-0.5">{item.album}</p>}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.date}</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[7px] font-black">{(item.agent || 'A')[0]}</div>
                                                <p className="text-[9px] font-black uppercase text-gray-400 truncate">{item.agent}</p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* TASKS TAB */}
                <TabsContent value="tasks" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <Card key={task.id} className={`border-none shadow-premium overflow-hidden rounded-none ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                <CardHeader className="p-5 border-b border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="flex justify-between items-start">
                                        <Badge className={`font-black text-[8px] tracking-widest ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'} border-none px-3`}>
                                            {task.priority} PRIORITY
                                        </Badge>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">DUE: {task.dueDate}</p>
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mt-3 leading-tight">{task.title}</h3>
                                </CardHeader>
                                <CardContent className="p-5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#002f37] text-[#7ede56] flex items-center justify-center font-black text-xs">{(task.agent || 'A')[0]}</div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ASSIGNED TO</p>
                                            <p className="text-[10px] font-black uppercase">{task.agent || 'Unknown'} ({task.region || 'Unknown'})</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Mission Progress</span>
                                            <span className="text-[10px] font-black text-[#7ede56]">{task.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#7ede56]" style={{ width: `${task.progress}%` }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* TRAINING TAB */}
                <TabsContent value="training" className="mt-0">
                    <Card className={`border-none shadow-premium overflow-hidden rounded-none ${darkMode ? 'bg-gray-955' : 'bg-white'}`}>
                        <CardContent className="p-0 overflow-x-auto">
                            {training.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <GraduationCap className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">No training sessions recorded yet</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mt-1">
                                        Training records will appear here once agents enrol and complete sessions
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-[#002f37] text-white text-[10px] font-black uppercase tracking-widest">
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Agent</th>
                                            <th className="p-4">Course / Module</th>
                                            <th className="p-4">Category & Mode</th>
                                            <th className="p-4 text-center">Status</th>
                                            <th className="p-4 text-right">Certificate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {training.map((t: any) => {
                                            const statusColor = {
                                                Completed: 'bg-[#7ede56]/10 text-[#7ede56]',
                                                Ongoing: 'bg-blue-500/10 text-blue-500',
                                                Registered: 'bg-amber-500/10 text-amber-500',
                                                Missed: 'bg-rose-500/10 text-rose-500',
                                            }[t.status as 'Completed' | 'Ongoing' | 'Registered' | 'Missed'] || 'bg-gray-100 text-gray-500';

                                            return (
                                                <tr key={t.id} className="hover:bg-[#7ede56]/5 transition-colors group">
                                                    <td className="p-4">
                                                        <p className="font-black text-xs uppercase">{t.date}</p>
                                                        {t.region && <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.region}</p>}
                                                    </td>
                                                    <td className="p-4 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                                        <div className="flex flex-col">
                                                            <span className="font-black uppercase tracking-tight text-sm">{t.trainee}</span>
                                                            {t.trainer && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Trainer: {t.trainer}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <GraduationCap className="w-4 h-4 text-[#7ede56] shrink-0" />
                                                            <span className="text-[10px] font-black uppercase">{t.course}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                            {t.category && <Badge className="bg-purple-500/10 text-purple-500 border-none font-black text-[8px] w-fit px-2">{String(t.category).toUpperCase()}</Badge>}
                                                            {t.mode && <span className="text-[9px] font-bold text-gray-400 uppercase">{t.mode}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Badge className={`text-[7px] font-black border-none px-3 py-0 h-5 ${statusColor}`}>
                                                            {String(t.status || 'Registered').toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {t.certificate ? (
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[7px] px-2 py-0 h-5">ISSUED</Badge>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500">
                                                                    <Download className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">— Pending</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* ========================================================
                SPACIOUS & BEAUTIFUL VISIT DETAILS OVERLAY - MD:MAX-W-[1100PX]
                ======================================================== */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className={`w-[95vw] md:max-w-[1280px] lg:max-w-[1400px] md:w-full p-0 border-none rounded-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'} max-h-[96vh] overflow-y-auto [&>button]:text-white [&>button]:opacity-85 [&>button:hover]:opacity-100 [&>button]:top-5 [&>button]:right-6 [&>button]:z-50 [&>button]:scale-110`}>
                    {selectedItem && (
                        <div className="flex flex-col">
                            
                            {/* Deep Pine Header Banner with White/Green Branding */}
                            <div className="bg-[#002f37] px-8 py-6 text-white relative border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-none bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <MapPin className="w-7 h-7 text-[#7ede56]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-tighter">{selectedItem.purpose} Details Log</h2>
                                        <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.2em] mt-1">
                                            Farmer: {selectedItem.farmer} • Territory: {selectedItem.region} Region
                                        </p>
                                    </div>
                                </div>
                                <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px] px-3 py-1 rounded-none mr-8 uppercase">
                                    MISSION RECAP
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto">
                                
                                {/* LEFT COLUMN: Details Grid (7-Cols) */}
                                <div className="md:col-span-7 p-10 space-y-8 border-r border-gray-100 dark:border-gray-800">
                                    
                                    {/* Personnel Involved */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-450">
                                            <User className="w-4 h-4 text-[#7ede56]" /> Personnel Assigned & Beneficiary
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3.5 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-none shadow-inner">
                                                <div className="w-9 h-9 rounded-none bg-[#002f37] text-[#7ede56] flex items-center justify-center font-black text-xs border border-white/10">
                                                    A
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Assigned Agent</p>
                                                    <p className="text-[11px] font-black uppercase tracking-wide text-gray-850 dark:text-white leading-tight">
                                                        {selectedItem.agent}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3.5 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-none shadow-inner">
                                                <div className="w-9 h-9 rounded-none bg-[#7ede56]/15 text-[#7ede56] flex items-center justify-center font-black text-xs">
                                                    F
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Beneficiary Farmer</p>
                                                    <p className="text-[11px] font-black uppercase tracking-wide text-gray-850 dark:text-white leading-tight">
                                                        {selectedItem.farmer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Audit Observations */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-450">
                                            <FileText className="w-4 h-4 text-[#7ede56]" /> Logged Observations
                                        </h4>
                                        <div className="p-5 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-none relative">
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${selectedItem.status === 'Completed' ? 'bg-[#7ede56]' : 'bg-rose-500'}`}></div>
                                                <span className="text-[9px] font-black uppercase text-gray-500">{selectedItem.status}</span>
                                            </div>
                                            <p className="text-xs font-semibold leading-relaxed text-gray-700 dark:text-gray-300 italic pt-2">
                                                "{selectedItem.notes}"
                                            </p>
                                        </div>
                                    </div>


                                </div>
                                
                                {/* RIGHT COLUMN: Operational Evidence & Verification Actions (5-Cols) */}
                                <div className="md:col-span-5 p-10 flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-450">
                                            <Camera className="w-4 h-4 text-[#7ede56]" /> Crop / Field Photo Evidence
                                        </h4>
                                        <div className="aspect-video w-full rounded-none overflow-hidden border-2 border-[#7ede56] shadow-xl">
                                            <img src={selectedItem.images?.[0] || selectedItem.photo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Audit Evidence" />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase text-center tracking-wider">
                                            High-definition timestamped field imagery uploaded by {selectedItem.agent}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <Button 
                                            onClick={() => {
                                                toast.success(`Observation verified successfully!`);
                                                setIsDetailsOpen(false);
                                            }}
                                            className="w-full h-12 bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest rounded-none shadow-md flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" /> Verify Observation
                                        </Button>
                                        
                                        <Button 
                                            variant="outline"
                                            className="w-full h-12 text-rose-500 border-2 border-rose-500/20 hover:bg-rose-500/10 font-black uppercase text-[10px] tracking-widest rounded-none" 
                                            onClick={() => setIsDetailsOpen(false)}
                                        >
                                            Flag for Review
                                        </Button>
                                        
                                        <Button 
                                            variant="ghost" 
                                            className="w-full h-12 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-none" 
                                            onClick={() => setIsDetailsOpen(false)}
                                        >
                                            Close Audit View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FieldOperationsAudit;
