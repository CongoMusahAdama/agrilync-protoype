import React, { useState, useEffect } from 'react';
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
    LayoutList
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
    const [activeTab, setActiveTab] = useState('visits');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Mock Data for Audit
    const visits = [
        { id: '1', date: '2026-04-05', agent: 'Kwame Mensah', farmer: 'Kofi Annan', region: 'Ashanti', purpose: 'Soil Testing', status: 'Completed', notes: 'Soil nitrogen levels low. Recommended organic fertilizer.', photo: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop' },
        { id: '2', date: '2026-04-04', agent: 'Abena Osei', farmer: 'Efua Sutherland', region: 'Western', purpose: 'Pest Inspection', status: 'Issue Found', notes: 'Found aphids on lower leaves of cocoa plants.', photo: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2040&auto=format&fit=crop' },
        { id: '3', date: '2026-04-03', agent: 'Sarkodie King', farmer: 'Nii Lamptey', region: 'Eastern', purpose: 'Harvest Prep', status: 'Completed', notes: 'Maize moisture content at 14%. Ready for harvest in 5 days.', photo: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop' },
    ];

    const media = [
        { id: '1', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop', caption: 'Farm Entrance - Kofi Annan', type: 'Site Photo', agent: 'Kwame Mensah', date: '2026-04-05' },
        { id: '2', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2040&auto=format&fit=crop', caption: 'Crop Health - Ashanti North', type: 'Detail', agent: 'Kwame Mensah', date: '2026-04-05' },
        { id: '3', url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop', caption: ' Irrigation Setup', type: 'Infra', agent: 'Abena Osei', date: '2026-04-04' },
        { id: '4', url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop', caption: 'Seedling Progress', type: 'Growth', agent: 'Sarkodie King', date: '2026-04-03' },
    ];

    const training = [
        { id: '1', trainee: 'Kofi Annan', course: 'Smart Irrigation', agent: 'Kwame Mensah', date: '2026-03-28', score: 95, status: 'Passed' },
        { id: '2', trainee: 'Efua Sutherland', course: 'Soil Fertility', agent: 'Abena Osei', date: '2026-04-02', score: 88, status: 'Passed' },
        { id: '3', trainee: 'Nii Lamptey', course: 'Pest Management', agent: 'Sarkodie King', date: '2026-04-01', score: 45, status: 'Failed' },
    ];

    const tasks = [
        { id: '1', title: 'Onboard 10 Farmers', agent: 'Kwame Mensah', region: 'Ashanti', progress: 80, dueDate: '2026-04-10', priority: 'High' },
        { id: '2', title: 'Verify Volta Yields', agent: 'John Dumelo', region: 'Volta', progress: 30, dueDate: '2026-04-15', priority: 'Medium' },
        { id: '3', title: 'Upload Site Photos', agent: 'Abena Osei', region: 'Western', progress: 100, dueDate: '2026-04-04', priority: 'High' },
    ];

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
                    <Button className="bg-[#002f37] text-[#7ede56] border border-[#7ede56]/20 font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Global Export
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="visits" onValueChange={setActiveTab} className="w-full">
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
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
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
                                                    <span className="text-[9px] font-bold text-[#7ede56] uppercase tracking-widest leading-none">For {visit.farmer} ({visit.region})</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[9px] px-3">{visit.purpose.toUpperCase()}</Badge>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MEDIA TAB */}
                <TabsContent value="media" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {media.map(item => (
                            <Card key={item.id} className={`border-none shadow-premium overflow-hidden group cursor-pointer ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                <div className="aspect-square relative overflow-hidden">
                                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.caption} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <Badge className="w-fit bg-[#7ede56] text-[#002f37] font-black text-[7px] mb-2">{item.type}</Badge>
                                        <p className="text-white font-black text-[9px] uppercase leading-tight">{item.caption}</p>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.date}</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[7px] font-black">{item.agent[0]}</div>
                                        <p className="text-[9px] font-black uppercase text-gray-400">{item.agent}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* TASKS TAB */}
                <TabsContent value="tasks" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <Card key={task.id} className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
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
                                        <div className="w-8 h-8 rounded-full bg-[#002f37] text-[#7ede56] flex items-center justify-center font-black text-xs">{task.agent[0]}</div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ASSIGNED TO</p>
                                            <p className="text-[10px] font-black uppercase">{task.agent} ({task.region})</p>
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
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#002f37] text-white text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-4">Completion Date</th>
                                        <th className="p-4">Farmer (Learner)</th>
                                        <th className="p-4">Module / Course</th>
                                        <th className="p-4 text-center">Score / Performance</th>
                                        <th className="p-4 text-right">Certificate Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {training.map(t => (
                                        <tr key={t.id} className="hover:bg-[#7ede56]/5 transition-colors">
                                            <td className="p-4">
                                                <p className="font-black text-xs uppercase">{t.date}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black uppercase tracking-tight text-sm">{t.trainee}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Via Agent {t.agent}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-[#7ede56]" />
                                                    <span className="text-[10px] font-black uppercase">{t.course}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-[11px] font-black ${t.score >= 80 ? 'text-[#7ede56]' : 'text-rose-500'}`}>{t.score}%</span>
                                                    <Badge className={`text-[7px] font-black border-none px-2 py-0 h-4 mt-1 ${t.status === 'Passed' ? 'bg-[#7ede56]/10 text-[#7ede56]' : 'bg-rose-500/10 text-rose-500'}`}>{t.status.toUpperCase()}</Badge>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-blue-500"><Download className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Visit Details Overlay */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className={`sm:max-w-[700px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedItem && (
                        <div className="flex flex-col">
                            <div className="bg-[#002f37] p-8 text-white relative">
                                <Badge className="absolute top-4 right-4 bg-[#7ede56] text-[#002f37] font-black tracking-widest border-none">MISSION RECAP</Badge>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <MapPin className="w-8 h-8 text-[#7ede56]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedItem.purpose}</h2>
                                        <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.2em]">{selectedItem.farmer} • {selectedItem.region}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto">
                                <div className="p-8 space-y-6 border-r border-black/5 dark:border-white/5">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><User className="w-4 h-4" /> Personnel Involved</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-black/5">
                                                <div className="w-8 h-8 rounded-full bg-[#002f37] text-[#7ede56] flex items-center justify-center font-black text-xs">A</div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Assigned Agent</p>
                                                    <p className="text-[10px] font-black uppercase leading-tight">{selectedItem.agent}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-black/5">
                                                <div className="w-8 h-8 rounded-full bg-[#7ede56]/10 text-[#7ede56] flex items-center justify-center font-black text-xs text-emerald-500">F</div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Beneficiary Farmer</p>
                                                    <p className="text-[10px] font-black uppercase leading-tight">{selectedItem.farmer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><FileText className="w-4 h-4" /> Field Observations</h4>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-black/5">
                                            <p className="text-xs font-medium leading-relaxed italic">"{selectedItem.notes}"</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><Camera className="w-4 h-4" /> Operational Evidence</h4>
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-[#7ede56]/20 shadow-lg">
                                        <img src={selectedItem.photo} className="w-full h-full object-cover" alt="Audit Evidence" />
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <Button className="w-full h-12 bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest rounded-xl">Verify Observation</Button>
                                        <Button variant="ghost" className="w-full h-12 text-rose-500 font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => setIsDetailsOpen(false)}>Close Audit</Button>
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
