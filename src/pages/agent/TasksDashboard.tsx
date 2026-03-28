import React, { useState } from 'react';
import AgentLayout from './AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  MapPin,
  ClipboardList,
  Camera,
  GraduationCap,
  Sprout,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  CalendarDays,
  Check
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AddTaskModal from '../../components/agent/AddTaskModal';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { GHANA_REGIONS, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';

// Mock Data
type TaskPriority = 'urgent' | 'normal' | 'low';
type TaskStatus = 'pending' | 'in-progress' | 'done';
type TaskType = 'visit' | 'kyc' | 'training' | 'media' | 'harvest' | 'sync';

interface Task {
  id: string;
  type: TaskType;
  title: string;
  farmer: string;
  farm: string;
  location?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  synced?: boolean;
}

// We will fetch this data from the backend
const mockTasks: Task[] = [];

const getTaskIcon = (type: TaskType) => {
  switch (type) {
    case 'visit': return <Sprout className="h-5 w-5 text-[#065f46]" />;
    case 'kyc': return <ClipboardList className="h-5 w-5 text-[#065f46]" />;
    case 'training': return <GraduationCap className="h-5 w-5 text-[#065f46]" />;
    case 'media': return <Camera className="h-5 w-5 text-[#065f46]" />;
    case 'harvest': return <Sprout className="h-5 w-5 text-[#065f46]" />;
    case 'sync': return <RefreshCw className="h-5 w-5 text-[#065f46]" />;
    default: return <ClipboardList className="h-5 w-5 text-gray-600" />;
  }
};

const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case 'urgent': return <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50/50">Urgent</Badge>;
    case 'normal': return <Badge variant="outline" className="text-[#065f46] border-[#065f46]/20 bg-[#065f46]/5">Normal</Badge>;
    case 'low': return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50/50">Low</Badge>;
  }
};

const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case 'pending': return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-200">Pending</Badge>;
    case 'in-progress': return <Badge variant="secondary" className="bg-[#065f46]/10 text-[#065f46] hover:bg-[#065f46]/10 border border-[#065f46]/20">In Progress</Badge>;
    case 'done': return <Badge variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-100 line-through">Done</Badge>;
  }
};

