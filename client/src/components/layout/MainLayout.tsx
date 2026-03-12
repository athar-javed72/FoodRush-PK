"use client";

import { Header } from '@/components/header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container flex-1 py-6">{children}</main>
    </>
  );
}

