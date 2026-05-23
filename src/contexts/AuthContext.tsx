import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
});

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'hpro453176@gmail.com';

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
  const mountedRef = useRef(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const fallback = buildFallbackProfile(currentUser);
      if (mountedRef.current) {
        setProfile(fallback);
        setRole(fallback.role);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!mountedRef.current) return;

      if (error) {
        if (error.code === 'PGRST116') {
          // Row not found — try to insert
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

          if (newProfile && mountedRef.current) {
            setProfile(newProfile as Profile);
            setRole(newProfile.role as Role);
          }
        }
        // For table-not-found (42P01) or any other error: keep fallback, it's already set above
      } else if (data) {
        setProfile(data as Profile);
        setRole(data.role as Role);
      }
    } catch (err) {
      console.error('fetchProfile error:', err);
      // Fallback is already set — just ensure loading resolves
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  useEffect(() => {
    mountedRef.current = true;

    // Safety net: if Supabase hangs for > 8s, release the loading gate
    const loadingTimeout = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('Auth load timed out — releasing loading gate');
        setLoading(false);
      }
    }, 8000);

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mountedRef.current) return;
        if (error) throw error;
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          await fetchProfile(u);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mountedRef.current) setLoading(false);
      } finally {
        clearTimeout(loadingTimeout);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return;
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

    return () => {
      mountedRef.current = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
