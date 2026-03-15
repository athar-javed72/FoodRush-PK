"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/EmptyState';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';

const ROLES = ['customer', 'admin', 'driver'] as const;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  isActive?: boolean;
  createdAt: string;
}

function roleLabel(role: string) {
  if (role === 'admin') return 'Admin';
  if (role === 'driver') return 'Driver';
  return 'Customer';
}

function UserAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt=""
        className="h-8 w-8 rounded-full object-cover border border-border"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
      {(user.name || user.email || '?').charAt(0).toUpperCase()}
    </div>
  );
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<string>('customer');

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<string>('customer');
  const [editNewPassword, setEditNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/users');
      setUsers(res.data?.data?.users ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editId = searchParams.get('edit');
  useEffect(() => {
    if (!editId || !users.length) return;
    const u = users.find((x) => x._id === editId);
    if (u) {
      setEditingUser(u);
      setEditName(u.name);
      setEditEmail(u.email);
      setEditRole(u.role);
      setEditNewPassword('');
      setFormError(null);
      setEditOpen(true);
      window.history.replaceState({}, '', '/admin/users');
    }
  }, [editId, users]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      await apiClient.put(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success('Role updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const openCreate = () => {
    setCreateName('');
    setCreateEmail('');
    setCreatePassword('');
    setCreateRole('customer');
    setFormError(null);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    setFormError(null);
    if (!createName.trim() || createName.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }
    if (!createEmail.trim()) {
      setFormError('Email is required.');
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    try {
      setSaving(true);
      await apiClient.post('/users', {
        name: createName.trim(),
        email: createEmail.trim().toLowerCase(),
        password: createPassword,
        role: createRole
      });
      toast.success('User created');
      await fetchUsers();
      setCreateOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create user');
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditNewPassword('');
    setFormError(null);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    setFormError(null);
    if (!editName.trim() || editName.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }
    if (!editEmail.trim()) {
      setFormError('Email is required.');
      return;
    }
    try {
      setSaving(true);
      const body: { name: string; email: string; role: string; newPassword?: string } = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        role: editRole
      };
      if (editNewPassword.trim().length >= 6) body.newPassword = editNewPassword.trim();
      await apiClient.put(`/users/${editingUser._id}`, body);
      toast.success('User updated');
      await fetchUsers();
      setEditOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to update user');
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/users/${u._id}`);
      toast.success('User deleted');
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage user accounts. Full CRUD on this screen.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          Create user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">User accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loader className="my-6" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <EmptyState
              title="No users found"
              message="Click “Create user” above to add an account, or users will appear here when they sign up."
            />
          )}
          {!loading && !error && users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join date</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <UserAvatar user={u} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/users/${u._id}`}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {u.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updatingId === u._id}
                        className="rounded border border-input bg-background px-2 py-1 text-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {roleLabel(r)}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => openEdit(u)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(u)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create user"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={saving}>
              {saving ? 'Creating…' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="space-y-1">
            <label className="text-xs font-medium">Name</label>
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <Input
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Password (min 6)</label>
            <Input
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Role</label>
            <select
              value={createRole}
              onChange={(e) => setCreateRole(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{roleLabel(r)}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditingUser(null); }}
        title="Edit user"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => { setEditOpen(false); setEditingUser(null); }} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleEdit} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="space-y-1">
            <label className="text-xs font-medium">Name</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <Input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Role</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{roleLabel(r)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">New password (optional, min 6)</label>
            <Input
              type="password"
              value={editNewPassword}
              onChange={(e) => setEditNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
