
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_SECONDARY,
  CONTACT_WHATSAPP,
  WHATSAPP_COMMUNITY_URL,
  formatGhanaPhone,
} from '@/lib/communityLinks';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const trustItems = [
    t('footer.trust1'),
    t('footer.trust2'),
    t('footer.trust3'),
    t('footer.trust4'),
    t('footer.trust5'),
    t('footer.trust6'),
    t('footer.trust7'),
  ];

  return (
    <footer className="bg-gray-900 text-white mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/Frame 74.png"
                alt="AgriLync Nexus Logo"
                className="h-24 md:h-32 w-auto object-contain transform scale-110 md:scale-125 origin-left"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              {t('footer.blurb')}
            </p>
            <p className="text-gray-500 text-[10px] leading-relaxed mb-6 border-t border-gray-800 pt-4">
              {t('footer.disclaimer')}
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

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.contactSupport')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <a href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '#'} className="text-gray-400 hover:text-green-400 text-xs transition-colors">
                  {CONTACT_EMAIL || t('footer.contactUs')}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <div className="flex flex-col">
                  {CONTACT_WHATSAPP && (
                    <a href={`tel:+${CONTACT_WHATSAPP}`} className="text-gray-400 hover:text-green-400 text-xs transition-colors">
                      {formatGhanaPhone(CONTACT_WHATSAPP)}
                    </a>
                  )}
                  {CONTACT_PHONE_SECONDARY && (
                    <a href={`tel:+${CONTACT_PHONE_SECONDARY}`} className="text-gray-400 hover:text-green-400 text-xs transition-colors">
                      {formatGhanaPhone(CONTACT_PHONE_SECONDARY)}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-xs">
                  {t('footer.location')}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.trustTitle')}</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.legalTitle')}</h3>
            <div className="space-y-3">
              <Link to="/safeguarding-policy" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.safeguarding')}</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.terms')}</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.privacy')}</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.risk')}</Link>
              <Link to="/about" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.refund')}</Link>
              {WHATSAPP_COMMUNITY_URL && (
                <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-green-400 text-xs transition-colors">{t('footer.community')}</a>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.subscribe')}</h3>
            <p className="text-gray-400 text-[10px] mb-4">
              {t('footer.subscribeBlurb')}
            </p>
            {isSubmitted ? (
              <div className="bg-green-600 text-white p-3 rounded-lg text-xs">
                {t('footer.subscribed')}
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
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
                  {isSubmitting ? t('footer.subscribing') : t('footer.subscribeBtn')}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-[10px] mb-2 md:mb-0">{t('footer.rights')}</p>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-green-400" />
            {WHATSAPP_COMMUNITY_URL && (
              <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 text-[10px] transition-colors">
                {t('footer.joinWhatsapp')}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
