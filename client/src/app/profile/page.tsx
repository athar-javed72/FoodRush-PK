"use client";

import { useEffect, useState, FormEvent } from 'react';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';

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
        {loading && <p>Loading profile...</p>}
        {!loading && profile && (
          <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-md border bg-card p-4">
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <div className="space-y-1 text-sm">
              <label className="font-medium">Name</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="font-medium">Phone</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}

