
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <img 
            src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png" 
            alt="AgriLync Logo" 
            className="h-7 w-7"
          />
          <span className="font-bold text-lg">AgriLync</span>
        </div>
        {/* Copyright */}
        <p className="text-gray-400 text-xs mb-2 md:mb-0">© 2024 AgriLync. All rights reserved.</p>
        {/* Minimal Links */}
        <div className="flex space-x-4">
          <a href="mailto:info.agrilync@gmail.com" className="text-gray-400 hover:text-green-400 text-xs transition-colors">Contact</a>
          <a href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 text-xs transition-colors">Community</a>
          <Link to="#" className="text-gray-400 hover:text-green-400 text-xs transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
