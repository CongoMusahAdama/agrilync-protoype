import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ExternalLink, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

const Team = () => {
  // Modal state
  const [isCEOModalOpen, setIsCEOModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-triggered animation hooks
  const [teamRef, teamVisible] = useScrollReveal();
  const [leadershipRef, leadershipVisible] = useScrollReveal();
  const [productRef, productVisible] = useScrollReveal();
  const [marketingRef, marketingVisible] = useScrollReveal();

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Meet the Team Section */}
      <section className="pt-24 pb-10 sm:pb-16 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={teamRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (teamVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Meet the Team Behind AgriLync
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              We are a diverse and passionate team of innovators, strategists, designers, developers, and agricultural experts committed to transforming African agriculture through AI-driven solutions.
            </p>
          </div>

          {/* Organizational Chart */}
          <div className="relative">
            {/* Top Level - CEO */}
            <div ref={leadershipRef} className={"text-center mb-16 sm:mb-20 transition-all duration-1000 ease-out " + (leadershipVisible ? " animate-fade-in-up opacity-100 translate-y-0" : " opacity-0 translate-y-8")}>
              <div className="inline-block group hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setIsCEOModalOpen(true)}>
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-purple-100">
                  <img
                    src="/lovable-uploads/congo.jpg"
                    alt="Congo Musah Adama"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl">CA</span></div>';
                    }}
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Congo Musah Adama</h4>
                <p className="text-lg sm:text-xl font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>CEO and Founder</p>
                <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                  Provides technical leadership, project oversight, backend development, and ensures alignment with agricultural operations.
                </p>
              </div>
            </div>

            {/* Connecting Lines from CEO to Co-Founders */}
            <div className={"hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 pointer-events-none transition-all duration-1000 delay-500 " + (leadershipVisible ? " opacity-100" : " opacity-0")}>
              <div className="w-px h-16 bg-purple-300 mx-auto"></div>
              <div className="flex justify-between px-8">
                <div className="w-px h-16 bg-purple-300"></div>
                <div className="w-px h-16 bg-purple-300"></div>
              </div>
            </div>

            {/* Second Level - Co-Founders */}
            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20 transition-all duration-1000 ease-out delay-300 " + (leadershipVisible ? " animate-fade-in-up opacity-100 translate-y-0" : " opacity-0 translate-y-8")}>
              {/* Takyi Robert - Strategy */}
              <div className="text-center">
                <div className="inline-block group hover:scale-105 transition-all duration-300">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-green-100">
                    <img
                      src="/lovable-uploads/robert.jpg"
                      alt="Takyi Robert"
                      className="w-full h-full object-cover object-center"
                      style={{ objectPosition: 'center 35%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl">TR</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Takyi Robert</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Co-Founder (Strategy)</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Leads business strategy, stakeholder engagement, and partnership development.
                  </p>
                </div>
              </div>

              {/* Agbenyenu Sedem Prince - Product Manager */}
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="inline-block group hover:scale-105 transition-all duration-300">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-orange-100">
                    <img
                      src="/lovable-uploads/prince-sedem.jpg"
                      alt="Agbenyenu Sedem Prince"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl">AP</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Agbenyenu Sedem Prince</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Co-Founder (Product Manager)</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Manages frontend development and product.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Hierarchy Divider */}
            <div className={"lg:hidden w-16 h-px bg-purple-300 mx-auto mb-8 transition-all duration-1000 delay-700 " + (leadershipVisible ? " opacity-100" : " opacity-0")}></div>

            {/* Third Level - Product & Design Team */}
            <div ref={productRef} className={"mb-16 sm:mb-20 transition-all duration-1000 ease-out delay-600 " + (productVisible ? " animate-fade-in-up opacity-100 translate-y-0" : " opacity-0 translate-y-8")}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 sm:mb-10 text-center" style={{ color: BRAND_MAGENTA }}>
                Product & Design Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Osei Prince */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/princeosei.jpg"
                      alt="Osei Prince"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">OP</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Osei Prince</h4>
                  <p className="text-xs sm:text-sm font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Brand Design Lead</p>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Guides brand identity and overall design direction across UX and UI.
                  </p>
                </div>

                {/* Cecil Odonkor */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/cecilodonkoh.jpg"
                      alt="Cecil Odonkor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">CO</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Cecil Odonkor</h4>
                  <p className="text-xs sm:text-sm font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>UI/UX Designer & Frontend Developer</p>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Builds user-centric interfaces, ensuring functional and interactive frontend design.
                  </p>
                </div>

                {/* Boah Samuel */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/boahsamuel.jpg"
                      alt="Boah Samuel"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">BS</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Boah Samuel</h4>
                  <p className="text-xs sm:text-sm font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>CTO / Frontend Developer</p>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Supports frontend and backend development, ensuring seamless UI/UX collaboration.
                  </p>
                </div>

                {/* Kwaku Essah */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/kwakuessah.jpg"
                      alt="Kwaku Essah"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 25%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">KE</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Kwaku Essah</h4>
                  <p className="text-xs sm:text-sm font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Backend Developer & Quality Assurance</p>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Assists in frontend tasks and contributes to backend system development.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Hierarchy Divider */}
            <div className={"lg:hidden w-16 h-px bg-purple-300 mx-auto mb-8 transition-all duration-1000 delay-900 " + (productVisible ? " opacity-100" : " opacity-0")}></div>

            {/* Fourth Level - Strategy & Marketing Team */}
            <div ref={marketingRef} className={"mb-16 sm:mb-20 transition-all duration-1000 ease-out delay-900 " + (marketingVisible ? " animate-fade-in-up opacity-100 translate-y-0" : " opacity-0 translate-y-8")}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 sm:mb-10 text-center" style={{ color: BRAND_MAGENTA }}>
                Strategy & Marketing Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {/* Kwagbedzi Dela */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/dela.jpg"
                      alt="Kwagbedzi Dela"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-xl">KD</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Kwagbedzi Dela</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Business & Partnership Lead</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Supports business growth through investor and partnership engagement.
                  </p>
                </div>

                {/* Adzah Isabella */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/isabel.jpg"
                      alt="Adzah Isabella"
                      className="w-full h-full object-cover object-center"
                      style={{ objectPosition: 'center 30%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-xl">AI</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Adzah Isabella</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Digital Marketing & Sales</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Identifies and engages cooperatives, NGOs, agribusiness stakeholders and government bodies while driving early sales and B2B partnerships.
                  </p>
                </div>

                {/* Vorlashie Raphael */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/mawuli.jpg"
                      alt="Vorlashie Raphael"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-xl">VR</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Vorlashie Raphael</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Digital Marketing & Media</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Leads digital campaigns, media content creation, and brand presence.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Hierarchy Divider */}
            <div className={"lg:hidden w-16 h-px bg-purple-300 mx-auto mb-8 transition-all duration-1000 delay-1100 " + (marketingVisible ? " opacity-100" : " opacity-0")}></div>

            {/* Bottom Level - Community & Operations */}
            <div className={"text-center transition-all duration-1000 ease-out delay-1200 " + (marketingVisible ? " animate-fade-in-up opacity-100 translate-y-0" : " opacity-0 translate-y-8")}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 sm:mb-10 text-center" style={{ color: BRAND_MAGENTA }}>
                Community & Operations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Wontumi Gabriel */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/wontumi.jpg"
                      alt="Wontumi Gabriel"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-xl">WG</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Wontumi Gabriel Oti</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Operational Lead (Community & Extension Operations)</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Leads field engagement, drives tech adoption, and connects farmers with digital tools.
                  </p>
                </div>

                {/* Simons Justice */}
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img
                      src="/lovable-uploads/simons.jpg"
                      alt="Simons Justice"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-xl">SJ</span></div>';
                      }}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold mb-2" style={{ color: BRAND_TEAL }}>Simmons Justice</h4>
                  <p className="text-base sm:text-lg font-semibold mb-3" style={{ color: BRAND_MAGENTA }}>Farmer Outreach & Engagement Specialist</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Champions webinars and outreach strategies to engage farmers across communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {/* Profile Image */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg">
                <img
                  src="/lovable-uploads/congo.jpg"
                  alt="Congo Musah Adama"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            </div>

            {/* About Content */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Technology and agriculture may seem like unlikely allies, but I've dedicated my career to proving just how powerful their partnership can be. As a full-stack developer with specialized expertise in the MERN stack, I architect digital solutions that modernize agricultural practices and drive economic empowerment across emerging markets.
              </p>

              <p className="text-gray-700 leading-relaxed">
                With three years of hands-on experience, I've:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Engineered backend systems that process agricultural data at scale</li>
                <li>Built intuitive interfaces that bridge the digital divide for rural users</li>
                <li>Optimized platforms that have demonstrably improved operational efficiencies</li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                My technical toolkit spans from database design to API development, but what truly sets me apart is my dual background in agricultural science and software engineering. This unique perspective allows me to:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Translate complex agricultural challenges into technical requirements</li>
                <li>Design systems with real-world usability at their core</li>
                <li>Measure success through both technical performance and social impact</li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                I'm particularly interested in collaborating with:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Agritech startups scaling their technology</li>
                <li>Development organizations modernizing their systems</li>
                <li>Research institutions working on food security solutions</li>
              </ul>

              <p className="text-gray-700 leading-relaxed font-semibold">
                The future of agriculture is digital - let's build it together.
              </p>
            </div>

            {/* Website Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <a
                href="https://congodev.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit My Website
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-opacity duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default Team;
