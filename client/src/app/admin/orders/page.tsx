"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/EmptyState';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
] as const;

interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
}

interface OrderItem {
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

interface Driver {
  _id: string;
  name: string;
  email?: string;
  role: string;
}

interface Order {
  _id: string;
  user: OrderUser;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  assignedDriver?: Driver | null;
}

function toCSV(orders: Order[]): string {
  const headers = ['Order ID', 'Customer', 'Email', 'Items', 'Total (Rs)', 'Status', 'Date'];
  const rows = orders.map((o) => [
    o._id,
    o.user?.name ?? '',
    o.user?.email ?? '',
    o.items?.length ?? 0,
    o.totalAmount,
    o.orderStatus,
    new Date(o.createdAt).toLocaleString()
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\r\n');
  return csvContent;
}

function downloadCSV(orders: Order[]) {
  const csv = toCSV(orders);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `foodrush-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiClient.get('/users').then((res) => {
      const users = res.data?.data?.users ?? [];
      setDrivers(users.filter((u: Driver) => u.role === 'driver'));
    }).catch(() => setDrivers([]));
  }, []);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/orders', { params });
      const data = res.data?.data;
      setOrders(data?.orders ?? []);
      setPagination(data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update status';
      alert(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignDriver = async (orderId: string, driverId: string) => {
    try {
      setUpdatingId(orderId);
      const res = await apiClient.put(`/orders/${orderId}/assign`, { driverId });
      const updated = res.data?.data?.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, assignedDriver: updated?.assignedDriver } : o))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to assign driver');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params: Record<string, string | number> = { limit: 1000 };
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/orders', { params });
      const list = res.data?.data?.orders ?? [];
      downloadCSV(list);
    } catch (_) {
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage recent orders across the platform.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">Recent orders</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1 text-xs"
            >
              <option value="">All</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <Loader className="my-6" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <EmptyState
              title="No orders yet"
              message="As customers place orders, you'll see them listed here."
            />
          )}
          {!loading && !error && orders.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell className="font-mono text-xs">{o._id.slice(-8)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{o.user?.name ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{o.user?.email ?? ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>{o.items?.length ?? 0}</TableCell>
                      <TableCell>Rs. {o.totalAmount}</TableCell>
                      <TableCell>
                        <select
                          value={o.assignedDriver?._id ?? ''}
                          onChange={(e) => handleAssignDriver(o._id, e.target.value)}
                          disabled={updatingId === o._id}
                          className="rounded border border-input bg-background px-2 py-1 text-xs"
                        >
                          <option value="">— Assign —</option>
                          {drivers.map((d) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          disabled={updatingId === o._id}
                          className="rounded border border-input bg-background px-2 py-1 text-xs"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
