import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, MessageCircle, Construction, Star, Quote } from 'lucide-react';
import Navbar from '@/components/Navbar';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

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
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Show sweet alert for successful login
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <p style="font-size: 18px; color: #059669; margin: 15px 0;">
              Welcome back! You have successfully logged in.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              Redirecting to your dashboard...
            </p>
          </div>
        `,
        confirmButtonText: 'Continue',
        confirmButtonColor: '#7ede56',
        timer: 2000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      
      navigate('/dashboard/redirect');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.msg || err.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);

      if (!err.response && !err.status) {
        toast.info('This might be a network issue. Please ensure VITE_API_URL is correctly set in your hosting platform.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-manrope">

      {/* Left Side - Brand Panel (Deep Teal) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002f37] relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#7ede56]/10 blur-3xl"></div>

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
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to the <br />
            <span className="text-[#7ede56]">AgriLync Community</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Empower your agricultural journey with smart insights, trusted connections, and innovative tools designed to help you grow, succeed, and make lasting impact.
          </p>
        </div>

        {/* Testimonial Removed as per user request */}
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

          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-[#002f37]">Welcome back!</h2>
            <p className="text-gray-500">
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
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#002f37] font-bold hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
