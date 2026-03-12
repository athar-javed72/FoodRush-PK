"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';

const mockUsers = [
  { id: '1', name: 'Ali Khan', email: 'ali@example.com', role: 'user' },
  { id: '2', name: 'Sara Ahmed', email: 'sara@example.com', role: 'restaurant_owner' },
  { id: '3', name: 'Admin', email: 'admin@example.com', role: 'admin' }
];

function roleLabel(role: string) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'restaurant_owner':
      return 'Restaurant owner';
    default:
      return 'Customer';
  }
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          View who uses FoodRush, and which roles they have.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {mockUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              message="New customers and partners will appear here once they sign up."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'destructive' : 'outline'}>
                        {roleLabel(u.role)}
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

