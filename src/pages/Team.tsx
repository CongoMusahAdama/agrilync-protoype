import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, Facebook, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import {
  leadership,
  coFounders,
  productTeam,
  marketingTeam,
  operationsTeam,
  TeamMember
} from '@/data/teamData';
import { motion } from 'framer-motion';

// Brand colors
const BRAND_TEAL = '#002F37';
const BRAND_MAGENTA = '#921573';

const TeamMemberCard = ({ member, index = 0 }: { member: TeamMember; index?: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full h-full border border-gray-100"
      onClick={() => navigate(`/team/${member.id}`)}
    >
      <div className="relative w-full aspect-[4/5] bg-[#e6f3f7]">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          style={{ objectPosition: member.imagePosition || 'center' }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">${member.initials}</div>`;
          }}
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm rounded-sm max-w-[90%] truncate">
          {member.role}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {member.description}
        </p>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, highlight, description }: { title: string, highlight: string, description: string }) => (
  <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-6">
    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
      {title} <span className="border-b-2 border-teal-500 pb-1">{highlight}</span>
    </h2>
    <p className="text-gray-500 text-sm max-w-md md:text-right leading-relaxed">
      {description}
    </p>
  </div>
);

const Team = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [foundersRef] = useScrollReveal();
  const [productRef] = useScrollReveal();
  const [marketingRef] = useScrollReveal();
  const [operationsRef] = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-0">
        
        {/* Top White Section */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-12 md:pb-24">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 sm:mb-24 flex flex-col items-center text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Meet Our <span className="border-b-4 border-[#7ede56] pb-2">Team</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mt-4">
              Meet our exceptional team at Agrilync Nexus! Comprising diverse talents and expertise, we are dedicated to unlocking capital and knowledge for Lync Growers across Africa.
            </p>
          </motion.div>

          {/* CEO Section */}
          <motion.div
            id="leadership"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
              {/* Left Column - Image */}
              <div className="w-full md:w-5/12">
                <div className="relative bg-[#e6f3f7] overflow-hidden aspect-[4/5]">
                  <div className="absolute top-6 left-6 bg-white px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-sm z-10 rounded-sm">
                    CEO & Founder
                  </div>
                  <img 
                    src={leadership.image} 
                    alt={leadership.name} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: leadership.imagePosition || 'center' }}
                  />
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="w-full md:w-7/12 md:pt-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{leadership.name}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {leadership.longBio?.split('\n')[0] || leadership.description}
                </p>
                
                {/* Socials */}
                <div className="flex gap-4 mb-10">
                  <a href={leadership.socials?.facebook || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"><Facebook size={16} /></a>
                  <a href={leadership.socials?.twitter || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"><Twitter size={16} /></a>
                  <a href={leadership.socials?.linkedin || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"><Linkedin size={16} /></a>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{leadership.name.split(' ')[0]} Experience</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {leadership.longBio?.split('\n\n')[1] || "A proven track record of leadership and innovation in the agricultural sector, bringing transformative solutions to smallholder farmers."}
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-800 shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">Leading technological innovation for smallholder agriculture.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-800 shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">Bridging technology, operations, and grassroots engagement.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-800 shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">Spearheads AI integration and cross-departmental strategy.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gray Background Sections */}
        <div className="bg-[#f8f9fa] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Co-Founders Section */}
            <div id="founding-team" ref={foundersRef} className="mb-16 md:mb-24">
              <SectionHeader 
                title="Co-" 
                highlight="Founders" 
                description="Our esteemed co-founders guiding the strategic direction and partnerships that drive AgriLync Nexus forward."
              />
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {coFounders.map((member, index) => (
                  <motion.div 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamMemberCard member={member} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Product & Design Section */}
            <div id="product-design" ref={productRef} className="mb-16 md:mb-24">
              <SectionHeader 
                title="Product &" 
                highlight="Engineering" 
                description="The brilliant minds crafting our digital products, ensuring seamless user experiences and robust technical infrastructure."
              />
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {productTeam.map((member, index) => (
                  <motion.div 
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamMemberCard member={member} index={index + 3} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Strategy & Marketing Section */}
            <div id="marketing" ref={marketingRef} className="mb-16 md:mb-24">
              <SectionHeader 
                title="Strategy &" 
                highlight="Marketing" 
                description="Our brand voices and strategists who connect AgriLync Nexus with the global agricultural community."
              />
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {marketingTeam.map((member, index) => (
                  <motion.div 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamMemberCard member={member} index={index + 6} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Operations Section */}
            <div id="operations" ref={operationsRef} className="mb-12">
              <SectionHeader 
                title="Community &" 
                highlight="Operations" 
                description="The boots-on-the-ground experts ensuring our services directly impact and uplift smallholder farmers in the field."
              />
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {operationsTeam.map((member, index) => (
                  <motion.div 
                    key={index} 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <TeamMemberCard member={member} index={index + 9} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {
        showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )
      }
    </div >
  );
};

export default Team;
