"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';

type Tab = 'complaints' | 'suggestions' | 'attendance';

interface Complaint {
  _id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Suggestion {
  _id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

export default function StaffDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('attendance');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [suggestionSubject, setSuggestionSubject] = useState('');
  const [suggestionDesc, setSuggestionDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<AttendanceRecord | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

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

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/staff/suggestions');
      setSuggestions(res.data?.data?.suggestions ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/staff/attendance');
      const list = res.data?.data?.attendance ?? [];
      setAttendance(list);
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = list.find((a: AttendanceRecord) => a.date?.slice(0, 10) === today);
      setTodayCheckIn(todayRecord ?? null);
    } catch {
      setAttendance([]);
      setTodayCheckIn(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'complaints') fetchComplaints();
    else if (activeTab === 'suggestions') fetchSuggestions();
    else if (activeTab === 'attendance') fetchAttendance();
  }, [activeTab]);

  const handleSubmitComplaint = async () => {
    if (!complaintSubject.trim() || !complaintDesc.trim()) {
      toast.error('Subject and description required');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/staff/complaints', {
        subject: complaintSubject.trim(),
        description: complaintDesc.trim()
      });
      toast.success('Concern shared');
      setComplaintOpen(false);
      setComplaintSubject('');
      setComplaintDesc('');
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Couldn\'t submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestionSubject.trim() || !suggestionDesc.trim()) {
      toast.error('Subject and description required');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/staff/suggestions', {
        subject: suggestionSubject.trim(),
        description: suggestionDesc.trim()
      });
      toast.success('Idea shared');
      setSuggestionOpen(false);
      setSuggestionSubject('');
      setSuggestionDesc('');
      fetchSuggestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Couldn\'t submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckIn = async () => {
    setAttendanceLoading(true);
    try {
      const res = await apiClient.post('/staff/attendance/check-in');
      setTodayCheckIn(res.data?.data?.attendance ?? null);
      toast.success('Check-in recorded');
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Couldn\'t check in. Please try again.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setAttendanceLoading(true);
    try {
      const res = await apiClient.post('/staff/attendance/check-out');
      setTodayCheckIn(res.data?.data?.attendance ?? null);
      toast.success('Check-out recorded');
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Couldn\'t check out. Please try again.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'complaints', label: 'Share a concern' },
    { id: 'suggestions', label: 'Share an idea' },
    { id: 'attendance', label: 'Attendance' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Staff Hub</h1>
        <p className="text-sm text-muted-foreground">
          Share concerns, ideas, and mark your attendance here.
        </p>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'complaints' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Concerns I've shared</CardTitle>
            <Button size="sm" onClick={() => setComplaintOpen(true)}>
              Share a concern
            </Button>
          </CardHeader>
          <CardContent>
            {loading && <Loader className="my-4" />}
            {!loading && complaints.length === 0 && (
              <p className="text-sm text-muted-foreground">No concerns shared yet. Use &quot;Share a concern&quot; to report an issue.</p>
            )}
            {!loading && complaints.length > 0 && (
              <ul className="space-y-3">
                {complaints.map((c) => (
                  <li key={c._id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{c.subject}</p>
                    <p className="text-muted-foreground">{c.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Status: {c.status} · {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'suggestions' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ideas I've shared</CardTitle>
            <Button size="sm" onClick={() => setSuggestionOpen(true)}>
              Share an idea
            </Button>
          </CardHeader>
          <CardContent>
            {loading && <Loader className="my-4" />}
            {!loading && suggestions.length === 0 && (
              <p className="text-sm text-muted-foreground">No ideas shared yet. Share your ideas to help us improve.</p>
            )}
            {!loading && suggestions.length > 0 && (
              <ul className="space-y-3">
                {suggestions.map((s) => (
                  <li key={s._id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{s.subject}</p>
                    <p className="text-muted-foreground">{s.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Status: {s.status} · {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance</CardTitle>
            <p className="text-sm text-muted-foreground">Mark check-in when you start and check-out when you leave.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {!todayCheckIn?.checkIn ? (
                <Button onClick={handleCheckIn} disabled={attendanceLoading}>
                  {attendanceLoading ? 'Recording…' : 'Check in'}
                </Button>
              ) : (
                <Button onClick={handleCheckOut} disabled={attendanceLoading || !!todayCheckIn?.checkOut}>
                  {attendanceLoading ? 'Recording…' : todayCheckIn?.checkOut ? 'Checked out' : 'Check out'}
                </Button>
              )}
            </div>
            {todayCheckIn && (
              <p className="text-sm text-muted-foreground">
                Today: Check-in {todayCheckIn.checkIn ? new Date(todayCheckIn.checkIn).toLocaleTimeString() : '—'}
                {todayCheckIn.checkOut ? ` · Check-out ${new Date(todayCheckIn.checkOut).toLocaleTimeString()}` : ''}
              </p>
            )}
            {loading && <Loader className="my-4" />}
            {!loading && attendance.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Recent attendance</p>
                <ul className="space-y-1 text-sm">
                  {attendance.slice(0, 10).map((a) => (
                    <li key={a._id}>
                      {new Date(a.date).toLocaleDateString()} — {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '—'} to{' '}
                      {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '—'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        title="Share a concern"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setComplaintOpen(false)} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitComplaint} disabled={saving}>{saving ? 'Submitting…' : 'Submit'}</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium">Subject</label>
            <Input
              value={complaintSubject}
              onChange={(e) => setComplaintSubject(e.target.value)}
              placeholder="Brief subject"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Description</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Describe the issue..."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={suggestionOpen}
        onClose={() => setSuggestionOpen(false)}
        title="Share an idea"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSuggestionOpen(false)} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitSuggestion} disabled={saving}>{saving ? 'Submitting…' : 'Submit'}</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium">Subject</label>
            <Input
              value={suggestionSubject}
              onChange={(e) => setSuggestionSubject(e.target.value)}
              placeholder="Brief subject"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Description</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              value={suggestionDesc}
              onChange={(e) => setSuggestionDesc(e.target.value)}
              placeholder="Your suggestion..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
