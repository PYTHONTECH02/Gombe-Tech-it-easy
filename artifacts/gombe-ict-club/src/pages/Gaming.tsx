import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function Gaming() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [consoleTab, setConsoleTab] = useState<'ps4' | 'ps5'>('ps4');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [gameType, setGameType] = useState('');
  const [slots, setSlots] = useState('');
  const [gameConsole, setGameConsole] = useState<'ps4' | 'ps5'>('ps4');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase.from('gaming_sessions').select('*').order('created_at', { ascending: false });
      if (error && error.code !== '42P01') throw error;
      if (data) setSessions(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !day || !month || !time || !venue) {
      toast({ variant: 'destructive', title: 'Fill in all required fields' }); return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.from('gaming_sessions').insert([{
        console: gameConsole, day, month,
        year: new Date().getFullYear().toString(),
        title, time, venue,
        game_type: gameType || null,
        slots: slots ? parseInt(slots) : null,
      }]).select().single();
      if (error) throw error;
      setSessions([data, ...sessions]);
      setShowModal(false);
      toast({ title: '🎮 Session scheduled!' });
      setDay(''); setMonth(''); setTitle(''); setTime(''); setVenue(''); setGameType(''); setSlots('');
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this session?')) return;
    try {
      await supabase.from('gaming_sessions').delete().eq('id', id);
      setSessions(sessions.filter(s => s.id !== id));
      toast({ title: 'Session deleted' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const isAdmin = role === 'admin' || role === 'super_admin';
  const filteredSessions = sessions.filter(s => s.console === consoleTab);

  return (
    <div className="flex-1 bg-[#0c0018] text-white min-h-[calc(100vh-60px)] p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#C44DFF] opacity-10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h1 className="font-display text-6xl md:text-8xl text-[#C44DFF] drop-shadow-[4px_4px_0_#0A0A0A]">GAMING HUB</h1>
            <p className="text-xl text-gray-300 font-bold max-w-2xl mt-4">
              Tournaments, casual play, and leaderboards. Pick your console and show up.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-end gap-3">
            {isAdmin ? (
              <button onClick={() => setShowModal(true)}
                className="bg-[#C44DFF] text-[#0A0A0A] font-bold uppercase px-6 py-3 neubrutalism-box hover:bg-white transition-colors flex items-center gap-2">
                🛡️ + Schedule Session
              </button>
            ) : !user ? (
              <div className="bg-[#0A0A0A] border-[3px] border-[#C44DFF] p-4 text-center">
                <p className="font-bold text-sm mb-2">Sign in to see your registrations</p>
                <Link href="/auth" className="bg-[#C44DFF] text-[#0A0A0A] px-4 py-2 font-bold uppercase block text-center text-sm">Sign In</Link>
              </div>
            ) : null}
          </div>
        </div>

        {/* Admin badge */}
        {isAdmin && (
          <div className="mb-8 bg-[#C44DFF]/10 border-[2px] border-[#C44DFF] px-5 py-3 flex items-center gap-3">
            <span className="text-[#C44DFF] font-bold text-sm uppercase">🛡️ Admin View</span>
            <span className="text-gray-400 text-xs font-bold">— You can schedule and delete sessions. Students only see the schedule.</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-12 border-b-[3px] border-[#0A0A0A] pb-4">
          <button
            className={`font-display text-4xl px-4 py-2 transition-colors ${consoleTab === 'ps4' ? 'bg-[#0033A0] text-white neubrutalism-box' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setConsoleTab('ps4')}>
            PLAYSTATION 4
          </button>
          <button
            className={`font-display text-4xl px-4 py-2 transition-colors ${consoleTab === 'ps5' ? 'bg-[#C44DFF] text-[#0A0A0A] neubrutalism-box' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setConsoleTab('ps5')}>
            PLAYSTATION 5
          </button>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="text-center text-gray-500 font-bold py-12 animate-pulse">Loading sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-[#0A0A0A] border-[3px] border-gray-800 p-12 text-center">
            <p className="font-bold text-xl text-gray-500 mb-2">No sessions scheduled for {consoleTab.toUpperCase()} yet.</p>
            {isAdmin && <p className="text-gray-600 text-sm font-bold">Use the "Schedule Session" button above to add one.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map(session => (
              <div key={session.id} className="bg-[#0A0A0A] border-[3px] border-[#C44DFF] p-6 flex flex-col relative group">
                {isAdmin && (
                  <button onClick={() => handleDelete(session.id)}
                    className="absolute top-3 right-3 bg-[#FF3B3B] text-white w-7 h-7 font-bold border-[2px] border-[#0A0A0A] flex items-center justify-center text-xs hover:bg-white hover:text-[#FF3B3B] transition-all">
                    ✕
                  </button>
                )}

                <div className="flex gap-4 mb-5 items-center">
                  <div className="flex flex-col items-center bg-[#C44DFF] text-[#0A0A0A] p-3 border-[2px] border-[#0A0A0A] shrink-0">
                    <span className="font-display text-4xl leading-none">{session.day}</span>
                    <span className="font-bold text-xs uppercase">{session.month}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 border-[2px] border-[#0A0A0A] ${session.console === 'ps5' ? 'bg-[#C44DFF] text-[#0A0A0A]' : 'bg-[#0033A0] text-white'}`}>
                      {session.console?.toUpperCase()}
                    </span>
                    <p className="text-gray-300 font-bold mt-1.5 text-sm">🕐 {session.time}</p>
                  </div>
                </div>

                <h3 className="font-display text-2xl text-white tracking-wide mb-3">{session.title}</h3>

                {/* Extra details */}
                <div className="mt-auto space-y-1.5">
                  {session.venue && (
                    <p className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="text-[#C44DFF]">📍</span> {session.venue}
                    </p>
                  )}
                  {session.game_type && (
                    <p className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="text-[#FFE500]">🎮</span> {session.game_type}
                    </p>
                  )}
                  {session.slots && (
                    <p className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="text-[#00E676]">👥</span> {session.slots} slots available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Session Modal — admin only */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm p-4">
          <div className="bg-[#F2EDE4] w-full max-w-lg neubrutalism-box p-8 text-[#0A0A0A] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-4xl">SCHEDULE SESSION</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl font-bold hover:text-[#FF3B3B]">✕</button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Session Title *</label>
                <input required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none"
                  placeholder="e.g. FIFA 25 Tournament" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Day *</label>
                  <input required type="number" min="1" max="31" value={day} onChange={e => setDay(e.target.value)}
                    className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none" placeholder="15" />
                </div>
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Month *</label>
                  <select required value={month} onChange={e => setMonth(e.target.value)}
                    className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold bg-white cursor-pointer">
                    <option value="">Select…</option>
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Time *</label>
                <input required type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none" />
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Venue / Location *</label>
                <input required value={venue} onChange={e => setVenue(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none"
                  placeholder="e.g. ICT Lab B, Room 12" />
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Game Type</label>
                <input value={gameType} onChange={e => setGameType(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none"
                  placeholder="e.g. FIFA 25, Mortal Kombat, Free roam" />
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Available Slots</label>
                <input type="number" value={slots} onChange={e => setSlots(e.target.value)}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none"
                  placeholder="e.g. 16" />
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-2 block">Console *</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setGameConsole('ps4')}
                    className={`flex-1 py-3 font-bold uppercase border-[3px] border-[#0A0A0A] transition-all ${gameConsole === 'ps4' ? 'bg-[#0033A0] text-white' : 'bg-white text-[#0A0A0A]'}`}>
                    PS4
                  </button>
                  <button type="button" onClick={() => setGameConsole('ps5')}
                    className={`flex-1 py-3 font-bold uppercase border-[3px] border-[#0A0A0A] transition-all ${gameConsole === 'ps5' ? 'bg-[#C44DFF] text-white' : 'bg-white text-[#0A0A0A]'}`}>
                    PS5
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-[3px] border-[#0A0A0A] font-bold uppercase hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#C44DFF] text-[#0A0A0A] font-display text-2xl border-[3px] border-[#0A0A0A] hover:bg-[#FFE500] transition-colors disabled:opacity-50">
                  {saving ? 'SAVING...' : 'SCHEDULE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
