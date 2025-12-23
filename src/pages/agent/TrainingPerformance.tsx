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
import {
  agentProfile,
  availableTrainings,
  myTrainings,
  performanceMetrics,
  activityTimeline
} from './agent-data';

export const TrainingPerformanceContent = () => {
  const { darkMode } = useDarkMode();
  const [trainingFilter, setTrainingFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  const summaryCards = [
    { title: 'Available', value: '12', icon: GraduationCap, color: 'bg-blue-600' },
    { title: 'Upcoming', value: '3', icon: Calendar, color: 'bg-orange-600' },
    { title: 'Completed', value: '5', icon: CheckCircle, color: 'bg-emerald-600' },
    { title: 'Score', value: '89%', icon: TrendingUp, color: 'bg-purple-600' },
    { title: 'Reports', value: '48', icon: FileText, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
                <Card key={training.id} className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden h-full flex flex-col`}>
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
                        <span>NEIP Trainer</span>
                      </div>
                      <p className={`text-sm mt-3 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {training.description}
                      </p>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs h-10">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                  {myTrainings.map((training) => (
                    <TableRow key={training.id} className={darkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50 border-gray-100 transition-colors'}>
                      <TableCell className={`font-medium sm:text-sm text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{training.title}</TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{training.date}</TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{training.mode}</TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-sm shadow-none ${training.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          training.status === 'Registered' ? 'bg-blue-100 text-blue-700' :
                            training.status === 'Ongoing' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-200 text-gray-600'
                          }`}>
                          {training.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {training.certificate ? (
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
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* 4. Performance Metrics & Analytics */}
          <section className="space-y-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance Metrics & Analytics</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Farmers Onboarded', value: performanceMetrics.monthlyActivity[10].onboarding, icon: UserCheck, color: 'text-emerald-500' },
                { label: 'Field Visits', value: performanceMetrics.fieldVisits, icon: Sprout, color: 'text-emerald-500' },
                { label: 'Reports Submitted', value: performanceMetrics.monthlyActivity[10].reports, icon: FileText, color: 'text-blue-500' },
                { label: 'Investment Matches', value: '12', icon: Handshake, color: 'text-amber-500' },
                { label: 'Disputes Resolved', value: '8', icon: AlertTriangle, color: 'text-rose-500' },
                { label: 'Training Participation', value: `${performanceMetrics.score}%`, icon: GraduationCap, color: 'text-purple-500' },
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
                  <BarChart data={performanceMetrics.monthlyActivity}>
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
                {[
                  { time: '10 Nov', action: 'Completed training', subject: 'Digital Field Reporting', icon: CheckCircle, color: 'text-emerald-500' },
                  { time: '08 Nov', action: 'Submitted farm visit report', subject: 'John Mensah', icon: FileText, color: 'text-blue-500' },
                  { time: '07 Nov', action: 'Logged dispute', subject: '#D112', icon: AlertTriangle, color: 'text-rose-500' },
                  { time: '06 Nov', action: 'Verified farmer', subject: 'Amina Fuseini', icon: UserCheck, color: 'text-emerald-500' },
                  { time: '04 Nov', action: 'Attended Webinar', subject: 'Climate Resilience', icon: GraduationCap, color: 'text-purple-500' },
                  { time: '01 Nov', action: 'Reached Milestone', subject: '50 Onboarded', icon: TrendingUp, color: 'text-amber-500' },
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full z-10 flex items-center justify-center border-2 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-50'}`}>
                      <item.icon className={`h-2 w-2 ${item.color}`} />
                    </div>
                    <div className="transition-all">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</p>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="opacity-70">{item.action}: </span>
                        <span className="font-bold">{item.subject}</span>
                      </p>
                    </div>
                  </div>
                ))}
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
