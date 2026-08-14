import React, { useEffect, useState } from 'react';
import { Phone, X } from 'lucide-react';
import { whatsappMeUrl } from '@/lib/communityLinks';
import { useLanguage } from '@/contexts/LanguageContext';

const BUBBLE_AUTO_CLOSE_MS = 8000;

export const SupportFloatingWidget: React.FC = () => {
  const { t } = useLanguage();
  const [bubbleOpen, setBubbleOpen] = useState(true);

  useEffect(() => {
    if (!bubbleOpen) return;
    const timer = window.setTimeout(() => setBubbleOpen(false), BUBBLE_AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [bubbleOpen]);

  const openSupport = () => {
    const url = whatsappMeUrl(t('support.whatsappPrefill'));
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex items-end gap-3 pointer-events-none">
      <div className="pointer-events-auto relative shrink-0">
        <span className="absolute inset-0 rounded-full bg-[#7ede56]/40 animate-ping opacity-40" aria-hidden="true" />
        <span className="absolute -inset-1.5 rounded-full border border-[#7ede56]/50" aria-hidden="true" />
        <span className="absolute -inset-3 rounded-full border border-[#7ede56]/25" aria-hidden="true" />
        <button
          type="button"
          onClick={openSupport}
          className="relative w-14 h-14 rounded-full bg-[#7ede56] text-[#002f37] shadow-lg flex items-center justify-center hover:bg-[#6cd147] hover:scale-105 active:scale-95 transition-all"
          aria-label={t('support.aria')}
        >
          <Phone className="w-6 h-6" strokeWidth={2.25} />
        </button>
      </div>

      {bubbleOpen && (
        <div className="pointer-events-auto relative mb-1 max-w-[260px] sm:max-w-[300px] bg-white border-2 border-[#7ede56] rounded-2xl shadow-xl p-3.5 pr-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className="absolute left-[-9px] bottom-6 w-0 h-0 border-y-[8px] border-y-transparent border-r-[9px] border-r-[#7ede56]"
            aria-hidden="true"
          />
          <div
            className="absolute left-[-6px] bottom-[26px] w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-white"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={t('support.dismiss')}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
              <img
                src="/Frame 74.png"
                alt=""
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[#002f37] text-sm font-bold font-montserrat leading-tight">
                {t('support.title')}
              </p>
              <p className="mt-1.5 text-gray-600 text-xs leading-relaxed">
                {t('support.intro')}
              </p>
              <button
                type="button"
                onClick={openSupport}
                className="mt-2.5 text-[#002f37] text-xs font-bold hover:text-[#7ede56] transition-colors underline underline-offset-2"
              >
                {t('support.chat')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
