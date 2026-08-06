import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppLanguage } from '@/i18n/types';

const LANGUAGES: { code: AppLanguage; short: string; labelKey: string }[] = [
  { code: 'en', short: 'EN', labelKey: 'lang.english' },
  { code: 'fr', short: 'FR', labelKey: 'lang.french' },
];

interface LanguageSwitcherProps {
  /** Lighter styles for transparent / teal navbar */
  light?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  light = false,
  className = '',
}) => {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: AppLanguage) => {
    setLang(code);
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
          light
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-gray-100 text-[#002f37] hover:bg-gray-200'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.select')}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>{current.short}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full right-0 mt-1.5 min-w-[9.5rem] bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-[80]"
        >
          {LANGUAGES.map((option) => (
            <button
              key={option.code}
              type="button"
              role="option"
              aria-selected={lang === option.code}
              onClick={() => select(option.code)}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                lang === option.code
                  ? 'bg-[#7ede56]/15 text-[#002f37]'
                  : 'text-[#002f37] hover:bg-gray-50 hover:text-[#7ede56]'
              }`}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export type { AppLanguage };
