import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { translate } from '@/i18n/dictionaries';
import {
  LANG_EVENT,
  LANG_STORAGE_KEY,
  type AppLanguage,
} from '@/i18n/types';

interface LanguageContextType {
  lang: AppLanguage;
  setLang: (code: AppLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function readStoredLang(): AppLanguage {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v === 'fr' || v === 'en') return v;
  } catch {
    // ignore
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<AppLanguage>(() => readStoredLang());

  const setLang = useCallback((code: AppLanguage) => {
    setLangState(code);
    document.documentElement.lang = code;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent(LANG_EVENT, { detail: code })
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onLang = (e: Event) => {
      const code = (e as CustomEvent<AppLanguage>).detail;
      if (code === 'en' || code === 'fr') setLangState(code);
    };
    window.addEventListener(LANG_EVENT, onLang);
    return () => window.removeEventListener(LANG_EVENT, onLang);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
