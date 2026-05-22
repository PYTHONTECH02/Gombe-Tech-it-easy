import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function Members() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role_title: '', class_year: '', bio: '', skills: '', color: '#FFE500' });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const { data, error } = await supabase.from('officers').select('*').order('sort_order', { ascending: true });
      if (error && error.code !== '42P01') throw error;
      if (data) setOfficers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (officer: any) => {
    setEditingId(officer.id);
    setFormData({
      name: officer.name,
      role_title: officer.role_title,
      class_year: officer.class_year,
      bio: officer.bio,
      skills: (officer.skills || []).join(', '),
      color: officer.color || '#FFE500'
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      if (editingId) {
        const { error } = await supabase.from('officers').update({
          name: formData.name,
          role_title: formData.role_title,
          class_year: formData.class_year,
          bio: formData.bio,
          skills: skillsArray,
          color: formData.color
        }).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Updated successfully' });
      } else {
        const { error } = await supabase.from('officers').insert([{
          name: formData.name,
          role_title: formData.role_title,
          class_year: formData.class_year,
          bio: formData.bio,
          skills: skillsArray,
          color: formData.color,
          sort_order: officers.length
        }]);
        if (error) throw error;
        toast({ title: 'Added successfully' });
      }
      
      setShowModal(false);
      fetchOfficers();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <div className="flex-1 bg-[#F2EDE4] text-[#0A0A0A] min-h-[calc(100vh-60px)] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b-[4px] border-[#0A0A0A] pb-6">
          <h1 className="font-display text-6xl md:text-8xl leading-none">LEADERSHIP</h1>
          {isAdmin && (
            <button onClick={() => { setEditingId(null); setFormData({name:'',role_title:'',class_year:'',bio:'',skills:'',color:'#FFE500'}); setShowModal(true); }} className="bg-[#0A0A0A] text-white px-6 py-2 font-bold uppercase neubrutalism-box-sm">
              + Add Officer
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center font-bold">Loading...</div>
        ) : officers.length === 0 ? (
          <div className="bg-white border-[3px] border-[#0A0A0A] p-12 text-center neubrutalism-box">
            <p className="font-bold text-xl">No officers found.</p>
            {isAdmin && <p className="mt-2 text-gray-500">Click Add Officer to get started.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officers.map(officer => (
              <div key={officer.id} className="bg-white border-[3px] border-[#0A0A0A] neubrutalism-box relative">
                {isAdmin && (
                  <button onClick={() => handleEdit(officer)} className="absolute top-2 right-2 bg-[#0A0A0A] text-white text-xs px-2 py-1 font-bold">EDIT</button>
                )}
                
                <div className="p-6 border-b-[3px] border-[#0A0A0A] flex items-center gap-4" style={{ backgroundColor: officer.color || '#F2EDE4' }}>
                  <div className="w-16 h-16 rounded-full bg-white border-[3px] border-[#0A0A0A] flex items-center justify-center font-display text-2xl">
                    {officer.name ? officer.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl leading-none bg-white px-2 py-1 border-[2px] border-[#0A0A0A] inline-block mb-1">{officer.role_title}</h2>
                    <p className="font-bold uppercase tracking-wider text-sm">{officer.name}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="inline-block bg-gray-200 text-[#0A0A0A] text-xs font-bold uppercase px-2 py-1 mb-4 border-[2px] border-[#0A0A0A]">
                    Class: {officer.class_year}
                  </div>
                  <p className="text-gray-700 font-medium mb-6 line-clamp-3">"{officer.bio}"</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(officer.skills || []).map((skill: string, i: number) => (
                      <span key={i} className="text-xs font-bold px-2 py-1 border-[2px] border-[#0A0A0A] rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join Section */}
        <div className="mt-24 bg-[#00E676] border-[3px] border-[#0A0A0A] neubrutalism-box p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-display text-5xl mb-4 text-[#0A0A0A]">WANT TO JOIN?</h2>
            <p className="font-bold text-lg max-w-lg text-[#0A0A0A]">
              We're always looking for passionate students to join the club. No prior experience required — just a willingness to learn.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <ul className="space-y-3 font-bold text-[#0A0A0A]">
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A0A0A]"></div> Active SS1 - SS3 student</li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A0A0A]"></div> Interest in tech or gaming</li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A0A0A]"></div> Attend weekly Friday sessions</li>
            </ul>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg neubrutalism-box p-8">
            <h2 className="font-display text-4xl mb-6">{editingId ? 'EDIT OFFICER' : 'ADD OFFICER'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Name</label>
                  <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2" />
                </div>
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Role</label>
                  <input required value={formData.role_title} onChange={e=>setFormData({...formData, role_title: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Class</label>
                  <input value={formData.class_year} onChange={e=>setFormData({...formData, class_year: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2" />
                </div>
                <div>
                  <label className="font-bold uppercase text-xs mb-1 block">Card Color</label>
                  <select value={formData.color} onChange={e=>setFormData({...formData, color: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2 bg-white">
                    <option value="#FFE500">Yellow</option>
                    <option value="#C44DFF">Purple</option>
                    <option value="#00E676">Green</option>
                    <option value="#2563FF">Blue</option>
                    <option value="#FF3B3B">Red</option>
                    <option value="#FF6B00">Orange</option>
                    <option value="#F2EDE4">Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Bio</label>
                <textarea required value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2 min-h-[80px]" />
              </div>

              <div>
                <label className="font-bold uppercase text-xs mb-1 block">Skills (comma separated)</label>
                <input value={formData.skills} onChange={e=>setFormData({...formData, skills: e.target.value})} className="w-full border-[3px] border-[#0A0A0A] p-2" placeholder="HTML, Python, Public Speaking" />
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-3 border-[3px] border-[#0A0A0A] font-bold uppercase hover:bg-gray-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#0A0A0A] text-white font-bold uppercase border-[3px] border-[#0A0A0A] hover:bg-[#FFE500] hover:text-[#0A0A0A] transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
