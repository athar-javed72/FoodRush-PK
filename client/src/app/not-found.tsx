import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-background to-muted/30 px-4">
      <Image
        src="/foodrush-pk-logo.svg"
        alt="FoodRush PK"
        width={180}
        height={40}
        className="opacity-90"
      />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline">Browse menu</Button>
        </Link>
      </div>
    </div>
  );
}
