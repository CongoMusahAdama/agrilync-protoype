import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Bell, Smartphone, DollarSign, Lock, LogOut, 
  Camera, Check, X, Shield, Globe, Layers, 
  Wifi, RefreshCw, FileText, ChevronRight,
  TrendingUp, Award, Clock, Users, Handshake, AlertTriangle
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
import AgentLayout from './AgentLayout';
import { toast } from 'sonner';
import api from '@/utils/api';

const AgentProfile: React.FC = () => {
  const { agent, logout } = useAuth();
  const { darkMode } = useDarkMode();
  const [activePanel, setActivePanel] = useState('personal-info');
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
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('Image size must be less than 2MB');
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      setSaving(true);
      try {
        await api.put('/agents/profile', { avatar: base64data });
        toast.success('Profile picture updated');
        // Refresh profile via location reload or update context if we had a method
        window.location.reload(); 
      } catch (err) {
        toast.error('Failed to upload profile picture');
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
      toast.success('Settings saved');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setSaving(true);
    try {
      await api.put('/agents/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      return toast.error('Subject and description are required');
    }

    setCreatingTicket(true);
    try {
      await api.post('/support/tickets', ticketData);
      toast.success('Support ticket created');
      setTicketModalOpen(false);
      setTicketData({ subject: '', category: 'Technical Issue', description: '' });
      fetchTickets();
    } catch (err) {
      toast.error('Failed to create ticket');
    } finally {
      setCreatingTicket(false);
    }
  };

  const Field = ({ label, id, type = "text", required = false, readOnly = false, value, onChange, options }: any) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </Label>
        {value && !readOnly && <Check className="w-3 h-3 text-[#177209]" />}
      </div>
      {type === "select" ? (
        <Select disabled={readOnly} defaultValue={value}>
          <SelectTrigger className="h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-[13px] font-semibold transition-all">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-2xl">
            {options?.map((opt: any) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold uppercase tracking-wider">{opt.label}</SelectItem>
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
          className={`h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-[13px] font-semibold transition-all ${readOnly ? 'opacity-60 cursor-not-allowed shadow-none' : ''}`}
        />
      )}
    </div>
  );

  const ToggleRow = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
      <div className="space-y-0.5">
        <h4 className="text-[13px] font-black text-[#002F37] leading-tight">{label}</h4>
        <p className="text-[11px] font-medium text-gray-400">{description}</p>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#7EDE56] data-[state=unchecked]:bg-gray-200"
      />
    </div>
  );

  return (
    <AgentLayout activeSection="profile" title="Settings & Support">
      <div className="space-y-8 animate-fade-in font-nunito">
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-2">
          <div>
            <h1 className="page-title text-[24px] sm:text-[28px] font-black tracking-tight text-[#002f37]">Settings & Support</h1>
            <p className="page-desc text-gray-500 font-semibold text-[13px]">Manage your field profile, operational alerts, and support requests</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#f2fcf0] text-[#177209] border-[#177209]/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#177209] animate-pulse" />
              Operational: Active
            </Badge>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 py-2">
        {/* LEFT NAV PANEL */}
        <div className="w-full lg:w-[220px] lg:shrink-0 lg:block overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 sticky top-0 lg:top-6 bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-0 z-40 py-3 lg:py-0 border-b lg:border-none border-gray-100 px-1 lg:px-0">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-row lg:flex-col gap-2 lg:gap-1 shrink-0">
                <p className="hidden lg:flex text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-2 items-center gap-2">
                  {section.icon} {section.title}
                </p>
                <div className="flex flex-row lg:flex-col gap-2">
                {section.items.map((item) => {
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive 
                        ? 'bg-[#F4FFEE] border-l-[3px] border-[#7EDE56] text-[#002F37] font-black shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-50 font-bold'}`}
                    >
                      <span className={`${isActive ? 'text-[#7EDE56]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="flex-1 min-w-0 pb-12 transition-all duration-300">
          <div className="animate-fade-in-up">
            {activePanel === 'personal-info' && (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 text-white shadow-2xl" 
                     style={{ background: 'linear-gradient(135deg, #002F37 0%, #004D4D 100%)' }}>
                  <div className="absolute right-[-20px] top-[-20px] text-[140px] opacity-10 pointer-events-none grayscale brightness-200">
                    <User className="w-full h-full" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" 
                          id="avatar-upload" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                        />
                        <div 
                          className="h-20 w-20 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center text-3xl font-black"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          {agent?.avatar ? (
                            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                          ) : (
                            agent?.name?.split(' ').map((n:any) => n[0]).join('') || 'AG'
                          )}
                        </div>
                        <div 
                          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#7EDE56] h-5 w-5 rounded-full border-2 border-[#002F37]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black">{agent?.name}</h2>
                          <Badge className="bg-[#7EDE56]/20 text-[#7EDE56] border-none font-black text-[9px] px-2 py-0.5 uppercase tracking-widest">
                            ● FIELD AGENT
                          </Badge>
                        </div>
                        <p className="text-[11px] font-bold text-white/60 mt-1 uppercase tracking-widest">
                          {agent?.agentId} · Region: {agent?.region}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button onClick={handleUpdateProfile} disabled={saving} className="bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black px-6 h-10 rounded-xl border-none">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <p className="text-[10px] font-bold text-white/40 mt-3 uppercase tracking-widest">Last updated: March 2026</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl space-y-6 lg:space-y-8 border-b-[6px] border-[#7EDE56]">
                  <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <Field 
                      label="Full Name" 
                      id="name" 
                      required 
                      value={formData.name || ''} 
                      onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
                    />
                    <Field 
                      label="Email Address" 
                      id="email" 
                      required 
                      value={formData.email || ''} 
                      readOnly 
                    />
                    <Field 
                      label="Phone Number" 
                      id="phone" 
                      required 
                      value={formData.contact || ''} 
                      onChange={(e: any) => setFormData({...formData, contact: e.target.value})} 
                    />
                    <Field label="Gender" id="gender" type="select" value="male" readOnly options={[{label:'MALE', value:'male'}, {label:'FEMALE', value:'female'}]} />
                    <Field label="Date of Birth" id="dob" type="date" value="1990-05-15" readOnly />
                    <Field label="National ID Number" id="id-num" value="GHA-123456789-0" readOnly />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-[13px] border-gray-100" onClick={() => setFormData(agent)}>CANCEL</Button>
                    <Button 
                      className="h-12 px-8 rounded-xl bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black text-[13px] border-none"
                      onClick={handleUpdateProfile}
                      disabled={saving}
                    >
                      {saving ? 'SAVING...' : 'SAVE CHANGES'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'work-details' && (
              <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl space-y-6 lg:space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Work Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <Field label="Agent ID" id="aid" readOnly value={agent?.agentId} />
                  <Field label="Role" id="role" readOnly value="Field Agent" />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Regions</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Ashanti', 'Eastern'].map(r => (
                        <Badge key={r} className="bg-[#F4FFEE] text-[#002F37] border-gray-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border-none">
                          {r} <X className="w-3 h-3 text-[#921573] cursor-pointer" />
                        </Badge>
                      ))}
                      <Button variant="ghost" className="h-8 px-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-[10px] font-black uppercase">+ ADD</Button>
                    </div>
                  </div>
                  <Field label="Supervisor Name" id="sup" readOnly value="Samuel Kwaku" />
                  <Field label="Start Date" id="start" readOnly value="September 2024" />
                  <Field label="Employment Type" id="etype" type="select" value="full-time" readOnly options={[{label:'CONTRACT', value:'contract'}, {label:'FULL-TIME', value:'full-time'}]} />
                  <Field label="Specialisation" id="spec" type="select" value="crop" readOnly options={[{label:'CROP FARMING', value:'crop'}, {label:'LIVESTOCK', value:'livestock'}]} />
                </div>
                <div className="bg-[#F4FFEE] rounded-2xl p-6 border-[1.5px] border-[#7EDE56]/10 flex flex-wrap gap-8 justify-between items-center text-[#002F37]">
                   <div className="flex-1 min-w-[120px]"><p className="text-xs font-black uppercase opacity-40">Farmers Onboarded</p><h4 className="text-xl font-black">312</h4></div>
                   <div className="flex-1 min-w-[120px]"><p className="text-xs font-black uppercase opacity-40">Training Sessions</p><h4 className="text-xl font-black">48</h4></div>
                   <div className="flex-1 min-w-[120px]"><p className="text-xs font-black uppercase opacity-40">Earnings To Date</p><h4 className="text-xl font-black">GH₵ 840</h4></div>
                </div>
              </div>
            )}

            {activePanel === 'location' && (
              <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-xl space-y-6 lg:space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Location & Coverage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <Field 
                    label="Home District" 
                    id="dist" 
                    value="Kumasi" 
                    readOnly 
                  />
                  <Field 
                    label="Home Region" 
                    id="reg" 
                    type="select" 
                    value="Ashanti Region" 
                    readOnly
                    options={[{label:'ASHANTI', value:'Ashanti Region'}]} 
                  />
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GPS Home Coordinates</Label>
                    <div className="relative">
                      <Input value="6.6666, -1.6163" readOnly className="h-11 border-gray-100 rounded-xl bg-gray-50 pr-12 text-[13px] font-semibold" />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-[#002F37] text-white flex items-center justify-center hover:bg-[#002F37]/90 active:scale-95 transition-all"><MapPin className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Zones</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Ashanti', 'Eastern'].map(r => <Badge key={r} className="bg-[#F4FFEE] text-[#002F37] font-bold px-3 py-1.5 rounded-lg border-none">{r} ✕</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="h-[180px] w-full rounded-2xl relative overflow-hidden group border-2 border-[#7EDE56]/10" style={{ background: 'linear-gradient(135deg, #177209 0%, #002F37 100%)' }}>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"><MapPin className="w-6 h-6 text-[#7EDE56]" /></div>
                    <Button className="bg-white text-[#002F37] font-black text-[11px] uppercase tracking-widest px-6 h-10 rounded-xl border-none shadow-2xl">Update my location</Button>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'alerts' && (
              <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Notification & Alert Settings</h3>
                <div className="space-y-10">
                  <div>
                    <h5 className="text-[10px] font-black text-[#177209] uppercase tracking-[0.2em] mb-4">Farm Alerts</h5>
                    <ToggleRow 
                      label="At-Risk Farm Flags" 
                      description="Immediate alert when a farm status changes" 
                      checked={agent?.notificationPreferences?.email} 
                      onChange={(val: boolean) => handleUpdateSettings({ email: val }, 'notification')} 
                    />
                    <ToggleRow 
                      label="Off-Track Escalations" 
                      description="Notify when farm requires urgent intervention" 
                      checked={agent?.notificationPreferences?.sms} 
                      onChange={(val: boolean) => handleUpdateSettings({ sms: val }, 'notification')} 
                    />
                    <ToggleRow 
                      label="Visit Overdue Reminders" 
                      description="Alert when a farm visit is overdue" 
                      checked={agent?.notificationPreferences?.push} 
                      onChange={(val: boolean) => handleUpdateSettings({ push: val }, 'notification')} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'display' && (
              <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Display & Language Preferences</h3>
                <div className="space-y-6">
                  <div className="p-6 rounded-[24px] border-2 border-[#F4FFEE] bg-[#F4FFEE]/30">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Interface Language</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border-2 border-[#002F37] bg-white flex flex-col items-center justify-center gap-2 cursor-pointer relative shadow-md">
                        <Globe className="w-6 h-6 text-[#002F37]" />
                        <span className="text-[13px] font-black text-[#002F37]">English</span>
                        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-[#002F37] flex items-center justify-center text-[8px] text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-gray-100 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7EDE56] transition-all opacity-60">
                        <Globe className="w-6 h-6 text-gray-400" />
                        <span className="text-[13px] font-black text-gray-500">Twi</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-4 italic">Changing language affects the Agent App and training content</p>
                  </div>
                  <div className="space-y-2">
                    <ToggleRow label="High Contrast Mode" description="Optimised for bright outdoor sunlight" checked={false} onChange={() => {}} />
                    <ToggleRow label="Large Text Mode" description="Increases font size across the app" checked={false} onChange={() => {}} />
                    <ToggleRow label="Compact View" description="Fit more data on screen at once" checked={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'sync' && (
              <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Offline Mode & Data Sync</h3>
                <div className="bg-[#177209] text-white p-4 rounded-xl flex items-center gap-3 shadow-lg shadow-[#177209]/20">
                   <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                   <p className="text-[13px] font-black uppercase tracking-wider text-nowrap">● Offline mode is ACTIVE — your data is protected</p>
                </div>
                <div className="space-y-2">
                  <ToggleRow label="Auto-Sync on Reconnect" description="Sync all pending records when data is restored" checked={true} onChange={() => {}} />
                  <ToggleRow label="Background Sync" description="Sync silently in background when connected" checked={true} onChange={() => {}} />
                  <ToggleRow label="Paper Backup Reminder" description="Prompt to fill backup form when offline" checked={false} onChange={() => {}} />
                </div>
                <div className="p-6 rounded-[24px] bg-[#F4FFEE] border-2 border-[#7EDE56]/10 space-y-6">
                  <div className="flex justify-between items-center"><h4 className="text-[14px] font-black text-[#002F37]">4 records pending sync</h4><Button className="bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black text-[11px] tracking-widest px-6 h-10 rounded-xl border-none">Sync Now</Button></div>
                  <div className="grid gap-3">
                    {[
                      { l: 'Visit log - Asante Farm', t: '2hrs ago' },
                      { l: 'Photo - Mensah Farm', t: '3hrs ago' },
                      { l: 'KYC - Frimpong', t: '5hrs ago' },
                      { l: 'Visit log - Boateng Farm', t: '1 day ago' }
                    ].map(i => (
                      <div key={i.l} className="flex justify-between items-center text-[11px] font-bold text-[#002F37]/60 pb-2 border-b border-white/50 last:border-none"><span>{i.l}</span><span className="text-[9px] font-black text-[#921573]">{i.t}</span></div>
                    ))}
                  </div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center pt-2">Last successful sync: Today at 10:34am</p>
                </div>
              </div>
            )}

            {activePanel === 'commission' && (
              <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">My Earnings & Commission</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {l:'Total Earned', v:'GH₵ 840', c:'bg-emerald-50 text-emerald-700'},
                    {l:'Onboarded', v:'312', c:'bg-blue-50 text-blue-700'},
                    {l:'Sessions', v:'48', c:'bg-purple-50 text-purple-700'},
                    {l:'Pending Payout', v:'GH₵ 120', c:'bg-amber-50 text-amber-700'}
                  ].map(s => (
                    <div key={s.l} className={`${s.c} p-4 rounded-2xl flex flex-col justify-center h-24 shadow-sm`}><p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{s.l}</p><h4 className="text-xl font-black">{s.v}</h4></div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                   <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-100">
                       <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <th className="p-4">Activity</th><th className="p-4">Count</th><th className="p-4">Rate</th><th className="p-4">Amount</th><th className="p-4">Status</th>
                       </tr>
                     </thead>
                     <tbody className="text-[12px] font-bold text-[#002F37] divide-y divide-gray-50">
                       {[
                         { a: 'Farmer Onboarding', c: '312', r: 'GH₵ 2.00', am: 'GH₵ 624', s: 'Paid', sc: 'text-[#177209]' },
                         { a: 'Training Sessions', c: '48', r: 'GH₵ 3.00', am: 'GH₵ 144', s: 'Paid', sc: 'text-[#177209]' },
                         { a: 'Harvest Docs', c: '50', r: 'GH₵ 1.50', am: 'GH₵ 75', s: 'Pending', sc: 'text-amber-600' },
                         { a: 'At-Risk Escalation', c: '3', r: 'GH₵ 5.00', am: 'GH₵ 15', s: 'Pending', sc: 'text-amber-600' },
                         { a: 'Bonus (March KPIs)', c: '1', r: 'GH₵ 50', am: 'GH₵ 50', s: 'Pending', sc: 'text-amber-600' }
                       ].map((r,ix) => (
                         <tr key={ix} className="hover:bg-gray-50/50"><td className="p-4 font-black">{r.a}</td><td className="p-4">{r.c}</td><td className="p-4">{r.r}</td><td className="p-4 font-black">{r.am}</td><td className={`p-4 ${r.sc}`}>{r.s}</td></tr>
                       ))}
                     </tbody>
                     <tfoot className="bg-[#002F37] text-white text-[12px] font-black"><tr className="border-none group shadow-inner"><td colSpan={3} className="p-4 uppercase tracking-[0.2em] opacity-40">Monthly Breakdown Totals</td><td colSpan={2} className="p-4 text-right pr-8">GH₵ 908 Total | <span className="text-[#7EDE56]">GH₵ 120 Pending</span></td></tr></tfoot>
                   </table>
                </div>
                <div className="p-6 rounded-[24px] bg-[#F4FFEE] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div><p className="text-[11px] font-black text-[#002F37] uppercase tracking-widest leading-tight">Next payout: April 5, 2026</p><p className="text-[10px] font-bold text-gray-400 mt-1">Mobile Money: 0506 *** 068 (MTN MoMo)</p></div>
                  <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-6 h-10 border-[#7EDE56] border-2 text-[#177209] rounded-xl hover:bg-[#7EDE56]">Request Early Payout</Button>
                </div>
              </div>
            )}

            {activePanel === 'security' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                  <h3 className="text-lg font-black text-[#002F37] border-b-2 border-gray-50 pb-4">Account & Security</h3>
                  <div className="grid gap-6 max-w-md">
                    <Field 
                      label="Current Password" 
                      id="cp" 
                      type="password" 
                      value={passwordData.currentPassword} 
                      onChange={(e: any) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                    />
                    <div className="space-y-2">
                      <Field 
                        label="New Password" 
                        id="np" 
                        type="password" 
                        value={passwordData.newPassword} 
                        onChange={(e: any) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      />
                      <div className="flex gap-1 h-1.5 px-1">
                        <div className={`flex-1 rounded-full ${passwordData.newPassword.length > 0 ? 'bg-red-500' : 'bg-gray-100'}`} />
                        <div className={`flex-1 rounded-full ${passwordData.newPassword.length > 5 ? 'bg-amber-500' : 'bg-gray-100'}`} />
                        <div className={`flex-1 rounded-full ${passwordData.newPassword.length > 8 ? 'bg-[#7EDE56]' : 'bg-gray-100'}`} />
                        <div className={`flex-1 rounded-full ${passwordData.newPassword.length > 10 ? 'bg-[#177209]' : 'bg-gray-100'}`} />
                      </div>
                      <p className={`text-[9px] font-black uppercase px-1 tracking-widest ${
                        passwordData.newPassword.length > 8 ? 'text-[#177209]' : 
                        passwordData.newPassword.length > 5 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        Strength: {passwordData.newPassword.length > 8 ? 'Strong' : passwordData.newPassword.length > 5 ? 'Medium' : 'Weak'}
                      </p>
                    </div>
                    <Field 
                      label="Confirm New Password" 
                      id="cnp" 
                      type="password" 
                      value={passwordData.confirmPassword} 
                      onChange={(e: any) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                    />
                    <Button 
                      onClick={handleUpdatePassword} 
                      disabled={saving}
                      className="h-12 bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black rounded-xl border-none mt-2"
                    >
                      {saving ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[24px] p-6 border-2 border-gray-100 opacity-60 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Created</p><p className="text-[11px] font-bold text-[#002F37]">September 6, 2024</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Login</p><p className="text-[11px] font-bold text-[#002F37]">Today, 8:14am · Accra, Ghana</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Version</p><p className="text-[11px] font-bold text-[#002F37]">v1.2.0</p></div>
                </div>

                <div className="bg-white rounded-[24px] p-8 shadow-xl border-2 border-red-50 space-y-6">
                  <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em]">Danger Zone</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-50 font-black text-[11px] px-8 rounded-xl h-12 uppercase tracking-widest">Sign Out of All Devices</Button>
                    <button className="text-gray-400 font-bold text-[11px] uppercase tracking-widest hover:text-red-500 transition-colors underline underline-offset-4">Deactivate Account</button>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'support' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8 border-l-[6px] border-[#002F37]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-[#002F37]">Support Center</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">We're here to help you succeed</p>
                    </div>
                    <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#002F37] hover:bg-[#002F37]/90 text-white font-black px-6 h-11 rounded-xl border-none">Create Ticket</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md rounded-[24px] p-8 border-none shadow-3xl bg-white font-nunito translate-y-[-50%]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black text-[#002F37]">Create Support Ticket</DialogTitle>
                          <DialogDescription className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            Describe your issue and we'll get back to you shortly
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 mt-6">
                          <Field 
                            label="Subject" 
                            id="tsub" 
                            placeholder="e.g. Farmer registration error"
                            value={ticketData.subject}
                            onChange={(e: any) => setTicketData({...ticketData, subject: e.target.value})}
                          />
                          <Field 
                            label="Category" 
                            id="tcat" 
                            type="select" 
                            value={ticketData.category}
                            options={[
                              {label: 'TECHNICAL ISSUE', value: 'Technical Issue'},
                              {label: 'ACCOUNT ACCESS', value: 'Account Access'},
                              {label: 'COMMISSION/PAYOUT', value: 'Payout Issue'},
                              {label: 'OTHER', value: 'Other'}
                            ]}
                            onChange={(val: string) => setTicketData({...ticketData, category: val})}
                          />
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</Label>
                            <Textarea 
                              className="min-h-[120px] rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-sm font-semibold"
                              placeholder="Please provide details about the issue..."
                              value={ticketData.description}
                              onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-8 flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setTicketModalOpen(false)}
                            className="flex-1 h-12 rounded-xl font-black border-gray-100"
                          >
                            CANCEL
                          </Button>
                          <Button 
                            onClick={handleCreateTicket}
                            disabled={creatingTicket}
                            className="flex-1 h-12 bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black rounded-xl border-none shadow-xl shadow-[#7EDE56]/20"
                          >
                            {creatingTicket ? 'SUBMITTING...' : 'SUBMIT TICKET'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">2</div>
                      <div><p className="text-[11px] font-black text-[#002F37] uppercase tracking-widest opacity-40">Open Tickets</p><h4 className="text-sm font-black">Active Requests</h4></div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black">24h</div>
                      <div><p className="text-[11px] font-black text-[#002F37] uppercase tracking-widest opacity-40">Avg. Response</p><h4 className="text-sm font-black">Fast Support</h4></div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#F4FFEE] text-[#177209] flex items-center justify-center font-black">
                        <Check className="w-5 h-5" />
                      </div>
                      <div><p className="text-[11px] font-black text-[#002F37] uppercase tracking-widest opacity-40">Resolved</p><h4 className="text-sm font-black">12 Completed</h4></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">Recent Tickets</h4>
                    
                    {loadingTickets ? (
                      <div className="py-12 flex justify-center"><RefreshCw className="w-8 h-8 text-[#7EDE56] animate-spin" /></div>
                    ) : tickets.length > 0 ? (
                      <div className="space-y-3">
                        {tickets.map((t: any) => (
                          <div key={t._id} className="p-4 rounded-xl border border-gray-100 hover:border-[#7EDE56] transition-all group flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${t.status === 'Open' ? 'bg-amber-500' : 'bg-green-500'}`} />
                              <div>
                                <h5 className="text-[13px] font-black text-[#002F37]">{t.subject}</h5>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.ticketId} · {t.category}</p>
                              </div>
                            </div>
                            <Badge className={`${t.status === 'Open' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'} border-none font-bold text-[9px]`}>{t.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <h5 className="text-sm font-black text-gray-400">No active support tickets</h5>
                        <p className="text-[11px] font-medium text-gray-400 mt-1">Create a ticket if you need assistance with the app</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 rounded-[24px] bg-[#002F37] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute right-[-30px] bottom-[-30px] opacity-10 rotate-12 scale-150"><Smartphone className="w-48 h-48" /></div>
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="space-y-3">
                        <Badge className="bg-[#7EDE56] text-[#002F37] font-black px-3 py-1 mb-2 border-none">DIRECT SUPPORT</Badge>
                        <h3 className="text-2xl font-black">Need immediate help?</h3>
                        <p className="text-sm font-medium opacity-60 max-w-md">Our regional supervisors are available Mon-Fri, 8am - 5pm for urgent field assistance.</p>
                     </div>
                     <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Button className="bg-[#7EDE56] hover:bg-[#7EDE56]/90 text-[#002F37] font-black h-12 rounded-xl px-10 border-none shadow-xl shadow-[#7EDE56]/20">Call Support</Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 rounded-xl px-10 font-black">WhatsApp Chat</Button>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activePanel === 'knowledge' && (
              <div className="space-y-8">
                <div className="bg-white rounded-[24px] p-8 shadow-xl space-y-8">
                  <h3 className="text-xl font-black text-[#002F37]">Agent Resource Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { t: 'Farmer Onboarding', b: 'Step-by-step guide on registering new growers', i: <Users className="w-5 h-5 text-blue-600" />, c: 'bg-blue-50', content: 'Our farmer onboarding protocol ensures data integrity and regional compliance. Requirements: Photo ID, farm coordinates, contact info.' },
                      { t: 'Field Visit App', b: 'How to use the offline sync and geolocation tools', i: <MapPin className="w-5 h-5 text-emerald-600" />, c: 'bg-emerald-50', content: 'Use the geolocation button to pin farm boundaries. If offline, the app will store data locally and sync automatically when you reach a network area.' },
                      { t: 'Investment Matching', b: 'Understanding how farmers are linked to investors', i: <Handshake className="w-5 h-5 text-amber-600" />, c: 'bg-amber-50', content: 'Matches are based on crop suitability, soil reports, and regional sustainability scores. Be sure to upload soil test results for better matches.' },
                      { t: 'Payout & Earnings', b: 'Complete breakdown of commission structures', i: <DollarSign className="w-5 h-5 text-purple-600" />, c: 'bg-purple-50', content: 'Commission is paid out on the 5th of every month. Standard rate: 2.5% of investment value + performance bonuses.' },
                      { t: 'Data Privacy', b: 'Information on Ghanaian Data Protection compliance', i: <Shield className="w-5 h-5 text-red-600" />, c: 'bg-red-50', content: 'Under the Ghana Data Protection Act, you must obtain verbal or written consent from farmers before sharing their data with investors.' },
                      { t: 'Dispute Handling', b: 'Protocol for managing farmer-investor conflicts', i: <AlertTriangle className="w-5 h-5 text-orange-600" />, c: 'bg-orange-50', content: 'Immediately log any dispute in the dashboard. Our resolution specialists will mediate between the parties within 48 hours.' }
                    ].map(g => (
                      <div 
                        key={g.t} 
                        className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => setSelectedGuide(g)}
                      >
                        <div className={`h-12 w-12 rounded-xl ${g.c} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{g.i}</div>
                        <h4 className="text-sm font-black text-[#002F37] mb-2">{g.t}</h4>
                        <p className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest leading-relaxed">{g.b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
                  <DialogContent className="max-w-lg rounded-[24px] p-8 border-none shadow-3xl bg-white font-nunito translate-y-[-50%]">
                    <DialogHeader>
                      <div className={`h-16 w-16 rounded-2xl ${selectedGuide?.c} flex items-center justify-center mb-6`}>
                        {selectedGuide?.i}
                      </div>
                      <DialogTitle className="text-2xl font-black text-[#002F37]">{selectedGuide?.t}</DialogTitle>
                      <DialogDescription className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {selectedGuide?.b}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 p-6 rounded-2xl bg-gray-50 text-[13px] font-semibold text-[#002F37]/80 leading-relaxed border border-gray-100">
                      {selectedGuide?.content}
                    </div>
                    <DialogFooter className="mt-8">
                      <Button 
                        onClick={() => setSelectedGuide(null)}
                        className="w-full h-12 bg-[#002F37] text-white font-black rounded-xl border-none shadow-xl"
                      >
                        CLOSE GUIDE
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Card className="bg-[#7EDE56] border-none shadow-2xl rounded-[24px] overflow-hidden">
                  <CardContent className="p-10 text-[#002F37] text-center space-y-4">
                    <h3 className="text-2xl font-black">AgriLync Academy</h3>
                    <p className="font-bold opacity-60">Complete our certified training courses to unlock higher commission rates.</p>
                    <Button 
                      className="bg-[#002F37] text-white hover:bg-[#002F37]/90 font-black px-12 h-12 rounded-xl border-none mt-2 shadow-xl"
                      onClick={() => navigate('/agent/training')}
                    >
                      ENTER ACADEMY
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </AgentLayout>
  );
};

export default AgentProfile;
