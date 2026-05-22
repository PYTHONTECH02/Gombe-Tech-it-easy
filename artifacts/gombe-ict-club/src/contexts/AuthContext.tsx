import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type Role = 'super_admin' | 'admin' | 'student';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
});

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'hpro453176@gmail.com';

// Build a fallback profile from the Supabase user object alone
// so the Account page always renders even if the profiles table is missing
function buildFallbackProfile(u: User): Profile {
  const role: Role = u.email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'student';
  return {
    id: u.id,
    email: u.email ?? '',
    full_name: u.user_metadata?.full_name || null,
    role,
    avatar_url: u.user_metadata?.avatar_url || null,
    created_at: u.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await fetchProfile(u);
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (currentUser: User) => {
    try {
      // Always set a fallback immediately so the page never hangs
      const fallback = buildFallbackProfile(currentUser);
      setProfile(fallback);
      setRole(fallback.role);

      // Then try to get the real profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        // Table might not exist yet — try to create the profile row
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Row not found or table doesn't exist — stick with fallback
          console.warn('profiles table missing or row not found — using fallback profile');
        } else {
          // Try inserting a new profile row
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{
              id: currentUser.id,
              email: currentUser.email,
              role: fallback.role,
              full_name: currentUser.user_metadata?.full_name || '',
              avatar_url: currentUser.user_metadata?.avatar_url || '',
            }])
            .select()
            .single();

          if (newProfile) {
            setProfile(newProfile as Profile);
            setRole(newProfile.role as Role);
          }
        }
      } else if (data) {
        // Got real profile — use it (may have admin role assigned by super admin)
        setProfile(data as Profile);
        setRole(data.role as Role);
      }
    } catch (err) {
      console.error('fetchProfile error:', err);
      // Always fall back gracefully — never leave page loading forever
      const fallback = buildFallbackProfile(currentUser);
      setProfile(fallback);
      setRole(fallback.role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
