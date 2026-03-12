"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { useAppSelector } from '@/app/store';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';

interface Address {
  _id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  area: string;
  label?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get('/addresses');
        setAddresses(res.data.data.addresses || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load addresses');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, router]);

  const handlePrepareCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError('Please select an address');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.post('/cart/checkout/prepare', {
        addressId: selectedAddressId,
        couponCode: couponCode || undefined
      });
      setSummary(res.data.data);
      setSuccess('Checkout is ready. You can now place your order.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to prepare checkout');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod: 'cod'
      });
      setSuccess('Order placed successfully!');
      router.replace(`/orders/${res.data.data.order._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-2 text-sm text-emerald-600">{success}</p>}

        <form onSubmit={handlePrepareCheckout} className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Delivery address
            </h2>
            {addresses.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You have no saved addresses. Add one in your profile.
              </p>
            )}
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border bg-card p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  />
                  <div>
                    <p className="font-medium">
                      {addr.fullName} {addr.label && <span>({addr.label})</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {addr.streetAddress}, {addr.area}, {addr.city}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">Coupon</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Checking...' : 'Apply & Review'}
                </Button>
              </div>
            </div>
          </section>

          <aside className="space-y-2 rounded-md border bg-card p-4 text-sm">
            <h2 className="mb-2 text-base font-semibold">Summary</h2>
            {summary ? (
              <>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {summary.cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>- Rs. {summary.cart.discountAmount}</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs. {summary.cart.totalAmount}</span>
                </div>
                <Button className="mt-4 w-full" type="button" onClick={handlePlaceOrder}>
                  {loading ? 'Placing order...' : 'Place order (COD)'}
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an address and apply coupon (optional) to see final summary.
              </p>
            )}
          </aside>
        </form>
      </main>
    </>
  );
}

