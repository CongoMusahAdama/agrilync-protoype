import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, User, TrendingUp, Users } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });

  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
          navigate(from, { replace: true });
        }
      } else {
        // Robust validation for signup
        const allowedRoles = ['farmer', 'investor', 'extension_agent'];
        if (!userRole || !allowedRoles.includes(userRole)) {
          toast.error('Please select a valid role.');
          setLoading(false);
          return;
        }
        if (!formData.name || formData.name.trim().length < 2) {
          toast.error('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!formData.email || !formData.password) {
          toast.error('Email and password are required.');
          setLoading(false);
          return;
        }

        const userData = {
          role: userRole,
          full_name: formData.name.trim(),
          phone: formData.phone,
          location: formData.location
        };
        console.log('Signup payload:', formData.email, formData.password, userData); // <-- Added for debugging

        const { error } = await signUp(formData.email, formData.password, userData);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
          // Auto-redirect based on role after successful signup
          setTimeout(() => {
            if (userRole === 'farmer') {
              navigate('/farmer-dashboard');
            } else if (userRole === 'investor') {
              navigate('/investor-dashboard');
            } else if (userRole === 'extension_agent') {
              navigate('/agent-dashboard');
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { 
      value: 'farmer', 
      label: 'Farmer', 
      icon: Leaf, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200 hover:border-green-300',
      desc: 'Grow smarter with AI consultation and weather insights' 
    },
    { 
      value: 'investor', 
      label: 'Investor', 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-300',
      desc: 'Partner with verified farmers for sustainable returns' 
    },
    { 
      value: 'extension_agent', 
      label: 'Extension Agent', 
      icon: Users, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-300',
      desc: 'Support farming communities and drive agricultural growth' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-2 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="w-full max-w-6xl">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png" 
              alt="AgriLync Logo" 
              className="h-8 w-8"
            />
            <span className="font-bold text-xs sm:text-base text-gray-900">AgriLync</span>
          </Link>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base">
            {isLogin ? 'Welcome back to your farming journey' : 'Start your smart farming journey today'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Role Selection - Beside the form */}
          {!isLogin && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
                Choose Your Role
              </h3>
              <div className="space-y-4">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setUserRole(role.value)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      userRole === role.value 
                        ? `${role.bgColor} ${role.borderColor.replace('hover:', '')} ring-2 ring-offset-2 ring-green-500` 
                        : `bg-white ${role.borderColor} hover:shadow-lg`
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${role.bgColor}`}>
                        <role.icon className={`h-8 w-8 ${role.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900">{role.label}</h4>
                        <p className="text-gray-600 mt-1">{role.desc}</p>
                      </div>
                      {userRole === role.value && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auth Form */}
          <div className={`${!isLogin ? '' : 'lg:col-span-2 max-w-md mx-auto w-full'}`}>
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="Your city/region in Ghana"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 h-12"
                    disabled={(!isLogin && !userRole) || loading}
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {isLogin 
                      ? "Don't have an account? Create one" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
