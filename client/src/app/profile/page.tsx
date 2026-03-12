"use client";

import { useEffect, useState, FormEvent } from 'react';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get('/users/me');
        setProfile(res.data.data.user);
        setName(res.data.data.user.name || '');
        setPhone(res.data.data.user.phone || '');
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await apiClient.put('/users/me', { name, phone });
      setProfile(res.data.data.user);
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Profile</h1>
        {loading && (
          <Loader className="my-4" />
        )}
        {!loading && profile && (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {message && <p className="text-xs text-muted-foreground">{message}</p>}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Phone</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Email</label>
                  <Input type="email" value={profile.email} disabled />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
                <div className="pt-2 text-xs text-muted-foreground">
                  <p>
                    Need to update your delivery locations?{' '}
                    <Link href="/addresses" className="text-primary underline underline-offset-2">
                      Manage addresses
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}


