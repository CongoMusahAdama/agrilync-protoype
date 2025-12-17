import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, ArrowUp, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Brand colors
const BRAND_TEAL = '#002F37';
const BRAND_MAGENTA = '#921573';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  initials: string;
  description: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  isCEO?: boolean;
  imagePosition?: string;
  borderColor?: string;
  scale?: number;
}

// Group data structure
const leadership: TeamMember = {
  name: 'Congo Musah Adama',
  role: 'CEO and Founder',
  image: '/lovable-uploads/f.jpg',
  initials: 'CA',
  isCEO: true,
  description: 'Technical leadership, backend architecture, AI integration, strategic vision, and cross-department coordination.',
  socials: {
    twitter: 'https://x.com/1real_vee',
    linkedin: 'https://www.linkedin.com/in/congo-musah-ad-deen-766bb3224/'
  },
  imagePosition: 'center 20%',
  borderColor: 'border-[#0EA5E9]' // Sky Blue for CEO
};

const coFounders: TeamMember[] = [
  {
    name: 'Takyi Robert',
    role: 'Co-Founder (Finance & Partnerships)',
    image: '/lovable-uploads/robert.jpg',
    initials: 'TR',
    description: 'Finance, partnerships, investor relations, financial planning, and strategic collaborations.',
    imagePosition: 'center',
    scale: 1.15,
    borderColor: 'border-[#22c55e]' // Green for Robert
  },
  {
    name: 'Agbenyenu Sedem Prince',
    role: 'Co-Founder (CTO)',
    image: '/lovable-uploads/prince-sedem.jpg',
    initials: 'AP',
    description: 'Software development, product management, technical execution, and cross-team coordination.',
    socials: {
      instagram: 'https://www.instagram.com/prinzsedem/?hl=en',
      twitter: 'https://x.com/PrinzSedem'
    },
    borderColor: 'border-[#f97316]' // Orange for Sedem
  },
  {
    name: 'Boah Samuel',
    role: 'Co-Founder (Product Experience)',
    image: '/lovable-uploads/boahsamuel.jpg',
    initials: 'BS',
    description: 'User experience direction, product consistency, and inclusive interface design across platforms.',
    imagePosition: 'center 20%',
    socials: {
      linkedin: 'https://www.linkedin.com/in/samuel-boah',
      instagram: 'https://www.instagram.com/gentle___sammy?igsh=aTl6ZTJ0ZjIxaWo4&utm_source=qr'
    },
    borderColor: 'border-[#eab308]' // Yellow for Samuel
  }
];

const productTeam: TeamMember[] = [
  {
    name: 'Osei Prince',
    role: 'UI/UX & Product Design Lead',
    image: '/lovable-uploads/princeosei.jpg',
    initials: 'OP',
    description: 'Product design, user experience, design standards, and interface consistency.',
    socials: {
      instagram: 'https://www.instagram.com/prince.ui.ux/',
      linkedin: 'https://www.linkedin.com/in/prince-osei-597605207/'
    },
    borderColor: 'border-[#a855f7]' // Purple for Prince Osei
  },
  {
    name: 'Cecil Odonkor',
    role: 'UI/UX Designer & Frontend Support',
    image: '/lovable-uploads/cecilodonkoh.jpg',
    initials: 'CO',
    description: 'Interface design, frontend development, responsive design, and user-friendly interaction.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/cecil-odonkor-559650266?trk=contact-info',
      twitter: 'https://x.com/terminator7845?s=21'
    },
    borderColor: 'border-[#14b8a6]' // Teal for Cecil
  },
  {
    name: 'Kwaku Essah',
    role: 'Backend Developer & AI Support',
    image: '/lovable-uploads/kwakuessah.jpg',
    initials: 'KE',
    description: 'Backend systems, APIs, AI integration, system security, and data processing.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/kwaku-essah',
      twitter: 'https://x.com/hexstories_'
    },
    imagePosition: 'center 0%',
    scale: 1.08,
    borderColor: 'border-[#ec4899]' // Pink for Kwaku
  }
];

