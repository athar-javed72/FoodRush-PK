"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';

const mockProducts = [
  { id: '1', name: 'Classic beef burger', category: 'Burgers', price: 750, active: true },
  { id: '2', name: 'Loaded fries', category: 'Fries & sides', price: 490, active: true },
  { id: '3', name: 'Chocolate shake', category: 'Drinks', price: 350, active: false }
];

export default function AdminProductsPage() {
  const [query, setQuery] = useState('');

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the dishes available across your FoodRush menu.
          </p>
        </div>
        <Button size="sm">Add product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product catalogue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by product name..."
              className="sm:max-w-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              title="No products match your search"
              message="Try a different name or clear your filters."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.category}</TableCell>
                    <TableCell>Rs. {p.price}</TableCell>
                    <TableCell>
                      <Badge variant={p.active ? 'success' : 'outline'}>
                        {p.active ? 'Active' : 'Hidden'}
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

