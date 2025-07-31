
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

const About = () => {
  // Scroll-triggered animation hooks
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();
  const [visionRef, visionVisible] = useScrollReveal();
  const [missionRef, missionVisible] = useScrollReveal();
  const [valuesRef, valuesVisible] = useScrollReveal();
  const [value1Ref, value1Visible] = useScrollReveal();
  const [value2Ref, value2Visible] = useScrollReveal();
  const [value3Ref, value3Visible] = useScrollReveal();
  const [value4Ref, value4Visible] = useScrollReveal();
  const [value5Ref, value5Visible] = useScrollReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Professional Background Image */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-0 m-0">
        {/* Hero Image */}
        <img
          src="/lovable-uploads/ab.jpg"
          alt="About Hero Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
          loading="eager"
          fetchPriority="high"
          style={{ objectPosition: 'center 40%', objectFit: 'cover' }}
          onError={(e) => {
            console.log('Image failed to load, trying fallback');
            const target = e.target as HTMLImageElement;
            target.src = '/lovable-uploads/image.png'; // Fallback to homepage image
          }}
        />
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/25 z-10"></div>
        {/* Navbar overlayed above image */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <Navbar variant="transparent" />
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-12 sm:mt-20">
          <div className="animate-fade-in-up w-full">
            <h1 ref={heroHeadingRef} className={"text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl transition-all duration-700 ease-in-out leading-tight " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              About Us
            </h1>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-2 sm:gap-4">
            {/* Title - very close to content */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <h2 ref={whoWeAreRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 text-left transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
                Who Are We?
              </h2>
              <div className="w-16 h-0.5 bg-purple-600 mb-1 sm:mb-2"></div>
            </div>
            {/* Content - very close to title */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out flex-1">
              <div className="max-w-4xl">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                  We are Agrilync. We're focused on revolutionizing agriculture in Africa through AI and digital technologies. Our AI-powered platform connects key actors across the value chain with various stakeholders, offering access to financing, market opportunities, and farming intelligence.
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                  We connect 9–5 workers with verified farmers who have proven track records, enabling shared profit models. An assigned extension agent monitors all on-farm and off-farm activities, ensuring productivity and connecting harvests to market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

             {/* Vision & Mission Section */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                         {/* Vision Section - Content on left, heading on right */}
             <div className="flex flex-col lg:flex-row items-start gap-2 sm:gap-4 mb-16 sm:mb-20">
               {/* Content on the left */}
               <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
                 <div className="text-left max-w-4xl">
                   <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                     To become Africa's leading agricultural technology platform, empowering
                     smallholder farmers with AI-driven insights, connecting them with
                     sustainable financing, and building resilient farming communities
                     across the continent.
                   </p>
                 </div>
               </div>
               {/* Heading on the right */}
               <div className="animate-fade-in-left transition-all duration-700 ease-in-out">
                 <h3 ref={visionRef} className={"text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-right transition-all duration-700 ease-in-out " + (visionVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>Our Vision</h3>
                 <div className="w-16 h-0.5 bg-purple-600 mb-1 sm:mb-2 ml-auto"></div>
               </div>
             </div>

            {/* Mission Section - Heading on left, content on right */}
            <div className="flex flex-col lg:flex-row items-start gap-2 sm:gap-4">
              {/* Heading on the left */}
              <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
                <h3 ref={missionRef} className={"text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-left transition-all duration-700 ease-in-out " + (missionVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>Our Mission</h3>
                <div className="w-16 h-0.5 bg-purple-600 mb-1 sm:mb-2"></div>
              </div>
              {/* Content on the right */}
              <div className="animate-fade-in-left transition-all duration-700 ease-in-out flex-1">
                <div className="text-left max-w-4xl">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    To bridge finance, knowledge, and market access gaps for African farmers and agri-entrepreneurs through accessible AI-driven solutions, driving sustainable agricultural growth and improved livelihoods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Core Values Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={valuesRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (valuesVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Our Core Values
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              The principles that guide our mission to transform African agriculture through technology and innovation.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div ref={value1Ref} className={"transition-all duration-700 ease-in-out transform " + (value1Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Inclusivity</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Ensuring our solutions are accessible to all farmers, regardless of their background or resources.
              </p>
            </div>

            <div ref={value2Ref} className={"transition-all duration-700 ease-in-out transform " + (value2Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Collaboration</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Working together with farmers, partners, and stakeholders to achieve shared agricultural goals.
              </p>
            </div>

            <div ref={value3Ref} className={"transition-all duration-700 ease-in-out transform " + (value3Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Innovation</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Continuously developing cutting-edge technologies and solutions for modern farming challenges.
              </p>
            </div>

            <div ref={value4Ref} className={"transition-all duration-700 ease-in-out transform " + (value4Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Empowerment</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Equipping farmers with the knowledge, tools, and resources they need to succeed and grow.
              </p>
            </div>

            <div ref={value5Ref} className={"transition-all duration-700 ease-in-out transform " + (value5Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Transparency</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Maintaining open, honest communication and clear processes in all our partnerships and operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
