'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeValue = 'light' | 'dark' | 'system';

const labels: Record<ThemeValue, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <select
        className="h-9 rounded-md border border-input bg-background px-3 text-xs text-muted-foreground"
        aria-label="Theme"
        defaultValue="system"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    );
  }

  const current = (theme ?? 'system') as ThemeValue;

  return (
    <select
      className="h-9 min-w-[100px] rounded-md border border-input bg-background px-3 text-xs text-foreground"
      value={current}
      onChange={(e) => setTheme(e.target.value as ThemeValue)}
      aria-label="Theme"
    >
      <option value="system">{labels.system}</option>
      <option value="light">{labels.light}</option>
      <option value="dark">{labels.dark}</option>
    </select>
  );
}
