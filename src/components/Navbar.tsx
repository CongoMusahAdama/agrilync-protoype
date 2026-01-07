import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentPage = location.pathname === '/' || location.pathname === '/who-we-are';
  const isTealPage = ['/team', '/blog', '/portfolio', '/contact'].includes(location.pathname);
  const isTransparent = isTransparentPage && !isScrolled && !isHovered;

  // Design Constants based on state
  const navBgClass = isTransparent
    ? 'bg-transparent shadow-none'
    : isTealPage
      ? 'bg-[#002f37] shadow-md'
      : 'bg-white shadow-md';

  const topBarBgClass = isTransparent
    ? 'bg-transparent text-white/90'
    : 'bg-[#002f37] text-white';

  const textColor = (isTransparent || isTealPage) ? 'text-white' : 'text-[#002f37]';
  const logoTextClass = (isTransparent || isTealPage) ? 'text-white' : 'text-[#002f37]';

  const textClass = (isTransparent || isTealPage)
    ? 'text-white hover:text-[#7ede56]'
    : 'text-[#002f37] hover:text-[#7ede56]';

  const mobileTextClass = 'text-[#002f37] hover:text-[#7ede56]'; // Always dark on mobile menu

  // Navigation Data
  const navLinks = [
    { label: 'Home', path: '/' },
    {
      label: 'Who We Are',
      path: '/who-we-are',
      dropdown: [
        { label: 'Who We Are', path: '/who-we-are#who-we-are' },
        { label: 'Vision & Mission', path: '/who-we-are#vision-mission' },
        { label: 'Core Values', path: '/who-we-are#core-values' },
        { label: 'Who We Serve', path: '/who-we-are#who-we-serve' },
        { label: 'Our Process', path: '/who-we-are#process' },
        { label: 'Why Choose Us', path: '/who-we-are#why-choose-us' },
        { label: 'Mobile App', path: '/who-we-are#mobile-app' },
      ]
    },
    {
      label: 'Team',
      path: '/team',
      dropdown: [
        { label: 'Leadership', path: '/team#leadership' },
        { label: 'Founding Team', path: '/team#founding-team' },
        { label: 'Product & Design', path: '/team#product-design' },
        { label: 'Strategy & Marketing', path: '/team#marketing' },
        { label: 'Operations', path: '/team#operations' },
      ]
    },
    { label: 'Portfolio', path: '/portfolio' },
    {
      label: 'Blog',
      path: '/blog',
      dropdown: [
        { label: 'Latest News', path: '/blog#latest' },
        { label: 'Success Stories', path: '/blog#success-stories' },
        { label: 'Industry Insights', path: '/blog#insights' },
        { label: 'Events & Webinars', path: '/blog#events' },
      ]
    },
    {
      label: 'Contact',
      path: '/contact',
      dropdown: [
        { label: 'Send a Message', path: '/contact#message' },
        { label: 'Contact Info', path: '/contact#info' },
        { label: 'Book Consultation', path: '/contact#book-session' },
        { label: 'Community', path: '/contact#community' },
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
      className="fixed top-0 left-0 right-0 z-50 flex flex-col font-manrope transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Top Bar - Deep Teal */}
      <div className={`${topBarBgClass} py-2.5 px-4 sm:px-6 lg:px-8 hidden md:block transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium">
          <div className="flex items-center space-x-6">
            <span className="opacity-90">Supporting farmers on the continent and beyond</span>
            <div className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity">
              <Phone className="h-3.5 w-3.5 text-[#7ede56]" />
              <a href="tel:+233506626068" className="hover:text-[#7ede56] transition-colors">(+233) 50 662 6068</a>
            </div>
            <div className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity">
              <Mail className="h-3.5 w-3.5 text-[#7ede56]" />
              <a href="mailto:agrilync@gmail.com" className="hover:text-[#7ede56] transition-colors">agrilync@gmail.com</a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://www.facebook.com/share/16SkoNJAsW/" target="_blank" rel="noreferrer" className="w-2 h-2 rounded-full bg-white/40 hover:bg-[#7ede56] hover:scale-125 transition-all duration-300" aria-label="Facebook"></a>
            <a href="https://x.com/agri_lync" target="_blank" rel="noreferrer" className="w-2 h-2 rounded-full bg-white/40 hover:bg-[#7ede56] hover:scale-125 transition-all duration-300" aria-label="X"></a>
            <a href="https://instagram.com/agri_lync" target="_blank" rel="noreferrer" className="w-2 h-2 rounded-full bg-white/40 hover:bg-[#7ede56] hover:scale-125 transition-all duration-300" aria-label="Instagram"></a>
            <a href="https://www.linkedin.com/company/agrilync/" target="_blank" rel="noreferrer" className="w-2 h-2 rounded-full bg-white/40 hover:bg-[#7ede56] hover:scale-125 transition-all duration-300" aria-label="LinkedIn"></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full ${navBgClass} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 ml-0 md:-ml-10" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                alt="AgriLync Logo"
                className="h-10 w-10"
              />
              <span className={`font-bold text-2xl ${logoTextClass} transition-colors duration-300`}>AgriLync</span>
            </Link>

            {/* Desktop Navigation - Aligned to Right */}
            <div className="hidden md:flex items-center justify-end flex-1 pl-12 pr-8">
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
                      className={`${textClass} transition-colors text-sm font-bold uppercase tracking-wide flex items-center gap-1 py-6`}
                    >
                      {link.label}
                      {link.dropdown && <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />}
                    </Link>

                    {/* Dropdown Menu */}
                    {link.dropdown && (
                      <div
                        className={`absolute top-full left-0 w-56 bg-white shadow-xl border-t-2 border-[#7ede56] rounded-b-lg transform transition-all duration-500 origin-top z-50 ${activeDropdown === link.label ? 'opacity-100 [transform:rotateX(0deg)] visible' : 'opacity-0 [transform:rotateX(-90deg)] invisible'}`}
                      >
                        <div className="py-2">
                          {link.dropdown.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              onClick={(e) => handleNavClick(e, subItem.path)}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7ede56] border-b last:border-0 border-gray-100 transition-colors font-medium"
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

            {/* Right side buttons - Only on Homepage */}
            {location.pathname === '/' && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className={`${isTransparent ? 'text-white hover:text-[#7ede56] hover:bg-white/10' : 'text-[#002f37] hover:text-[#7ede56] hover:bg-transparent'} font-bold transition-all duration-300 px-4 py-2 uppercase tracking-wide text-sm`}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className={`${isTransparent ? 'bg-white text-[#002f37] hover:bg-gray-100' : 'bg-[#002f37] hover:bg-[#003c47] text-white'} px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${(isTransparent || isTealPage) ? 'text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm' : 'text-[#002f37] bg-white/90 hover:bg-white'} p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7ede56] shadow-md`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-5 max-h-[85vh] overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-gray-100 last:border-0 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 text-base font-bold ${mobileTextClass}`}
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
                          className="block px-4 py-3 text-sm text-gray-600 hover:text-[#7ede56] font-medium border-b last:border-0 border-gray-200"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {location.pathname === '/' && (
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-[#002f37] text-[#002f37]">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full"
                  >
                    <Button className="w-full bg-[#002f37] hover:bg-[#003c47] text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