const marketingTeam: TeamMember[] = [
  {
    name: 'Kwagbedzi Dela',
    role: 'Marketing & Partnership Lead',
    image: '/lovable-uploads/dela.jpg',
    initials: 'KD',
    description: 'Marketing strategy, brand communication, partnership development, and business growth.',
    socials: {
      linkedin: 'https://www.linkedin.com/public-profile/settings',
      facebook: 'https://www.facebook.com/share/1CuccL8ABV/?mibextid=wwXIfr'
    },
    borderColor: 'border-[#f43f5e]' // Rose for Dela
  },
  {
    name: 'Adzah Isabella',
    role: 'Sales & Content Support',
    image: '/lovable-uploads/isabel.jpg',
    initials: 'AI',
    description: 'Sales initiatives, content creation, community engagement, and partnership activations.',
    socials: {
      instagram: 'https://www.instagram.com/itz_lil_anaaaa?igsh=MWQ0c3pjajZ0aTk2aA%3D%3D&utm_source=qr'
    },
    borderColor: 'border-[#8b5cf6]' // Violet for Isabella
  },
  {
    name: 'Vorlashie Raphael',
    role: 'Communications Lead',
    image: '/lovable-uploads/mawuli.jpg',
    initials: 'VR',
    description: 'Public relations, internal communication, media content, and brand visibility.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/raphaelvorlash',
      facebook: 'https://www.facebook.com/share/1BfjDGjJnt/',
      instagram: 'https://www.instagram.com/raphaelvorlash_mawuli?igsh=MTBxajk4aGlscTdlMw=='
    },
    borderColor: 'border-[#3b82f6]' // Blue for Raphael
  }
];

const operationsTeam: TeamMember[] = [
  {
    name: 'Wontumi Gabriel Oti',
    role: 'Field Operations Lead',
    image: '/lovable-uploads/wontumi.jpg',
    initials: 'WG',
    description: 'Community engagement, field agents, farmer onboarding, and regional operations.',
    socials: {
      linkedin: 'http://linkedin.com/in/gabriel-wontumi-aa357928a',
      twitter: 'https://x.com/championwontumi'
    },
    borderColor: 'border-[#6366f1]' // Indigo for Gabriel
  },
  {
    name: 'Simmons Justice',
    role: 'Advisory & Research Lead',
    image: '/lovable-uploads/simons.jpg',
    initials: 'SJ',
    description: 'Field research, agricultural insights, farmer outreach, and AI model training support.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/justice-simmons-264b29317',
      twitter: 'https://x.com/simmons_ju67046',
      facebook: 'https://www.facebook.com/justice.simmons.963'
    },
    borderColor: 'border-[#06b6d4]' // Cyan for Justice
  }
];

