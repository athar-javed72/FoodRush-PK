'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';

interface AnalyticsOverview {
  todayOrderCount: number;
  yesterdayOrderCount: number;
  todayVsYesterdayPercent: number;
  weeklyRevenue: number;
  repeatCustomerPercent: number;
  totalCustomersWithOrders: number;
}

function formatRevenue(n: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get<{ data: AnalyticsOverview }>('/admin/analytics/overview');
        setData(res.data.data);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : 'Failed to load analytics';
        setError(String(message));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            High-level trends to understand how FoodRush is performing.
          </p>
        </div>
        <Loader className="my-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            High-level trends to understand how FoodRush is performing.
          </p>
        </div>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const overview = data ?? {
    todayOrderCount: 0,
    yesterdayOrderCount: 0,
    todayVsYesterdayPercent: 0,
    weeklyRevenue: 0,
    repeatCustomerPercent: 0,
    totalCustomersWithOrders: 0
  };

  const todayLabel =
    overview.todayVsYesterdayPercent > 0
      ? `+${overview.todayVsYesterdayPercent}% vs yesterday`
      : overview.todayVsYesterdayPercent < 0
        ? `${overview.todayVsYesterdayPercent}% vs yesterday`
        : 'Same as yesterday';

  const weeklyLabel =
    overview.weeklyRevenue > 0 ? 'Last 7 days' : 'No orders in the last 7 days';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          High-level trends to understand how FoodRush is performing. Data is loaded from your
          backend in real time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today&apos;s orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{overview.todayOrderCount}</p>
            <Badge
              variant={overview.todayVsYesterdayPercent >= 0 ? 'success' : 'outline'}
              className="text-[10px]"
            >
              {todayLabel}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">Rs. {formatRevenue(overview.weeklyRevenue)}</p>
            <Badge variant="outline" className="text-[10px]">
              {weeklyLabel}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Repeat customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{overview.repeatCustomerPercent}%</p>
            <Badge variant="outline" className="text-[10px]">
              {overview.totalCustomersWithOrders > 0
                ? `${overview.totalCustomersWithOrders} customers with orders`
                : 'No orders yet'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Traffic & conversion snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Today&apos;s orders, weekly revenue, and repeat customer % are computed from your
            database. You can add charts (e.g. orders by day, revenue trend) by calling{' '}
            <code className="rounded bg-muted px-1">/admin/order-stats</code> and plotting the
            response.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
