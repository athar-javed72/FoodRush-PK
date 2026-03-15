'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

type ThemeValue = 'light' | 'dark' | 'system';

const labels: Record<ThemeValue, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const icons: Record<ThemeValue, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-[90px] rounded-full bg-muted/50 animate-pulse" />
    );
  }

  const current = (theme ?? 'system') as ThemeValue;
  const options: ThemeValue[] = ['light', 'dark', 'system'];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Theme"
        className="inline-flex items-center gap-1.5 rounded-full h-8 pl-3 pr-3 text-xs font-medium text-foreground bg-background dark:bg-card border border-border/60 shadow-sm hover:border-primary/30 hover:shadow-card transition-all duration-200 min-w-[90px]"
      >
        <span className="opacity-80" aria-hidden>{icons[current]}</span>
        {labels[current]}
        <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] rounded-xl border border-border/60 bg-popover/95 dark:bg-popover backdrop-blur-xl py-2 shadow-card">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Theme
          </p>
          {options.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left text-sm rounded-lg mx-1.5 transition-colors inline-flex items-center gap-2 ${
                current === value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/80 text-foreground'
              }`}
            >
              <span aria-hidden>{icons[value]}</span>
              {labels[value]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
