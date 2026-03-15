'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/store';
import { setOrderMode } from '@/features/orderMode/orderModeSlice';
import type { OrderMode } from '@/features/orderMode/orderModeSlice';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/animation/FadeIn';
import { OrganizationWebSiteJsonLd } from '@/components/layout/JsonLd';
import { Footer } from '@/components/layout/Footer';
import { TrustSection } from '@/components/home/TrustSection';
import { PopularDishes } from '@/components/home/PopularDishes';
import { OffersBanner } from '@/components/home/OffersBanner';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ORDER_MODE_LABELS } from '@/features/orderMode/orderModeSlice';

const MODES: OrderMode[] = ['delivery', 'dine_in', 'pickup'];

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleModeSelect = (mode: OrderMode) => {
    dispatch(setOrderMode(mode));
    router.push('/menu');
  };

  return (
    <>
      <OrganizationWebSiteJsonLd />
      <Header />
      <main className="flex flex-1 flex-col min-h-[calc(100vh-3.5rem)]">
        {/* Hero – relatable food image + strong text contrast */}
        <section className="relative container flex flex-1 flex-col items-center justify-center gap-12 py-16 md:grid md:grid-cols-2 md:items-center md:gap-16 md:py-24 overflow-hidden">
          {/* Background: fresh food / delivery relatable */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80&auto=format&fit=crop')] bg-cover bg-center scale-105" />
          {/* Strong overlay so text is always readable in light & dark */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/80 dark:from-background dark:via-background/95 dark:to-background/85" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,hsl(var(--primary)/0.08),transparent)]" />

          <FadeIn className="space-y-6 text-center md:text-left relative z-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Fast, fresh, and right on time
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground drop-shadow-sm">
              Fresh Food Delivered Fast Across Pakistan
            </h1>
            <p className="max-w-md text-base text-foreground/90 leading-relaxed">
              Order burgers, pizzas, biryani, and more. Choose how you want to enjoy—delivery, dine-in, or pickup.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center md:justify-start">
              {MODES.map((mode) => (
                <Button
                  key={mode}
                  size="lg"
                  variant={mode === 'delivery' ? 'default' : 'outline'}
                  className={`min-w-[180px] sm:min-w-0 rounded-full px-6 transition-all duration-300 ${mode === 'delivery' ? 'shadow-button hover:shadow-glow' : 'shadow-elevated hover:shadow-card'}`}
                  onClick={() => handleModeSelect(mode)}
                >
                  {ORDER_MODE_LABELS[mode]}
                </Button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="flex justify-center w-full relative z-0">
            <Card className="w-full max-w-md rounded-2xl border border-border bg-card dark:bg-card shadow-card transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-primary/20">
              <CardContent className="flex flex-col items-center gap-5 py-10 px-6">
                <Image
                  src="/foodrush-pk-logo.svg"
                  alt="FoodRush PK"
                  width={220}
                  height={50}
                  className="h-12 w-auto"
                  priority
                />
                <p className="text-center text-sm text-foreground/85 leading-relaxed">
                  Explore popular picks. Save time and enjoy your favourites at home.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </section>

        <section className="bg-gradient-to-b from-background via-muted/20 to-background">
          <TrustSection />
          <PopularDishes />
          <OffersBanner />
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
