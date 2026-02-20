import Image from 'next/image';
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
        <p className="mb-6 text-muted-foreground">Food delivery across Pakistan – Fast & fresh</p>
        <Button>Get started</Button>
      </main>
    </>
  );
}
