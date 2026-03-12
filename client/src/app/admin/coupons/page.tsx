"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';

const mockCoupons = [
  { id: '1', code: 'WELCOME10', discount: '10%', active: true },
  { id: '2', code: 'FRIESFREE', discount: 'Free fries', active: false }
];

export default function AdminCouponsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage promo codes to reward loyal customers.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          Create coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active & archived coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {mockCoupons.length === 0 ? (
            <EmptyState
              title="No coupons yet"
              message="Add a coupon to run limited-time offers and rewards."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCoupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell>{c.discount}</TableCell>
                    <TableCell>
                      <Badge variant={c.active ? 'success' : 'outline'}>
                        {c.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create coupon"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium">Code</label>
            <Input placeholder="e.g. WELCOME10" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Discount</label>
            <Input placeholder="e.g. 10% off or Free fries" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

