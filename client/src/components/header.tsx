import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/foodrush-pk-logo.svg"
            alt="FoodRush PK"
            width={160}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
