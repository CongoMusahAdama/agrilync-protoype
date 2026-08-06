import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  variant?: 'transparent' | 'solid' | 'light' | 'transparent-full';
  disableHover?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'solid', disableHover = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const isTransparentPage = location.pathname === '/' || location.pathname === '/who-we-are';
  const isTealPage = ['/team', '/blog', '/portfolio', '/contact', '/resources'].includes(location.pathname);
  const isTransparent = isTransparentPage && !isScrolled && !isHovered;

  // Background state
  const navBgClass = isTransparent
    ? 'bg-transparent shadow-none'
    : isTealPage
      ? 'bg-[#002f37] shadow-md'
      : 'bg-white shadow-md';

  const textColor = (isTransparent || isTealPage) ? 'text-white' : 'text-[#002f37]';
  const logoTextClass = (isTransparent || isTealPage) ? 'text-white' : 'text-[#002f37]';
  const textClass = (isTransparent || isTealPage)
    ? 'text-white hover:text-[#7ede56]'
    : 'text-[#002f37] hover:text-[#7ede56]';
  const mobileTextClass = 'text-[#002f37] hover:text-[#7ede56]'; // Always dark on mobile menu

  // Navigation Data
  const navLinks = [
    { label: t('nav.home'), path: '/' },
    {
      label: t('nav.whoWeAre'),
      path: '/who-we-are',
      dropdown: [
        { label: t('nav.whoWeAre'), path: '/who-we-are#who-we-are' },
        { label: t('nav.visionMission'), path: '/who-we-are#vision-mission' },
        { label: t('nav.coreValues'), path: '/who-we-are#core-values' },
        { label: t('nav.whoWeServe'), path: '/who-we-are#who-we-serve' },
        { label: t('nav.ourProcess'), path: '/who-we-are#process' },
        { label: t('nav.whyChooseUs'), path: '/who-we-are#why-choose-us' },
        { label: t('nav.mobileApp'), path: '/who-we-are#mobile-app' },
      ]
    },
    {
      label: t('nav.team'),
      path: '/team',
      dropdown: [
        { label: t('nav.leadership'), path: '/team#leadership' },
        { label: t('nav.foundingTeam'), path: '/team#founding-team' },
        { label: t('nav.productDesign'), path: '/team#product-design' },
        { label: t('nav.strategyMarketing'), path: '/team#marketing' },
        { label: t('nav.operations'), path: '/team#operations' },
      ]
    },
    { label: t('nav.portfolio'), path: '/portfolio' },
    {
      label: t('nav.blog'),
      path: '/blog',
      dropdown: [
        { label: t('nav.latestNews'), path: '/blog#latest' },
        { label: t('nav.successStories'), path: '/blog#success-stories' },
        { label: t('nav.industryInsights'), path: '/blog#insights' },
        { label: t('nav.eventsWebinars'), path: '/blog#events' },
      ]
    },
    {
      label: t('nav.resources'),
      path: '/resources',
      dropdown: [
        { label: t('nav.toolsCalculators'), path: '/resources#resource-grid' },
        { label: t('nav.guidesEbooks'), path: '/resources#resource-grid' },
        { label: t('nav.templates'), path: '/resources#resource-grid' },
        { label: t('nav.videoRecordings'), path: '/resources#resource-grid' },
        { label: t('nav.marketReports'), path: '/resources#resource-grid' },
      ]
    },
    {
      label: t('nav.contact'),
      path: '/contact',
      dropdown: [
        { label: t('nav.sendMessage'), path: '/contact#message' },
        { label: t('nav.contactInfo'), path: '/contact#info' },
        { label: t('nav.bookConsultation'), path: '/contact#book-session' },
        { label: t('nav.community'), path: '/contact#community' },
      ]
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // If it's a hash link on the same page, handle smooth scroll
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#');
      if (location.pathname === pathname) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
        setActiveDropdown(null);
      } else {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    } else {
      setIsMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex flex-col font-montserrat transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Info Bar - Only on Homepage */}
      {isHomePage && (
        <div className={`hidden md:block w-full py-1.5 px-10 ${isTransparent ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'}`}>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-[#7ede56]" />
                <span className={isTransparent ? 'text-white' : 'text-[#002f37]'}>{t('nav.needConsultation')}</span>
                <button className="text-[#FFD700] hover:underline">{t('nav.bookSchedule')}</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/share/16SkoNJAsW/" target="_blank" rel="noopener noreferrer" className={`hover:text-[#7ede56] transition-colors ${isTransparent ? 'text-white' : 'text-[#002f37]'}`}>
                <Facebook className="h-3 w-3" />
              </a>
              <a href="https://x.com/agri_lync" target="_blank" rel="noopener noreferrer" className={`hover:text-[#7ede56] transition-colors ${isTransparent ? 'text-white' : 'text-[#002f37]'}`}>
                <Twitter className="h-3 w-3" />
              </a>
              <a href="https://www.linkedin.com/company/agrilync/" target="_blank" rel="noopener noreferrer" className={`hover:text-[#7ede56] transition-colors ${isTransparent ? 'text-white' : 'text-[#002f37]'}`}>
                <Linkedin className="h-3 w-3" />
              </a>
              <a href="https://instagram.com/agri_lync" target="_blank" rel="noopener noreferrer" className={`hover:text-[#7ede56] transition-colors ${isTransparent ? 'text-white' : 'text-[#002f37]'}`}>
                <Instagram className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className={`w-full ${navBgClass} transition-all duration-300`}>
        <div className="w-full">
          <div className="flex justify-between items-center h-20 md:h-[5.5rem]">
            <Link to="/" className="flex items-center pl-3 sm:px-6 lg:pl-10 overflow-visible" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/Frame 74.png"
                alt="Agrilync Nexus Logo"
                className="h-[4.5rem] sm:h-20 md:h-[5.25rem] w-auto object-contain transition-all duration-300 transform scale-[1.65] sm:scale-[1.5] md:scale-[1.55] origin-left"
              />
            </Link>

            {/* Desktop Navigation - Right-aligned */}
            <div className="hidden md:flex items-center px-4 justify-end flex-grow pr-10">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative group perspective-[1000px]"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={link.path}
                      className={`${textClass} transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1 py-4`}
                    >
                      {link.label}
                      {link.dropdown && <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />}
                    </Link>

                    {/* Dropdown Menu */}
                    {link.dropdown && (
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white shadow-xl border-t-2 border-[#7ede56] rounded-b-lg transform transition-all duration-500 origin-top z-50 ${activeDropdown === link.label ? 'opacity-100 [transform:rotateX(0deg)] visible' : 'opacity-0 [transform:rotateX(-90deg)] invisible'}`}
                      >
                        <div className="py-2">
                          {link.dropdown.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              onClick={(e) => handleNavClick(e, subItem.path)}
                              className="block px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#7ede56] border-b last:border-0 border-gray-100 transition-colors font-bold uppercase tracking-wide"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Buttons + language */}
            <div className="hidden md:flex items-center space-x-3 pr-4 sm:pr-6 lg:pr-10">
              <LanguageSwitcher light={isTransparent || isTealPage} />
              <Link to="/login" className={`${textClass} transition-colors text-xs font-bold uppercase tracking-wider hover:text-[#7ede56]`}>
                {t('nav.signIn')}
              </Link>
              <Link to="/signup">
                <Button className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] border-none h-8 px-4 rounded-md transition-all duration-300 shadow-sm text-xs font-bold uppercase tracking-wider">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button + language */}
            <div className="md:hidden flex items-center gap-2 pr-4">
              <LanguageSwitcher light={isTransparent || isTealPage} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${(isTransparent || isTealPage) ? 'text-white bg-black/30' : 'text-[#002f37] bg-white shadow-sm'} p-2 rounded transition-all duration-300 focus:outline-none`}
                aria-label={t('nav.toggleMenu')}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in slide-in-from-top-5 max-h-[85vh] overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-gray-100 last:border-0 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 text-base font-bold uppercase tracking-wide ${mobileTextClass}`}
                      onClick={() => !link.dropdown && setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveDropdown(activeDropdown === link.label ? null : link.label);
                        }}
                        className="p-2 text-[#002f37]"
                      >
                        <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  {link.dropdown && activeDropdown === link.label && (
                    <div className="bg-gray-50 rounded-lg mt-1 mb-2 ml-4">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          onClick={(e) => handleNavClick(e, subItem.path)}
                          className="block px-4 py-3 text-sm text-gray-600 hover:text-[#7ede56] font-bold uppercase border-b last:border-0 border-gray-200"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6 px-4 space-y-3 pb-6">
                <Link to="/login" className="block w-full text-center py-3 text-sm font-bold uppercase tracking-wider text-[#002f37] border border-[#002f37] rounded-lg hover:bg-gray-50">
                  {t('nav.signIn')}
                </Link>
                <Link to="/signup" className="block w-full text-center py-3 text-sm font-bold uppercase tracking-wider bg-[#7ede56] text-[#002f37] rounded-lg hover:bg-[#6cd147]">
                  {t('nav.getStarted')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




