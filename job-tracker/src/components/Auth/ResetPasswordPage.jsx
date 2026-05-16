import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import ApplyNestLogo from '../UI/ApplyNestLogo';

export default function ResetPasswordPage({ onUpdatePassword }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      await onUpdatePassword(password);
      setSuccess(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {/* Mobile Background */}
        <div className="absolute inset-0 sm:hidden">
          <img 
            src="/auth-bg-mobile.jpg" 
            alt="background mobile" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 to-dark-900/90" />
        </div>
        
        {/* Desktop Background */}
        <div className="absolute inset-0 hidden sm:block">
          <img 
            src="/auth-bg-desktop.png" 
            alt="background desktop" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 to-dark-900/90" />
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <ApplyNestLogo />
            <div>
              <h1 className="text-lg font-semibold text-dark-100">ApplyNest</h1>
              <p className="text-xs text-dark-400">Set a new password</p>
            </div>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
                <ShieldCheck size={24} className="text-green-400" />
              </div>
              <p className="text-sm font-medium text-dark-100">Password updated!</p>
              <p className="text-xs text-dark-400">You are now signed in. Redirecting…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <Lock size={12} />
                  New Password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                  placeholder="Minimum 6 characters"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <Lock size={12} />
                  Confirm Password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                  placeholder="Re-enter your password"
                />
              </label>

              {message && (
                <p className="rounded-xl border border-glass-border bg-dark-700/35 px-3 py-2 text-xs text-dark-300">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Update Password
              </button>
            </form>
          )}
        </motion.section>
      </main>
    </div>
  );
}
