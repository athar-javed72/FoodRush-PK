import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <Image
          src="/foodrush-pk-logo.svg"
          alt="FoodRush PK"
          width={200}
          height={44}
          className="mb-6 h-11 w-auto"
          priority
        />
        <h1 className="sr-only">FoodRush PK</h1>
        <p className="mb-6 text-muted-foreground text-center max-w-md">
          Order your favourite fast food from a modern, easy-to-use FoodRush experience.
        </p>
        <div className="flex gap-3">
          <Link href="/menu">
            <Button>Browse Menu</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
