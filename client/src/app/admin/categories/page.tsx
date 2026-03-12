"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';

const mockCategories = [
  { id: '1', name: 'Burgers', slug: 'burgers', products: 24, active: true },
  { id: '2', name: 'Fries & sides', slug: 'fries-sides', products: 12, active: true },
  { id: '3', name: 'Drinks', slug: 'drinks', products: 8, active: false }
];

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organise the menu into clear, appetising groups.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          Add category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockCategories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Create your first category to start organising products."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell>{cat.products}</TableCell>
                    <TableCell>
                      <Badge variant={cat.active ? 'success' : 'outline'}>
                        {cat.active ? 'Active' : 'Hidden'}
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
        title="Add category"
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
            <label className="text-xs font-medium">Name</label>
            <Input placeholder="e.g. Burgers" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Slug</label>
            <Input placeholder="e.g. burgers" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

