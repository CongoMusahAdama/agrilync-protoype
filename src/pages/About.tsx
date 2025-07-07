
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Target, Eye, Users } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Kwame Nkrumah",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      quote: "Technology can revolutionize agriculture in Africa when applied with deep understanding of local needs."
    },
    {
      name: "Akosua Mensah",
      role: "Head of Agricultural Technology",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b02c",
      quote: "Every farmer deserves access to the same quality of agricultural insights as large commercial farms."
    },
    {
      name: "Abdul Rahman",
      role: "Director of Extension Services",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      quote: "Bridging the gap between traditional farming wisdom and modern agricultural science is our mission."
    },
    {
      name: "Efua Asante",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      quote: "AI should amplify human expertise, not replace it - especially in agriculture where context matters."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
            About AgriLync
          </h1>
          <p className="text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto animate-fade-in-up">
            We're on a mission to transform agriculture across Africa through innovative technology, 
            local expertise, and sustainable farming practices.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become Africa's leading agricultural technology platform, empowering every farmer 
                  with the tools, knowledge, and partnerships needed to achieve sustainable prosperity 
                  while contributing to food security across the continent.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To democratize access to agricultural expertise, weather intelligence, and financial 
                  resources through innovative technology solutions that bridge the gap between traditional 
                  farming practices and modern agricultural science.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Core Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agricultural experts, technology innovators, and passionate advocates 
              for sustainable farming across Ghana and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gray-50 border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-700 italic text-sm">"{member.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Team Says */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Team Says
            </h2>
            <p className="text-xl text-green-100">
              Insights from the people building the future of African agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Every day, we see farmers increase their yields by 40-60% through our platform. That's not just technology - that's transformation.",
                author: "Agricultural Success Team"
              },
              {
                quote: "The weather alerts have prevented millions of cedis in crop losses. When farmers can plan ahead, everyone wins.",
                author: "Weather Intelligence Team"
              },
              {
                quote: "Connecting farmers with investors isn't just about funding - it's about building sustainable agricultural communities.",
                author: "FarmPartner Initiative Team"
              }
            ].map((insight, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <p className="text-lg italic mb-4">"{insight.quote}"</p>
                  <p className="text-green-200 font-semibold">— {insight.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Impact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values & Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community First",
                description: "We believe in empowering farming communities through collaborative technology and shared knowledge."
              },
              {
                icon: Target,
                title: "Innovation with Purpose",
                description: "Every feature we build addresses real challenges faced by farmers in their daily agricultural activities."
              },
              {
                icon: Eye,
                title: "Transparency & Trust",
                description: "From our AI recommendations to our investment partnerships, we maintain complete transparency in all our processes."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-white shadow-lg border-0 text-center">
                <CardContent className="p-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect with fellow farmers, share experiences, and stay updated with the latest 
            agricultural innovations and best practices.
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 mr-4"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp Community
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
