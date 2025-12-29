import React, { useState } from 'react';
import AgentLayout from './AgentLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid
} from 'recharts';
import {
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  AlertCircle,
  School,
  History,
  Activity,
  UserCheck,
  GraduationCap,
  Calendar,
  Download,
  Filter,
  Sprout,
  Handshake
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { toast } from 'sonner';

export const TrainingPerformanceContent = () => {
  const { darkMode } = useDarkMode();
  const [trainingFilter, setTrainingFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [availableTrainings, setAvailableTrainings] = useState<any[]>([]);
  const [myTrainings, setMyTrainings] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const [availableRes, myRes, statsRes, activitiesRes] = await Promise.all([
          api.get('/trainings'),
          api.get('/trainings/my'),
          api.get('/agents/stats'),
          api.get('/activities')
        ]);
        setAvailableTrainings(availableRes.data);
        setMyTrainings(myRes.data);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);

        // Mocking performance metrics structure from stats if not available
        setPerformanceMetrics({
          score: statsRes.data?.performanceScore || 89,
          fieldVisits: statsRes.data?.activeFarms || 0,
          monthlyActivity: statsRes.data?.monthlyActivity || [],
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching performance data:', err);
        toast.error('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const handleConsultationAction = (id: string, action: 'accept' | 'decline' | 'reschedule') => {
    // In a real app, this would be an API call
    console.log(`Action ${action} on consultation ${id}`);
    toast.info(`Consultation ${action} for ID: ${id}`);
    // For now, we'll just update the local state for demonstration
    setConsultationRequests(prev => prev.map(req => {
      if (req.id === id) {
        if (action === 'accept') return { ...req, status: 'Confirmed' };
        if (action === 'decline') return { ...req, status: 'Declined' };
        if (action === 'reschedule') return { ...req, status: 'Reschedule Requested' };
      }
      return req;
    }));
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  const summaryCards = [
    { title: 'Available', value: availableTrainings.length.toString(), icon: GraduationCap, color: 'bg-blue-600' },
    { title: 'Upcoming', value: myTrainings.filter(t => t.status === 'Registered').length.toString(), icon: Calendar, color: 'bg-orange-600' },
    { title: 'Consultations', value: consultationRequests.length.toString(), icon: Handshake, color: 'bg-teal-600' },
    { title: 'Score', value: `${stats?.performanceScore || 0}%`, icon: TrendingUp, color: 'bg-purple-600' },
    { title: 'Reports', value: (stats?.reportsThisMonth || 0).toString(), icon: FileText, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-6">
        {summaryCards.map((card, idx) => (
          <Card
            key={idx}
            className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <card.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
            </div>

            <div className="p-3 sm:p-5 flex flex-col h-full relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <card.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                <p className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">{card.title}</p>
              </div>
              <div className="flex-1 flex items-center">
                <p className="text-2xl sm:text-4xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Incoming Consultation Requests Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Incoming Consultation Requests</h2>
            </div>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className={darkMode ? 'bg-[#0b3d32]' : 'bg-[#10b981]'}>
                    <TableRow className={darkMode ? 'border-[#124b53] hover:bg-transparent' : 'border-emerald-500 hover:bg-transparent'}>
                      <TableHead className="text-white font-bold h-10">Farmer</TableHead>
                      <TableHead className="text-white font-bold h-10">Purpose & location</TableHead>
                      <TableHead className="text-white font-bold h-10">Date & Time</TableHead>
                      <TableHead className="text-white font-bold h-10">Mode</TableHead>
                      <TableHead className="text-white font-bold h-10">Status</TableHead>
                      <TableHead className="text-right text-white font-bold h-10">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultationRequests.map((req) => (
                      <TableRow key={req.id} className={darkMode ? 'border-gray-800 hover:bg-gray-800/20' : 'border-gray-50 hover:bg-gray-50'}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              {req.farmer.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{req.farmer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{req.purpose}</span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{req.region}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex flex-col text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span>{req.date}</span>
                            <span>{req.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {req.mode === 'Virtual' ? (
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                                <Activity className="h-3 w-3" />
                                {req.mode}
                              </div>
                            ) : (
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                <UserCheck className="h-3 w-3" />
                                {req.mode}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${req.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' :
                            req.status === 'Declined' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                              req.status === 'Reschedule Requested' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' :
                                'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                            }`}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]" onClick={() => handleConsultationAction(req.id, 'accept')}>
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 border-red-500 text-red-500 hover:bg-red-500/10 text-[10px]" onClick={() => handleConsultationAction(req.id, 'decline')}>
                                Decline
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleConsultationAction(req.id, 'reschedule')}>
                                <Clock className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {req.status !== 'Pending' && (
                            <span className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {req.status === 'Confirmed' ? 'Scheduled' : 'Action Taken'}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>


          {/* 2. Available Trainings List */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Training Programs</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700' : ''}>
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrainings.map((training) => (
                <Card key={training._id} className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden h-full flex flex-col`}>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        {training.category}
                      </Badge>
                      <span className={`text-[10px] font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600 uppercase tracking-widest'}`}>
                        {training.mode}
                      </span>
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>{training.title}</h3>
                    <div className="space-y-2 mb-4 text-sm flex-1">
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className="h-4 w-4" />
                        <span>{training.date}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <GraduationCap className="h-4 w-4" />
                        <span>{training.trainer}</span>
                      </div>
                      <p className={`text-sm mt-3 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {training.description}
                      </p>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs h-10"
                      onClick={() => toast.success(`Registered for ${training.title}`)}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {availableTrainings.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No available trainings found
                </div>
              )}
            </div>
          </section>

          {/* 3. My Training Schedule */}
          <section>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Training Schedule</h2>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden shadow-sm`}>
              <Table>
                <TableHeader>
                  <TableRow className={darkMode ? 'bg-emerald-900/40 border-gray-800' : 'bg-emerald-600 border-emerald-500'}>
                    <TableHead className={`font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Training Title</TableHead>
                    <TableHead className={`font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Date</TableHead>
                    <TableHead className={`font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Mode</TableHead>
                    <TableHead className={`font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Status</TableHead>
                    <TableHead className={`font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Cert.</TableHead>
                    <TableHead className={`text-right font-black uppercase text-[10px] tracking-widest ${darkMode ? 'text-emerald-400' : 'text-white'}`}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTrainings.map((reg) => (
                    <TableRow key={reg._id} className={darkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50 border-gray-100 transition-colors'}>
                      <TableCell className={`font-medium sm:text-sm text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{reg.training?.title || 'Unknown Training'}</TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{reg.training?.date || 'N/A'}</TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{reg.training?.mode || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-sm shadow-none ${reg.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          reg.status === 'Registered' ? 'bg-blue-100 text-blue-700' :
                            reg.status === 'Ongoing' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-200 text-gray-600'
                          }`}>
                          {reg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reg.certificate ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-50 text-emerald-600">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {myTrainings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        You haven't registered for any trainings yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* 4. Performance Metrics & Analytics */}
          <section className="space-y-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance Metrics & Analytics</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Farmers Onboarded', value: stats?.farmersOnboarded || 0, icon: UserCheck, color: 'text-emerald-500' },
                { label: 'Field Visits', value: stats?.activeFarms || 0, icon: Sprout, color: 'text-emerald-500' },
                { label: 'Reports Submitted', value: stats?.reportsThisMonth || 0, icon: FileText, color: 'text-blue-500' },
                { label: 'Investment Matches', value: stats?.investorMatches || 0, icon: Handshake, color: 'text-amber-500' },
                { label: 'Disputes Resolved', value: stats?.pendingDisputes || 0, icon: AlertTriangle, color: 'text-rose-500' },
                { label: 'Performance Score', value: `${stats?.performanceScore || 0}%`, icon: GraduationCap, color: 'text-purple-500' },
              ].map((m, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</span>
                  </div>
                  <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>{m.value}</p>
                </div>
              ))}
            </div>

            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} p-6 shadow-sm`}>
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Trends</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly overview of extension delivery</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-400">Onboarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-400">Reports</span>
                  </div>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMetrics?.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} stroke="#9ca3af" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} stroke="#9ca3af" />
                    <Tooltip contentStyle={darkMode ? { backgroundColor: '#111827', border: '1px solid #1f2937' } : {}} cursor={{ fill: darkMode ? '#ffffff05' : '#00000005' }} />
                    <Bar dataKey="onboarding" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
                    <Bar dataKey="reports" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">

          {/* 5. Agent Activity Timeline */}
          <section>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Log</h2>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} p-6 shadow-sm`}>
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-px before:bg-gray-100 dark:before:bg-gray-800">
                {activities.map((item, idx) => (
                  <div key={item._id || idx} className="relative pl-8 group">
                    <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full z-10 flex items-center justify-center border-2 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-50'}`}>
                      {item.type === 'training' ? <CheckCircle className={`h-2 w-2 text-emerald-500`} /> :
                        item.type === 'report' ? <FileText className={`h-2 w-2 text-blue-500`} /> :
                          <TrendingUp className={`h-2 w-2 text-amber-500`} />}
                    </div>
                    <div className="transition-all">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-bold">{item.title}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No activity logged</div>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">
                View All Activity
              </Button>
            </Card>
          </section>

          {/* Help/Support Section */}
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <School className="h-48 w-48 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need Technical Help?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Connect with our support team or your regional supervisor for immediate assistance.</p>
              <div className="space-y-3">
                <Button className="w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold uppercase tracking-wider text-xs h-10 border-none">
                  Contact Supervisor
                </Button>
                <Button variant="link" className="w-full text-white text-xs font-bold uppercase tracking-widest p-0 underline-offset-4 decoration-white/30">
                  View Help Center
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TrainingPerformance = () => {
  return (
    <AgentLayout
      activeSection="training-performance"
      title="Training & Performance"
    >
      <TrainingPerformanceContent />
    </AgentLayout>
  );
};

export default TrainingPerformance;
