'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/EmptyState';

const STATUS_OPTIONS = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'] as const;

interface OrderItem {
  nameSnapshot: string;
  quantity: number;
  priceSnapshot: number;
  lineTotal: number;
}

interface AddressSnapshot {
  fullName?: string;
  phone?: string;
  streetAddress?: string;
  area?: string;
  city?: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  items: OrderItem[];
  addressSnapshot: AddressSnapshot;
  createdAt: string;
}

export default function DriverDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/driver/orders', { params });
      setOrders(res.data?.data?.orders ?? []);
    } catch (err: any) {
      if (err.response?.status === 403) router.replace('/');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await apiClient.put(`/driver/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assigned orders</h1>
        <p className="text-sm text-muted-foreground">Update delivery status for your orders.</p>
      </div>

      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
          Refresh
        </Button>
      </div>

      {loading && <Loader className="my-8" />}
      {!loading && orders.length === 0 && (
        <EmptyState
          title="No assigned orders"
          message="When admin assigns you orders, they will appear here."
        />
      )}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/50 py-3">
                <CardTitle className="text-base">Order #{order._id.slice(-8)}</CardTitle>
                <Badge variant="outline">{order.orderStatus}</Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Delivery address</h4>
                    <p className="mt-1">
                      {order.addressSnapshot?.fullName}<br />
                      {order.addressSnapshot?.streetAddress}
                      {order.addressSnapshot?.area && `, ${order.addressSnapshot.area}`}
                      {order.addressSnapshot?.city && `, ${order.addressSnapshot.city}`}
                    </p>
                    {order.addressSnapshot?.phone && (
                      <p className="mt-1">Phone: {order.addressSnapshot.phone}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Items</h4>
                    <ul className="mt-1 space-y-0.5">
                      {order.items?.map((item, i) => (
                        <li key={i}>
                          {item.nameSnapshot} × {item.quantity} — Rs. {item.lineTotal}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-semibold">Total: Rs. {order.totalAmount}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                  {STATUS_OPTIONS.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={order.orderStatus === status ? 'default' : 'outline'}
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