const TasksDashboard = () => {
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'due_today' | 'upcoming' | 'completed'>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      const raw = res.data?.data || res.data || [];
      const formattedTasks = (Array.isArray(raw) ? raw : []).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
      setTasks(formattedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filterTasks = (tasks: Task[], condition: (t: Task) => boolean) => tasks.filter(condition);

  const isOverdue = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isUpcoming = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  const overdueTasks = filterTasks(tasks, t => isOverdue(t.dueDate) && t.status !== 'done');
  const todayTasks = filterTasks(tasks, t => isToday(t.dueDate) && t.status !== 'done');
  const upcomingTasks = filterTasks(tasks, t => isUpcoming(t.dueDate) && t.status !== 'done');
  const completedTasks = filterTasks(tasks, t => t.status === 'done');

  // Days for the week view strip
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i + 1); // Start from Monday
    return d;
  });

  const getDayTaskCount = (date: Date) => {
    return tasks.filter(t => t.status !== 'done' && new Date(t.dueDate).toDateString() === date.toDateString()).length;
  };

  const handleDayClick = (dayStr: number) => {
    if (selectedDay === dayStr) {
      setSelectedDay(null); // toggle off
    } else {
      setSelectedDay(dayStr);
      setActiveTab('all');
    }
  };

  // Reset selected day when switching views
  React.useEffect(() => {
    setSelectedDay(null);
  }, [viewMode]);

  // Filter tasks based on tab & day & district/community
  const displayedTasks = React.useMemo(() => {
    let filtered = tasks;

    if (selectedDay) {
      filtered = filtered.filter(t => new Date(t.dueDate).getDate() === selectedDay);
    }

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(t => t.location?.toLowerCase().includes(selectedDistrict.toLowerCase()));
    }

    if (selectedCommunity !== 'all') {
      filtered = filtered.filter(t => t.location?.toLowerCase().includes(selectedCommunity.toLowerCase()));
    }

    switch (activeTab) {
      case 'overdue':
        return filtered.filter(t => isOverdue(t.dueDate) && t.status !== 'done');
      case 'due_today':
        return filtered.filter(t => isToday(t.dueDate) && t.status !== 'done');
      case 'upcoming':
        return filtered.filter(t => isUpcoming(t.dueDate) && t.status !== 'done');
      case 'completed':
        return filtered.filter(t => t.status === 'done');
      case 'all':
      default:
        // if displaying all but day is NOT selected, just show pending things... actually, let's show all pending
        return filtered.filter(t => t.status !== 'done');
    }
  }, [selectedDay, activeTab, tasks, selectedDistrict, selectedCommunity]);

  return (
    <AgentLayout
      activeSection="tasks-alerts"
      title="Tasks Dashboard"
    >
      <div className="space-y-6">

        {/* Header Section inside content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
          <div>
            <h2 className="text-[24px] font-bold text-[#002f37]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              My Tasks
            </h2>
            <p className="text-[14px] font-medium text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your field schedule and pending actions
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity('all'); }}>
                <SelectTrigger className={`h-11 w-40 border-gray-100 bg-white rounded-xl text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm`}>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="all">All Districts</SelectItem>
                  {GHANA_REGIONS[getRegionKey(agent?.region)]?.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className={`h-11 w-40 border-gray-100 bg-white rounded-xl text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm`}>
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="all">All Communities</SelectItem>
                  {selectedDistrict !== 'all' && GHANA_COMMUNITIES[selectedDistrict]?.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-1 flex shadow-sm">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'week' ? 'bg-[#065f46] text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'month' ? 'bg-[#065f46] text-white shadow-lg shadow-[#065f46]/20' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Month
              </button>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-semibold text-[14px] px-6 h-11 rounded-xl shadow-lg shadow-[#065f46]/20 flex items-center gap-2 border-none transition-all"
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>

        {/* Overdue Alert Banner */}
        {overdueTasks.length > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-rose-800 font-bold text-sm lg:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>You have {overdueTasks.length} overdue tasks!</h3>
                <p className="text-rose-600 text-xs lg:text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Please resolve these soon to maintain your KPI score.</p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="text-rose-700 font-bold px-0 hover:text-rose-800 hidden sm:flex"
              onClick={() => {
                setActiveTab('overdue');
                setSelectedDay(null);
              }}
            >
              View all overdue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card 
            className="rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none bg-white cursor-pointer"
            onClick={() => { setActiveTab('due_today'); setSelectedDay(null); }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock className="h-20 w-20 sm:h-24 sm:w-24 text-amber-500 -rotate-12" />
            </div>
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 w-5 text-amber-500" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">TODAY</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">Due Today</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <h3 className="text-xl sm:text-4xl font-black text-gray-900 leading-none">{todayTasks.length}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">Tasks</span>
              </div>
            </div>
          </Card>
          
          <Card 
            className="rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none bg-white cursor-pointer"
            onClick={() => { setActiveTab('overdue'); setSelectedDay(null); }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <AlertCircle className="h-20 w-20 sm:h-24 sm:w-24 text-rose-500 -rotate-12" />
            </div>
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-rose-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 w-5 text-rose-500" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">URGENT</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">Overdue</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <h3 className="text-xl sm:text-4xl font-black text-gray-900 leading-none">{overdueTasks.length}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">Tasks</span>
              </div>
            </div>
          </Card>

          <Card 
            className="rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none bg-white cursor-pointer"
            onClick={() => { setActiveTab('completed'); setSelectedDay(null); }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-20 w-20 sm:h-24 sm:w-24 text-emerald-500 -rotate-12" />
            </div>
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 sm:h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">THIS WEEK</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">Completed</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <h3 className="text-xl sm:text-4xl font-black text-gray-900 leading-none">{completedTasks.length}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">Tasks</span>
              </div>
            </div>
          </Card>

          <Card 
            className="rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none bg-[#065f46] cursor-pointer"
            onClick={() => { setActiveTab('upcoming'); setSelectedDay(null); }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <CalendarDays className="h-20 w-20 sm:h-24 sm:w-24 text-white -rotate-12" />
            </div>
            <div className="flex items-center justify-between">
              <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                <CalendarDays className="h-4 w-4 sm:h-5 w-5 text-white" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-white/40 uppercase tracking-widest">FUTURE</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase tracking-widest mb-0.5 sm:mb-1">Upcoming</p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <h3 className="text-xl sm:text-4xl font-black text-white leading-none">{upcomingTasks.length}</h3>
                <span className="text-[8px] sm:text-[10px] font-bold text-white/80">Tasks</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           {/* Horizontal Calendar View (Week vs Month) */}
           {viewMode === 'week' ? (
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto scrollbar-hide">
                <div className="flex-shrink-0 md:pr-6 md:border-r border-gray-100">
                  <h3 className="text-sm font-black text-[#002f37] uppercase tracking-widest whitespace-nowrap">This Week</h3>
                  <p className="text-xs text-gray-500 font-medium">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                   {weekDays.map((date, idx) => {
                      const isSelected = selectedDay === date.getDate();
                      const isCurrentDay = isToday(date);
                      const taskCount = getDayTaskCount(date);

                      return (
                        <div 
                          key={idx}
                          onClick={() => handleDayClick(date.getDate())}
                          className={`flex flex-col items-center justify-center py-3 px-2 sm:px-5 rounded-xl cursor-pointer transition-all flex-1 min-w-[3.5rem] sm:min-w-[5rem] border ${isSelected ? 'bg-[#065f46] border-[#065f46] text-white shadow-lg shadow-[#065f46]/20 md:scale-105' : 'bg-gray-50/50 border-gray-100 hover:border-[#065f46]/30 hover:bg-[#065f46]/5'}`}
                        >
                           <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-white/80' : isCurrentDay ? 'text-[#065f46]' : 'text-gray-400'}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                           <span className={`text-lg sm:text-xl font-black leading-none mb-1.5 ${isSelected ? 'text-white' : 'text-[#002f37]'}`}>{date.getDate()}</span>
                           <div className={`h-1.5 w-1.5 rounded-full ${taskCount > 0 ? (isOverdue(date) ? 'bg-rose-500' : isCurrentDay ? 'bg-amber-500' : 'bg-[#065f46]') : 'bg-transparent'}`} />
                        </div>
                      );
                   })}
                </div>
             </div>
           ) : (
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[140px] text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <CalendarDays className="h-8 w-8 text-[#065f46]/40" />
                </div>
                <h3 className="text-[#002f37] font-black text-lg">Monthly Overview</h3>
                <p className="text-gray-500 font-medium text-sm max-w-md">The full monthly calendar view is being prepared. For now, easily manage your schedule via the Week view or the filters below.</p>
                <Button 
                  onClick={() => setViewMode('week')}
                  variant="outline" 
                  className="mt-4 border border-[#065f46]/20 text-[#065f46] hover:bg-[#065f46]/5"
                >
                  Return to Week View
                </Button>
             </div>
           )}

           {/* Tabs for Task filtering */}
            <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex overflow-x-auto whitespace-nowrap scrollbar-hide shadow-sm gap-1">
              <button
                onClick={() => { setActiveTab('all'); setSelectedDay(null); }}
                className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-wider transition-all flex items-center gap-2 ${activeTab === 'all' && !selectedDay ? 'bg-[#065f46] text-white shadow-md shadow-[#065f46]/20' : 'text-gray-500 hover:text-[#065f46] hover:bg-gray-50'}`}
              >
                ALL PENDING
              </button>
              <button
                onClick={() => { setActiveTab('overdue'); setSelectedDay(null); }}
                className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'overdue' && !selectedDay ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-gray-500 hover:text-rose-600 hover:bg-gray-50'}`}
              >
                OVERDUE
                {overdueTasks.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'overdue' && !selectedDay ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>{overdueTasks.length}</span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('due_today'); setSelectedDay(null); }}
                className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'due_today' && !selectedDay ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-gray-500 hover:text-amber-500 hover:bg-gray-50'}`}
              >
                DUE TODAY
                {todayTasks.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'due_today' && !selectedDay ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>{todayTasks.length}</span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('upcoming'); setSelectedDay(null); }}
                className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'upcoming' && !selectedDay ? 'bg-[#065f46] text-white shadow-md shadow-[#065f46]/20' : 'text-gray-500 hover:text-[#065f46] hover:bg-gray-50'}`}
              >
                UPCOMING
                {upcomingTasks.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'upcoming' && !selectedDay ? 'bg-white/20 text-white' : 'bg-[#065f46]/10 text-[#065f46]'}`}>{upcomingTasks.length}</span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('completed'); setSelectedDay(null); }}
                className={`px-6 py-3 rounded-xl text-[13px] font-bold tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'completed' && !selectedDay ? 'bg-gray-800 text-white shadow-md shadow-gray-800/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                COMPLETED
                {completedTasks.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'completed' && !selectedDay ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{completedTasks.length}</span>
                )}
              </button>
            </div>

            {/* Task List Render */}
            <div className="space-y-4">
               {displayedTasks.length > 0 ? (
                 displayedTasks.map(task => (
                   <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
                 ))
               ) : (
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                     <CheckCircle2 className="h-10 w-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-black text-[#002f37] mb-2">No tasks found</h3>
                   <p className="text-gray-500 font-medium">You have no tasks matching this criteria.</p>
                 </div>
               )}
            </div>
        </div>
      </div>
      
      <AddTaskModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onTaskAdded={fetchTasks} 
      />
    </AgentLayout>
  );
};

// Sub-component for individual task
const TaskCard = ({ task, onRefresh }: { task: Task; onRefresh: () => void }) => {
  const isOverdueTask = task.status !== 'done' && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  const isTodayTask = task.status !== 'done' && new Date(task.dueDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
  const isCompleted = task.status === 'done';

  const borderColor = isCompleted 
    ? 'border-l-gray-300' 
    : isOverdueTask 
      ? 'border-l-rose-500' 
      : isTodayTask 
        ? 'border-l-amber-500' 
        : 'border-l-emerald-500';

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
     try {
       await api.put(`/tasks/${task.id}`, { status: newStatus });
       onRefresh();
     } catch (err) {
       console.error('Failed to update task status', err);
     }
  };

  return (
    <Card className={`border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-lg group rounded-2xl relative ${isCompleted ? 'bg-gray-50/80' : 'bg-white'}`}>
       {/* colored left indicator bar */}
       <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${isCompleted ? 'bg-gray-300' : isOverdueTask ? 'bg-rose-500' : isTodayTask ? 'bg-amber-500' : 'bg-[#065f46]'}`} />
       
       <div className={`p-5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center ml-1 ${isCompleted ? 'grayscale-[0.5] opacity-75' : ''}`}>
          
          <div className="flex items-start gap-4">
             <div className="p-3.5 bg-gray-50 rounded-xl mt-0.5 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                {getTaskIcon(task.type)}
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h4 className={`font-black text-[15px] ${isCompleted ? 'text-gray-500 line-through' : 'text-[#002f37]'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{task.title}</h4>
                  {!isCompleted && getPriorityBadge(task.priority)}
                </div>
                
                <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 font-medium font-inter">
                   <div className="flex items-center gap-1.5">
                     <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {task.farmer !== 'System' && <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.farmer}`} alt={task.farmer} />}
                     </div>
                     <span className="font-bold text-gray-700">{task.farmer}</span>
                   </div>
                   
                   {task.location && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <div className="flex items-center gap-1 text-[#065f46] font-semibold">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{task.location}</span>
                        </div>
                     </>
                   )}
                   
                   {!task.location && task.farm !== 'N/A' && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span>{task.farm}</span>
                        </div>
                     </>
                   )}
                </div>

                <div className="mt-3 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {isCompleted && task.synced !== undefined && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                      {task.synced ? (
                        <span className="text-[#065f46] flex items-center gap-1"><Check className="h-3 w-3"/> SYNCED</span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1"><RefreshCw className="h-3 w-3"/> PENDING SYNC</span>
                      )}
                    </>
                  )}
                </div>
             </div>
          </div>

          <div className="flex sm:flex-col justify-between items-end gap-3 ml-12 sm:ml-0">
             {getStatusBadge(task.status)}
             {!isCompleted ? (
               <Button 
                onClick={() => handleUpdateStatus(task.status === 'pending' ? 'in-progress' : 'done')}
                className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-md shadow-[#065f46]/20 transition-all"
               >
                 {task.status === 'pending' ? 'Start Task' : 'Mark Done'}
               </Button>
             ) : (
               <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-lg transition-colors">
                 <MoreVertical className="h-4 w-4" />
               </Button>
             )}
          </div>
       </div>
    </Card>
  );
};

export default TasksDashboard;
