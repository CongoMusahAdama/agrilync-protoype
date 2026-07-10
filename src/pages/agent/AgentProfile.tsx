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
import ProfileImageCropDialog from '@/components/ProfileImageCropDialog';
import AgentLayout from './AgentLayout';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { playSuccessSound } from '@/utils/audio';
import {
  agentModalShell,
  agentModalHeader,
  agentModalBody,
  agentModalFooter,
  agentModalCloseClear,
} from '@/utils/agentModalStyles';
import { cn } from '@/lib/utils';
import {
  getCommunitiesForDistrict,
  getCommunitiesForRegion,
  getDistrictsForRegion,
  getRegionKey,
  GHANA_REGIONS,
  OTHER_COMMUNITY_OPTION,
} from '@/data/ghanaRegions';

const MOBILE_PANEL_TITLES: Record<string, string> = {
  'personal-info': 'My Account',
  'work-details': 'Work Details',
  location: 'Field Location',
  alerts: 'Notifications',
  comms: 'Communication',
  display: 'Display & Language',
  sync: 'Offline & Sync',
  commission: 'Earnings',
  payouts: 'Payout History',
  security: 'Security & Access',
  support: 'Help & Support',
  knowledge: 'Knowledge Base',
};

const cardShell = 'rounded-2xl lg:rounded-[32px] border border-gray-100 lg:border-none shadow-sm lg:shadow-2xl bg-white overflow-hidden agent-settings-form-card';
const cardPad = 'p-5 sm:p-6 lg:p-10';
const sectionGap = 'space-y-6 lg:space-y-10';
const sectionTitle = 'text-lg sm:text-xl font-black font-montserrat text-[#002F37] uppercase tracking-tight';
const actionBtn = 'h-12 lg:h-14 rounded-xl lg:rounded-2xl font-black font-montserrat text-[12px] lg:text-[13px]';

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
        <SelectTrigger id={id} className="h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-base sm:text-[13px] font-semibold transition-all font-inter">
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
        className={`h-11 border-[1.5px] border-gray-100 rounded-xl bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] text-base sm:text-[13px] font-semibold transition-all font-inter ${readOnly ? 'opacity-60 cursor-not-allowed shadow-none' : ''}`}
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
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [customCommunity, setCustomCommunity] = useState('');
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const supervisorInfo = React.useMemo(() => {
    const sup = (agent as { supervisor?: { name?: string; contact?: string; email?: string } })?.supervisor;
    return sup && typeof sup === 'object' ? sup : null;
  }, [agent]);

  const contactSupervisor = (mode: 'phone' | 'email' | 'whatsapp' = 'phone') => {
    const phone = supervisorInfo?.contact?.replace(/\s/g, '');
    const email = supervisorInfo?.email;
    if (mode === 'phone' && phone) {
      window.location.href = `tel:${phone}`;
      return;
    }
    if (mode === 'whatsapp' && phone) {
      const digits = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${digits}`, '_blank');
      return;
    }
    if (email) {
      window.location.href = `mailto:${email}?subject=AgriLync Field Agent Support`;
      return;
    }
    Swal.fire({
      icon: 'info',
      title: 'Supervisor not assigned',
      text: 'No reporting supervisor is linked to your account yet. Please ask your admin to assign one.',
      confirmButtonColor: '#065f46',
    });
  };

  useEffect(() => {
    if (agent) {
      setFormData(agent);
      const regionKey = getRegionKey(agent.region);
      const districts = getDistrictsForRegion(agent.region);
      const communities = getCommunitiesForRegion(agent.region);
      const storedDistrict = (agent as any).district || '';
      const storedCommunity = (agent as any).community || agent.districts?.[0] || '';

      if (storedDistrict && districts.includes(storedDistrict)) {
        setSelectedDistrict(storedDistrict);
      } else {
        setSelectedDistrict('');
      }

      if (storedCommunity && communities.includes(storedCommunity)) {
        setSelectedCommunity(storedCommunity);
        setCustomCommunity('');
      } else if (storedCommunity) {
        setSelectedCommunity(OTHER_COMMUNITY_OPTION);
        setCustomCommunity(storedCommunity);
      } else {
        setSelectedCommunity('');
        setCustomCommunity('');
      }
    }
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
      const finalCommunity =
        selectedCommunity === OTHER_COMMUNITY_OPTION
          ? customCommunity.trim()
          : selectedCommunity;

      const updated = await updateAgent({
        name: formData.name,
        contact: formData.contact,
        region: getRegionKey(formData.region || agent?.region),
        district: selectedDistrict || finalCommunity,
        community: finalCommunity,
      });
      if (updated) setFormData(updated);
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
    e.target.value = '';

    if (file.size > 5 * 1024 * 1024) {
      return Swal.fire({
        icon: 'warning',
        title: 'File Too Large',
        text: 'Profile images must be under 5MB.',
        confirmButtonColor: '#065f46'
      });
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setCropDialogOpen(true);
    };
  };

  const handleCroppedAvatar = async (base64data: string) => {
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
            <div className="relative overflow-hidden rounded-2xl lg:rounded-[32px] p-5 sm:p-6 lg:p-10 text-white shadow-xl lg:shadow-2xl" 
                 style={{ background: 'linear-gradient(135deg, #002F37 0%, #004D4D 100%)' }}>
              <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none scale-150 rotate-12">
                <User className="h-64 w-64" />
              </div>
              <div className="relative z-10 flex flex-col items-center md:items-start md:flex-row gap-8">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full border-4 border-white/20 overflow-hidden bg-[#004d4d] flex items-center justify-center shadow-2xl">
                    {agent?.avatar ? (
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover object-center" />
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

            <Card className={cardShell}>
              <div className="h-1.5 w-full bg-[#7EDE56]" />
              <CardContent className={cn(cardPad, sectionGap)}>
                <div>
                  <h3 className={sectionTitle}>Personal Identity</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-2">Verified credentials & mapping</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                  <Field label="Full Name" id="name" required value={formData.name || ''} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                  <Field label="Mobile Number" id="phone" required value={formData.contact || ''} onChange={(e: any) => setFormData({...formData, contact: e.target.value})} />
                  <Field label="Primary Email" id="email" required value={formData.email || ''} readOnly />
                  <Field label="Assigned Gender" id="gender" type="select" value="male" readOnly options={[{label:'MALE', value:'male'}, {label:'FEMALE', value:'female'}]} />
                </div>
                <div className="agent-action-row flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 lg:pt-6 border-t border-gray-50 sticky bottom-0 lg:static bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none -mx-1 px-1 pb-1 lg:mx-0 lg:px-0 lg:pb-0">
                  <Button variant="ghost" className={cn(actionBtn, 'px-6 lg:px-8 text-gray-400 hover:bg-gray-50')} onClick={() => { setFormData(agent); setActivePanel('home'); }}>Back</Button>
                  <Button className={cn(actionBtn, 'px-8 lg:px-10 bg-[#002f37] hover:bg-[#002f37]/90 text-white border-none shadow-lg lg:shadow-xl shadow-[#002f37]/20')} onClick={handleUpdateProfile} disabled={saving}>
                    {saving ? 'Processing…' : 'Update Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'location': {
        const regionOptions = Object.keys(GHANA_REGIONS);
        const districtOptions = getDistrictsForRegion(formData.region || agent?.region);
        const communityOptions = selectedDistrict
          ? getCommunitiesForDistrict(selectedDistrict)
          : getCommunitiesForRegion(formData.region || agent?.region);

        return (
          <Card className={cn(cardShell, 'animate-fade-in')}>
            <div className="h-1.5 w-full bg-[#7EDE56]" />
            <CardContent className={cn(cardPad, sectionGap)}>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-[#7EDE56]/10 flex items-center justify-center text-[#002f37] shrink-0">
                  <MapPin className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className={sectionTitle}>Field Location</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-1">Region, district & community mapping</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Region</Label>
                  <Select
                    value={getRegionKey(formData.region || agent?.region)}
                    onValueChange={(val) => {
                      setFormData({ ...formData, region: val });
                      setSelectedDistrict('');
                      setSelectedCommunity('');
                      setCustomCommunity('');
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-100 font-semibold text-[13px]">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-64">
                      {regionOptions.map((r) => (
                        <SelectItem key={r} value={r} className="text-xs font-bold uppercase">{r.replace(/\s+Region$/i, '')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">District</Label>
                  <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity(''); setCustomCommunity(''); }}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-100 font-semibold text-[13px]">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-64">
                      {districtOptions.map((d) => (
                        <SelectItem key={d} value={d} className="text-xs font-bold">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Community</Label>
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-100 font-semibold text-[13px]">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-64">
                      {communityOptions.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs font-bold">{c}</SelectItem>
                      ))}
                      <SelectItem value={OTHER_COMMUNITY_OPTION} className="text-xs font-bold text-[#065f46]">{OTHER_COMMUNITY_OPTION}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedCommunity === OTHER_COMMUNITY_OPTION && (
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specify Community</Label>
                    <Input
                      value={customCommunity}
                      onChange={(e) => setCustomCommunity(e.target.value)}
                      placeholder="Enter your community name"
                      className="h-11 rounded-xl bg-gray-50 border-gray-100 font-semibold text-[13px]"
                    />
                  </div>
                )}
              </div>

              {agent?.districts && agent.districts.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational communities (assigned)</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.districts.map((c: string) => (
                      <Badge key={c} className="bg-[#7EDE56]/15 text-[#002f37] border-none font-black text-[9px] uppercase">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="agent-action-row flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 lg:pt-6 border-t border-gray-50 sticky bottom-0 lg:static bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none -mx-1 px-1 pb-1 lg:mx-0 lg:px-0 lg:pb-0">
                <Button variant="ghost" className={cn(actionBtn, 'px-6 lg:px-8 text-gray-400')} onClick={() => setActivePanel('home')}>Back</Button>
                <Button className={cn(actionBtn, 'px-8 lg:px-10 bg-[#002f37] hover:bg-[#002f37]/90 text-white')} onClick={handleUpdateProfile} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Location'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }

      case 'work-details':
        return (
          <Card className={cn(cardShell, 'animate-fade-in')}>
            <div className="h-1.5 w-full bg-[#002f37]" />
            <CardContent className={cn(cardPad, sectionGap)}>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-[#002f37]/5 flex items-center justify-center text-[#002f37] shrink-0">
                   <Briefcase className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className={sectionTitle}>Work Profile</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-1">Operational details & assignment</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                <Field label="Agent Identity" id="aid" readOnly value={agent?.agentId} />
                <Field label="Current Grade" id="role" readOnly value="Field Agent (Gold)" />
                <Field label="Reporting Supervisor" id="sup" readOnly value={supervisorInfo?.name || 'Not assigned'} />
                <Field label="Supervisor Contact" id="supc" readOnly value={supervisorInfo?.contact || supervisorInfo?.email || '—'} />
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card className={cn(cardShell, 'animate-fade-in')}>
            <div className="h-1.5 w-full bg-[#921573]" />
            <CardContent className={cn(cardPad, sectionGap)}>
               <div>
                  <h3 className={sectionTitle}>Account Access</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mt-2">Manage your authentication</p>
                </div>
              <div className="grid gap-5 lg:gap-6 max-w-md">
                <Field label="Current Password" id="cp" type="password" value={passwordData.currentPassword} onChange={(e: any) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                <Field label="New Secure Password" id="np" type="password" value={passwordData.newPassword} onChange={(e: any) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                <Field label="Verify New Password" id="cnp" type="password" value={passwordData.confirmPassword} onChange={(e: any) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                <Button onClick={handleUpdatePassword} disabled={saving} className={cn(actionBtn, 'bg-[#002f37] hover:bg-[#002f37]/90 text-white border-none mt-1 shadow-lg lg:shadow-xl shadow-[#002f37]/20 uppercase tracking-widest text-[11px] w-full')}>
                  {saving ? 'Authenticating…' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'support':
        return (
          <div className="space-y-4 lg:space-y-6 animate-fade-in">
            <Card className={cardShell}>
              <div className="h-1.5 w-full bg-[#002f37]" />
              <CardContent className={cn(cardPad, sectionGap)}>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-montserrat text-[#002F37] uppercase tracking-tight leading-tight">Support Center</h3>
                    <p className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-[0.25em]">We're here to help you succeed</p>
                  </div>
                  <Button className={cn(actionBtn, 'bg-[#002F37] hover:bg-[#003c47] text-white px-6 lg:px-8 border-none shadow-lg lg:shadow-xl shadow-[#002F37]/20 uppercase tracking-widest text-[11px] w-full sm:w-auto shrink-0')} onClick={() => setTicketModalOpen(true)}>
                    Create Ticket
                  </Button>
                </div>
                <div className="space-y-4 lg:space-y-6">
                  <h4 className="text-[10px] font-black font-inter text-gray-400 uppercase tracking-[0.3em]">Recent Tickets</h4>
                  {loadingTickets ? (
                    <div className="py-10 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">Loading tickets…</div>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-3">
                      {tickets.map((t: any) => (
                        <div key={t._id} className="p-4 lg:p-5 rounded-xl lg:rounded-2xl border border-gray-100 hover:border-[#7EDE56] hover:bg-gray-50/50 transition-all group flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${t.status === 'Open' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
                            <div className="min-w-0">
                              <h5 className="text-[13px] lg:text-[14px] font-black font-montserrat text-[#002F37] truncate">{t.subject}</h5>
                              <p className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest mt-0.5 truncate">{t.ticketId} · {t.category}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-[#002F37] transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 lg:py-16 text-center bg-gray-50/50 rounded-2xl lg:rounded-[32px] border-2 border-dashed border-gray-200">
                      <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-sm">
                        <Briefcase className="w-8 h-8 lg:w-10 lg:h-10 text-gray-200" />
                      </div>
                      <h5 className="text-[11px] lg:text-[12px] font-black font-inter text-gray-400 uppercase tracking-[0.2em]">No active support tickets</h5>
                      <p className="text-[10px] font-medium text-gray-300 mt-2 px-6">Your historical requests will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-[40px] bg-[#002F37] text-white shadow-xl lg:shadow-3xl relative overflow-hidden border-none text-center">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Handshake className="h-64 w-64 -rotate-12" />
               </div>
               <div className="relative z-10 space-y-6 lg:space-y-8 flex flex-col items-center">
                  <Badge className="bg-[#7EDE56] text-[#002F37] font-black font-inter px-4 py-2 border-none uppercase tracking-[0.25em] rounded-full shadow-lg">Your Supervisor</Badge>
                  <div className="space-y-2">
                    <h3 className="text-2xl lg:text-3xl font-black font-montserrat tracking-tight">{supervisorInfo?.name || 'Supervisor pending'}</h3>
                    <p className="text-white/60 text-[12px] lg:text-[13px] font-medium max-w-xs mx-auto px-2">
                      {supervisorInfo?.contact || supervisorInfo?.email
                        ? 'Contact your assigned regional supervisor directly from the field.'
                        : 'Ask your admin to assign a supervisor to your account.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 w-full max-w-sm px-2">
                    <Button
                      onClick={() => contactSupervisor('phone')}
                      className={cn(actionBtn, 'bg-[#7EDE56] hover:bg-[#8eff6b] text-[#002F37] w-full border-none shadow-lg shadow-[#7EDE56]/10 uppercase tracking-widest text-[11px]')}
                    >
                      Call Supervisor
                    </Button>
                    <Button
                      onClick={() => contactSupervisor('whatsapp')}
                      variant="ghost"
                      className={cn(actionBtn, 'bg-white/10 text-white hover:bg-white/20 w-full border-none uppercase tracking-widest text-[11px]')}
                    >
                      WhatsApp
                    </Button>
                  </div>
               </div>
            </Card>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-4 lg:space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {[
                  { title: 'Offline & PWA Field Guide', desc: 'Install the app, download grower data, work offline, sync in town', icon: <Wifi className="h-6 w-6" />, route: '/dashboard/agent/offline-guide' },
                  { title: 'Grower Onboarding', desc: 'Step-by-step guide to registering new farmers', icon: <UserCheck className="h-6 w-6" /> },
                  { title: 'Visit & Documentation', desc: 'How to log visits and capture field evidence', icon: <Camera className="h-6 w-6" /> },
                  { title: 'Commission Payouts', desc: 'Understanding your earnings and withdrawal process', icon: <Coins className="h-6 w-6" /> }
                ].map((guide, idx) => (
                  <Card
                    key={idx}
                    className="p-5 lg:p-6 rounded-2xl lg:rounded-[32px] border border-gray-100 lg:border-none shadow-sm lg:shadow-xl hover:shadow-md lg:hover:shadow-2xl transition-all cursor-pointer bg-white group active:scale-[0.99]"
                    onClick={() => {
                      if ('route' in guide && guide.route) navigate(guide.route as string);
                    }}
                  >
                    <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl bg-[#002f37]/5 flex items-center justify-center text-[#002f37] group-hover:bg-[#7EDE56] group-hover:text-[#002f37] transition-all mb-3 lg:mb-4">
                      {guide.icon}
                    </div>
                    <h4 className="text-[14px] lg:text-[15px] font-black font-montserrat text-[#002f37] mb-1.5 lg:mb-2 leading-tight uppercase tracking-tight">{guide.title}</h4>
                    <p className="text-[11px] font-medium text-gray-400 font-inter leading-relaxed">{guide.desc}</p>
                  </Card>
                ))}
             </div>
             <Card className={cn(cardShell, 'p-0')}>
                <CardContent className={cn(cardPad)}>
                <h3 className={cn(sectionTitle, 'mb-5 lg:mb-8')}>Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {[
                    "How do I use AgriLync offline in the village?",
                    "What should I do if my GPS isn't locking?",
                    "Where can I find my monthly performance bonus?",
                    "Offline sync is taking too long, what's wrong?"
                  ].map((q, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl lg:rounded-2xl border border-gray-50 flex items-center justify-between gap-3 group hover:border-[#7EDE56] active:bg-gray-50/80 cursor-pointer"
                      onClick={() => {
                        if (i === 0) navigate('/dashboard/agent/offline-guide');
                      }}
                    >
                      <p className="text-[13px] font-bold text-gray-600 font-inter group-hover:text-[#002f37] leading-snug">{q}</p>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#002f37] shrink-0" />
                    </div>
                  ))}
                </div>
                </CardContent>
             </Card>
          </div>
        );

      case 'commission':
      case 'payouts':
        return (
          <div className="space-y-4 lg:space-y-6 animate-fade-in">
             <Card className="p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-[40px] bg-[#002F37] text-white shadow-xl lg:shadow-3xl relative overflow-hidden border-none text-center">
                <div className="absolute top-0 left-0 p-8 opacity-5">
                   <TrendingUp className="h-64 w-64" />
                </div>
                <div className="relative z-10 space-y-3 lg:space-y-4">
                   <p className="text-[10px] font-black text-[#7EDE56] uppercase tracking-[0.3em]">Lifetime Earnings</p>
                   <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-montserrat tracking-tighter">GH₵ 4,250.00</h2>
                   <p className="text-white/40 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest">Next payout: April 30, 2026</p>
                </div>
             </Card>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { label: 'This Month', val: '640' },
                  { label: 'Bonuses', val: '200' },
                  { label: 'Referrals', val: '120' },
                  { label: 'Withdrawn', val: '3.2k' }
                ].map((stat, i) => (
                  <Card key={i} className="p-4 lg:p-5 rounded-2xl lg:rounded-3xl border border-gray-100 lg:border-none shadow-sm lg:shadow-xl bg-white text-center">
                    <p className="text-[9px] font-black text-gray-400 gap-2 mb-1 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[16px] lg:text-[18px] font-black text-[#002f37] font-montserrat">₵{stat.val}</p>
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
          <Card className={cn(cardShell, 'animate-fade-in')}>
            <CardContent className={cn(cardPad, 'space-y-2 lg:space-y-4')}>
              <h3 className={sectionTitle}>Display Settings</h3>
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
      <div className="pb-24 lg:pb-0">
        <div className="lg:hidden agent-settings-mobile">
          {activePanel === 'home' ? (
            <div className="space-y-0 px-1 sm:px-2">
               <div className="pt-8 pb-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-2 border-[#7ede56]/20 shadow-md relative z-10">
                      <AvatarImage src={agent?.avatar} />
                      <AvatarFallback className="bg-[#065f46] text-white text-xl font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 h-8 w-8 bg-[#002f37] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20 active:scale-95 transition-all cursor-pointer">
                       <Camera className="h-4 w-4" />
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  
                  <div className="text-center px-4">
                    <h2 className="text-xl font-bold font-montserrat text-[#002f37] tracking-tight">{agent?.name}</h2>
                    <p className="text-[12px] font-semibold text-gray-400 font-inter mt-1">{agent?.agentId}</p>
                  </div>
               </div>

               <div className="space-y-2.5 pb-28">
                  {[
                    { id: 'personal-info', title: 'My Account', desc: 'Manage your profile and mapping', icon: <User className="w-4 h-4 text-white" /> },
                    { id: 'commission', title: 'Earnings & Payouts', desc: 'Monitor monthly growth and bonuses', icon: <Coins className="w-4 h-4 text-white" /> },
                    { id: 'display', title: 'Offline access', desc: 'Install app & field data guide', icon: <RefreshCw className="w-4 h-4 text-white" />, route: '/dashboard/agent/offline-guide' },
                    { id: 'security', title: 'Security & Access', desc: 'Password and account protection', icon: <Lock className="w-4 h-4 text-white" /> },
                    { id: 'knowledge', title: 'Knowledge base', desc: 'Best practices, FAQs and guides', icon: <FileText className="w-4 h-4 text-white" /> },
                    { id: 'support', title: 'Help and support', desc: "Get help with any issue you face", icon: <AlertTriangle className="w-4 h-4 text-white" /> },
                  ].map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => {
                        if ('route' in item && item.route) {
                          navigate(item.route as string);
                          return;
                        }
                        setActivePanel(item.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="w-full flex items-center gap-4 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm active:bg-gray-50 active:scale-[0.99] transition-all text-left group"
                    >
                      <div className="h-11 w-11 rounded-full flex items-center justify-center bg-[#002f37] text-white shrink-0 shadow-sm">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold font-montserrat text-[#002f37] leading-tight">{item.title}</p>
                        <p className="text-[11px] font-medium text-gray-400 font-inter leading-snug mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-active:text-[#002f37] shrink-0" />
                    </button>
                  ))}

                  <div className="pt-3">
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className="w-full h-12 rounded-2xl text-rose-500 font-bold font-montserrat hover:bg-rose-50 active:bg-rose-100 transition-all gap-2 text-[13px] border border-rose-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-[calc(100dvh-6rem)] -mx-2 sm:-mx-0">
              <div className="sticky top-0 z-40 bg-[#f8fafc]/95 backdrop-blur-md border-b border-gray-100 px-3 sm:px-4 py-3 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => { setActivePanel('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#002f37] shadow-sm active:scale-95 transition-transform shrink-0"
                  aria-label="Back to settings"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Settings</p>
                  <h1 className="text-[15px] font-black font-montserrat text-[#002f37] truncate">
                    {MOBILE_PANEL_TITLES[activePanel] || 'Settings'}
                  </h1>
                </div>
              </div>
              <div className="agent-settings-mobile-panel flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-4 py-4 pb-32">
                {renderContent()}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-10 pt-4">
          <div className="w-[300px] shrink-0 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl text-center space-y-4 border-b-[6px] border-[#002f37]">
               <div className="h-24 w-24 rounded-full mx-auto border-4 border-gray-50 overflow-hidden">
                 {agent?.avatar ? <img src={agent.avatar} className="w-full h-full object-cover object-center" alt="" /> : <User className="w-full h-full p-6 text-gray-200" />}
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
        <DialogContent className={agentModalShell('border-none shadow-2xl bg-white font-inter gap-0')}>
          <DialogHeader className={cn(agentModalHeader, agentModalCloseClear, 'space-y-2 border-gray-100 bg-white')}>
            <DialogTitle className="text-xl sm:text-2xl font-black font-montserrat text-[#002F37] uppercase tracking-tight">Create Ticket</DialogTitle>
            <DialogDescription className="text-[11px] font-medium text-gray-400">Describe your issue and we'll resolve it within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className={cn(agentModalBody, 'space-y-5')}>
            <Field label="Brief Subject" id="tsub" value={ticketData.subject} onChange={(e: any) => setTicketData({...ticketData, subject: e.target.value})} />
            <Field label="Issue Category" id="tcat" type="select" value={ticketData.category} options={[{label:'TECHNICAL ISSUE', value:'Technical Issue'}, {label:'ACCOUNT ACCESS', value:'Account Access'}, {label:'FIELD OPERATIONS', value:'Field Operations'}]} />
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Describe detailed issue</Label>
              <Textarea 
                className="min-h-[120px] sm:min-h-[140px] rounded-xl lg:rounded-2xl border-[1.5px] border-gray-100 bg-gray-50 focus:ring-4 focus:ring-[#7EDE56]/15 focus:border-[#7EDE56] transition-all p-4 text-base sm:text-sm font-medium resize-none" 
                placeholder="How can we help you today?" 
                value={ticketData.description} 
                onChange={(e) => setTicketData({...ticketData, description: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter className={cn(agentModalFooter, 'border-gray-100 bg-white mt-0')}>
            <Button
              variant="outline"
              onClick={() => setTicketModalOpen(false)}
              className={cn(actionBtn, 'border-2 border-gray-200 text-gray-500 hover:bg-gray-50')}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={creatingTicket} className={cn(actionBtn, 'bg-[#7EDE56] hover:bg-[#6cd147] text-[#002F37] border-none shadow-lg shadow-[#7EDE56]/20 uppercase tracking-widest text-[12px]')}>
              {creatingTicket ? 'Submitting…' : 'Submit Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProfileImageCropDialog
        open={cropDialogOpen}
        imageSrc={cropImageSrc}
        onOpenChange={setCropDialogOpen}
        onCropComplete={handleCroppedAvatar}
      />
    </AgentLayout>
  );
};

export default AgentProfile;
