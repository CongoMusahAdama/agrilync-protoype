
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  variant?: 'transparent' | 'solid' | 'light' | 'transparent-full';
  disableHover?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'solid', disableHover = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Color logic
  const bgClass = variant === 'transparent'
    ? (disableHover ? 'bg-transparent' : 'bg-transparent hover:bg-white/95')
    : variant === 'transparent-full' ? 'bg-transparent'
      : variant === 'light' ? 'bg-white' : 'bg-[#002f37]';

  const textClass = variant === 'transparent' || variant === 'transparent-full'
    ? (disableHover ? 'text-white' : 'text-white group-hover:text-[#002f37]')
    : variant === 'light' ? 'text-gray-800' : 'text-white';

  const hoverClass = variant === 'transparent' || variant === 'transparent-full'
    ? (disableHover ? 'hover:text-green-300' : 'hover:text-green-300 group-hover:hover:text-[#7ede56]')
    : variant === 'light' ? 'hover:text-green-600' : 'hover:text-green-300';

  const btnClass = 'bg-white text-[#002f37] border-2 border-[#002f37] hover:bg-gray-100 px-5 py-2 text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300';

  const shadowClass = variant === 'light' || variant === 'transparent' || variant === 'transparent-full' ? 'shadow-none' : 'shadow-lg';
  const isFloating = variant === 'transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isFloating ? 'flex justify-center py-4 sm:py-6 px-4 pointer-events-none' : (variant === 'light' ? 'bg-white md:shadow-md' : (variant === 'transparent-full' ? 'bg-transparent' : 'bg-[#002f37] md:shadow-md'))}`}>
      <div className={`group transition-all duration-300 ${isFloating ? `${bgClass} ${shadowClass} w-full max-w-7xl rounded-full px-4 sm:px-6 lg:px-8 pointer-events-auto backdrop-blur-none hover:backdrop-blur-sm` : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8'}`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 -ml-6">
            <img
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
              alt="AgriLync Logo"
              className="h-8 w-8"
            />
            <span className={`font-bold text-xl ${textClass} transition-colors duration-300`}>AgriLync</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 pl-20">
            <div className="flex items-center space-x-6">
              <Link to="/" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Home
              </Link>
              <Link to="/who-we-are" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Who We Are
              </Link>
              <Link to="/team" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Team
              </Link>
              <Link to="/portfolio" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Portfolio
              </Link>
              <Link to="/blog" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Blog
              </Link>
              <Link to="/contact" className={`${textClass} ${hoverClass} transition-colors text-sm font-medium`}>
                Contact
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className={`${textClass} ${hoverClass} hover:bg-transparent font-medium transition-colors duration-300 px-4 py-2`}>
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 rounded-full">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textClass} ${hoverClass}`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Moved outside container for full width */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 w-full pointer-events-auto ${variant === 'transparent' ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white shadow-lg'}`}>
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/who-we-are"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Who We Are
            </Link>
            <Link
              to="/team"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/portfolio"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/blog"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 mt-2 border-t border-gray-200">
              <Link
                to="/login"
                className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`block px-3 py-2 text-base font-medium transition-colors ${variant === 'transparent' ? 'text-[#002f37] hover:text-[#7ede56]' : 'text-gray-800 hover:text-green-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
