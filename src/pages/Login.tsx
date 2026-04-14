import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, MessageCircle, Construction, Star, Quote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import RegionSelectionModal from '@/components/auth/RegionSelectionModal';

const Login = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    region: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Regional verification states
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<{ token: string; agent: any } | null>(null);

  useEffect(() => {
    // Trigger animations after component mounts
    setImagesLoaded(true);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Verify Credentials only (we don't pass region here anymore)
      const res = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });
      
      const { token, agent } = res.data;
      
      // Step 2: Store session data temporarily and open verification modal
      setPendingSession({ token, agent });
      setIsRegionModalOpen(true);
      
      toast.info('Credentials Verified. Please confirm your region.');
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error.response?.data?.msg || 'Invalid Credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSuccess = (region: string) => {
    if (pendingSession) {
      // Step 3: Finalize session and navigate to dashboard
      // Ensure the newly verified region is merged into the agent object
      setSession(pendingSession.token, { ...pendingSession.agent, region });
      setIsRegionModalOpen(false);
      navigate('/dashboard/agent');
    }
  };

  return (
    <div className="min-h-screen w-full flex font-manrope">
      {/* Region Selection Modal */}
      {pendingSession && (
        <RegionSelectionModal 
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          onSuccess={handleRegionSuccess}
          assignedRegion={pendingSession.agent.region}
        />
      )}

      {/* Left Side - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002f37] relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Background Image with Deep Teal Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/image%20copy%2012.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[#002f37]/75 mix-blend-multiply" />
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#7ede56]/10 blur-3xl z-10"></div>

        <div className="relative z-20">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 p-0 mb-12 h-auto font-normal flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 leading-tight text-white">
            Welcome to the <br />
            <span className="text-[#7ede56]">AgriLync Community</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Empower your agricultural journey with smart insights, trusted connections, and innovative tools designed to help you grow, succeed, and make lasting impact.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Header (Back button) */}
          <div className="lg:hidden">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>

          {/* Mobile Hero Image (Top) */}
          <div className="lg:hidden relative">
            <div className="w-full h-48 rounded-[2rem] overflow-hidden shadow-2xl relative mb-10 group">
                <img 
                    src="/lovable-uploads/image%20copy%2012.png" 
                    alt="Heritage Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002f37]/90 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ede56] mb-1">Our Heritage</p>
                    <h2 className="text-xl font-black text-white leading-tight">AgriLync Community</h2>
                </div>
            </div>
            {/* Soft decorative elements on mobile */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7ede56]/10 blur-2xl rounded-full" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold text-[#002f37]">Welcome back!</h2>
            <p className="text-gray-500 font-medium">
              Your agricultural journey provides you with the building blocks necessary to create true success.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="h-12 bg-gray-50 border-gray-200 focus:border-[#002f37] focus:ring-[#002f37]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-[#002f37] focus:ring-[#002f37]"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                  className="border-gray-300 text-[#002f37] focus:ring-[#002f37]"
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal text-gray-600">Remember me</Label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-[#002f37] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#002f37] hover:bg-[#002f37]/90 text-white font-semibold text-lg rounded-lg shadow-lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center pt-4 space-y-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#002f37] font-bold hover:underline">
                Create free account
              </Link>
            </p>
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Field Agent Access</p>
              <Link to="/agent/login">
                <Button variant="outline" className="w-full border-[#002f37]/20 text-[#002f37] font-bold hover:bg-[#002f37]/5 transition-all rounded-xl gap-2">
                   <ShieldCheck className="h-4 w-4" /> Go to Dedicated Agent Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
