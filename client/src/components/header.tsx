'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link href="/menu" className="text-sm text-muted-foreground hover:text-primary">
        Menu
      </Link>
      <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary">
        Cart
      </Link>
      {user ? (
        <>
          <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary">
            Orders
          </Link>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary">
            Profile
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
              Admin
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
            Login
          </Link>
          <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/foodrush-pk-logo.svg"
            alt="FoodRush PK"
            width={160}
            height={36}
            className="h-9 w-auto"
            priority
          />
          <Badge className="hidden text-[10px] font-medium uppercase tracking-wide text-primary md:inline-flex">
            Fast food, delivered
          </Badge>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <NavLinks />
        </nav>

        <Button
          variant="outline"
          size="icon"
          className="inline-flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-[2px] w-4 rounded bg-foreground" />
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background/95 pb-3 pt-2 md:hidden">
          <div className="container flex flex-col gap-2">
            <NavLinks />
          </div>
        </div>
      )}
    </header>
  );
}

