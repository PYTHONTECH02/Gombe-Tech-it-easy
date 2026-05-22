import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // If already logged in, redirect to account
  useEffect(() => {
    if (user) setLocation('/account');
  }, [user]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'Welcome to the club.' });
        setLocation('/account');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
        setLocation('/account');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'An error occurred during authentication' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Always redirect back to /account after Google sign-in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: { prompt: 'select_account' },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'An error occurred with Google Sign In' });
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({ variant: 'destructive', title: 'Email required', description: 'Enter your email above first.' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });
      if (error) throw error;
      toast({ title: 'Email sent', description: 'Check your inbox for a password reset link.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not send reset email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center p-4 min-h-[calc(100vh-60px)]">
      <div className="w-full max-w-md bg-[#F2EDE4] neubrutalism-box p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE500] rounded-full translate-x-16 -translate-y-16 border-[3px] border-[#0A0A0A] z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C44DFF] translate-x-[-12px] translate-y-12 border-[3px] border-[#0A0A0A] rotate-12 z-0"></div>

        <div className="relative z-10">
          <div className="flex border-b-[3px] border-[#0A0A0A] mb-8">
            <button type="button"
              className={`flex-1 py-4 font-display text-3xl transition-colors ${!isSignUp ? 'bg-[#FFE500] text-[#0A0A0A]' : 'bg-transparent text-gray-500 hover:text-[#0A0A0A]'}`}
              onClick={() => setIsSignUp(false)}>SIGN IN</button>
            <div className="w-[3px] bg-[#0A0A0A]"></div>
            <button type="button"
              className={`flex-1 py-4 font-display text-3xl transition-colors ${isSignUp ? 'bg-[#00E676] text-[#0A0A0A]' : 'bg-transparent text-gray-500 hover:text-[#0A0A0A]'}`}
              onClick={() => setIsSignUp(true)}>SIGN UP</button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="font-display text-xl tracking-wide text-[#0A0A0A]">FULL NAME</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-white neubrutalism-box-sm focus:outline-none focus:border-[#2563FF] focus:shadow-[4px_4px_0_#2563FF] transition-all"
                  placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-2">
              <label className="font-display text-xl tracking-wide text-[#0A0A0A]">EMAIL</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white neubrutalism-box-sm focus:outline-none focus:border-[#2563FF] focus:shadow-[4px_4px_0_#2563FF] transition-all"
                placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="font-display text-xl tracking-wide text-[#0A0A0A]">PASSWORD</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white neubrutalism-box-sm focus:outline-none focus:border-[#2563FF] focus:shadow-[4px_4px_0_#2563FF] transition-all"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#0A0A0A] text-white font-display text-2xl tracking-wider hover:bg-[#FF3B3B] hover:text-[#0A0A0A] transition-colors neubrutalism-box disabled:opacity-50">
              {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'ENTER CLUB'}
            </button>
          </form>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <button type="button" onClick={handleResetPassword}
                className="text-sm font-bold text-gray-600 hover:text-[#FF3B3B] underline underline-offset-4 decoration-[2px]">
                FORGOT PASSWORD?
              </button>
            </div>
          )}

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-[3px] bg-[#0A0A0A]"></div>
            <span className="font-bold text-sm">OR</span>
            <div className="flex-1 h-[3px] bg-[#0A0A0A]"></div>
          </div>

          <button type="button" onClick={handleGoogleAuth}
            className="w-full py-3 bg-white neubrutalism-box flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <FcGoogle size={28} />
            <span className="font-bold uppercase tracking-wider text-[#0A0A0A]">Continue with Google</span>
          </button>

          <p className="text-xs text-gray-500 font-bold text-center mt-4">
            Google sign-in redirects you to your Account page ✓
          </p>
        </div>
      </div>
    </div>
  );
}
