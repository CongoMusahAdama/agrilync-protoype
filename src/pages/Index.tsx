
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    if (!user) {
      navigate('/auth', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Updated with video background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://www.pinterest.com/pin/104216178872541278/" type="video/mp4" />
            {/* Fallback image */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
              }}
            ></div>
          </video>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-slide-in-up">
              Transforming Agriculture
              <span className="block text-green-300 animate-fade-in delay-500">
                through AI and Easy Access to Finance
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg font-medium">
              Connect with AI-powered consultation, hyperlocal weather insights, 
              and innovative financing solutions for sustainable farming success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full shadow-xl backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Succeed Section - Updated with consistent purple theming */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered consultation to investment opportunities, we provide comprehensive tools for modern farming.
            </p>
          </div>

          {/* Feature 1 - AI Consultation with Purple Theme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-in-left">
              <img 
                src="/lovable-uploads/a27f20d9-60db-490a-9d3f-a0d3d0e362c9.png"
                alt="AI Consultation"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/ai-consultation')}
              />
            </div>
            <div className="animate-fade-in-right delay-200">
              <Leaf className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => handleFeatureClick('/ai-consultation')}>
                AI-Powered Crop Consultation
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get instant, personalized advice for your crops. Upload photos of plant diseases, 
                pests, or growth issues and receive expert recommendations powered by advanced AI technology.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Instant disease identification</li>
                <li>• Personalized treatment recommendations</li>
                <li>• Connect with human experts</li>
                <li>• Track crop health over time</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/ai-consultation')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try AI Consultation
              </Button>
            </div>
          </div>

          {/* Feature 2 - Weather with Purple Theme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-fade-in-left delay-400 lg:order-1">
              <MapPin className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => handleFeatureClick('/weather')}>
                Hyperlocal Weather Insights
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Access precise, farm-specific weather forecasts and receive intelligent 
                recommendations for planting, irrigation, and harvesting based on local conditions.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• 7-day hyperlocal forecasts</li>
                <li>• SMS weather alerts</li>
                <li>• Farming calendar notifications</li>
                <li>• AI-driven recommendations</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/weather')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                View Weather Forecast
              </Button>
            </div>
            <div className="animate-slide-in-right delay-400 lg:order-2">
              <img 
                src="/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png"
                alt="Weather Forecast"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/weather')}
              />
            </div>
          </div>

          {/* Feature 3 - FarmPartner with Updated Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left delay-600">
              <img 
                src="/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png"
                alt="FarmPartner Investment"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/farm-partner')}
              />
            </div>
            <div className="animate-fade-in-right delay-600">
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => handleFeatureClick('/farm-partner')}>
                FarmPartner Investment Initiative
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Connect verified farmers with impact investors through our transparent 
                partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Verified farmer profiles</li>
                <li>• Transparent profit sharing</li>
                <li>• Extension agent monitoring</li>
                <li>• Impact tracking dashboard</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/farm-partner')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Explore FarmPartner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Ghana Focus */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories from Ghana
            </h2>
            <p className="text-xl text-gray-600">
              Real farmers, real results across Ghana's agricultural regions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Kwame Asante"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Kwame Asante</h4>
                  <p className="text-gray-600">Ashanti Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "AgriLync helped me increase my cocoa yield by 40% through AI disease detection 
                and connected me with an investor who funded my irrigation system."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>

            {/* Farmer 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616c27b2e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Akosua Mensah"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Akosua Mensah</h4>
                  <p className="text-gray-600">Northern Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The weather alerts saved my tomato harvest during the unexpected rains. 
                Now I'm partnered with 3 investors and managing 50 acres successfully."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>

            {/* Farmer 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Kofi Osei"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Kofi Osei</h4>
                  <p className="text-gray-600">Eastern Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "From 2 acres to 15 acres in just 18 months. AgriLync's extension agents 
                guided me through modern farming techniques and secured funding for expansion."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of Ghanaian farmers already growing smarter with AgriLync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl">
                Start Your Journey Today
              </Button>
            </Link>
            
            {/* WhatsApp Community Button */}
            <a 
              href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Join WhatsApp Community</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
