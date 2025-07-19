
import React from 'react';
import { Leaf, Users, Target, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">About AgriLync</h1>
            <p className="text-xs sm:text-base text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              Transforming African agriculture through AI-driven consultation, 
              hyperlocal weather services, and innovative financing solutions.
            </p>
          </div>
          {/* Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-10 sm:mb-20">
            <div className="bg-white p-5 sm:p-8">
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                To become Africa's leading agricultural technology platform, empowering 
                smallholder farmers with AI-driven insights, connecting them with 
                sustainable financing, and building resilient farming communities 
                across the continent.
              </p>
            </div>
            <div className="bg-white p-5 sm:p-8">
              <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                To revolutionize agriculture in Ghana and across Africa by providing 
                farmers with accessible AI consultation, hyperlocal weather insights, 
                and transparent investment partnerships that drive sustainable growth 
                and food security.
              </p>
            </div>
          </div>
          {/* Core Team */}
          <div className="mb-10 sm:mb-20">
            <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">Our Core Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 bg-green-100 flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/lovable-uploads/musa.png" alt="Congo Musah Adama" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Congo Musah Adama</h4>
                <p className="text-green-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">CEO and Founder</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Agricultural Innovator, Software engineer and prduct strategist thinker
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 bg-green-100 flex items-center justify-center shadow-lg">
                  <Target className="h-10 w-10 sm:h-16 sm:w-16 text-green-600" />
                </div>
                <h4 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Prince Sedem</h4>
                <p className="text-green-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Co-founder and CTO</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Software developement expert, trading and chief technology officer
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 bg-green-100 flex items-center justify-center shadow-lg">
                  <Heart className="h-10 w-10 sm:h-16 sm:w-16 text-green-600" />
                </div>
                <h4 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Robert</h4>
                <p className="text-green-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Co-founder and Business Communication</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                Drives clear, impactful communication that build trust, engagement, and growth
                </p>
              </div>
            </div>
          </div>
          {/* What Our Team Says */}
          <div className="bg-gray-50 p-6 sm:p-12 mb-10 sm:mb-20">
            <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">What Our Team Says</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white p-4 sm:p-6">
                <p className="text-xs sm:text-base text-gray-700 italic mb-3 sm:mb-4">
                  "Every day, we're not just building technology – we're building bridges 
                  between traditional farming wisdom and cutting-edge innovation."
                </p>
                <p className="text-green-600 font-medium text-xs sm:text-base">- Congo Musah Adama, CEO</p>
              </div>
              <div className="bg-white p-4 sm:p-6">
                <p className="text-xs sm:text-base text-gray-700 italic mb-3 sm:mb-4">
                  "Our AI doesn't replace the farmer's expertise – it amplifies it. 
                  We're creating tools that respect and enhance human knowledge."
                </p>
                <p className="text-green-600 font-medium text-xs sm:text-base">- Prince Sedem, CTO</p>
              </div>
            </div>
          </div>
          {/* Join Community */}
          <div className="text-center bg-green-50 p-6 sm:p-12">
            <MessageCircle className="h-10 w-10 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Join Our Growing Community</h2>
            <p className="text-gray-600 mb-4 sm:mb-8 max-w-xs sm:max-w-2xl mx-auto text-sm sm:text-base">
              Connect with fellow farmers, share experiences, and stay updated 
              with the latest agricultural insights and opportunities.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
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
