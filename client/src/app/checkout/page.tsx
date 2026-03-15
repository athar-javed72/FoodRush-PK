"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { useAppSelector } from '@/app/store';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [couponValidateMsg, setCouponValidateMsg] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const step3Active = !!summary;
  const currentStep = summary ? 3 : selectedAddressId ? 2 : 1;
  const step1Done = currentStep >= 2;
  const step2Done = currentStep >= 3;

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
        setError(err.response?.data?.message || 'Failed to load addresses. Please try again.');
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
      const msg = err.response?.data?.message || '';
      const friendly =
        msg.toLowerCase().includes('address') || msg.includes('Invalid address')
          ? 'Address not found. Please select a valid saved address.'
          : msg.toLowerCase().includes('cart') && msg.toLowerCase().includes('empty')
          ? 'Your cart is empty. Add items from the menu first.'
          : msg.toLowerCase().includes('coupon') || msg.toLowerCase().includes('expired')
          ? 'Invalid or expired coupon. Check the code or try without it.'
          : msg.toLowerCase().includes('minimum') || msg.toLowerCase().includes('amount')
          ? 'Order amount does not meet the minimum for this coupon.'
          : msg || 'Failed to prepare checkout. Please try again.';
      setError(friendly);
      setSuccess(null);
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponValidateMsg('Enter a coupon code first.');
      return;
    }
    try {
      setValidatingCoupon(true);
      setCouponValidateMsg(null);
      const cartRes = await apiClient.get('/cart');
      const subtotal = cartRes.data?.data?.cart?.subtotal ?? 0;
      const valRes = await apiClient.post('/cart/coupon/validate', {
        code: couponCode.trim(),
        amount: subtotal
      });
      const discount = valRes.data?.data?.discount ?? 0;
      setCouponValidateMsg(
        discount > 0
          ? `Valid! You'll get Rs. ${discount} off. Click "Apply & review" to use it.`
          : 'Coupon is valid.'
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon.';
      setCouponValidateMsg(msg);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod
      });
      setSuccess('Order placed successfully!');
      toast.success('Order placed successfully!');
      router.replace(`/orders/${res.data.data.order._id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      const friendly =
        msg.toLowerCase().includes('address')
          ? 'Address not found. Please select a valid address.'
          : msg.toLowerCase().includes('cart') && msg.toLowerCase().includes('empty')
          ? 'Your cart is empty.'
          : msg.toLowerCase().includes('payment')
          ? 'Payment failed. Please try again.'
          : msg || 'Failed to place order. Please try again.';
      setError(friendly);
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-2 shadow-sm md:max-w-xl">
            {[
              { num: 1, label: 'Address', done: step1Done, active: currentStep === 1 },
              { num: 2, label: 'Payment', done: step2Done, active: currentStep === 2 },
              { num: 3, label: 'Review', done: step3Active, active: currentStep === 3 }
            ].map((s, i) => (
              <div key={s.num} className="flex flex-1 items-center">
                <div
                  className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
                    s.active ? 'bg-primary/10 text-primary' : s.done ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    s.done ? 'bg-emerald-500 text-white' : s.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s.done ? '✓' : s.num}
                  </span>
                  <span className="text-xs font-medium">{s.label}</span>
                </div>
                {i < 2 && (
                  <div className="h-px w-4 flex-shrink-0 bg-border md:w-8" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
        {loading && !summary && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4 shrink-0" />
            <span>Preparing your checkout…</span>
          </div>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
          >
            {success}
          </motion.p>
        )}

        <form onSubmit={handlePrepareCheckout} className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <section className="space-y-4">
            <Card className="overflow-hidden rounded-xl border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Step 1 · Delivery address</span>
                  <Badge variant="outline" className="text-[10px]">
                    Required
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {addresses.length === 0 && !loading && (
                  <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    You have no saved addresses. <Link href="/profile" className="text-primary underline">Add one in your profile</Link>, then return to checkout.
                  </p>
                )}
                {loading && !addresses.length && (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                )}
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-xs transition-all hover:border-primary/50 hover:shadow-sm ${
                        selectedAddressId === addr._id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <div>
                        <p className="font-medium">
                          {addr.fullName} {addr.label && <span>({addr.label})</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {addr.streetAddress}, {addr.area}, {addr.city}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Step 2 · Coupon & payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Coupon</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponValidateMsg(null);
                      }}
                      placeholder="Enter coupon code (optional)"
                      className="sm:max-w-[200px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleValidateCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                    >
                      {validatingCoupon ? 'Checking…' : 'Validate coupon'}
                    </Button>
                    <Button type="submit" disabled={loading} className="sm:w-40">
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Checking…
                        </span>
                      ) : (
                        'Apply & review'
                      )}
                    </Button>
                  </div>
                  {couponValidateMsg && (
                    <p
                      className={
                        couponValidateMsg.startsWith('Valid')
                          ? 'text-xs text-emerald-600'
                          : 'text-xs text-red-500'
                      }
                    >
                      {couponValidateMsg}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Payment method</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="flex flex-1 cursor-pointer items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="h-4 w-4 accent-primary"
                        />
                        <div>
                          <p className="font-medium">Cash on delivery</p>
                          <p className="text-[11px] text-muted-foreground">
                            Pay in cash when your food arrives.
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Recommended
                      </Badge>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside>
            <Card className="sticky top-4 overflow-hidden rounded-xl border-border text-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Step 3 · Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                    <div className="mt-1 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs. {summary.cart.totalAmount}</span>
                    </div>
                    <Button
                      className="mt-4 w-full"
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Placing order…
                        </span>
                      ) : (
                        'Place order (Cash on delivery)'
                      )}
                    </Button>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      By placing this order, you confirm your details and agree to pay in cash on
                      delivery. You can track your order status on the next screen.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select an address and optionally apply a coupon to see your final total before
                    placing the order.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>
        </form>
      </main>
    </>
  );
}

