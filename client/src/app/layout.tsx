import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'FoodRush PK',
  description: 'Food delivery platform – Fast delivery across Pakistan.',
  icons: { icon: '/foodrush-pk-logo.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
