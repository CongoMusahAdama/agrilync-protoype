
import React from 'react';
import { Leaf, Users, Target, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About AgriLync
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming African agriculture through AI-driven consultation, 
              hyperlocal weather services, and innovative financing solutions.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8">
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become Africa's leading agricultural technology platform, empowering 
                smallholder farmers with AI-driven insights, connecting them with 
                sustainable financing, and building resilient farming communities 
                across the continent.
              </p>
            </div>

            <div className="bg-white p-8">
              <Heart className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize agriculture in Ghana and across Africa by providing 
                farmers with accessible AI consultation, hyperlocal weather insights, 
                and transparent investment partnerships that drive sustainable growth 
                and food security.
              </p>
            </div>
          </div>

          {/* Core Team */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Our Core Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-green-100 flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/lovable-uploads/musa.png" alt="Congo Musah Adama" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Congo Musah Adama</h4>
                <p className="text-green-600 font-medium mb-2">CEO and Founder</p>
                <p className="text-gray-600 text-sm">
                  Agricultural Innovator, Software engineer and prduct strategist thinker
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-green-100 flex items-center justify-center shadow-lg">
                  <Target className="h-16 w-16 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Prince Sedem</h4>
                <p className="text-green-600 font-medium mb-2">Co-founder and CTO</p>
                <p className="text-gray-600 text-sm">
                  Software developement expert, trading and chief technology officer
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-green-100 flex items-center justify-center shadow-lg">
                  <Heart className="h-16 w-16 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Robert</h4>
                <p className="text-green-600 font-medium mb-2">Co-founder and Business Communication</p>
                <p className="text-gray-600 text-sm">
                Drives clear, impactful communication that build trust, engagement, and growth
                </p>
              </div>
            </div>
          </div>

          {/* What Our Team Says */}
          <div className="bg-gray-50 p-12 mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              What Our Team Says
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6">
                <p className="text-gray-700 italic mb-4">
                  "Every day, we're not just building technology – we're building bridges 
                  between traditional farming wisdom and cutting-edge innovation."
                </p>
                <p className="text-green-600 font-medium">- Congo Musah Adama, CEO</p>
              </div>

              <div className="bg-white p-6">
                <p className="text-gray-700 italic mb-4">
                  "Our AI doesn't replace the farmer's expertise – it amplifies it. 
                  We're creating tools that respect and enhance human knowledge."
                </p>
                <p className="text-green-600 font-medium">- Prince Sedem, CTO</p>
              </div>
            </div>
          </div>

          {/* Join Community */}
          <div className="text-center bg-green-50 p-12">
            <MessageCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with fellow farmers, share experiences, and stay updated 
              with the latest agricultural insights and opportunities.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              onClick={() => window.open('#', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Community
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
