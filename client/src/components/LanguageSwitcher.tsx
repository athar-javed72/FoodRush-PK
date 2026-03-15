'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/lib/translations';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale, t, localeNames } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locales = Object.keys(localeNames) as Locale[];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('language')}
        className="inline-flex items-center gap-1.5 rounded-full h-8 pl-3 pr-3 text-xs font-medium text-foreground bg-background dark:bg-card border border-border/60 shadow-sm hover:border-primary/30 hover:shadow-card transition-all duration-200 min-w-[100px]"
      >
        <span className="opacity-80" aria-hidden>🌐</span>
        {localeNames[locale]}
        <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 min-w-[160px] rounded-xl border border-border bg-popover dark:bg-popover text-popover-foreground py-2 shadow-card max-h-[280px] overflow-y-auto">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('language')}
          </p>
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left text-sm rounded-lg mx-1.5 transition-colors ${
                locale === loc
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'hover:bg-accent/50 text-foreground'
              }`}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
