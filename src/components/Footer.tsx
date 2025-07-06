
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { href: '/ai-consultation', label: 'AI Consultation' },
        { href: '/weather', label: 'Weather Forecast' },
        { href: '/farm-partner', label: 'FarmPartner Initiative' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '#', label: 'Help Center' },
        { href: '#', label: 'Contact Us' },
        { href: '#', label: 'Community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '#', label: 'About Us' },
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms of Service' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">AgriLync</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Transforming African agriculture through AI-driven consultation, 
              weather services, and financing opportunities.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 AgriLync. All rights reserved. Made with ❤️ for African farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
