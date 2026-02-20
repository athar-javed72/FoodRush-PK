import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FoodRush PK',
  description: 'Food delivery platform – Fast delivery across Pakistan.',
  icons: { icon: '/foodrush-pk-logo.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
