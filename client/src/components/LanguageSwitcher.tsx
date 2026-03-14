'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/lib/translations';

export function LanguageSwitcher() {
  const { locale, setLocale, t, localeNames } = useLanguage();
  const locales = Object.keys(localeNames) as Locale[];

  return (
    <select
      className="h-9 min-w-[110px] rounded-md border border-input bg-background px-3 text-xs text-foreground"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label={t('language')}
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
