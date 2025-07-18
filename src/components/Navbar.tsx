
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  variant?: 'transparent' | 'solid';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'solid' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Color logic
  const bgClass = variant === 'transparent' ? 'bg-transparent' : 'bg-white';
  const textClass = variant === 'transparent' ? 'text-white' : 'text-[#002f37]';
  const hoverClass = variant === 'transparent' ? 'hover:text-green-300' : 'hover:text-green-700';
  const btnClass = variant === 'transparent'
    ? 'bg-white text-[#002f37] border-2 border-[#002f37] hover:bg-gray-100 px-5 py-2 text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300'
    : 'bg-white text-[#002f37] border-2 border-[#002f37] hover:bg-gray-100 px-5 py-2 text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300';

  return (
    <nav className={`${bgClass} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png" 
              alt="AgriLync Logo" 
              className="h-8 w-8"
            />
            <span className={`font-bold text-xl ${textClass}`}>AgriLync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${textClass} ${hoverClass} transition-colors`}>
              Home
            </Link>
            <Link to="/ai-consultation" className={`${textClass} ${hoverClass} transition-colors`}>
              AI Consultation
            </Link>
            <Link to="/weather" className={`${textClass} ${hoverClass} transition-colors`}>
              Weather
            </Link>
            <Link to="/farm-partner" className={`${textClass} ${hoverClass} transition-colors`}>
              FarmPartner
            </Link>
            <Link to="/about" className={`${textClass} ${hoverClass} transition-colors`}>
              About
            </Link>
            <Link to="/auth">
              <Button className={btnClass}>
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 ${bgClass}`}>
              <Link 
                to="/" 
                className={`block px-3 py-2 ${textClass} ${hoverClass} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/ai-consultation" 
                className={`block px-3 py-2 ${textClass} ${hoverClass} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                AI Consultation
              </Link>
              <Link 
                to="/weather" 
                className={`block px-3 py-2 ${textClass} ${hoverClass} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Weather
              </Link>
              <Link 
                to="/farm-partner" 
                className={`block px-3 py-2 ${textClass} ${hoverClass} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                FarmPartner
              </Link>
              <Link 
                to="/about" 
                className={`block px-3 py-2 ${textClass} ${hoverClass} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/auth" 
                className="block px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className={btnClass + ' w-full'}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
