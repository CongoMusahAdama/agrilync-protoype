import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Leaf,
  DollarSign,
  BarChart3,
  TrendingUp,
  Activity,
  Moon,
  Sun,
  Star,
  Settings,
  Bell,
  Users,
  Calendar,
  MapPin,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';

const FarmAnalytics = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const sidebarDarkMode = !darkMode;
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('farm-analytics');


  // Mock data for different user types
  const mockData = {
    grower: {
      name: 'John Agribusiness',
      stats: {
        totalProjects: 12,
        activeConnections: 8,
        totalInvestment: 45000,
        monthlyGrowth: 15.2,
        performance: 85,
        satisfaction: 4.8
      }
    },
    farmer: {
      name: 'Sarah Farm',
      stats: {
        totalCrops: 8,
        activeProjects: 5,
        totalEarnings: 25000,
        monthlyGrowth: 12.5,
        performance: 92,
        satisfaction: 4.9
      }
    },
    investor: {
      name: 'AgriInvest Ltd',
      stats: {
        totalInvestment: 150000,
        activePortfolio: 12,
        totalReturns: 18000,
        monthlyGrowth: 8.3,
        performance: 78,
        satisfaction: 4.5
      }
    },
    agent: {
      name: 'Extension Officer',
      stats: {
        activeConnections: 25,
        totalFarmers: 45,
        completedVisits: 120,
        monthlyGrowth: 22.1,
        performance: 95,
        satisfaction: 5.0
      }
    }
  };

  const currentData = mockData[userType as keyof typeof mockData] || mockData.grower;

  // Performance data with review ratings over time
  const performanceData = [
    { month: 'Jan', performance: 72, rating: 4.2 },
    { month: 'Feb', performance: 75, rating: 4.3 },
    { month: 'Mar', performance: 78, rating: 4.4 },
    { month: 'Apr', performance: 82, rating: 4.5 },
    { month: 'May', performance: 85, rating: 4.6 },
    { month: 'Jun', performance: 88, rating: 4.7 },
    { month: 'Jul', performance: 90, rating: 4.8 },
    { month: 'Aug', performance: 92, rating: 4.8 },
    { month: 'Sep', performance: 89, rating: 4.7 },
    { month: 'Oct', performance: 91, rating: 4.8 },
    { month: 'Nov', performance: 93, rating: 4.9 },
    { month: 'Dec', performance: 95, rating: 5.0 },
  ];

  // Recent Trends pie chart data
  const trendsData = [
    { name: 'Monthly Growth', value: currentData.stats.monthlyGrowth, color: '#7ede56' },
    { name: 'Total Value', value: 35, color: '#002f37' },
    { name: 'Active Items', value: 25, color: '#ffa500' },
    { name: 'Other Metrics', value: 15, color: '#ff6347' },
  ];

  // Yield by Category data (for pie chart)
  const yieldData = [
    { name: 'Cocoa', value: 35, color: '#7ede56' },
    { name: 'Maize', value: 25, color: '#ffa500' },
    { name: 'Poultry', value: 20, color: '#ff6347' },
    { name: 'Vegetables', value: 15, color: '#921573' },
    { name: 'Other', value: 5, color: '#002f37' },
  ];

  // Revenue by Month data (for bar chart)
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 },
    { month: 'Jul', revenue: 30000 },
    { month: 'Aug', revenue: 32000 },
    { month: 'Sep', revenue: 29000 },
    { month: 'Oct', revenue: 31000 },
    { month: 'Nov', revenue: 33000 },
    { month: 'Dec', revenue: 35000 },
  ];

  const performanceConfig = {
    performance: {
      label: 'Performance Score',
      color: darkMode ? '#7ede56' : '#7ede56',
    },
    rating: {
      label: 'Review Rating',
      color: darkMode ? '#ffa500' : '#ffa500',
    },
  };

  const trendsConfig = {
    value: {
      label: 'Trends',
    },
  };

  const yieldConfig = {
    value: {
      label: 'Yield',
    },
  };

  const revenueConfig = {
    revenue: {
      label: 'Revenue (GHS)',
      color: darkMode ? '#7ede56' : '#7ede56',
    },
  };

  const chartStyles = {
    performance: {
      color: darkMode ? '#7ede56' : '#002f37',
      areaFill: darkMode ? 'rgba(126, 222, 86, 0.2)' : 'rgba(0, 47, 55, 0.2)',
      stroke: darkMode ? '#7ede56' : '#002f37',
    },
    satisfaction: {
      color: darkMode ? '#ff6347' : '#ff6347',
      areaFill: darkMode ? 'rgba(255, 99, 71, 0.2)' : 'rgba(255, 99, 71, 0.2)',
      stroke: '#ff6347',
    },
    trends: {
      color: darkMode ? '#ffa500' : '#ffa500',
    },
    comparison: {
      color: darkMode ? '#921573' : '#921573',
    },
    ratings: {
      color: darkMode ? '#7ede56' : '#7ede56',
    },
  };


  return (
    <DashboardLayout activeSidebarItem="farm-analytics" title="Farm Analytics" description="Track your farm performance and insights">

      <div className="w-full p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your performance and growth metrics</p>
        </div>

        {/* Key Metrics Cards - Matching Main Dashboard Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          {/* Performance Score - Green */}
          <Card className="hover:shadow-md transition-shadow bg-[#7ede56] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Performance</span>
                <span className="text-xl sm:text-2xl font-bold text-white">{currentData.stats.performance}%</span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction - Blue */}
          <Card className="hover:shadow-md transition-shadow bg-[#3b82f6] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Satisfaction</span>
                <span className="text-xl sm:text-2xl font-bold text-white">{currentData.stats.satisfaction}/5.0</span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Total Value - Coral/Red */}
          <Card className="hover:shadow-md transition-shadow bg-[#ff6347] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Total Value</span>
                <span className="text-lg sm:text-2xl font-bold text-white truncate">
                  ₵{userType === 'farmer' ?
                    ('totalEarnings' in currentData.stats ? (currentData.stats as any).totalEarnings : 0).toLocaleString() :
                    ('totalInvestment' in currentData.stats ? (currentData.stats as any).totalInvestment :
                      'totalReturns' in currentData.stats ? (currentData.stats as any).totalReturns : 0)
                      .toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth - Magenta/Purple */}
          <Card className="hover:shadow-md transition-shadow bg-[#9333ea] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Growth</span>
                <span className="text-xl sm:text-2xl font-bold text-white">+{currentData.stats.monthlyGrowth}%</span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts - Larger Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={`${darkMode ? 'bg-[#002f37]' : 'bg-white'} transition-colors border-0`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-base sm:text-lg flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                <Leaf className="h-5 w-5 text-[#7ede56]" />
                Yield by Category
              </CardTitle>
              <CardDescription className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : ''}`}>Distribution of outputs across farm types</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isMobile ? (
                <div className="space-y-5 py-4">
                  {yieldData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                        <span className={`font-bold ${darkMode ? 'text-[#7ede56]' : 'text-gray-900'}`}>{item.value}%</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                            boxShadow: `0 0 10px ${item.color}40`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ChartContainer config={yieldConfig} className="h-80">
                    <PieChart>
                      <Pie
                        data={yieldData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (percent < 0.03) return ''; // Hide labels for very small slices
                          return `${name}: ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {yieldData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1a1f24' : '#ffffff',
                          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: darkMode ? '#f3f4f6' : '#111827',
                        }}
                        formatter={(value: number, name: string) => [
                          `${value}%`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {yieldData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</span>
                        </div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className={`${darkMode ? 'bg-[#002f37]' : 'bg-white'} transition-colors border-0`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-base sm:text-lg flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                <DollarSign className="h-5 w-5 text-[#7ede56]" />
                Revenue by Month
              </CardTitle>
              <CardDescription className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : ''}`}>Track your revenues over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={revenueConfig} className="h-64 sm:h-80 w-full flex justify-center">
                <BarChart data={isMobile ? revenueData.slice(-6) : revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                    stroke={darkMode ? '#4b5563' : '#d1d5db'}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                    stroke={darkMode ? '#4b5563' : '#d1d5db'}
                    axisLine={false}
                    tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: darkMode ? '#ffffff10' : '#00000005' }}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1a1f24' : '#ffffff',
                      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: darkMode ? '#f3f4f6' : '#111827',
                    }}
                    formatter={(value: number) => [
                      `₵${value.toLocaleString()}`,
                      'Revenue'
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={darkMode ? '#7ede56' : '#7ede56'}
                    radius={[4, 4, 0, 0]}
                    barSize={isMobile ? 20 : 30}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview & Recent Trends - Larger Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${darkMode ? 'bg-[#002f37]' : 'bg-white'} transition-colors border-0`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-base sm:text-lg ${darkMode ? 'text-white' : ''}`}>Performance Overview</CardTitle>
                  <CardDescription className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : ''}`}>Your progress and growth metrics</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? 'text-[#7ede56]' : 'text-yellow-500'}`} fill={darkMode ? '#7ede56' : '#eab308'} />
                  <span className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performanceData[performanceData.length - 1].rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isMobile ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-8">
                  <div className="relative h-48 w-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className={`${darkMode ? 'text-gray-800' : 'text-gray-100'}`}
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#7ede56"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={2 * Math.PI * 80 * (1 - currentData.stats.performance / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.stats.performance}%</span>
                      <span className={`text-xs uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level</span>
                    </div>
                  </div>
                  <div className={`w-full grid grid-cols-2 gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="text-center">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target Achieved</p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>92%</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Review Avg</p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.stats.satisfaction}/5</p>
                    </div>
                  </div>
                </div>
              ) : (
                <ChartContainer config={performanceConfig} className="h-80">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={darkMode ? '#7ede56' : '#7ede56'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={darkMode ? '#7ede56' : '#7ede56'} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={darkMode ? '#ffa500' : '#ffa500'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={darkMode ? '#ffa500' : '#ffa500'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                      stroke={darkMode ? '#4b5563' : '#d1d5db'}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                      stroke={darkMode ? '#4b5563' : '#d1d5db'}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[3.5, 5.5]}
                      tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                      stroke={darkMode ? '#4b5563' : '#d1d5db'}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1a1f24' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="performance"
                      stroke={darkMode ? '#7ede56' : '#7ede56'}
                      fillOpacity={1}
                      fill="url(#colorPerformance)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rating"
                      stroke={darkMode ? '#ffa500' : '#ffa500'}
                      strokeWidth={2}
                      dot={{ fill: darkMode ? '#ffa500' : '#ffa500', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      iconType="line"
                      formatter={(value) => (
                        <span style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>
                          {value === 'performance' ? 'Performance Score' : 'Review Rating'}
                        </span>
                      )}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className={`${darkMode ? 'bg-[#002f37]' : 'bg-white'} transition-colors border-0`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-base sm:text-lg ${darkMode ? 'text-white' : ''}`}>Recent Trends</CardTitle>
              <CardDescription className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : ''}`}>Key performance indicators distribution</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isMobile ? (
                <div className="grid grid-cols-1 gap-3 py-2">
                  {trendsData.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-gray-800/20 border-gray-700/50' : 'bg-gray-50/50 border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <Activity className="h-5 w-5" style={{ color: item.color }} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${darkMode ? 'text-[#7ede56]' : 'text-gray-900'}`}>{item.value}%</p>
                        <TrendingUp className="h-3 w-3 inline ml-1 text-[#7ede56]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ChartContainer config={trendsConfig} className="h-80">
                    <PieChart>
                      <Pie
                        data={trendsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (percent < 0.05) return ''; // Hide labels for very small slices
                          return `${name}: ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trendsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1a1f24' : '#ffffff',
                          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          color: darkMode ? '#f3f4f6' : '#111827',
                        }}
                        formatter={(value: number, name: string) => [
                          `${value}%`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {trendsData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</span>
                        </div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmAnalytics;