const TeamMemberCard = ({ member, index = 0 }: { member: TeamMember; index?: number }) => (
  <div
    className={`group ${member.isCEO ? 'cursor-pointer' : ''} animate-fade-in-up`}
    style={{ animationDelay: `${index * 100}ms` }}
    onClick={() => member.isCEO && document.dispatchEvent(new CustomEvent('openCEOModal'))}
  >
    <div className="relative aspect-square w-full bg-[#F6F6F6] rounded-xl overflow-hidden mb-5 shadow-sm transition-all duration-500">
      <div className="w-full h-full" style={{ transform: member.scale ? `scale(${member.scale})` : 'none' }}>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ objectPosition: member.imagePosition || 'center' }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">${member.initials}</div>`;
          }}
        />
      </div>

    </div>

    <div className="space-y-1">
      <h3 className="text-xl font-bold text-gray-900 transition-colors">
        {member.name}
      </h3>
      <p className="text-[#921573] text-sm font-bold uppercase tracking-wide">
        {member.role}
      </p>

      {/* Social links - Always Colorful, Centered */}
      {member.socials && (
        <div className="flex justify-center pt-3">
          <div className="inline-flex items-center justify-center gap-3 bg-[#e5e7eb] rounded-full px-4 py-2 shadow-sm transition-colors duration-300 hover:bg-[#d1d5db]">
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.socials.twitter && (
              <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <img src="/x-logo.png" alt="X" className="w-5 h-5 object-contain" />
              </a>
            )}
            {member.socials.instagram && (
              <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {member.socials.facebook && (
              <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

const Team = () => {
  const [isCEOModalOpen, setIsCEOModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerRef, headerVisible] = useScrollReveal();
  const [ceoRef, ceoVisible] = useScrollReveal();
  const [foundersRef, foundersVisible] = useScrollReveal();
  const [productRef, productVisible] = useScrollReveal();
  const [marketingRef, marketingVisible] = useScrollReveal();
  const [operationsRef, operationsVisible] = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    const openModalHandler = () => setIsCEOModalOpen(true);

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('openCEOModal', openModalHandler);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('openCEOModal', openModalHandler);
    };
  }, []);



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div ref={headerRef} className={`mb-16 sm:mb-24 transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Teams</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#002F37] mb-6">
            Meet our team
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mb-8"></div>

          <p className="text-lg sm:text-x text-gray-500 max-w-2xl leading-relaxed">
            Meet our exceptional team at AgriLync! Comprising diverse talents and expertise, we are a dedicated group committed to delivering excellence in every project.
          </p>
        </div>

        {/* CEO Section */}
        <div ref={ceoRef} className={`mb-20 transition-all duration-700 ease-out ${ceoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-[240px] mx-auto">
            <TeamMemberCard member={leadership} />
          </div>
        </div>

        {/* Co-Founders Section */}
        <div ref={foundersRef} className={`mb-20 transition-all duration-700 ease-out ${foundersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Founding Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {coFounders.map((member, index) => (
              <div key={index} className="max-w-[240px] mx-auto w-full">
                <TeamMemberCard member={member} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Product & Design Section */}
        <div ref={productRef} className={`mb-20 transition-all duration-700 ease-out ${productVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Product & Design Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {productTeam.map((member, index) => (
              <div key={index} className="max-w-[240px] mx-auto w-full">
                <TeamMemberCard member={member} index={index + 3} />
              </div>
            ))}
          </div>
        </div>

        {/* Strategy & Marketing Section */}
        <div ref={marketingRef} className={`mb-20 transition-all duration-700 ease-out ${marketingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Strategy & Marketing Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {marketingTeam.map((member, index) => (
              <div key={index} className="max-w-[240px] mx-auto w-full">
                <TeamMemberCard member={member} index={index + 6} />
              </div>
            ))}
          </div>
        </div>

        {/* Operations Section */}
        <div ref={operationsRef} className={`mb-12 transition-all duration-700 ease-out ${operationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Community & Operations</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {operationsTeam.map((member, index) => (
              <div key={index} className="max-w-[240px] mx-auto w-full">
                <TeamMemberCard member={member} index={index + 9} />
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />

      {/* CEO Modal */}
      <Dialog open={isCEOModalOpen} onOpenChange={setIsCEOModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4" style={{ color: BRAND_TEAL }}>
              Congo Musah Adama
            </DialogTitle>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold" style={{ color: BRAND_MAGENTA }}>CEO and Founder</p>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg">
                <img
                  src="/lovable-uploads/f.jpg"
                  alt="Congo Musah Adama"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 20%', objectFit: 'cover', transform: 'scale(1.2)' }}
                />
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed px-4 sm:px-8">
              <p>
                Technology and agriculture may seem like unlikely allies, but I've dedicated my career to proving just how powerful their partnership can be. As a full-stack developer with specialized expertise in the MERN stack, I architect digital solutions that modernize agricultural practices and drive economic empowerment across emerging markets.
              </p>
              <p>With three years of hands-on experience, I've:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Engineered backend systems that process agricultural data at scale</li>
                <li>Built intuitive interfaces that bridge the digital divide for rural users</li>
                <li>Optimized platforms that have demonstrably improved operational efficiencies</li>
              </ul>
              <p>
                My technical toolkit spans from database design to API development, but what truly sets me apart is my dual background in agricultural science and software engineering. This unique perspective allows me to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Translate complex agricultural challenges into technical requirements</li>
                <li>Design systems with real-world usability at their core</li>
                <li>Measure success through both technical performance and social impact</li>
              </ul>
              <p>I'm particularly interested in collaborating with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Agritech startups scaling their technology</li>
                <li>Development organizations modernizing their systems</li>
                <li>Research institutions working on food security solutions</li>
              </ul>
              <p className="font-semibold pt-2">
                The future of agriculture is digital - let's build it together.
              </p>
            </div>

            <div className="text-center pt-6 border-t border-gray-100">
              <a
                href="https://congodev.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit My Website
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default Team;
