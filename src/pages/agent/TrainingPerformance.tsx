import React from 'react';
import AgentLayout from './AgentLayout';
import { agentTrainings, agentPerformanceTrend } from './agent-data';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
const TrainingPerformance: React.FC = () => {
  const { darkMode } = useDarkMode();
  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const trainingCardClass = darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-emerald-100 bg-emerald-50';
  const trainingTitleClass = darkMode ? 'text-emerald-200' : 'text-emerald-700';
  const trainingItemClass = darkMode ? 'bg-[#0b2528] text-gray-200' : 'bg-white text-gray-600';
  const trainingItemTitleClass = darkMode ? 'text-white' : 'text-gray-900';
  const performanceCardClass = darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-white';
  const performanceTextClass = darkMode ? 'text-gray-100' : 'text-gray-700';
  const chartAxisClass = darkMode ? '#a3b3c7' : '#94a3b8';

  return (
    <AgentLayout
      activeSection="training-performance"
      title="Training & Performance"
      subtitle="Level up agent capabilities and track monthly performance deliverables."
    >
      <Card className={`transition-colors ${cardClass}`}>
        <CardHeader>
          <CardTitle className={`text-xl ${titleClass}`}>Upcoming Sessions</CardTitle>
          <CardDescription className={descClass}>Reserve a seat and keep improving your advisory toolkit.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className={`rounded-2xl border p-4 ${trainingCardClass}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className={`text-sm font-semibold ${trainingTitleClass}`}>Upcoming Trainings</p>
              <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                {agentTrainings.upcoming.length}
              </Badge>
            </div>
            <ul className="space-y-3">
              {agentTrainings.upcoming.map((session) => (
                <li key={session.title} className={`rounded-lg p-3 text-sm shadow-sm ${trainingItemClass}`}>
                  <p className={`font-medium ${trainingItemTitleClass}`}>{session.title}</p>
                  <p>{session.date} · {session.time}</p>
                  <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{session.mode}</p>
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full bg-[#1db954] hover:bg-[#17a447] text-white">
              Join Training
            </Button>
          </div>
          <div className={`rounded-2xl border p-4 shadow-sm ${performanceCardClass}`}>
            <p className={`text-sm font-semibold ${performanceTextClass}`}>Performance Summary</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={agentPerformanceTrend} barSize={18}>
                <XAxis dataKey="month" stroke={chartAxisClass} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }} />
                <Bar dataKey="farmers" stackId="a" fill="#047857" radius={[6, 6, 0, 0]} />
                <Bar dataKey="reports" stackId="a" fill="#f97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="disputes" stackId="a" fill="#fb7185" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {agentTrainings.summary.map((item) => (
                <div key={item.label}>
                  <div className={`flex items-center justify-between text-sm font-medium ${performanceTextClass}`}>
                    <span>{item.label}</span>
                    <span>{item.value}/{item.goal}</span>
                  </div>
                  <Progress value={(item.value / item.goal) * 100} className="h-2 bg-emerald-100" aria-label={item.label} />
                </div>
              ))}
            </div>
            <Button variant="outline" className={darkMode ? 'mt-4 w-full border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
              Download Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </AgentLayout>
  );
};

export default TrainingPerformance;

