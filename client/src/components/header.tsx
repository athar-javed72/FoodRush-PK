'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4">
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
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/menu" className="hover:text-primary">
            Menu
          </Link>
          <Link href="/cart" className="hover:text-primary">
            Cart
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="hover:text-primary">
                Orders
              </Link>
              <Link href="/profile" className="hover:text-primary">
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="hover:text-primary">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary">
                Login
              </Link>
              <Link href="/register" className="hover:text-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
