
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, MessageCircle, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-white mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo and Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                alt="AgriLync Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-xl">AgriLync</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Transforming African agriculture through AI and digital technologies. Empowering farmers with tools for sustainable growth and higher yields.
            </p>
            <p className="text-gray-500 text-[10px] leading-relaxed mb-6 border-t border-gray-800 pt-4">
              AgriLync is a technology-enabled agricultural platform that connects farmers, agricultural experts, and independent investors. We do not operate as a fund manager, financial institution, or farm operator. AgriLync does not custody user funds or guarantee investment returns. The platform acts only as a technology facilitator.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16SkoNJAsW/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/agri_lync" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/agri_lync" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/agrilync/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <a href="mailto:agrilync@email.com" className="text-gray-400 hover:text-green-400 text-xs transition-colors">
                  agrilync@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+233506626068" className="text-gray-400 hover:text-green-400 text-xs transition-colors">
                  +233 50 662 6068
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-xs">
                  Accra, Ghana
                </span>
              </div>
            </div>
          </div>

          {/* Trust & Compliance */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Trust & Compliance</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Registered business entity
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Secure payment processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Data protection compliant
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Encrypted platform security
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Transparent reporting
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                Independent verification
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Legal Links</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">Terms of Service</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">Privacy Policy</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">Risk Disclosure</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">Refund Policy</Link>
              <a href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">Community</a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Subscribe</h3>
            <p className="text-gray-400 text-[10px] mb-4">
              Stay updated with agricultural insights and news.
            </p>
            {isSubmitted ? (
              <div className="bg-green-600 text-white p-3 rounded-lg text-xs">
                Successfully subscribed!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-400 h-8 text-xs"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-[10px] mb-2 md:mb-0">© 2024 AgriLync. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-green-400" />
            <a href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 text-[10px] transition-colors">
              Join our WhatsApp Community
            </a>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
