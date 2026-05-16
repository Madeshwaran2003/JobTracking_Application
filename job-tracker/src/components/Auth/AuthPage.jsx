import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Lock, Mail, Loader2 } from 'lucide-react';

export default function AuthPage({ onSignIn, onSignUp, authError, isConfigured = true }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(authError || '');
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isConfigured) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to job-tracker/.env, then restart the dev server.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      if (isSignUp) {
        await onSignUp({ email, password });
        setMessage('Account created. Check your email if confirmation is enabled, then sign in.');
        setMode('signin');
      } else {
        await onSignIn({ email, password });
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 app-background" />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-dark-100">ApplyNest</h1>
              <p className="text-xs text-dark-400">
                {isConfigured ? 'Sign in to your private tracker' : 'Supabase configuration required'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5 rounded-xl bg-dark-700/45 p-1 border border-glass-border">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setMessage('');
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                !isSignUp ? 'bg-accent-blue text-white' : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setMessage('');
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isSignUp ? 'bg-accent-blue text-white' : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                <Mail size={12} />
                Email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                <Lock size={12} />
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                placeholder="Minimum 6 characters"
              />
            </label>

            {!isConfigured && (
              <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
                Add your Supabase URL and anon key in <span className="font-mono">job-tracker/.env</span>, then restart localhost.
              </p>
            )}

            {message && (
              <p className="rounded-xl border border-glass-border bg-dark-700/35 px-3 py-2 text-xs text-dark-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isConfigured}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </motion.section>
      </main>
    </div>
  );
}
