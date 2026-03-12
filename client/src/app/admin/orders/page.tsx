"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';

const mockOrders = [
  { id: 'ORD123456', customer: 'Ali Khan', total: 2150, status: 'preparing' },
  { id: 'ORD123457', customer: 'Sara Ahmed', total: 1450, status: 'on_the_way' },
  { id: 'ORD123458', customer: 'John Doe', total: 890, status: 'delivered' }
];

function statusLabel(status: string) {
  switch (status) {
    case 'preparing':
      return 'Preparing';
    case 'on_the_way':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage recent orders across the platform.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          {mockOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              message="As customers place orders, you’ll see them listed here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>Rs. {o.total}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.status === 'delivered'
                            ? 'success'
                            : o.status === 'on_the_way'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {statusLabel(o.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

