import Image from 'next/image';
import Link from 'next/link';
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

export default function Home() {
  return (
    <>
      <OrganizationWebSiteJsonLd />
      <Header />
      <main className="flex flex-1 flex-col bg-gradient-to-b from-background to-muted/40">
        {/* Hero */}
        <section className="relative container flex flex-1 flex-col items-center justify-center gap-10 py-14 md:grid md:grid-cols-2 md:items-center md:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/75 to-background/95" />
          <FadeIn className="space-y-5 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Fast, fresh, and right on time
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Fresh Food Delivered Fast Across Pakistan
            </h1>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              Order burgers, pizzas, biryani, and more. Delivered to your door with a smooth ordering experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link href="/menu">
                <Button size="lg">Order Now</Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline">Browse Menu</Button>
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.05} className="flex justify-center">
            <Card className="w-full max-w-md border-none bg-card/80 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-1">
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <Image
                  src="/foodrush-pk-logo.svg"
                  alt="FoodRush PK"
                  width={220}
                  height={50}
                  className="h-12 w-auto"
                  priority
                />
                <p className="text-center text-sm text-muted-foreground">
                  Explore popular picks. Save time and enjoy your favourites at home.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </section>

        <TrustSection />
        <PopularDishes />
        <OffersBanner />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
