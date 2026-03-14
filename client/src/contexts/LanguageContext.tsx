'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type Locale, getTranslations, localeNames } from '@/lib/translations';

const STORAGE_KEY = 'foodrush-locale';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localeNames: typeof localeNames;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && localeNames[saved]) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' || saved === 'ur' ? 'rtl' : 'ltr';
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next;
        document.documentElement.dir = next === 'ar' || next === 'ur' ? 'rtl' : 'ltr';
      }
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = getTranslations(locale);
      return dict[key] ?? key;
    },
    [locale]
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    localeNames,
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ ...value, locale: 'en' }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
