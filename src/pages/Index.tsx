
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Leaf, 
  Cloud, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  MessageSquare,
  MapPin,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 nature-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                The Smartest Way to 
                <span className="text-green-300"> Farm, Trade, </span>
                and Grow
              </h1>
              <p className="text-xl text-green-100 leading-relaxed">
                Transform your agricultural journey with AI-driven consultation, 
                hyperlocal weather forecasts, and access to financing through 
                our revolutionary FarmPartner Initiative.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-8 py-4">
                    Join as a Farmer
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white border-white hover:bg-white hover:text-green-700 text-lg px-8 py-4"
                  >
                    Become an Investor
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4"
                  >
                    Explore As an Agent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img
                  src="/placeholder.svg"
                  alt="African farmer using technology"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with local expertise 
              to empower farmers across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI & Human Consultation */}
            <Card className="hover-scale bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI & Human Consultation
                </h3>
                <p className="text-gray-600 mb-6">
                  Get instant AI-powered crop advice or connect with local extension agents. 
                  95% accurate disease detection through image analysis.
                </p>
                <Link to="/ai-consultation">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Try AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Hyperlocal Weather */}
            <Card className="hover-scale bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Hyperlocal Weather Forecast
                </h3>
                <p className="text-gray-600 mb-6">
                  Farm-specific weather data with SMS alerts for critical farming decisions. 
                  Never miss the perfect planting or harvesting window.
                </p>
                <Link to="/weather">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Weather <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* FarmPartner Initiative */}
            <Card className="hover-scale bg-white shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  FarmPartner Initiative
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect with verified investors for seeds, fertilizer, and equipment. 
                  Share profits and grow together with transparent partnerships.
                </p>
                <Link to="/farm-partner">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Find Partners <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Farmers
            </h2>
            <p className="text-xl text-gray-600">
              Real results from farmers across Ghana, Nigeria, and Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Kwame Asante",
                location: "Ashanti Region, Ghana",
                crop: "Cocoa Farmer",
                story: "AgriLync's AI consultation helped me identify and treat black pod disease early, saving 80% of my harvest. My income increased by 150% this season.",
                image: "/placeholder.svg"
              },
              {
                name: "Amina Ibrahim",
                location: "Kano State, Nigeria",
                crop: "Rice Farmer",
                story: "Through FarmPartner, I got the fertilizer I needed and proper guidance. My rice yield doubled, and I'm planning to expand my farm next season.",
                image: "/placeholder.svg"
              },
              {
                name: "Joseph Kimani",
                location: "Central Kenya",
                crop: "Maize Farmer",
                story: "The weather alerts saved my crops from unexpected rains. I now plan my farming activities based on AgriLync's forecasts and never miss market opportunities.",
                image: "/placeholder.svg"
              }
            ].map((story, index) => (
              <Card key={index} className="bg-gray-50 border-0 shadow-lg">
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
                  <p className="text-gray-700 italic">"{story.story}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact Across Africa
            </h2>
            <p className="text-xl text-green-100">
              Growing stronger together, one farm at a time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50,000+", label: "Farmers Empowered" },
              { number: "₵2.5M", label: "Additional Income Generated" },
              { number: "95%", label: "Disease Detection Accuracy" },
              { number: "3 Countries", label: "And Growing" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Farming Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of farmers who are already using AgriLync to grow smarter, 
            earn more, and build sustainable agricultural businesses.
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
