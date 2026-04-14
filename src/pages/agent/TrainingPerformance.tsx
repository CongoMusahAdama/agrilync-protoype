import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AgentLayout from './AgentLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
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
  Handshake,
  Loader2,
  MessageSquare,
  Phone,
  X,
  CheckCircle2
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import ScheduleVisitModal from '@/components/agent/ScheduleVisitModal';
import DeliverTrainingModal from '@/components/agent/DeliverTrainingModal';
import SubmitTrainingReportModal from '@/components/agent/SubmitTrainingReportModal';
import Preloader from '@/components/ui/Preloader';

export const TrainingPerformanceContent = () => {
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const [trainingFilter, setTrainingFilter] = useState('all');

  // All useState hooks must be declared before any conditional returns
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [isProcessingConsultation, setIsProcessingConsultation] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedVisitForSMS, setSelectedVisitForSMS] = useState<string | null>(null);
  const [selectedVisitForCall, setSelectedVisitForCall] = useState<string | null>(null);
  const [deliverTrainingOpen, setDeliverTrainingOpen] = useState(false);
  
  // Training Report State
  const [selectedDeliveryForReport, setSelectedDeliveryForReport] = useState<any>(null);
  const [selectedDeliveryForEdit, setSelectedDeliveryForEdit] = useState<any>(null);
  const [isSendingSMS, setIsSendingSMS] = useState<string | null>(null);
  const [sendingSimulation, setSendingSimulation] = useState(false);

  const { data: summaryData, isLoading: loadingSummary, isFetching: fetchingSummary, refetch } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    },
    // Uses global defaults from App.tsx
  });

  const availableTrainingsRaw = summaryData?.trainings || [];
  const availableTrainings = availableTrainingsRaw.filter((t: any) => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    return !effectiveRegion || t.region === effectiveRegion;
  });
  const myTrainings = summaryData?.myTrainings || [];
  const activities = summaryData?.activities || [];
  const stats = summaryData?.stats || {};

  // Fetch scheduled visits
  const { data: scheduledVisitsData, isLoading: loadingVisits, isFetching: fetchingVisits, refetch: refetchScheduledVisits } = useQuery({
    queryKey: ['scheduledVisits'],
    queryFn: async () => {
      const response = await api.get('/scheduled-visits');
      const resData = response.data;
      return Array.isArray(resData) ? resData : (resData?.data || []);
    },
    // Uses global defaults from App.tsx
  });

  const scheduledVisits = scheduledVisitsData || [];

  // Fetch training deliveries created by this agent
  const { data: trainingDeliveriesData, refetch: refetchDeliveries } = useQuery({
    queryKey: ['trainingDeliveries'],
    queryFn: async () => {
      const response = await api.get('/training-deliveries');
      return response.data.data || [];
    },
  });

  const trainingDeliveries = trainingDeliveriesData || [];

  const loading = loadingSummary || loadingVisits;
  const isFetching = fetchingSummary || fetchingVisits;
  const isLoaded = !loading && !isFetching;

  const handleConsultationAction = useCallback(async (id: string, action: 'accept' | 'decline' | 'reschedule') => {
    setIsProcessingConsultation(id);
    try {
      await api.post(`/consultations/${id}/${action}`);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
              Consultation ${action}d successfully
            </p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
      refetch();

      // Update local state
      setConsultationRequests(prev => prev.map(req => {
        if (req.id === id) {
          if (action === 'accept') return { ...req, status: 'Confirmed' };
          if (action === 'decline') return { ...req, status: 'Declined' };
          if (action === 'reschedule') return { ...req, status: 'Reschedule Requested' };
        }
        return req;
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || error.message || `Failed to ${action} consultation`;
      Swal.fire({ icon: 'error', title: 'Action Failed', text: errorMessage, confirmButtonColor: '#065f46' });
    } finally {
      setIsProcessingConsultation(null);
    }
  }, [refetch]);

  // Show preloader on initial load or when fetching data
  if ((loading || isFetching) && !summaryData && !scheduledVisitsData) {
    return <Preloader />;
  }

  const loadingAvailable = loadingSummary;
  const loadingMyTrainings = loadingSummary;
  const loadingStats = loadingSummary;
  const loadingActivities = loadingSummary;

  // Send SMS for scheduled visit
  const handleSendSMS = async (visitId: string) => {
    setSelectedVisitForSMS(visitId);
    try {
      const response = await api.post(`/scheduled-visits/${visitId}/send-sms`);
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'SMS Sent!',
          html: `
            <div style="text-align: center; padding: 10px 0;">
              <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                ${response.data.message || 'SMS sent successfully'}
              </p>
              <div style="font-size: 11px; color: #6b7280; margin-top: 10px; background: #f9fafb; padding: 8px; border-radius: 8px;">
                "Your field notification has been queued for transmission to the group mobile list."
              </div>
            </div>
          `,
          confirmButtonText: 'Great!',
          confirmButtonColor: '#065f46',
          timer: 2500,
          timerProgressBar: true
        });
        refetchScheduledVisits();
      } else {
        Swal.fire({ icon: 'error', title: 'Dispatch Failed', text: response.data.message || 'The network was unable to route the SMS reminder.', confirmButtonColor: '#065f46' });
      }
    } catch (error: any) {
      console.error('SMS Error Details:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'The communication server return an unexpected error (500).';
      
      // Prototype Fallback: If it's a server error, offer to simulate success for the demo
      if (error.response?.status === 500) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Transmission Blocked',
          text: 'The backend SMS gateway is experiencing internal connectivity issues.',
          showCancelButton: true,
          confirmButtonText: 'Run Mission Simulation',
          cancelButtonText: 'Ignore',
          confirmButtonColor: '#fbbf24',
          footer: '<span style="font-size: 10px; color: #9ca3af;">Developer Mode: Simulate successful dispatch for verification.</span>'
        });

        if (result.isConfirmed) {
          setSendingSimulation(true);
          await new Promise(r => setTimeout(r, 1500));
          await Swal.fire({
            icon: 'success',
            title: 'Simulation Finalized',
            text: 'System has marked the notification as "Sent" in offline mode.',
            confirmButtonColor: '#065f46',
            timer: 2000
          });
          // Update local status if possible or just refetch
          refetchScheduledVisits();
          setSendingSimulation(false);
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Transmission Error', text: errorMessage, confirmButtonColor: '#065f46' });
      }
    } finally {
      setSelectedVisitForSMS(null);
    }
  };

  // Log phone call
  const handleLogPhoneCall = async (visitId: string) => {
    setSelectedVisitForCall(visitId);
    try {
      const response = await api.post(`/scheduled-visits/${visitId}/phone-call`, {
        notes: 'Follow-up phone call made'
      });
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Call Logged!',
          html: `
            <div style="text-align: center; padding: 10px 0;">
              <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                ${response.data.message || 'Phone call logged successfully'}
              </p>
            </div>
          `,
          confirmButtonText: 'OK',
          confirmButtonColor: '#065f46',
          timer: 2000,
          timerProgressBar: true
        });
        refetchScheduledVisits();
      } else {
        Swal.fire({ icon: 'error', title: 'Log Failed', text: response.data.message || 'Unable to record the phone call in the audit log.', confirmButtonColor: '#065f46' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to log phone call. Please try again.';
      Swal.fire({ icon: 'error', title: 'Entry Error', text: errorMessage, confirmButtonColor: '#065f46' });
      console.error('Phone call error:', error);
    } finally {
      setSelectedVisitForCall(null);
    }
  };

  const handleSendTrainingSMS = async (id: string) => {
    setIsSendingSMS(id);
    try {
      const res = await api.post(`/training-deliveries/${id}/send-sms`);
      Swal.fire({ 
        icon: 'success', 
        title: 'Farmers Notified', 
        text: res.data.message || 'Training alerts have been dispatched to the participant list.', 
        confirmButtonColor: '#065f46', 
        timer: 2500, 
        timerProgressBar: true 
      });
      refetchDeliveries();
    } catch (e: any) {
      console.error('Training SMS Error:', e);
      // Prototype Fallback
      if (e.response?.status === 500) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Transmission Blocked',
          text: 'The backend communication bridge is currently unresponsive.',
          showCancelButton: true,
          confirmButtonText: 'Run Mission Simulation',
          cancelButtonText: 'Ignore',
          confirmButtonColor: '#fbbf24'
        });

        if (result.isConfirmed) {
          setSendingSimulation(true);
          await new Promise(r => setTimeout(r, 1500));
          await Swal.fire({ icon: 'success', title: 'Simulation Finalized', text: 'Training notifications marked as sent in offline mode.', confirmButtonColor: '#065f46', timer: 2000 });
          refetchDeliveries();
          setSendingSimulation(false);
        }
      } else {
        Swal.fire({ icon: 'error', title: 'SMS dispatch Failed', text: e.response?.data?.message || 'The system could not broadcast the training alert.', confirmButtonColor: '#065f46' });
      }
    } finally {
      setIsSendingSMS(null);
    }
  };


  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  const summaryCards = [
    { title: 'Available', value: availableTrainings.length.toString(), icon: GraduationCap, color: 'bg-blue-600' },
    { title: 'Upcoming', value: myTrainings.filter((t: any) => t.status === 'Registered').length.toString(), icon: Calendar, color: 'bg-[#065f46]' },
    { title: 'Consultations', value: consultationRequests.length.toString(), icon: Handshake, color: 'bg-teal-600' },
    { title: 'My Schedule', value: trainingDeliveries.length.toString(), icon: School, color: 'bg-amber-600' },
  ];

  const MetricCardSkeleton = () => (
    <Card className="bg-gray-800/50 border-gray-700 rounded-lg p-3 sm:p-6 shadow-lg animate-pulse h-28 sm:h-36">
      <div className="flex flex-col h-full gap-4 text-left">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gray-700" />
          <Skeleton className="h-3 w-16 sm:h-4 sm:w-24 bg-gray-700" />
        </div>
        <div className="flex-1 flex items-center">
          <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 bg-gray-700" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {summaryCards.map((card: any, idx: number) => {
          const isLoading =
            (card.title === 'Available' && loadingAvailable) ||
            (card.title === 'Upcoming' && loadingMyTrainings) ||
            (card.title === 'Consultations' && loadingStats) || // tied to stats for now
            (card.title === 'Score' && loadingStats) ||
            (card.title === 'Reports' && loadingStats);

          return isLoading ? (
            <MetricCardSkeleton key={`skeleton-${idx}`} />
          ) : (
            <Card
              key={idx}
              className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden h-28 sm:h-36 opacity-100 translate-y-0`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Background Decoration */}
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
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
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Schedule Visit Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`section-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>Scheduled Visits</h2>
              <Button
                onClick={() => setScheduleModalOpen(true)}
                className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-bold border-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}>
                <Table>
                  <TableHeader className="bg-[#065f46]">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Type</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farmers/Community</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Date & Time</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Purpose</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Status</TableHead>
                      <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledVisits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No scheduled visits. Click "Schedule Visit" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      scheduledVisits.map((visit: any) => {
                        const visitDate = new Date(visit.scheduledDate);
                        const dateStr = visitDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        const isUpcoming = visitDate >= new Date() && visit.status === 'scheduled';

                        return (
                          <TableRow key={visit._id || visit.id} className={darkMode ? 'border-gray-800 hover:bg-gray-800/20' : 'border-gray-50 hover:bg-gray-50'}>
                            <TableCell>
                              <Badge className={`text-[10px] uppercase ${visit.visitType === 'farm-visit' ? 'bg-blue-500/10 text-blue-500' : visit.visitType === 'community-visit' ? 'bg-[#065f46]/10 text-[#065f46]' : 'bg-[#065f46]/10 text-[#065f46]'}`}>
                                {visit.visitType === 'farm-visit' ? 'Farm' : visit.visitType === 'community-visit' ? 'Community' : 'Meeting'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {visit.visitType === 'community-visit' ? (
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{visit.community}</span>
                              ) : (
                                <div className="flex flex-col">
                                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {visit.farmers?.length || 0} farmer(s)
                                  </span>
                                  {visit.farmers?.slice(0, 2).map((f: any) => (
                                    <span key={f._id || f.id} className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {f.name}
                                    </span>
                                  ))}
                                  {visit.farmers?.length > 2 && (
                                    <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      +{visit.farmers.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className={`flex flex-col text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>{dateStr}</span>
                                <span>{visit.scheduledTime}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {visit.purpose?.substring(0, 40)}{visit.purpose?.length > 40 ? '...' : ''}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] ${visit.status?.toLowerCase() === 'scheduled' ? 'bg-yellow-500/10 text-yellow-600' : visit.status?.toLowerCase() === 'completed' ? 'bg-[#065f46]/10 text-[#065f46]' : visit.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                {visit.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1.5 flex-wrap">
                                {visit.status?.toLowerCase() === 'scheduled' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                      onClick={() => handleSendSMS(visit._id || visit.id)}
                                      disabled={selectedVisitForSMS === (visit._id || visit.id) || visit.smsSent}
                                    >
                                      {selectedVisitForSMS === (visit._id || visit.id) ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <><MessageSquare className="h-3 w-3 mr-1" />{visit.smsSent ? 'Sent' : 'SMS'}</>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] border-[#065f46] text-[#065f46] hover:bg-[#065f46]/10"
                                      onClick={() => handleLogPhoneCall(visit._id || visit.id)}
                                      disabled={selectedVisitForCall === (visit._id || visit.id)}
                                    >
                                      {selectedVisitForCall === (visit._id || visit.id) ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <><Phone className="h-3 w-3 mr-1" />{visit.phoneCallMade ? 'Called' : 'Call'}</>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                      onClick={async () => {
                                        try {
                                          await api.patch(`/scheduled-visits/${visit._id || visit.id}`, { status: 'completed' });
                                          refetchScheduledVisits();
                                        } catch (e: any) {
                                          Swal.fire({ icon: 'error', title: 'Update Failed', text: e.response?.data?.message || 'Unable to mark this visit as completed.', confirmButtonColor: '#065f46' });
                                        }
                                      }}
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] border-red-400 text-red-500 hover:bg-red-50"
                                      onClick={async () => {
                                        try {
                                          await api.patch(`/scheduled-visits/${visit._id || visit.id}`, { status: 'cancelled' });
                                          refetchScheduledVisits();
                                        } catch (e: any) {
                                          Swal.fire({ icon: 'error', title: 'Cancellation Error', text: e.response?.data?.message || 'Access denied or system error during cancellation.', confirmButtonColor: '#065f46' });
                                        }
                                      }}
                                    >
                                      <X className="h-3 w-3 mr-1" /> Cancel
                                    </Button>
                                  </>
                                )}
                                {visit.status?.toLowerCase() === 'completed' && (
                                  <span className="text-[10px] text-emerald-600 font-semibold italic">Completed</span>
                                )}
                                {visit.status?.toLowerCase() === 'cancelled' && (
                                  <span className="text-[10px] text-red-400 font-semibold italic">Cancelled</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
            </Card>
          </section>

          {/* Incoming Consultation Requests Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`section-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>Incoming Consultation Requests</h2>
            </div>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}>
                <Table>
                  <TableHeader className="bg-[#065f46]">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farmer</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Purpose & location</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Date & Time</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Mode</TableHead>
                      <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Status</TableHead>
                      <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
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
                              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-[#065f46]/30 text-[#065f46] border border-[#065f46]/50' : 'bg-[#065f46]/10 text-[#065f46] border border-[#065f46]/20'}`}>
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
                          <Badge className={`text-[10px] ${req.status === 'Confirmed' ? 'bg-[#065f46]/10 text-[#065f46] hover:bg-[#065f46]/20' :
                            req.status === 'Declined' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                              req.status === 'Reschedule Requested' ? 'bg-[#065f46]/10 text-[#065f46] hover:bg-[#065f46]/20' :
                                'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                            }`}>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="h-8 px-3 bg-[#065f46] hover:bg-[#065f46]/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border-none flex items-center gap-2"
                                onClick={() => handleConsultationAction(req.id, 'accept')}
                                disabled={isProcessingConsultation === req.id}
                              >
                                {isProcessingConsultation === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                {isProcessingConsultation === req.id ? 'Loading' : 'Accept'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2"
                                onClick={() => handleConsultationAction(req.id, 'decline')}
                                disabled={isProcessingConsultation === req.id}
                              >
                                {isProcessingConsultation === req.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                                {isProcessingConsultation === req.id ? 'Loading' : 'Decline'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-2" 
                                onClick={() => handleConsultationAction(req.id, 'reschedule')}
                              >
                                <Clock className="h-3.5 w-3.5" />
                                Reschedule
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
            </Card>
          </section>


          {/* 2. Available Trainings List */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`section-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Training Programs</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700' : ''}>
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrainings.map((training: any) => (
                <Card key={training._id} className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden h-full flex flex-col`}>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        {training.category}
                      </Badge>
                      <span className={`text-[10px] font-bold text-[#065f46] uppercase tracking-widest`}>
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
                      className="w-full bg-[#065f46] hover:bg-[#065f46]/90 text-white font-bold uppercase tracking-wider text-xs h-10 border-none"
                      onClick={async () => {
                        setIsRegistering(training._id);
                        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                        await Swal.fire({
                          icon: 'success',
                          title: 'Registered!',
                          html: `
                            <div style="text-align: center; padding: 10px 0;">
                              <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                                Registered for <strong>${training.title}</strong>
                              </p>
                            </div>
                          `,
                          confirmButtonText: 'OK',
                          confirmButtonColor: '#7ede56',
                          timer: 2000,
                          timerProgressBar: true
                        });
                        setIsRegistering(null);
                      }}
                      disabled={isRegistering === training._id}
                    >
                      {isRegistering === training._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register Now'
                      )}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className={`section-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Training Schedule</h2>
              <Button
                onClick={() => setDeliverTrainingOpen(true)}
                className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[11px] uppercase tracking-widest h-10 px-5 rounded-xl border-none shadow-lg gap-2 flex items-center"
              >
                <GraduationCap className="h-4 w-4" />
                Deliver Training
              </Button>
            </div>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} overflow-hidden shadow-sm`}>
              <Table>
                <TableHeader className="bg-[#065f46]">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Training Title</TableHead>
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Date</TableHead>
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Community / Venue</TableHead>
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Mode</TableHead>
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Status</TableHead>
                    <TableHead className="text-white font-black text-[10px] uppercase tracking-widest px-6">Participants</TableHead>
                    <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingDeliveries.map((delivery: any) => (
                    <TableRow key={delivery._id} className={darkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50 border-gray-100 transition-colors'}>
                      <TableCell className={`font-medium sm:text-sm text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="flex flex-col">
                          <span className="font-extrabold">{delivery.moduleTitle}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{delivery.moduleSubtitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex flex-col">
                          <span>{new Date(delivery.deliveryDate).toLocaleDateString('en-GB')}</span>
                          <span className="text-[10px] text-gray-400">{delivery.deliveryTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex flex-col">
                          <span className="font-bold">{delivery.community || 'Not specified'}</span>
                          <span className="text-[10px] text-gray-400">{delivery.venue || 'No venue'}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`sm:text-sm text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {delivery.mode}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-sm shadow-none ${
                            delivery.status === 'completed' ? 'bg-[#7ede56]/10 text-[#7ede56]' :
                            delivery.status === 'cancelled' ? 'bg-red-100 text-red-500' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-gray-500">
                          {delivery.farmers?.length || 0} Farmer(s)
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {delivery.status === 'scheduled' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2.5 text-[10px] font-black tracking-widest uppercase text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5"
                                onClick={() => handleSendTrainingSMS(delivery._id)}
                                disabled={isSendingSMS === delivery._id}
                              >
                                {isSendingSMS === delivery._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                                SMS
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-[10px] font-black tracking-widest uppercase hover:bg-gray-100 text-gray-600"
                                onClick={() => setSelectedDeliveryForEdit(delivery)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-[10px] font-black tracking-widest uppercase hover:bg-emerald-50 text-emerald-600"
                                onClick={() => setSelectedDeliveryForReport(delivery)}
                              >
                                Submit Report
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-[10px] font-black tracking-widest uppercase hover:bg-red-50 text-red-500"
                                onClick={async () => {
                                  await api.patch(`/training-deliveries/${delivery._id}`, { status: 'cancelled' });
                                  refetchDeliveries();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                        ) : (
                          <span className={`text-[10px] font-black tracking-widest uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {delivery.status}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {trainingDeliveries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        You haven't scheduled any training deliveries yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </section>


        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">

          {/* 5. Agent Activity Timeline */}
          <section>
            <h2 className={`section-title mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Log</h2>
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} p-6 shadow-sm`}>
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-px before:bg-gray-100 dark:before:bg-gray-800">
                {activities.map((item: any, idx: number) => (
                  <div key={item._id || idx} className="relative pl-8 group">
                    <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full z-10 flex items-center justify-center border-2 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-50'}`}>
                      {item.type === 'training' ? <CheckCircle className={`h-2 w-2 text-[#065f46]`} /> :
                        item.type === 'report' ? <FileText className={`h-2 w-2 text-blue-500`} /> :
                          <TrendingUp className={`h-2 w-2 text-[#065f46]`} />}
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
          <Card className="bg-gradient-to-br from-[#002f37] to-[#011a1e] text-white border-2 border-[#065f46]/20 p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <School className="h-48 w-48 text-[#065f46]" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need Technical Help?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Connect with our support team or your regional supervisor for immediate assistance.</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = 'mailto:supervisor@agrilync.com?subject=Technical Help Request'}
                  className="w-full bg-[#065f46] text-white hover:bg-[#065f46]/90 font-bold uppercase tracking-wider text-xs h-10 border-none"
                >
                  Contact Supervisor
                </Button>
                <Button 
                  onClick={() => {
                    Swal.fire({
                      icon: 'info',
                      title: 'Maintenance Update',
                      text: 'The AgriLync Help Center is currently being optimized for regional agents. Please check back shortly.',
                      confirmButtonColor: '#065f46'
                    });
                  }}
                  variant="link" 
                  className="w-full text-white text-xs font-bold uppercase tracking-widest p-0 underline-offset-4 decoration-white/30"
                >
                  View Help Center
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        onSuccess={() => {
          refetchScheduledVisits();
        }}
      />

      {/* Deliver Training Modal */}
      {/* Deliver Training Modal (Create & Edit) */}
      <DeliverTrainingModal
        open={deliverTrainingOpen || !!selectedDeliveryForEdit}
        onOpenChange={(open) => {
          if (!open) {
            setDeliverTrainingOpen(false);
            setSelectedDeliveryForEdit(null);
          } else {
            setDeliverTrainingOpen(true);
          }
        }}
        editItem={selectedDeliveryForEdit}
        onSuccess={() => refetchDeliveries()}
      />

      {/* Submit Training Report Modal */}
      <SubmitTrainingReportModal
        open={!!selectedDeliveryForReport}
        onOpenChange={(open) => !open && setSelectedDeliveryForReport(null)}
        delivery={selectedDeliveryForReport}
        onSuccess={() => refetchDeliveries()}
      />
    </div>
  );
};

const TrainingPerformance = () => {
  return (
    <AgentLayout
      activeSection="training-performance"
      title="Training"
    >
      <TrainingPerformanceContent />
    </AgentLayout>
  );
};

export default TrainingPerformance;
