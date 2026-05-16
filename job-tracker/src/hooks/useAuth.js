import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase) {
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(error.message);
      }
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setAuthError(null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signUp = async ({ email, password }) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  };

  const resetPassword = async (email) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw new Error(error.message);
  };

  return {
    user,
    authLoading,
    authError,
    isAuthEnabled: isSupabaseConfigured(),
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
