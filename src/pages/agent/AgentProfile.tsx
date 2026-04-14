import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Bell, Smartphone, DollarSign, Lock, LogOut, 
  Camera, Check, X, Shield, Globe, Layers, 
  Wifi, RefreshCw, FileText, ChevronRight,
  TrendingUp, Award, Clock, Users, Handshake, AlertTriangle,
  UserCheck, Coins
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import AgentLayout from './AgentLayout';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { playSuccessSound } from '@/utils/audio';

const Field = ({ label, id, type = "text", required = false, readOnly = false, value, onChange, options }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <Label htmlFor={id} className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-widest">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </Label>
      {value && !readOnly && <Check className="w-3 h-3 text-[#177209]" />}
    </div>
    {type === "select" ? (
      <Select disabled={readOnly} defaultValue={value}>
        <SelectTrigger id={id} className="h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-[13px] font-semibold transition-all font-inter">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-none shadow-2xl">
          {options?.map((opt: any) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold uppercase tracking-wider font-inter">{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input 
        id={id}
        type={type}
        readOnly={readOnly}
        value={value || ''}
        onChange={onChange}
        className={`h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-[13px] font-semibold transition-all font-inter ${readOnly ? 'opacity-60 cursor-not-allowed shadow-none' : ''}`}
      />
    )}
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
    <div className="space-y-0.5">
      <h4 className="text-[13px] font-black font-montserrat text-[#002F37] leading-tight">{label}</h4>
      <p className="text-[11px] font-medium font-inter text-gray-400">{description}</p>
    </div>
    <Switch 
      checked={checked} 
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-[#7EDE56] data-[state=unchecked]:bg-gray-200"
    />
  </div>
);

const AgentProfile: React.FC = () => {
  const { agent, logout, updateAgent } = useAuth();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('home');
  const [formData, setFormData] = useState<any>({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [ticketData, setTicketData] = useState({ subject: '', category: 'Technical Issue', description: '' });
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

  useEffect(() => {
    if (agent) setFormData(agent);
  }, [agent]);

  const navSections = [
    {
      title: 'Profile',
      icon: <User className="w-4 h-4" />,
      items: [
        { id: 'personal-info', label: 'Personal Info', icon: <User className="w-3.5 h-3.5" /> },
        { id: 'work-details', label: 'Work Details', icon: <Briefcase className="w-3.5 h-3.5" /> },
        { id: 'location', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      items: [
        { id: 'alerts', label: 'Alert Preferences', icon: <Shield className="w-3.5 h-3.5" /> },
        { id: 'comms', label: 'Communication', icon: <Mail className="w-3.5 h-3.5" /> },
      ]
    },
    {
      title: 'App Preferences',
      icon: <Smartphone className="w-4 h-4" />,
      items: [
        { id: 'display', label: 'Display & Language', icon: <Globe className="w-3.5 h-3.5" /> },
        { id: 'sync', label: 'Offline & Sync', icon: <RefreshCw className="w-3.5 h-3.5" /> },
      ]
    },
    {
      title: 'Earnings',
      icon: <DollarSign className="w-4 h-4" />,
      items: [
        { id: 'commission', label: 'Commission Summary', icon: <TrendingUp className="w-3.5 h-3.5" /> },
        { id: 'payouts', label: 'Payout History', icon: <Clock className="w-3.5 h-3.5" /> },
      ]
    },
    {
      title: 'Account & Security',
      icon: <Lock className="w-4 h-4" />,
      items: [
        { id: 'security', label: 'Change Password', icon: <Lock className="w-3.5 h-3.5" /> },
      ]
    },
    {
      title: 'Help & Support',
      icon: <Layers className="w-4 h-4" />,
      items: [
        { id: 'support', label: 'Support Center', icon: <Briefcase className="w-3.5 h-3.5" /> },
        { id: 'knowledge', label: 'FAQ / Guide', icon: <FileText className="w-3.5 h-3.5" /> },
      ]
    }
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    } else {
      setActivePanel(item.id);
    }
  };

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const [saving, setSaving] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (activePanel === 'support') {
      fetchTickets();
    }
  }, [activePanel]);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await api.put('/agents/profile', {
        name: formData.name,
        contact: formData.contact,
        region: formData.region,
        district: formData.district
      });
      playSuccessSound();
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your registration details have been synchronized.',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not synchronize profile changes.',
        confirmButtonColor: '#065f46'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return Swal.fire({
        icon: 'warning',
        title: 'File Too Large',
        text: 'Profile images must be under 2MB for optimal performance.',
        confirmButtonColor: '#065f46'
      });
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      setSaving(true);
      try {
        await updateAgent({ avatar: base64data });
        playSuccessSound();
        await Swal.fire({
          icon: 'success',
          title: 'Identity Updated',
          text: 'Your profile picture has been refreshed.',
          confirmButtonColor: '#065f46',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Could not update your profile picture. Please try again.',
          confirmButtonColor: '#065f46'
        });
      } finally {
        setSaving(false);
      }
    };
  };

  const handleUpdateSettings = async (prefs: any, type: 'notification' | 'app') => {
    try {
      const body = type === 'notification' 
        ? { notificationPreferences: prefs }
        : { appPreferences: prefs };
      
      await api.put('/agents/settings', body);
      playSuccessSound();
      Swal.fire({
        icon: 'success',
        title: 'Preferences Saved',
        text: 'Your application settings have been updated.',
        confirmButtonColor: '#065f46',
        timer: 1500,
        timerProgressBar: true
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Could not commit settings changes to the cloud.',
        confirmButtonColor: '#065f46'
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return Swal.fire({
        icon: 'warning',
        title: 'Secret Mismatch',
        text: 'The passwords provided do not match. Please re-type.',
        confirmButtonColor: '#065f46'
      });
    }
    if (passwordData.newPassword.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Security protocols require at least 6 characters.',
        confirmButtonColor: '#065f46'
      });
    }

    setSaving(true);
    try {
      await api.put('/agents/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      playSuccessSound();
      await Swal.fire({
        icon: 'success',
        title: 'Security Updated',
        text: 'Your credentials have been refreshed. Please log in with your new password.',
        confirmButtonColor: '#065f46',
        timer: 3000,
        timerProgressBar: true
      });
      handleLogout();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Security Error',
        text: err.response?.data?.message || 'Access credentials change failed.',
        confirmButtonColor: '#065f46'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Info',
        text: 'Subject and detailed description are mandatory for support requests.',
        confirmButtonColor: '#065f46'
      });
    }

    setCreatingTicket(true);
    try {
      await api.post('/support/tickets', ticketData);
      playSuccessSound();
      Swal.fire({
        icon: 'success',
        title: 'Ticket Created',
        text: 'Your support request has been queued for review (#248).',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
      setTicketModalOpen(false);
      setTicketData({ subject: '', category: 'Technical Issue', description: '' });
      fetchTickets();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Could not transmit the support ticket. Check your network.',
        confirmButtonColor: '#065f46'
      });
    } finally {
      setCreatingTicket(false);
    }
  };

  const renderContent = () => {
    switch (activePanel) {
      case 'personal-info':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="relative overflow-hidden rounded-[32px] p-8 md:p-10 text-white shadow-2xl" 
                 style={{ background: 'linear-gradient(135deg, #002F37 0%, #004D4D 100%)' }}>
              <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none scale-150 rotate-12">
                <User className="h-64 w-64" />
              </div>
              <div className="relative z-10 flex flex-col items-center md:items-start md:flex-row gap-8">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-[32px] border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
                    {agent?.avatar ? (
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-black font-montserrat text-white/40">
                        {agent?.name?.split(' ').map((n:any) => n[0]).join('') || 'AG'}
                      </span>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#7EDE56] rounded-2xl border-4 border-[#002f37] flex items-center justify-center cursor-pointer shadow-xl active:scale-90 transition-all" title="Upload or Snap Photo">
                    <Camera className="w-4 h-4 text-[#002f37]" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="text-center md:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h2 className="text-3xl font-black font-montserrat tracking-tight">{agent?.name}</h2>
                    <Badge className="bg-[#7EDE56] text-[#002F37] border-none font-black text-[10px] px-3 py-1 uppercase tracking-[0.2em] font-inter rounded-full shadow-lg shadow-[#7EDE56]/20">
                      ACTIVE AGENT
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/60">
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                      <Briefcase className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{agent?.agentId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                      <MapPin className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{agent?.region}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden">
              <div className="h-1.5 w-full bg-[#7EDE56]" />
              <CardContent className="p-8 md:p-10 space-y-10">
                <div>
                  <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Personal Identity</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-2">Verified credentials & mapping</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Full Name" id="name" required value={formData.name || ''} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                  <Field label="Mobile Number" id="phone" required value={formData.contact || ''} onChange={(e: any) => setFormData({...formData, contact: e.target.value})} />
                  <Field label="Primary Email" id="email" required value={formData.email || ''} readOnly />
                  <Field label="Assigned Gender" id="gender" type="select" value="male" readOnly options={[{label:'MALE', value:'male'}, {label:'FEMALE', value:'female'}]} />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-50">
                  <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black font-montserrat text-[13px] text-gray-400 hover:bg-gray-50" onClick={() => { setFormData(agent); setActivePanel('home'); }}>BACK</Button>
                  <Button className="h-14 px-10 rounded-2xl bg-[#002f37] hover:bg-[#002f37]/90 text-white font-black font-montserrat text-[13px] border-none shadow-xl shadow-[#002f37]/20" onClick={handleUpdateProfile} disabled={saving}>
                    {saving ? 'PROCESSING...' : 'UPDATE PROFILE'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'work-details':
        return (
          <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden animate-fade-in">
            <div className="h-1.5 w-full bg-[#002f37]" />
            <CardContent className="p-8 md:p-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#002f37]/5 flex items-center justify-center text-[#002f37]">
                   <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Work Profile</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-1">Operational details & assignment</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Agent Identity" id="aid" readOnly value={agent?.agentId} />
                <Field label="Current Grade" id="role" readOnly value="Field Agent (Gold)" />
                <Field label="Reporting Supervisor" id="sup" readOnly value="Samuel Kwaku" />
                <Field label="Onboarding Date" id="start" readOnly value="September 2024" />
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden animate-fade-in">
            <div className="h-1.5 w-full bg-[#921573]" />
            <CardContent className="p-8 md:p-10 space-y-10">
               <div>
                  <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Account Access</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-2">Manage your authentication</p>
                </div>
              <div className="grid gap-6 max-w-md">
                <Field label="Current Password" id="cp" type="password" value={passwordData.currentPassword} onChange={(e: any) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                <Field label="New Secure Password" id="np" type="password" value={passwordData.newPassword} onChange={(e: any) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                <Field label="Verify New Password" id="cnp" type="password" value={passwordData.confirmPassword} onChange={(e: any) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                <Button onClick={handleUpdatePassword} disabled={saving} className="h-14 bg-[#002f37] hover:bg-[#002f37]/90 text-white font-black font-montserrat rounded-2xl border-none mt-2 shadow-xl shadow-[#002f37]/20 uppercase tracking-widest text-[11px]">
                  {saving ? 'AUTHENTICATING...' : 'CHANGE PASSWORD'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'support':
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden">
              <div className="h-1.5 w-full bg-[#002f37]" />
              <CardContent className="p-8 md:p-10 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black font-montserrat text-[#002F37] uppercase tracking-tight leading-tight">Support<br/>Center</h3>
                    <p className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-[0.25em]">We're here to help you succeed</p>
                  </div>
                  <Button className="bg-[#002F37] hover:bg-[#003c47] text-white font-black font-montserrat px-8 h-14 rounded-2xl border-none shadow-xl shadow-[#002F37]/20 transition-all uppercase tracking-widest text-[11px]" onClick={() => setTicketModalOpen(true)}>
                    Create Ticket
                  </Button>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-[0.3em] mb-4">Recent Tickets</h4>
                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((t: any) => (
                        <div key={t._id} className="p-5 rounded-2xl border border-gray-100 hover:border-[#7EDE56] hover:bg-gray-50/50 transition-all group flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className={`h-3 w-3 rounded-full ${t.status === 'Open' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
                            <div>
                              <h5 className="text-[14px] font-black font-montserrat text-[#002F37]">{t.subject}</h5>
                              <p className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest mt-0.5">{t.ticketId} · {t.category}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-200 group-hover:text-[#002F37] transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200">
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Briefcase className="w-10 h-10 text-gray-200" />
                      </div>
                      <h5 className="text-[12px] font-black font-inter text-gray-400 uppercase tracking-[0.2em]">No active support tickets</h5>
                      <p className="text-[10px] font-medium text-gray-300 mt-2">Your historical requests will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="p-10 rounded-[40px] bg-[#002F37] text-white shadow-3xl relative overflow-hidden border-none text-center">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Handshake className="h-64 w-64 -rotate-12" />
               </div>
               <div className="relative z-10 space-y-8 flex flex-col items-center">
                  <Badge className="bg-[#7EDE56] text-[#002F37] font-black font-inter px-4 py-2 border-none uppercase tracking-[0.25em] rounded-full shadow-lg">DIRECT SUPPORT</Badge>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black font-montserrat tracking-tight">Need immediate help?</h3>
                    <p className="text-white/60 text-[13px] font-medium max-w-xs mx-auto">Skip the queue and talk directly to our expert field coordinators.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
                    <Button className="bg-[#7EDE56] hover:bg-[#8eff6b] text-[#002F37] font-black font-montserrat h-14 rounded-2xl w-full border-none shadow-xl shadow-[#7EDE56]/10 uppercase tracking-widest text-[11px]">
                      Call Support
                    </Button>
                    <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-14 rounded-2xl w-full font-black font-montserrat border-none uppercase tracking-widest text-[11px]">
                      WhatsApp Chat
                    </Button>
                  </div>
               </div>
            </Card>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Grower Onboarding', desc: 'Step-by-step guide to registering new farmers', icon: <UserCheck className="h-6 w-6" /> },
                  { title: 'Visit & Documentation', desc: 'How to log visits and capture field evidence', icon: <Camera className="h-6 w-6" /> },
                  { title: 'Commission Payouts', desc: 'Understanding your earnings and withdrawal process', icon: <Coins className="h-6 w-6" /> }
                ].map((guide, idx) => (
                  <Card key={idx} className="p-6 rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all cursor-pointer bg-white group">
                    <div className="h-14 w-14 rounded-2xl bg-[#002f37]/5 flex items-center justify-center text-[#002f37] group-hover:bg-[#7EDE56] group-hover:text-[#002f37] transition-all mb-4">
                      {guide.icon}
                    </div>
                    <h4 className="text-[15px] font-black font-montserrat text-[#002f37] mb-2 leading-tight uppercase tracking-tight">{guide.title}</h4>
                    <p className="text-[11px] font-medium text-gray-400 font-inter leading-relaxed">{guide.desc}</p>
                  </Card>
                ))}
             </div>
             <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden p-8">
                <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight mb-8">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    "How do I update a farmer's contact information?",
                    "What should I do if my GPS isn't locking?",
                    "Where can I find my monthly performance bonus?",
                    "Offline sync is taking too long, what's wrong?"
                  ].map((q, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-gray-50 flex items-center justify-between group hover:border-[#7EDE56] cursor-pointer">
                      <p className="text-[13px] font-bold text-gray-600 font-inter group-hover:text-[#002f37]">{q}</p>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#002f37]" />
                    </div>
                  ))}
                </div>
             </Card>
          </div>
        );

      case 'commission':
      case 'payouts':
        return (
          <div className="space-y-6 animate-fade-in">
             <Card className="p-10 rounded-[40px] bg-[#002F37] text-white shadow-3xl relative overflow-hidden border-none text-center">
                <div className="absolute top-0 left-0 p-8 opacity-5">
                   <TrendingUp className="h-64 w-64" />
                </div>
                <div className="relative z-10 space-y-4">
                   <p className="text-[10px] font-black text-[#7EDE56] uppercase tracking-[0.3em]">Lifetime Earnings</p>
                   <h2 className="text-6xl font-black font-montserrat tracking-tighter">GH₵ 4,250.00</h2>
                   <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Next payout: April 30, 2026</p>
                </div>
             </Card>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'This Month', val: '640' },
                  { label: 'Bonuses', val: '200' },
                  { label: 'Referrals', val: '120' },
                  { label: 'Withdrawn', val: '3.2k' }
                ].map((stat, i) => (
                  <Card key={i} className="p-5 rounded-3xl border-none shadow-xl bg-white text-center">
                    <p className="text-[9px] font-black text-gray-400 gap-2 mb-1 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[18px] font-black text-[#002f37] font-montserrat">₵{stat.val}</p>
                  </Card>
                ))}
             </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight mb-4">Notifications</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 flex gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-black font-montserrat text-[#002f37]">System Maintenance</h4>
                  <p className="text-[11px] font-medium text-gray-400 mt-1">Scheduled update for the field app on April 25th.</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'display':
        return (
          <Card className="rounded-[32px] border-none shadow-2xl bg-white overflow-hidden animate-fade-in">
            <CardContent className="p-8 md:p-10 space-y-8">
              <h3 className="text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Display Settings</h3>
              <ToggleRow label="Dark Mode" description="Switch between light and dark interface" />
              <ToggleRow label="Compact View" description="Reduce spacing in data tables" />
              <ToggleRow label="High Contrast" description="Improve readability for field use" />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AgentLayout activeSection="profile" title="Settings & Support">
      <div className="pb-24">
        <div className="lg:hidden animate-fade-in bg-white min-h-screen">
          {activePanel === 'home' ? (
            <div className="space-y-0 px-4">
               {/* MINIMAL CENTERED PROFILE HEADER */}
               <div className="pt-10 pb-8 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-none shadow-sm relative z-10">
                      <AvatarImage src={agent?.avatar} />
                      <AvatarFallback className="bg-gray-100 text-gray-400 text-xl font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20 active:scale-95 transition-all">
                       <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold font-montserrat text-black tracking-tight">{agent?.name || 'Musah Adams Congo'}</h2>
                    <p className="text-[12px] font-medium text-gray-400 font-inter mt-0.5">{agent?.agentId || '053 187 8243'}</p>
                  </div>
               </div>

               {/* NICE AND SIMPLE CARDS - REDUCED FONT SIZES */}
               <div className="space-y-3 pb-24 px-1">
                  {[
                    { id: 'personal-info', title: 'My Account', desc: 'Manage your history and mapping', icon: <User className="w-4 h-4 text-white" /> },
                    { id: 'commission', title: 'Earnings & Payouts', desc: 'Monitor monthly growth and bonuses', icon: <Coins className="w-4 h-4 text-white" /> },
                    { id: 'display', title: 'Offline access', desc: 'Field data and local storage settings', icon: <RefreshCw className="w-4 h-4 text-white" /> },
                    { id: 'security', title: 'Security & Access', desc: 'Customize how your account works', icon: <Lock className="w-4 h-4 text-white" /> },
                    { id: 'knowledge', title: 'Knowledge base', desc: 'Best practices, FAQs and guides', icon: <FileText className="w-4 h-4 text-white" /> },
                    { id: 'support', title: 'Help and support', desc: "Get help with any issue you face", icon: <AlertTriangle className="w-4 h-4 text-white" /> },
                  ].map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setActivePanel(item.id)} 
                      className="w-full flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm active:bg-gray-50 transition-all text-left group normal-case"
                    >
                      <div className="h-11 w-11 rounded-full flex items-center justify-center bg-black text-white shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold font-montserrat text-black leading-tight">{item.title}</p>
                        <p className="text-[11px] font-medium text-gray-400 font-inter leading-tight mt-1">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-200" />
                    </button>
                  ))}

                  {/* Simple Sign out */}
                  <div className="pt-4 px-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className="w-full h-14 rounded-[1.5rem] text-rose-500 font-bold font-montserrat hover:bg-rose-50 transition-all gap-2 text-[13px] border border-transparent normal-case"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out account
                    </Button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6 px-4 pt-6 bg-white min-h-screen">
              <Button variant="ghost" size="sm" onClick={() => setActivePanel('home')} className="font-bold font-montserrat text-black text-[13px] p-0 flex items-center gap-2 hover:bg-transparent mb-4">
                <ChevronRight className="h-4 w-4 rotate-180" /> Back to Sections
              </Button>
              {renderContent()}
            </div>
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-10 pt-4">
          <div className="w-[300px] shrink-0 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl text-center space-y-4 border-b-[6px] border-[#002f37]">
               <div className="h-24 w-24 rounded-full mx-auto border-4 border-gray-50 overflow-hidden">
                 {agent?.avatar ? <img src={agent.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-6 text-gray-200" />}
               </div>
               <h3 className="font-black font-montserrat text-[#002f37] uppercase tracking-tight">{agent?.name}</h3>
               <Badge className="bg-gray-100 text-gray-500 border-none font-black text-[9px] font-inter">{agent?.agentId}</Badge>
            </div>
            <div className="space-y-2">
              {navSections.map(s => (
                <div key={s.title} className="space-y-1 py-2">
                  <p className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-widest px-4 mb-2">{s.title}</p>
                  {s.items.map(i => (
                    <button key={i.id} onClick={() => setActivePanel(i.id)} className={`w-full text-left px-4 py-3 rounded-2xl transition-all font-inter font-bold text-[13px] flex items-center gap-3 ${activePanel === i.id ? 'bg-[#002f37] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}>
                      {i.icon} {i.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 pb-12">{renderContent() || <div className="bg-white rounded-[2.5rem] p-12 text-center text-gray-300 font-black font-montserrat uppercase tracking-widest">Select a section</div>}</div>
        </div>
      </div>
      
      {/* DIALOGS */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-8 md:p-10 border-none shadow-3xl bg-white font-inter">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Create Ticket</DialogTitle>
            <DialogDescription className="text-[11px] font-medium text-gray-400">Describe your issue and we'll resolve it within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <Field label="Brief Subject" id="tsub" value={ticketData.subject} onChange={(e: any) => setTicketData({...ticketData, subject: e.target.value})} />
            <Field label="Issue Category" id="tcat" type="select" value={ticketData.category} options={[{label:'TECHNICAL ISSUE', value:'Technical Issue'}, {label:'ACCOUNT ACCESS', value:'Account Access'}]} />
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Describe detailed issue</Label>
              <Textarea 
                className="min-h-[140px] rounded-2xl border-[1.5px] border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] transition-all p-4 text-sm font-medium" 
                placeholder="How can we help you today?" 
                value={ticketData.description} 
                onChange={(e) => setTicketData({...ticketData, description: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button onClick={handleCreateTicket} disabled={creatingTicket} className="w-full h-14 bg-[#7EDE56] text-[#002F37] font-black font-montserrat rounded-2xl border-none shadow-xl shadow-[#7EDE56]/20 uppercase tracking-widest text-[12px]">
              {creatingTicket ? 'SUBMITTING...' : 'SUBMIT SUPPORT TICKET'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgentLayout>
  );
};

export default AgentProfile;
