'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

function useCartCount() {
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);
  const guestCart = useAppSelector((s) => s.guestCart);
  if (user) {
    return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }
  return guestCart.reduce((sum, i) => sum + i.quantity, 0);
}

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const cartCount = useCartCount();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link href="/menu" className="text-sm text-muted-foreground hover:text-primary">
        {t('menu')}
      </Link>
      <Link
        href="/cart"
        className="relative inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        {t('cart')}
        {cartCount > 0 && (
          <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
            {cartCount}
          </Badge>
        )}
      </Link>
      <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary">
        {t('wishlist')}
      </Link>
      {user ? (
        <>
          <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary">
            {t('orders')}
          </Link>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary">
            {t('profile')}
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
              {t('admin')}
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleLogout}
          >
            {t('logout')}
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
            {t('login')}
          </Link>
          <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
            {t('register')}
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
            {t('tagline')}
          </Badge>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
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
            <div className="flex flex-wrap items-center gap-2 py-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <NavLinks />
          </div>
        </div>
      )}
    </header>
  );
}

