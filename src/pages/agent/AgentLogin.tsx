import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  Server,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import api from '@/utils/api';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  { value: 'Ashanti Region', label: 'Ashanti', desc: 'Central Agricultural Hub' },
  { value: 'Greater Accra Region', label: 'Greater Accra', desc: 'Capital Command Center' },
  { value: 'Eastern Region', label: 'Eastern', desc: 'Resource & Field Operations' },
  { value: 'Northern Region', label: 'Northern', desc: 'Savannah Data Terminal' },
  { value: 'Western Region', label: 'Western', desc: 'Coastal Supply Management' },
  { value: 'Volta Region', label: 'Volta', desc: 'Lakeside Monitoring Zone' },
  { value: 'Central Region', label: 'Central', desc: 'Regional Logistics Center' },
  { value: 'Bono Region', label: 'Bono', desc: 'Brong-Ahafo Field Office' },
  { value: 'Upper East Region', label: 'Upper East', desc: 'Arid Zone Cultivation' },
  { value: 'Upper West Region', label: 'Upper West', desc: 'Savannah Perimeter' }
];

const AgentLogin = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    region: ''
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.region) {
      toast.error('Please select your operational region');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Normal Login to verify credentials
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, agent } = res.data;

      // Step 2: Immediate Region Verification Logic
      const normalizedSelected = formData.region.toLowerCase().replace(' region', '').trim();
      const normalizedAssigned = (agent.region || '').toLowerCase().replace(' region', '').trim();
      
      if (normalizedSelected === normalizedAssigned || normalizedAssigned.includes(normalizedSelected)) {
        // Success
        setSession(token, { ...agent, region: formData.region });
        toast.success(`Welcome back, Agent ${agent.name.split(' ')[0]}!`);
        navigate('/dashboard/agent');
      } else {
        toast.error(`Access Denied: You are not assigned to the ${formData.region}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error.response?.data?.msg || 'Authentication failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 md:p-6 font-manrope selection:bg-[#7ede56]/30">
      
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#7ede56]/5 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full bg-[#002f37]/5 blur-3xl opacity-40"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1250px] min-h-screen md:min-h-[520px] bg-[#FDFCFB] md:bg-white md:rounded-[2.5rem] md:shadow-[0_50px_100px_-20px_rgba(0,47,55,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 md:border md:border-white my-0 md:my-8"
      >
        
        {/* Left Panel - Brand Identity (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-[50%] bg-[#002f37] relative flex-col justify-between p-10 md:p-14 overflow-hidden min-h-0 rounded-none">
          {/* Visual Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/image%20copy%206.png" 
              alt="AgriLync Operations" 
              className="w-full h-full object-cover opacity-80 scale-110"
            />
            {/* Neutral gradient overlay for text readability while keeping original image colors */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95 duration-300">
               <img src="/Frame 74.png" alt="AgriLync Logo" className="h-14 w-auto object-contain brightness-0 invert" />
            </Link>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center md:justify-end mt-16 md:mt-20 md:max-w-md pb-6 items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-[2.75rem] md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-3">
                  <span className="md:hidden block">Welcome <br /> Back</span>
                  <span className="hidden md:block">AgriLync Nexus <br /> <span className="text-[#7ede56]">Operations</span></span>
                </h1>
                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <span className="h-[2px] w-8 bg-[#7ede56]"></span>
                  <p className="text-[#7ede56] text-[10px] uppercase font-black tracking-[0.3em]">
                    <span className="md:hidden">Please sign in to continue</span>
                    <span className="hidden md:inline">Connect • Manage • Grow</span>
                  </p>
                </div>
                <p className="text-white/90 text-sm md:text-base leading-relaxed mb-8 font-semibold hidden md:block">
                  Access the Field Agent Strategic Portal. The trusted management system for regional oversight and farmer empowerment.
                </p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center transition-all group-hover:bg-[#7ede56]/20">
                    <Zap className="h-5 w-5 text-[#7ede56]" />
                  </div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-widest leading-none">Real-time Field Intel</p>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center transition-all group-hover:bg-[#7ede56]/20">
                    <ShieldCheck className="h-5 w-5 text-[#7ede56]" />
                  </div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-widest leading-none">Governance & Compliance</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Login Form (Focus on Mobile) */}
        <div className="w-full md:w-[50%] flex flex-col p-8 md:p-8 lg:p-10 relative bg-white overflow-y-auto scrollbar-hide md:bg-white md:rounded-none z-20">
          
          {/* Header/Badge Section */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center p-4 border border-gray-100 shadow-inner">
                 <img src="/Frame 74.png" alt="AgriLync Shield" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#7ede56] border-4 border-white flex items-center justify-center shadow-lg">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            
            <Badge variant="outline" className="mb-3 px-4 py-1.5 rounded-full border-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] bg-gray-50/50">
              Regional Field Operations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-[#002f37] tracking-tight mb-2">
               <span className="md:hidden block mb-1">Welcome Back</span>
               <span className="hidden md:block">Login into Secure Portal</span>
            </h2>
            
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full border border-rose-100/50">
              <Calendar className="h-3 w-3 text-rose-500" />
              <span className="text-[8px] md:text-[9px] font-black text-rose-600 uppercase tracking-widest text-center truncate">
                Current Server Date: {currentDate}
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 flex-1">
            
            {/* Email Field */}
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] pl-1">Operational ID / Email</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 transition-colors group-focus-within:text-[#002f37]">
                  <Mail className="h-full w-full" />
                </div>
                <Input 
                  id="email"
                  type="email"
                  placeholder="agent@agrilync.com"
                  className="pl-14 h-14 bg-white border-gray-100 focus:border-[#002f37] focus:ring-4 focus:ring-[#002f37]/5 transition-all text-[15px] font-bold rounded-3xl shadow-sm"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] pl-1">Secret Authentication Key</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 transition-colors group-focus-within:text-[#002f37]">
                  <Lock className="h-full w-full" />
                </div>
                <Input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="pl-14 pr-16 h-14 bg-white border-gray-100 focus:border-[#002f37] focus:ring-4 focus:ring-[#002f37]/5 transition-all text-[15px] font-bold rounded-3xl shadow-sm"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#002f37] uppercase tracking-tighter hover:bg-[#002f37]/5 px-2 py-1 rounded transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Region Field */}
            <div className="space-y-2.5">
              <Label htmlFor="region" className="text-[10px] font-black uppercase text-gray-500 tracking-[0.15em] pl-1">Deployment Region</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 transition-colors group-focus-within:text-[#002f37] z-10 pointer-events-none">
                  <MapPin className="h-full w-full" />
                </div>
                <Select onValueChange={(val) => handleInputChange('region', val)}>
                  <SelectTrigger className="pl-14 h-14 bg-white border-gray-100 focus:border-[#002f37] focus:ring-4 focus:ring-[#002f37]/5 transition-all text-[15px] font-bold rounded-3xl shadow-sm outline-none">
                    <SelectValue placeholder="SELECT OPERATIONAL REGION" className="text-gray-300" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 shadow-2xl p-2 bg-white ring-1 ring-black/5">
                    {regions.map((region) => (
                      <SelectItem 
                        key={region.value} 
                        value={region.value}
                        className="rounded-xl py-4 focus:bg-[#002f37] focus:text-white font-black uppercase text-[11px] tracking-tight cursor-pointer my-1 transition-colors"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-extrabold">{region.label}</span>
                          <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest">{region.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end pr-1">
              <button type="button" className="text-[11px] font-black text-gray-400 uppercase tracking-tighter hover:text-[#002f37] transition-colors">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-15 bg-gradient-to-r from-[#002f37] to-[#00454f] hover:from-[#001e23] hover:to-[#002f37] text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,47,55,0.3)] transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none mt-4 border-none"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   <span>Authenticating...</span>
                </div>
              ) : (
                'Authenticate & Enter'
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-2 w-2 rounded-full bg-[#7ede56] animate-pulse" />
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 Protected by Shield Layer & Multi-factor
               </p>
            </div>
            
            <p className="text-[11px] font-medium text-gray-400 mb-2">
              Don't have an account? <button className="text-[#002f37] font-black uppercase tracking-tighter hover:underline">Sign up</button>
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
               <span>© 2026 AgriLync Nexus</span>
               <span className="text-gray-300">|</span>
               <span>v4.0.2 Stable</span>
            </div>
          </div>
        </div>

        {/* Floating elements for visual flair */}
        <div className="absolute top-6 left-6 z-20 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="rounded-full h-12 w-12 bg-[#002f37] text-white border-2 border-white/20 shadow-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default AgentLogin;
