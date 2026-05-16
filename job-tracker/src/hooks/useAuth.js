import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());
  const [authError, setAuthError] = useState(null);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked the reset link in their email
        setIsRecoveryMode(true);
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setIsRecoveryMode(false);
        setUser(null);
      } else {
        // For SIGNED_IN, INITIAL_SESSION, etc.
        // Do NOT set isRecoveryMode to false here, because Supabase often 
        // fires SIGNED_IN immediately after PASSWORD_RECOVERY!
        setUser(session?.user || null);
      }
      
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

  /**
   * Sends a password-reset email.
   * The link in the email will redirect back to the current app origin.
   *
   * ⚠️  You MUST also add your app URL to:
   *   Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
   *   e.g.  http://localhost:5173   and   https://your-prod-domain.com
   */
  const resetPassword = async (email) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw new Error(error.message);
  };

  /** Called after the user lands on the app via the reset link and sets a new password. */
  const updatePassword = async (newPassword) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase is not configured.');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    setIsRecoveryMode(false);
  };

  return {
    user,
    authLoading,
    authError,
    isAuthEnabled: isSupabaseConfigured(),
    isRecoveryMode,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
}
