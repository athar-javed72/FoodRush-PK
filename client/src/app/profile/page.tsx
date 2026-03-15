"use client";

import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setUser } from '@/features/auth/authSlice';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
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
  }, [user, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image (JPEG, PNG, GIF, WebP).');
      return;
    }
    try {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = uploadRes.data?.data?.url;
      if (url) {
        const res = await apiClient.put('/users/me', { avatar: url });
        const updated = res.data.data.user;
        setProfile(updated);
        dispatch(setUser(updated));
        toast.success('Profile photo updated.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await apiClient.put('/users/me', { name, phone });
      const updated = res.data.data.user;
      setProfile(updated);
      dispatch(setUser(updated));
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
              <div className="mb-6 flex flex-col items-start gap-3">
                <div className="flex items-center gap-4">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
                      {(profile.name || profile.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={avatarUploading}
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {avatarUploading ? 'Uploading…' : 'Change profile photo'}
                    </Button>
                  </div>
                </div>
              </div>
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
                  <label className="text-xs font-medium">Phone (Pakistan: 03xxxxxxxxx)</label>
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

        {!loading && profile && (
          <Card className="mt-6 max-w-md">
            <CardHeader>
              <CardTitle>Change password</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPassword !== confirmPassword) {
                    setPasswordMessage('New password and confirm password do not match.');
                    return;
                  }
                  try {
                    setPasswordSaving(true);
                    setPasswordMessage(null);
                    await apiClient.put('/users/me/password', {
                      currentPassword,
                      newPassword
                    });
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordMessage('Password updated successfully.');
                  } catch (err: any) {
                    setPasswordMessage(
                      err.response?.data?.message || 'Failed to update password.'
                    );
                  } finally {
                    setPasswordSaving(false);
                  }
                }}
                className="space-y-4 text-sm"
              >
                {passwordMessage && (
                  <p
                    className={
                      passwordMessage.includes('success')
                        ? 'text-xs text-emerald-600'
                        : 'text-xs text-red-500'
                    }
                  >
                    {passwordMessage}
                  </p>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Current password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">New password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Confirm new password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={passwordSaving}>
                  {passwordSaving ? 'Updating…' : 'Update password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}


