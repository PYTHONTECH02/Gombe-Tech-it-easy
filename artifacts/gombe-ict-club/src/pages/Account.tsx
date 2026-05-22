import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { CODING_TRACKS, CYBER_TRACKS } from '@/lib/bootcamp-data';

const ROLE_CONFIG = {
  super_admin: {
    label: 'SUPER ADMIN',
    icon: '👑',
    bg: 'bg-[#FF3B3B]',
    text: 'text-white',
    description: 'Full system access. Manages all admin roles.',
  },
  admin: {
    label: 'ADMIN',
    icon: '🛡️',
    bg: 'bg-[#FFE500]',
    text: 'text-[#0A0A0A]',
    description: 'Can post announcements, manage gaming sessions and members.',
  },
  student: {
    label: 'STUDENT',
    icon: '👤',
    bg: 'bg-[#0A0A0A]',
    text: 'text-white',
    description: 'Member of the club. Tracks personal learning progress.',
  },
};

// ── Admin Controls Panel ──────────────────────────────────────────────────────
function AdminPanel({ role }: { role: string }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'announcements' | 'gaming' | 'schedule'>('announcements');

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annTag, setAnnTag] = useState('INFO');
  const [annSaving, setAnnSaving] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annLoading, setAnnLoading] = useState(true);

  // Gaming session form
  const [gsTitle, setGsTitle] = useState('');
  const [gsDay, setGsDay] = useState('');
  const [gsMonth, setGsMonth] = useState('');
  const [gsTime, setGsTime] = useState('');
  const [gsConsole, setGsConsole] = useState<'ps4' | 'ps5'>('ps4');
  const [gsVenue, setGsVenue] = useState('');
  const [gsType, setGsType] = useState('');
  const [gsSlots, setGsSlots] = useState('');
  const [gsSaving, setGsSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Schedule item form
  const [schTitle, setSchTitle] = useState('');
  const [schDate, setSchDate] = useState('');
  const [schTime, setSchTime] = useState('');
  const [schLocation, setSchLocation] = useState('');
  const [schDesc, setSchDesc] = useState('');
  const [schType, setSchType] = useState('meeting');
  const [schSaving, setSchSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    fetchSessions();
  }, []);

  const fetchAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5);
      if (data) setAnnouncements(data);
    } catch(e) {} finally { setAnnLoading(false); }
  };

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const { data } = await supabase.from('gaming_sessions').select('*').order('created_at', { ascending: false }).limit(5);
      if (data) setSessions(data);
    } catch(e) {} finally { setSessionsLoading(false); }
  };

  const handlePostAnnouncement = async () => {
    if (!annTitle.trim() || !annBody.trim()) {
      toast({ variant: 'destructive', title: 'Fill in title and body' }); return;
    }
    setAnnSaving(true);
    try {
      const { error } = await supabase.from('announcements').insert([{ title: annTitle, body: annBody, tag: annTag, created_at: new Date().toISOString() }]);
      if (error) throw error;
      toast({ title: '✅ Announcement posted!' });
      setAnnTitle(''); setAnnBody(''); setAnnTag('INFO');
      fetchAnnouncements();
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally { setAnnSaving(false); }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await supabase.from('announcements').delete().eq('id', id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast({ title: 'Deleted' });
    } catch(e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
  };

  const handleAddSession = async () => {
    if (!gsTitle || !gsDay || !gsMonth || !gsTime || !gsVenue) {
      toast({ variant: 'destructive', title: 'Fill in all required fields' }); return;
    }
    setGsSaving(true);
    try {
      const { data, error } = await supabase.from('gaming_sessions').insert([{
        console: gsConsole, day: gsDay, month: gsMonth,
        year: new Date().getFullYear().toString(),
        title: gsTitle, time: gsTime,
        venue: gsVenue, game_type: gsType, slots: gsSlots ? parseInt(gsSlots) : null,
      }]).select().single();
      if (error) throw error;
      setSessions([data, ...sessions]);
      toast({ title: '🎮 Gaming session added!' });
      setGsTitle(''); setGsDay(''); setGsMonth(''); setGsTime(''); setGsVenue(''); setGsType(''); setGsSlots('');
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally { setGsSaving(false); }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Delete this session?')) return;
    try {
      await supabase.from('gaming_sessions').delete().eq('id', id);
      setSessions(sessions.filter(s => s.id !== id));
      toast({ title: 'Deleted' });
    } catch(e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }); }
  };

  const handleAddSchedule = async () => {
    if (!schTitle || !schDate || !schTime) {
      toast({ variant: 'destructive', title: 'Title, date and time are required' }); return;
    }
    setSchSaving(true);
    try {
      const { error } = await supabase.from('schedules').insert([{
        title: schTitle, date: schDate, time: schTime,
        location: schLocation, description: schDesc, type: schType,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      toast({ title: '📅 Schedule item added!' });
      setSchTitle(''); setSchDate(''); setSchTime(''); setSchLocation(''); setSchDesc('');
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally { setSchSaving(false); }
  };

  const tagColor = (tag: string) => {
    switch(tag.toUpperCase()) {
      case 'URGENT': return 'bg-[#FF3B3B] text-white';
      case 'EVENT': return 'bg-[#2563FF] text-white';
      case 'UPDATE': return 'bg-[#00E676] text-[#0A0A0A]';
      default: return 'bg-gray-300 text-[#0A0A0A]';
    }
  };

  const adminBg = role === 'super_admin' ? 'bg-[#FF3B3B]' : 'bg-[#FFE500]';
  const adminText = role === 'super_admin' ? 'text-white' : 'text-[#0A0A0A]';

  return (
    <div className={`${adminBg} border-[3px] border-[#0A0A0A] neubrutalism-box p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-display text-3xl text-[#0A0A0A]">
          {role === 'super_admin' ? '👑' : '🛡️'} ADMIN CONTROLS
        </span>
        <span className={`px-3 py-1 border-[2px] border-[#0A0A0A] font-bold text-xs uppercase ${role === 'super_admin' ? 'bg-[#0A0A0A] text-[#FF3B3B]' : 'bg-[#0A0A0A] text-[#FFE500]'}`}>
          {role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
        </span>
      </div>
      <p className={`font-bold mb-6 text-sm ${adminText} opacity-80`}>
        Manage announcements, gaming sessions, and event schedules from here.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['announcements', 'gaming', 'schedule'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold uppercase text-sm border-[2px] border-[#0A0A0A] transition-all ${activeTab === tab ? 'bg-[#0A0A0A] text-white' : 'bg-white text-[#0A0A0A] hover:bg-gray-100'}`}
          >
            {tab === 'announcements' ? '📢 News' : tab === 'gaming' ? '🎮 Gaming' : '📅 Schedule'}
          </button>
        ))}
      </div>

      {/* ── Announcements Tab ── */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white border-[3px] border-[#0A0A0A] p-5">
            <h3 className="font-bold uppercase text-sm mb-4 text-[#0A0A0A]">Post New Announcement</h3>
            <div className="space-y-3">
              <input value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                placeholder="Announcement title…"
                className="w-full border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none focus:border-[#2563FF] text-sm" />
              <textarea value={annBody} onChange={e => setAnnBody(e.target.value)}
                placeholder="Write the announcement body here…"
                rows={3}
                className="w-full border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none focus:border-[#2563FF] text-sm resize-none" />
              <div className="flex gap-3">
                <select value={annTag} onChange={e => setAnnTag(e.target.value)}
                  className="border-[2px] border-[#0A0A0A] p-3 font-bold text-sm uppercase bg-white cursor-pointer">
                  <option value="INFO">INFO</option>
                  <option value="EVENT">EVENT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="URGENT">URGENT</option>
                </select>
                <button onClick={handlePostAnnouncement} disabled={annSaving}
                  className="flex-1 bg-[#0A0A0A] text-white font-bold uppercase py-3 border-[2px] border-[#0A0A0A] hover:bg-gray-800 transition-all disabled:opacity-50 text-sm">
                  {annSaving ? 'Posting…' : '📢 Post Announcement'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border-[3px] border-[#0A0A0A] p-5">
            <h3 className="font-bold uppercase text-sm mb-3 text-[#0A0A0A]">Recent Announcements</h3>
            {annLoading ? <p className="text-gray-500 text-sm font-bold">Loading…</p> :
              announcements.length === 0 ? <p className="text-gray-400 text-sm font-bold">No announcements yet.</p> :
              <div className="space-y-2">
                {announcements.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 border-[2px] border-gray-200">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${tagColor(a.tag)}`}>{a.tag}</span>
                    <span className="flex-1 font-bold text-sm text-[#0A0A0A] truncate">{a.title}</span>
                    <button onClick={() => handleDeleteAnnouncement(a.id)}
                      className="text-[#FF3B3B] font-bold text-xs uppercase border border-[#FF3B3B] px-2 py-1 hover:bg-[#FF3B3B] hover:text-white transition-all">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* ── Gaming Tab ── */}
      {activeTab === 'gaming' && (
        <div className="space-y-4">
          <div className="bg-white border-[3px] border-[#0A0A0A] p-5">
            <h3 className="font-bold uppercase text-sm mb-4 text-[#0A0A0A]">Schedule New Gaming Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={gsTitle} onChange={e => setGsTitle(e.target.value)}
                placeholder="Session title (e.g. FIFA Night) *"
                className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none focus:border-[#C44DFF] text-sm md:col-span-2" />
              <div className="flex gap-2">
                <input value={gsDay} onChange={e => setGsDay(e.target.value)}
                  placeholder="Day (e.g. 15) *" type="number" min="1" max="31"
                  className="flex-1 border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
                <select value={gsMonth} onChange={e => setGsMonth(e.target.value)}
                  className="flex-1 border-[2px] border-[#0A0A0A] p-3 font-bold bg-white text-sm cursor-pointer">
                  <option value="">Month *</option>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <input value={gsTime} onChange={e => setGsTime(e.target.value)}
                placeholder="Time (e.g. 14:00) *" type="time"
                className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
              <input value={gsVenue} onChange={e => setGsVenue(e.target.value)}
                placeholder="Venue (e.g. ICT Lab B, Room 12) *"
                className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm md:col-span-2" />
              <input value={gsType} onChange={e => setGsType(e.target.value)}
                placeholder="Game type (e.g. FIFA 25 Tournament)"
                className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
              <input value={gsSlots} onChange={e => setGsSlots(e.target.value)}
                placeholder="Available slots (e.g. 16)" type="number"
                className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
              <div className="flex gap-2 md:col-span-2">
                <button onClick={() => setGsConsole('ps4')}
                  className={`flex-1 py-3 font-bold uppercase border-[2px] border-[#0A0A0A] text-sm transition-all ${gsConsole === 'ps4' ? 'bg-[#0033A0] text-white' : 'bg-white text-[#0A0A0A]'}`}>
                  PlayStation 4
                </button>
                <button onClick={() => setGsConsole('ps5')}
                  className={`flex-1 py-3 font-bold uppercase border-[2px] border-[#0A0A0A] text-sm transition-all ${gsConsole === 'ps5' ? 'bg-[#C44DFF] text-white' : 'bg-white text-[#0A0A0A]'}`}>
                  PlayStation 5
                </button>
              </div>
              <button onClick={handleAddSession} disabled={gsSaving}
                className="md:col-span-2 bg-[#0A0A0A] text-white font-bold uppercase py-3 border-[2px] border-[#0A0A0A] hover:bg-gray-800 transition-all disabled:opacity-50 text-sm">
                {gsSaving ? 'Adding…' : '🎮 Add Gaming Session'}
              </button>
            </div>
          </div>

          <div className="bg-white border-[3px] border-[#0A0A0A] p-5">
            <h3 className="font-bold uppercase text-sm mb-3 text-[#0A0A0A]">Upcoming Sessions</h3>
            {sessionsLoading ? <p className="text-gray-500 text-sm font-bold">Loading…</p> :
              sessions.length === 0 ? <p className="text-gray-400 text-sm font-bold">No sessions scheduled yet.</p> :
              <div className="space-y-2">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 border-[2px] border-gray-200">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${s.console === 'ps5' ? 'bg-[#C44DFF] text-white' : 'bg-[#0033A0] text-white'}`}>{s.console?.toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0A0A0A] truncate">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.day} {s.month} · {s.time}{s.venue ? ` · ${s.venue}` : ''}</p>
                    </div>
                    <button onClick={() => handleDeleteSession(s.id)}
                      className="text-[#FF3B3B] font-bold text-xs uppercase border border-[#FF3B3B] px-2 py-1 hover:bg-[#FF3B3B] hover:text-white transition-all shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* ── Schedule Tab ── */}
      {activeTab === 'schedule' && (
        <div className="bg-white border-[3px] border-[#0A0A0A] p-5">
          <h3 className="font-bold uppercase text-sm mb-4 text-[#0A0A0A]">Add Schedule / Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={schTitle} onChange={e => setSchTitle(e.target.value)}
              placeholder="Event / meeting title *"
              className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm md:col-span-2" />
            <input value={schDate} onChange={e => setSchDate(e.target.value)}
              type="date"
              className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
            <input value={schTime} onChange={e => setSchTime(e.target.value)}
              type="time"
              className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm" />
            <input value={schLocation} onChange={e => setSchLocation(e.target.value)}
              placeholder="Location (optional)"
              className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm md:col-span-2" />
            <select value={schType} onChange={e => setSchType(e.target.value)}
              className="border-[2px] border-[#0A0A0A] p-3 font-bold bg-white text-sm cursor-pointer">
              <option value="meeting">Club Meeting</option>
              <option value="workshop">Workshop</option>
              <option value="tournament">Gaming Tournament</option>
              <option value="bootcamp">Bootcamp Session</option>
              <option value="exam">Exam / Test</option>
              <option value="trip">Field Trip</option>
              <option value="other">Other</option>
            </select>
            <textarea value={schDesc} onChange={e => setSchDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="border-[2px] border-[#0A0A0A] p-3 font-bold focus:outline-none text-sm resize-none md:col-span-2" />
            <button onClick={handleAddSchedule} disabled={schSaving}
              className="md:col-span-2 bg-[#0A0A0A] text-white font-bold uppercase py-3 border-[2px] border-[#0A0A0A] hover:bg-gray-800 disabled:opacity-50 text-sm">
              {schSaving ? 'Saving…' : '📅 Add to Schedule'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Account Page ──────────────────────────────────────────────────────────
export default function Account() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  const [codingProgress, setCodingProgress] = useState<any[]>([]);
  const [codingScores, setCodingScores] = useState<any[]>([]);
  const [cyberProgress, setCyberProgress] = useState<any[]>([]);
  const [cyberScores, setCyberScores] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/auth');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !profile) return;
    if (profile.full_name) setFullName(profile.full_name);
    loadProgressData();
    if (role === 'super_admin') fetchUsers();
  }, [user, profile, role]);

  const loadProgressData = async () => {
    if (!user) return;
    try {
      const [cp, cs, cyp, cys] = await Promise.all([
        supabase.from('coding_progress').select('*').eq('user_id', user.id),
        supabase.from('coding_exam_scores').select('*').eq('user_id', user.id),
        supabase.from('cyber_progress').select('*').eq('user_id', user.id),
        supabase.from('cyber_exam_scores').select('*').eq('user_id', user.id),
      ]);
      if (cp.data) setCodingProgress(cp.data);
      if (cs.data) setCodingScores(cs.data);
      if (cyp.data) setCyberProgress(cyp.data);
      if (cys.data) setCyberScores(cys.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoaded(true);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) setUsers(data);
    } catch (e) {}
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
      if (error) throw error;
      toast({ title: '✅ Profile updated' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', targetUserId);
      if (error) throw error;
      toast({ title: 'Role updated' });
      fetchUsers();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLocation('/');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await supabase.from('profiles').delete().eq('id', user!.id);
      await supabase.auth.signOut();
      setLocation('/');
      toast({ title: 'Account deleted' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  // Show loading while auth resolves — but with timeout fallback
  if (authLoading) {
    return (
      <div className="flex-1 bg-[#F2EDE4] flex items-center justify-center min-h-[calc(100vh-60px)]">
        <div className="text-center">
          <div className="font-display text-4xl text-[#0A0A0A] animate-pulse mb-4">LOADING...</div>
          <p className="text-gray-500 font-bold text-sm">Checking your account…</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex-1 bg-[#F2EDE4] flex items-center justify-center min-h-[calc(100vh-60px)]">
        <div className="text-center bg-white border-[3px] border-[#0A0A0A] p-10 neubrutalism-box">
          <p className="font-display text-3xl mb-4">NOT SIGNED IN</p>
          <p className="text-gray-500 font-bold mb-6">You need to sign in to view your account.</p>
          <a href="/auth" className="bg-[#2563FF] text-white px-6 py-3 font-bold uppercase border-[3px] border-[#0A0A0A] inline-block">Sign In</a>
        </div>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[role || 'student'];
  const totalCodingLessons = codingProgress.length;
  const totalCyberLessons = cyberProgress.length;
  const bestCodingScore = codingScores.length > 0 ? Math.max(...codingScores.map((s) => s.score)) : null;
  const bestCyberScore = cyberScores.length > 0 ? Math.max(...cyberScores.map((s) => s.score)) : null;
  const totalLessonsAvail = CODING_TRACKS.reduce((a,t)=>a+t.lessons.length,0) + CYBER_TRACKS.reduce((a,t)=>a+t.lessons.length,0);
  const totalCompleted = totalCodingLessons + totalCyberLessons;
  const pct = totalLessonsAvail > 0 ? Math.round((totalCompleted / totalLessonsAvail) * 100) : 0;

  return (
    <div className="flex-1 bg-[#F2EDE4] text-[#0A0A0A] p-6 md:p-12 min-h-[calc(100vh-60px)]">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Page Header */}
        <div className="border-b-[4px] border-[#0A0A0A] pb-4">
          <h1 className="font-display text-6xl md:text-8xl">ACCOUNT</h1>
          <p className="font-bold text-gray-500 mt-1">Manage your profile, security, and progress.</p>
        </div>

        {/* Role Status Banner */}
        <div className={`${roleConfig.bg} ${roleConfig.text} border-[3px] border-[#0A0A0A] neubrutalism-box p-6 flex flex-col md:flex-row items-start md:items-center gap-4`}>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-white/20 border-[3px] border-[#0A0A0A] flex items-center justify-center font-display text-4xl">
              {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-3xl">{profile.full_name || profile.email.split('@')[0]}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 font-bold uppercase text-xs px-3 py-1 border-[2px] border-[#0A0A0A] ${role === 'super_admin' ? 'bg-[#0A0A0A] text-[#FF3B3B]' : role === 'admin' ? 'bg-[#0A0A0A] text-[#FFE500]' : 'bg-white text-[#0A0A0A]'}`}>
                  {roleConfig.icon} {roleConfig.label}
                </span>
                <span className="text-sm font-bold opacity-75">{roleConfig.description}</span>
              </div>
            </div>
          </div>
          <div className="text-sm font-bold opacity-60 shrink-0">{profile.email}</div>
        </div>

        {/* Progress summary strip */}
        <div className="bg-white border-[3px] border-[#0A0A0A] neubrutalism-box p-5 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <p className="font-bold text-xs uppercase text-gray-500 mb-1">Overall Progress</p>
            <div className="w-full bg-gray-200 border-[2px] border-[#0A0A0A] h-4">
              <div className="h-full bg-[#2563FF] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="font-display text-sm mt-1">{totalCompleted} / {totalLessonsAvail} lessons — {pct}%</p>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="font-display text-3xl text-[#2563FF]">{codingScores.length + cyberScores.length}</p>
              <p className="text-xs font-bold uppercase text-gray-500">Exams Taken</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl text-[#FFE500]">{bestCodingScore ?? bestCyberScore ?? '—'}</p>
              <p className="text-xs font-bold uppercase text-gray-500">Best Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Profile Card */}
          <div className="bg-white border-[3px] border-[#0A0A0A] neubrutalism-box p-8">
            <h2 className="font-display text-3xl mb-6 text-[#2563FF]">PROFILE</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold bg-[#F2EDE4] focus:outline-none focus:border-[#2563FF]" />
              </div>
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Email</label>
                <input value={profile.email} disabled
                  className="w-full border-[3px] border-gray-300 p-3 font-bold bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Member Since</label>
                <input value={new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} disabled
                  className="w-full border-[3px] border-gray-300 p-3 font-bold bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-[#FFE500] text-[#0A0A0A] font-bold uppercase py-3 border-[3px] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-[#0A0A0A] text-white border-[3px] border-[#0A0A0A] neubrutalism-box p-8 flex flex-col">
            <h2 className="font-display text-3xl mb-6 text-[#00E676]">SECURITY</h2>
            <div className="space-y-4 flex-1">
              <div className="bg-[#111] border-[2px] border-gray-700 p-4">
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Account Type</p>
                <p className="font-bold text-white">{profile.email?.endsWith('@gmail.com') ? 'Google / Social Account' : 'Email & Password'}</p>
              </div>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(profile.email, { redirectTo: `${window.location.origin}/account` });
                  if (!error) toast({ title: 'Reset email sent!', description: 'Check your inbox.' });
                  else toast({ variant: 'destructive', title: 'Error', description: error.message });
                }}
                className="w-full bg-white text-[#0A0A0A] font-bold uppercase py-3 border-[3px] border-[#0A0A0A] hover:bg-gray-200 transition-colors">
                Send Password Reset Email
              </button>
              <button onClick={handleSignOut}
                className="w-full bg-transparent text-white font-bold uppercase py-3 border-[3px] border-white hover:bg-white hover:text-[#0A0A0A] transition-colors">
                Sign Out
              </button>
            </div>
            <div className="mt-6 pt-6 border-t-[3px] border-gray-800">
              <p className="text-xs text-gray-500 font-bold uppercase mb-3">Danger Zone</p>
              <button onClick={handleDeleteAccount}
                className="w-full bg-transparent text-[#FF3B3B] font-bold uppercase py-2 border-[2px] border-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white transition-colors text-sm">
                Delete My Account
              </button>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white border-[3px] border-[#0A0A0A] neubrutalism-box p-8">
          <h2 className="font-display text-3xl mb-6 text-[#C44DFF]">LEARNING PROGRESS</h2>
          {!dataLoaded ? (
            <p className="font-bold text-gray-400">Loading progress…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#030312] text-white border-[3px] border-[#0A0A0A] p-6">
                <h3 className="font-display text-2xl text-[#2563FF] mb-4">SOFTWARE ENG</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-400 uppercase">Lessons Completed</span>
                    <span className="font-display text-3xl text-white">{totalCodingLessons}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="h-full bg-[#2563FF]" style={{ width: `${Math.min(100,(totalCodingLessons/15)*100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-400 uppercase">Exams Taken</span>
                    <span className="font-display text-3xl text-white">{codingScores.length}</span>
                  </div>
                  {bestCodingScore !== null && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-400 uppercase">Best Score</span>
                      <span className="font-display text-3xl text-[#FFE500]">{bestCodingScore}/10</span>
                    </div>
                  )}
                  {codingScores.length === 0 && <p className="text-gray-500 text-sm font-bold">No exams taken yet.</p>}
                </div>
              </div>
              <div className="bg-[#030d03] text-white border-[3px] border-[#0A0A0A] p-6">
                <h3 className="font-display text-2xl text-[#00E676] mb-4">CYBERSECURITY</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-400 uppercase">Lessons Completed</span>
                    <span className="font-display text-3xl text-white">{totalCyberLessons}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="h-full bg-[#00E676]" style={{ width: `${Math.min(100,(totalCyberLessons/15)*100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-400 uppercase">Exams Taken</span>
                    <span className="font-display text-3xl text-white">{cyberScores.length}</span>
                  </div>
                  {bestCyberScore !== null && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-400 uppercase">Best Score</span>
                      <span className="font-display text-3xl text-[#FFE500]">{bestCyberScore}/10</span>
                    </div>
                  )}
                  {cyberScores.length === 0 && <p className="text-gray-500 text-sm font-bold">No exams taken yet.</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Controls — only for admin/super_admin */}
        {(role === 'admin' || role === 'super_admin') && (
          <AdminPanel role={role} />
        )}

        {/* Super Admin — User Management Console */}
        {role === 'super_admin' && (
          <div className="bg-[#FF3B3B] border-[3px] border-[#0A0A0A] neubrutalism-box p-8">
            <h2 className="font-display text-4xl mb-2 text-[#0A0A0A]">USER MANAGEMENT</h2>
            <p className="font-bold mb-6 text-[#0A0A0A]">Assign admin roles and manage all members.</p>
            <input
              placeholder="Filter by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold mb-4 focus:outline-none"
            />
            <div className="bg-white border-[3px] border-[#0A0A0A] overflow-x-auto">
              <table className="w-full text-left min-w-[400px]">
                <thead className="bg-gray-100 border-b-[3px] border-[#0A0A0A]">
                  <tr>
                    <th className="p-3 font-bold text-xs uppercase">User</th>
                    <th className="p-3 font-bold text-xs uppercase">Current Role</th>
                    <th className="p-3 font-bold text-xs uppercase text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.email?.toLowerCase().includes(searchEmail.toLowerCase()))
                    .map((u) => {
                      const uConfig = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.student;
                      return (
                        <tr key={u.id} className="border-b border-gray-200 last:border-0">
                          <td className="p-3">
                            <p className="font-bold text-sm">{u.email}</p>
                            <p className="text-xs text-gray-500">{u.full_name || '—'}</p>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase border-[2px] border-[#0A0A0A] ${uConfig.bg} ${uConfig.text}`}>
                              {uConfig.icon} {uConfig.label}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {u.role !== 'super_admin' && (
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="bg-white border-[2px] border-[#0A0A0A] text-xs font-bold p-2 uppercase cursor-pointer"
                              >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  {users.filter((u) => u.email?.toLowerCase().includes(searchEmail.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-gray-400 font-bold">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
