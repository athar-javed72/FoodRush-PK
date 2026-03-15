"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const ROLE_RIGHTS: Record<string, { label: string; access: string[] }> = {
  customer: {
    label: 'Customer',
    access: [
      'Browse menu & products',
      'Add to cart & wishlist',
      'Place orders',
      'View own order history & tracking',
      'Manage profile & addresses',
      'Apply coupons at checkout',
      'Write reviews for purchased products'
    ]
  },
  admin: {
    label: 'Admin',
    access: [
      'All Customer rights',
      'Dashboard: view totals (users, products, orders, revenue)',
      'Users: list, create, edit, delete, change role',
      'Categories: list, add, toggle active/inactive, delete',
      'Products: list, add (URL + upload image), toggle active/inactive, delete',
      'Orders: list all, update status, assign driver',
      'Coupons: list, create, update, delete',
      'Analytics: overview, top products, order stats',
      'Reviews: list all, delete any review',
      'Upload: product images & profile photos'
    ]
  },
  driver: {
    label: 'Driver',
    access: [
      'Driver dashboard: view assigned orders only',
      'Update delivery status (Confirmed → Preparing → Out for delivery → Delivered)',
      'View order details for assigned orders',
      'No access to admin panel, user management, or other orders'
    ]
  }
};

function roleLabel(role: string) {
  return ROLE_RIGHTS[role]?.label ?? role;
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/users/${params.id}`);
        setUser(res.data?.data?.user ?? null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'User not found');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Link href="/admin/users" className="text-sm text-primary hover:underline">
          ← Back to users
        </Link>
        <Loader className="my-8" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Link href="/admin/users" className="text-sm text-primary hover:underline">
          ← Back to users
        </Link>
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {error || 'User not found'}
          </CardContent>
        </Card>
      </div>
    );
  }

  const rights = ROLE_RIGHTS[user.role] ?? ROLE_RIGHTS.customer;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/users" className="text-sm text-primary hover:underline">
            ← Back to users
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">User details</h1>
          <p className="text-sm text-muted-foreground">
            Profile and access rights for this account
          </p>
        </div>
        <Link href={`/admin/users?edit=${user._id}`}>
          <Button variant="outline" size="sm">
            Edit user
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground">
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className="mt-1 capitalize" variant="default">
                  {roleLabel(user.role)}
                </Badge>
              </div>
            </div>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{user.phone || '—'}</dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant={user.isActive !== false ? 'default' : 'outline'}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between border-b pb-1">
                <dt className="text-muted-foreground">Joined</dt>
                <dd>{new Date(user.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Access & rights</CardTitle>
            <p className="text-xs text-muted-foreground">
              What this user can do based on role: <strong>{roleLabel(user.role)}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {rights.access.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
