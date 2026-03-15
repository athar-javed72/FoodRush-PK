'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { useAppSelector } from '@/app/store';
import { useAppDispatch } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { setOrderMode } from '@/features/orderMode/orderModeSlice';
import type { OrderMode } from '@/features/orderMode/orderModeSlice';
import { ORDER_MODE_LABELS, ORDER_MODE_SHORT } from '@/features/orderMode/orderModeSlice';
import { isStaffRole } from '@/lib/roles';
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

const ORDER_MODES: OrderMode[] = ['delivery', 'dine_in', 'pickup'];

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const orderMode = useAppSelector((state) => state.orderMode.mode);
  const cartCount = useCartCount();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setModeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetMode = (mode: OrderMode) => {
    dispatch(setOrderMode(mode));
    setModeDropdownOpen(false);
  };

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
          {user.role === 'driver' && (
            <Link href="/driver/dashboard" className="text-sm text-muted-foreground hover:text-primary">
              Delivery
            </Link>
          )}
          {isStaffRole(user.role) && (
            <Link href="/staff/dashboard" className="text-sm text-muted-foreground hover:text-primary">
              Staff Hub
            </Link>
          )}
          {user.role === 'manager' && (
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
              Manager
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
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 dark:bg-background/85 backdrop-blur-xl shadow-elevated">
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
          <div className="flex items-center gap-1.5 rounded-full bg-muted/50 dark:bg-muted/30 p-1.5 shadow-elevated border border-border/50">
            <div className="relative" ref={modeDropdownRef}>
              <button
                type="button"
                onClick={() => setModeDropdownOpen((o) => !o)}
                aria-expanded={modeDropdownOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1.5 rounded-full h-8 pl-3.5 pr-3 text-xs font-medium text-foreground bg-background dark:bg-card border border-border/60 shadow-sm hover:border-primary/30 hover:shadow-card transition-all duration-200 min-w-[100px]"
              >
                <span className="opacity-80" aria-hidden>🚚</span>
                {ORDER_MODE_SHORT[orderMode]}
                <svg className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {modeDropdownOpen && (
                <div className="absolute left-0 top-full z-[100] mt-2 min-w-[220px] rounded-xl border border-border bg-popover dark:bg-popover text-popover-foreground py-2 shadow-card">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Order mode
                  </p>
                  {ORDER_MODES.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleSetMode(mode)}
                      className={`w-full px-3 py-2.5 text-left text-sm rounded-lg mx-1.5 transition-colors ${
                        orderMode === mode
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-accent/50 text-foreground'
                      }`}
                    >
                      {ORDER_MODE_LABELS[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <div className="py-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Order mode</p>
              <div className="flex flex-wrap gap-1.5">
                {ORDER_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant={orderMode === mode ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      handleSetMode(mode);
                      setMobileOpen(false);
                    }}
                  >
                    {ORDER_MODE_SHORT[mode]}
                  </Button>
                ))}
              </div>
            </div>
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

