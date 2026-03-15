"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';
import { getRoleLabel } from '@/lib/roles';
import { useAppSelector } from '@/app/store';

interface Complaint {
  _id: string;
  subject: string;
  description: string;
  status: string;
  adminNotes?: string | null;
  user?: { name: string; email: string; role: string };
  createdAt: string;
}

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

export default function AdminComplaintsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const canUpdate = user?.role === 'admin' || user?.role === 'manager';
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Complaint | null>(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/staff/complaints');
      setComplaints(res.data?.data?.complaints ?? []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openEdit = (c: Complaint) => {
    setEditing(c);
    setStatus(c.status);
    setAdminNotes(c.adminNotes ?? '');
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editing || !canUpdate) return;
    setSaving(true);
    try {
      await apiClient.put(`/staff/complaints/${editing._id}/status`, { status, adminNotes: adminNotes || undefined });
      toast.success('Complaint updated');
      setEditOpen(false);
      setEditing(null);
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Complaints</h1>
        <p className="text-sm text-muted-foreground">View and update status of staff complaints.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loader className="my-6" />}
          {!loading && complaints.length === 0 && (
            <p className="text-sm text-muted-foreground">No complaints yet.</p>
          )}
          {!loading && complaints.length > 0 && (
            <ul className="space-y-3">
              {complaints.map((c) => (
                <li key={c._id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{c.subject}</p>
                      <p className="text-muted-foreground">{c.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        By: {c.user?.name ?? '—'} ({c.user?.email}) · {c.user?.role ? getRoleLabel(c.user.role) : ''} · {new Date(c.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs">Status: {c.status}</p>
                    </div>
                    {canUpdate && (
                      <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                        Update status
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditing(null); }}
        title="Update complaint status"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => { setEditOpen(false); setEditing(null); }} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Admin notes</label>
            <textarea
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
