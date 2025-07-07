
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Fixed visibility and contrast */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Transforming Agriculture
              <span className="block text-green-400">Across Ghana</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
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

      {/* Everything You Need to Succeed Section - Redesigned with real images */}
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

          {/* Feature 1 - Text Right, Image Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-fade-in-left">
              <img 
                src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="AI Consultation"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="animate-fade-in-right">
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                AI-Powered Crop Consultation
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get instant, personalized advice for your crops. Upload photos of plant diseases, 
                pests, or growth issues and receive expert recommendations powered by advanced AI technology.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Instant disease identification</li>
                <li>• Personalized treatment recommendations</li>
                <li>• Connect with human experts</li>
                <li>• Track crop health over time</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-fade-in-left lg:order-1">
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Hyperlocal Weather Insights
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Access precise, farm-specific weather forecasts and receive intelligent 
                recommendations for planting, irrigation, and harvesting based on local conditions.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 7-day hyperlocal forecasts</li>
                <li>• SMS weather alerts</li>
                <li>• Farming calendar notifications</li>
                <li>• AI-driven recommendations</li>
              </ul>
            </div>
            <div className="animate-fade-in-right lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Weather Forecast"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Feature 3 - Text Right, Image Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="FarmPartner Investment"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="animate-fade-in-right">
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                FarmPartner Investment Initiative
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Connect verified farmers with impact investors through our transparent 
                partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Verified farmer profiles</li>
                <li>• Transparent profit sharing</li>
                <li>• Extension agent monitoring</li>
                <li>• Impact tracking dashboard</li>
              </ul>
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
          <Link to="/auth">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
