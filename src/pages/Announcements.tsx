import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Announcements() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', tag: 'INFO' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (error && error.code !== '42P01') throw error;
      if (data) setNews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({ variant: 'destructive', title: 'Title and message are required' }); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('announcements').insert([{
        title: formData.title, body: formData.body, tag: formData.tag,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      toast({ title: '✅ Announcement posted!' });
      setShowModal(false);
      setFormData({ title: '', body: '', tag: 'INFO' });
      fetchNews();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await supabase.from('announcements').delete().eq('id', id);
      setNews(news.filter(n => n.id !== id));
      toast({ title: 'Deleted' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const isAdmin = role === 'admin' || role === 'super_admin';

  const getTagColor = (tag: string) => {
    switch (tag.toUpperCase()) {
      case 'URGENT': return 'bg-[#FF3B3B] text-white';
      case 'EVENT': return 'bg-[#2563FF] text-white';
      case 'UPDATE': return 'bg-[#00E676] text-[#0A0A0A]';
      default: return 'bg-gray-300 text-[#0A0A0A]';
    }
  };

  return (
    <div className="flex-1 bg-[#F2EDE4] text-[#0A0A0A] min-h-[calc(100vh-60px)] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b-[4px] border-[#0A0A0A] pb-6">
          <div>
            <h1 className="font-display text-6xl md:text-8xl leading-none">CLUB NEWS</h1>
            {isAdmin && (
              <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase border-[2px] border-[#0A0A0A] ${role === 'super_admin' ? 'bg-[#FF3B3B] text-white' : 'bg-[#FFE500] text-[#0A0A0A]'}`}>
                  {role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
                </span>
                You can post and delete announcements
              </p>
            )}
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)}
              className="bg-[#FFE500] text-[#0A0A0A] px-6 py-3 font-bold uppercase neubrutalism-box border-[3px] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors flex items-center gap-2">
              📢 Post News
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center font-bold animate-pulse py-12">Loading...</div>
        ) : news.length === 0 ? (
          <div className="bg-white border-[3px] border-[#0A0A0A] p-12 text-center neubrutalism-box">
            <p className="font-bold text-xl">No announcements yet.</p>
            {isAdmin && <p className="text-gray-500 font-bold text-sm mt-2">Click "Post News" above to add the first announcement.</p>}
          </div>
        ) : (
          <div className="space-y-6">
            {news.map(item => {
              const date = new Date(item.created_at);
              return (
                <div key={item.id} className="bg-white border-[3px] border-[#0A0A0A] neubrutalism-box flex flex-col md:flex-row relative">
                  {isAdmin && (
                    <button onClick={() => handleDelete(item.id)}
                      className="absolute top-3 right-3 bg-[#FF3B3B] text-white w-7 h-7 font-bold border-[2px] border-[#0A0A0A] flex items-center justify-center text-xs hover:bg-[#0A0A0A] transition-all z-10"
                      title="Delete announcement">✕</button>
                  )}
                  {/* Date Block */}
                  <div className="bg-[#0A0A0A] text-white p-6 md:w-32 flex flex-col justify-center items-center shrink-0 border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#0A0A0A]">
                    <span className="font-display text-5xl leading-none text-[#FFE500]">{format(date, 'dd')}</span>
                    <span className="font-bold uppercase tracking-widest text-sm">{format(date, 'MMM')}</span>
                    <span className="font-bold text-xs text-gray-500 mt-1">{format(date, 'yyyy')}</span>
                  </div>
                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1">
                    <div className="mb-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 border-[2px] border-[#0A0A0A] ${getTagColor(item.tag)}`}>
                        {item.tag}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl mb-4">{item.title}</h2>
                    <div className="font-medium text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Modal — admin only */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg neubrutalism-box p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-4xl text-[#0A0A0A]">POST ANNOUNCEMENT</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl font-bold hover:text-[#FF3B3B]">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Title *</label>
                <input required value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none focus:border-[#2563FF]"
                  placeholder="Announcement title" />
              </div>
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Tag</label>
                <select value={formData.tag}
                  onChange={e => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold bg-white cursor-pointer">
                  <option value="INFO">ℹ️ INFO</option>
                  <option value="EVENT">📅 EVENT</option>
                  <option value="UPDATE">🔄 UPDATE</option>
                  <option value="URGENT">🚨 URGENT</option>
                </select>
              </div>
              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Message *</label>
                <textarea required value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border-[3px] border-[#0A0A0A] p-3 font-bold focus:outline-none focus:border-[#2563FF] min-h-[140px] resize-none"
                  placeholder="Write your announcement here…" />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-[3px] border-[#0A0A0A] font-bold uppercase hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#FFE500] text-[#0A0A0A] font-bold uppercase border-[3px] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-50">
                  {saving ? 'Posting...' : '📢 Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
