
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  CheckCircle, 
  ArrowRight,
  Play
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Updated with better visibility and new CTAs */}
      <section className="relative hero-gradient text-white py-24 nature-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white animate-slide-in-left">
                  The Smartest Way to 
                  <span className="block text-green-300 animate-pulse"> Farm, Trade, </span>
                  <span className="block animate-bounce">and Grow</span>
                </h1>
                <p className="text-xl lg:text-2xl text-green-100 leading-relaxed max-w-2xl animate-fade-in-up">
                  Transform your agricultural journey with AI-driven consultation, 
                  hyperlocal weather forecasts, and access to financing through 
                  our revolutionary FarmPartner Initiative.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Get Started
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-green-700 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo Video
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-500">
                <img
                  src="/placeholder.svg"
                  alt="Ghanaian farmer using AgriLync technology"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Succeed Section - New alternating layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with local expertise 
              to empower farmers across Ghana.
            </p>
          </div>

          <div className="space-y-20">
            {/* Feature 1: AI & Human Consultation - Text Right, Image Left */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
              <div className="order-2 lg:order-1">
                <img
                  src="https://images.unsplash.com/photo-1493962853295-0fd70327578a"
                  alt="Farmer consulting with AI technology"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  AI & Human Consultation
                </h3>
                <p className="text-lg text-gray-600">
                  Get instant AI-powered crop advice or connect with local extension agents. 
                  95% accurate disease detection through image analysis helps you make informed decisions quickly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>24/7 AI-powered crop consultation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Connect with verified extension agents</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Instant disease detection and treatment</span>
                  </li>
                </ul>
                <Link to="/ai-consultation">
                  <Button className="bg-green-600 hover:bg-green-700 text-lg px-6 py-3">
                    Try AI Assistant <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature 2: Hyperlocal Weather - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Hyperlocal Weather Forecast
                </h3>
                <p className="text-lg text-gray-600">
                  Farm-specific weather data with SMS alerts for critical farming decisions. 
                  Never miss the perfect planting or harvesting window with our precise forecasts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Farm-specific weather predictions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>SMS alerts for critical weather events</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Personalized farming calendar</span>
                  </li>
                </ul>
                <Link to="/weather">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                    View Weather <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027"
                  alt="Weather monitoring for agriculture"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* Feature 3: FarmPartner Initiative - Text Right, Image Left */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
              <div className="order-2 lg:order-1">
                <img
                  src="https://images.unsplash.com/photo-1465379944081-7f47de8d74ac"
                  alt="Farmers and investors partnership"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  FarmPartner Initiative
                </h3>
                <p className="text-lg text-gray-600">
                  Connect with verified investors for seeds, fertilizer, and equipment. 
                  Share profits and grow together with transparent partnerships.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Connect with verified investors</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Transparent profit sharing model</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Professional monitoring by agents</span>
                  </li>
                </ul>
                <Link to="/farm-partner">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-3">
                    Find Partners <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Ghana Focus Only */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Ghana
            </h2>
            <p className="text-xl text-gray-600">
              Real results from farmers across Ghana who transformed their farming with AgriLync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Kwame Asante",
                location: "Ashanti Region, Ghana",
                crop: "Cocoa Farmer",
                story: "AgriLync's AI consultation helped me identify and treat black pod disease early, saving 80% of my harvest. My income increased by 150% this season.",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
              },
              {
                name: "Amina Ibrahim",
                location: "Northern Region, Ghana",
                crop: "Rice Farmer",
                story: "Through FarmPartner, I got the fertilizer I needed and proper guidance. My rice yield doubled, and I'm planning to expand my farm next season.",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
              },
              {
                name: "Joseph Mensah",
                location: "Greater Accra, Ghana",
                crop: "Maize Farmer",
                story: "The weather alerts saved my crops from unexpected rains. I now plan my farming activities based on AgriLync's forecasts and never miss market opportunities.",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
              }
            ].map((story, index) => (
              <Card key={index} className="bg-gray-50 border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{story.name}</h4>
                      <p className="text-sm text-gray-600">{story.location}</p>
                      <p className="text-sm text-green-600">{story.crop}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{story.story}"</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Success Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact Across Ghana
            </h2>
            <p className="text-xl text-green-100">
              Growing stronger together, one farm at a time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15,000+", label: "Farmers Empowered" },
              { number: "₵850K", label: "Additional Income Generated" },
              { number: "95%", label: "Disease Detection Accuracy" },
              { number: "All 16 Regions", label: "Across Ghana" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2 animate-fade-in">
                <div className="text-4xl lg:text-5xl font-bold text-green-200">
                  {stat.number}
                </div>
                <div className="text-lg text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Farming Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of farmers who are already using AgriLync to grow smarter, 
            earn more, and build sustainable agricultural businesses across Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                Start Your Journey Today
              </Button>
            </Link>
            <Link to="/ai-consultation">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              >
                Try AI Consultation Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
