import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/animation/FadeIn';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col bg-gradient-to-b from-background to-muted/40">
        <section className="container flex flex-1 flex-col items-center justify-center gap-10 py-10 md:grid md:grid-cols-2 md:items-center">
          <FadeIn className="space-y-5 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Fast, fresh, and right on time
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Hungry? Get your favourite fast food in minutes.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground md:text-base">
              FoodRush brings burgers, fries, pizzas, and more to your door with a smooth, modern
              ordering experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link href="/menu">
                <Button size="lg">Browse the menu</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign in to order
                </Button>
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
                  Explore popular picks across burgers, fries, pizzas, and more. Save time, skip the
                  line, and enjoy your favourites at home.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </section>
      </main>
    </>
  );
}
