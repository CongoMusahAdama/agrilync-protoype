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
  GraduationCap,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  Download,
  Eye,
  Filter,
  Search,
  School,
  History,
  Activity,
  UserCheck
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

  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2/3 width) - Trainings & Metrics */}
        <div className="lg:col-span-2 space-y-8">

          {/* 2. Available Trainings List */}
          <Card className={`${sectionCardClass}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={darkMode ? 'text-gray-100' : ''}>Available Training Programs</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>Enhance your skills with these courses</CardDescription>
                </div>
                <Button variant="outline" className={darkMode ? 'border-gray-600 text-gray-300' : ''}>
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableTrainings.map((training) => (
                  <div
                    key={training.id}
                    className={`p-4 rounded-lg border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-colors ${darkMode ? 'border-[#1b5b65] bg-[#0f3035] hover:bg-[#12393f]' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                        <School className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{training.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{training.category}</span>
                          <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Calendar className="h-3 w-3" /> {training.date}
                          </span>
                          <span className={`flex items-center gap-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {training.mode}
                          </span>
                        </div>
                        <p className={`text-sm mt-2 line-clamp-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{training.description}</p>
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto bg-[#1db954] hover:bg-[#17a447] text-white">
                      Register
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. My Training Schedule */}
          <Card className={`${sectionCardClass}`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>My Training Schedule</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>Track your enrolled and completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className={darkMode ? 'border-gray-700' : 'border-gray-200'}>
                      <TableHead className={darkMode ? 'text-gray-300' : ''}>Training Title</TableHead>
                      <TableHead className={darkMode ? 'text-gray-300' : ''}>Date</TableHead>
                      <TableHead className={darkMode ? 'text-gray-300' : ''}>Mode</TableHead>
                      <TableHead className={darkMode ? 'text-gray-300' : ''}>Status</TableHead>
                      <TableHead className={`text-right ${darkMode ? 'text-gray-300' : ''}`}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTrainings.map((training) => (
                      <TableRow key={training.id} className={darkMode ? 'border-gray-700 hover:bg-[#0f3035]' : 'hover:bg-gray-50'}>
                        <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{training.title}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{training.date}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{training.mode}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${training.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
                            training.status === 'Registered' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' :
                              training.status === 'Missed' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                            }`}>
                            {training.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {training.certificate && (
                              <Button variant="ghost" size="sm" className={darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-[#12393f]' : 'text-blue-600'}>
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className={darkMode ? 'text-gray-400 hover:text-white hover:bg-[#12393f]' : 'text-gray-500'}>
                              <Eye className="h-4 w-4" />
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

          {/* 4. Performance Metrics (Charts) */}
          <Card className={`${sectionCardClass}`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Performance Analytics</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>Activity trends for the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceMetrics.monthlyActivity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} vertical={false} />
                    <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} axisLine={false} tickLine={false} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={darkMode ? { backgroundColor: '#0b2528', borderColor: '#1b5b65', color: '#fff' } : {}}
                    />
                    <Bar dataKey="onboarding" name="Farmers Onboarded" fill="#1db954" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reports" name="Reports Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Onboarded (Month)</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{performanceMetrics.monthlyActivity[10].onboarding}</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reports (Month)</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{performanceMetrics.monthlyActivity[10].reports}</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Field Visits</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{performanceMetrics.fieldVisits}</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Score</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{performanceMetrics.score}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3 width) - Activity Timeline & Quick Links */}
        <div className="space-y-8">

          {/* 5. Agent Activity Timeline */}
          <Card className={`${sectionCardClass} h-fit`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Activity Log</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your recent actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                {activityTimeline.map((item, idx) => (
                  <div key={item.id} className="ml-6 relative">
                    <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ${darkMode ? 'ring-[#0b2528] bg-gray-800' : 'ring-white bg-gray-100'
                      }`}>
                      {item.type === 'training' && <School className="h-3 w-3 text-blue-500" />}
                      {item.type === 'report' && <FileText className="h-3 w-3 text-purple-500" />}
                      {item.type === 'verification' && <UserCheck className="h-3 w-3 text-green-500" />}
                      {item.type === 'dispute' && <Activity className="h-3 w-3 text-red-500" />}
                      {item.type === 'match' && <TrendingUp className="h-3 w-3 text-orange-500" />}
                      {item.type === 'event' && <Calendar className="h-3 w-3 text-teal-500" />}
                    </span>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.title}</h3>
                    <time className={`block mb-1 text-xs font-normal leading-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</time>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs text-gray-500">
                View Full History
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions / Recommendations */}
          <Card className={`bg-gradient-to-br from-[#1db954] to-[#17a447] text-white border-none shadow-lg`}>
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
              <CardDescription className="text-white/80">Connect with a supervisor for guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full bg-white text-[#1db954] hover:bg-gray-50 border-none">
                Contact Supervisor
              </Button>
              <Button variant="link" className="w-full text-white mt-2">
                View FAQ
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div >
  );
};

const TrainingPerformance = () => {
  return (
    <AgentLayout
      activeSection="training-performance"
      title="Training & Performance"
      subtitle="Track your skills, schedule, and performance metrics."
    >
      <TrainingPerformanceContent />
    </AgentLayout>
  );
};

export default TrainingPerformance;
