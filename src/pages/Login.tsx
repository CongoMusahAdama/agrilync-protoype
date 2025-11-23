import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, MessageCircle, Construction } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
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
    // Login is disabled - under development
    return;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="light" />
      
      <div className="flex min-h-screen">
        {/* Left Side - Image Grid */}
        <div className="hidden lg:flex lg:flex-1 bg-gray-50 p-6">
          <div className="w-full grid grid-cols-3 gap-3 h-full">
            {/* Column 1 */}
            <div className="space-y-4">
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.1s' }}
              >
                <img
                  src="/lovable-uploads/signup1.jpg"
                  alt="Agricultural content creation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.3s' }}
              >
                <img
                  src="/lovable-uploads/signup2.jpg"
                  alt="Digital farming consultation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-4">
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.2s' }}
              >
                <img
                  src="/lovable-uploads/signup3.jpg"
                  alt="Agricultural training session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.4s' }}
              >
                <img
                  src="/lovable-uploads/signup4.jpg"
                  alt="Farm planning and analysis"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>
            
            {/* Column 3 */}
            <div className="space-y-4">
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.3s' }}
              >
                <img
                  src="/lovable-uploads/signup5.jpg"
                  alt="Harvest and agricultural success"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              <div 
                className={`relative overflow-hidden rounded-lg shadow-lg h-72 transition-all duration-700 ease-out ${
                  imagesLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.5s' }}
              >
                <img
                  src="/lovable-uploads/signup6.jpg"
                  alt="Agricultural communication"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-6 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your AgriLync account</p>
            </div>

            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Access your dashboard and continue your agricultural journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Under Development Message */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Construction className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 mb-1">Under Development</h3>
                      <p className="text-sm text-yellow-700">
                        Our login system is currently under development. We're working hard to bring you the best experience. 
                        In the meantime, join our WhatsApp community to stay updated and connect with fellow farmers!
                      </p>
                    </div>
                  </div>
                  {/* WhatsApp Icon Button */}
                  <div className="mt-4 flex justify-center">
                    <a
                      href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-md hover:shadow-lg"
                      title="Join Our WhatsApp Community"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled
                      className="cursor-not-allowed opacity-60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled
                        className="cursor-not-allowed opacity-60"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
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
                        disabled
                        className="cursor-not-allowed opacity-60"
                      />
                      <Label htmlFor="rememberMe" className="text-sm opacity-60">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-gray-400 cursor-not-allowed pointer-events-none"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gray-400 text-white cursor-not-allowed"
                    disabled={true}
                  >
                    Sign In (Disabled)
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link
                        to="/signup"
                        className="text-[#7ede56] hover:text-[#6bc947] font-medium"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>© 2025 AgriLync Program. All rights reserved.</p>
              <p>Developed by AfriqNova and Anchor Ashland Desert LLC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image Section */}
      <div className="lg:hidden bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Mobile Image Grid - 3 columns */}
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.1s' }}
            >
              <img
                src="/lovable-uploads/signup1.jpg"
                alt="Agricultural content creation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              <img
                src="/lovable-uploads/signup2.jpg"
                alt="Digital farming consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <img
                src="/lovable-uploads/signup3.jpg"
                alt="Agricultural training session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              <img
                src="/lovable-uploads/signup4.jpg"
                alt="Farm planning and analysis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.5s' }}
            >
              <img
                src="/lovable-uploads/signup5.jpg"
                alt="Harvest and agricultural success"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div 
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${
                imagesLoaded 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.6s' }}
            >
              <img
                src="/lovable-uploads/signup6.jpg"
                alt="Agricultural communication"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
