import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Palette, CheckCircle2, XCircle,
  Loader2, Trash2, Download,
  Server, Shield, Zap, UploadCloud
} from 'lucide-react';
import { isSupabaseConfigured, getSupabase } from '../../lib/supabase';
import { addApplication, getConnectionMode } from '../../services/api';

const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark dashboard with blue and violet accents.',
    swatches: ['#0a0a0f', '#3b82f6', '#8b5cf6', '#22c55e'],
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'Clean light workspace with crisp contrast.',
    swatches: ['#f7fafc', '#2563eb', '#7c3aed', '#059669'],
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Calm green workspace with teal and amber details.',
    swatches: ['#07130f', '#14b8a6', '#84cc16', '#f59e0b'],
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: 'Warm dark workspace with rose and amber accents.',
    swatches: ['#150d12', '#e11d48', '#f97316', '#06b6d4'],
  },
  {
    id: 'caramel',
    name: 'Caramel Cream',
    description: 'RGB 150, 78, 6 with a soft 250, 230, 210 cream base.',
    swatches: ['rgb(150, 78, 6)', 'rgb(250, 230, 210)', '#c36a12', '#2f6f73'],
  },
];

export default function SettingsPage({ theme = 'midnight', onThemeChange }) {
  const mode = getConnectionMode();
  const isConfigured = isSupabaseConfigured();
  const [testing, setTesting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [migrationResult, setMigrationResult] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setTestResult({ success: false, message: 'Supabase not configured' });
        return;
      }
      const { data, error } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true });

      if (error) {
        setTestResult({ success: false, message: error.message });
      } else {
        setTestResult({
          success: true,
          message: `Connected! Found ${data?.length ?? 0} records in database.`,
        });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.removeItem('job-tracker-applications');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = localStorage.getItem('job-tracker-applications');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job-tracker-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const migrateLocalData = async () => {
    setMigrating(true);
    setMigrationResult(null);
    try {
      const stored = localStorage.getItem('job-tracker-applications');
      const applications = stored ? JSON.parse(stored) : [];

      if (!applications.length) {
        setMigrationResult({ success: false, message: 'No local data found to migrate.' });
        return;
      }

      for (const application of applications) {
        await addApplication(application);
      }

      setMigrationResult({
        success: true,
        message: `Migrated ${applications.length} application${applications.length === 1 ? '' : 's'} to Supabase.`,
      });
    } catch (err) {
      setMigrationResult({ success: false, message: err.message });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Supabase Connection - Primary Card */}
        <SettingsCard
          icon={Server}
          title="Supabase Database"
          description="Connect to a Supabase project for cloud storage, real-time sync, and multi-device access."
          accent="purple"
        >
          <div className="space-y-4">
            {/* Connection Status */}
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${
              isConfigured
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              {isConfigured ? (
                <>
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Connected to Supabase</p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      Your data is stored in the cloud and synced across devices.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Not Connected</p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      Using localStorage. Data is only in this browser.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-xl border border-glass-border bg-dark-700/35 px-4 py-3">
              <p className="text-sm font-medium text-dark-100">Credentials are hidden</p>
              <p className="text-xs text-dark-400 mt-1">
                Supabase environment values are used by the app but are not shown on this screen.
              </p>
            </div>

            {/* Test Connection Button */}
            {isConfigured && (
              <div className="flex items-center gap-3">
                <button
                  onClick={testConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-sm font-medium text-accent-purple hover:bg-accent-purple/20 transition-all disabled:opacity-50"
                >
                  {testing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Zap size={14} />
                  )}
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
                {testResult && (
                  <span className={`text-xs ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResult.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </SettingsCard>

        {/* Benefits Card */}
        {!isConfigured && (
          <SettingsCard
            icon={Shield}
            title="Why Supabase?"
            description="Benefits of connecting to a cloud database."
            accent="green"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '☁️', title: 'Cloud Storage', desc: 'Data persists even if you clear your browser' },
                { icon: '📱', title: 'Multi-Device Sync', desc: 'Access your data from any device' },
                { icon: '🔒', title: 'Secure', desc: 'Row Level Security and encrypted connections' },
                { icon: '⚡', title: 'Real-time', desc: 'Instant updates across all connected clients' },
                { icon: '💰', title: 'Free Tier', desc: '500MB database, 50K monthly active users' },
                { icon: '🔄', title: 'Auto-Backup', desc: 'Daily backups on free plan' },
              ].map((item) => (
                <div key={item.title} className="flex gap-2.5 p-2.5 rounded-xl bg-dark-700/30">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-dark-200">{item.title}</p>
                    <p className="text-[10px] text-dark-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>
        )}

        {/* Appearance */}
        <SettingsCard
          icon={Palette}
          title="Appearance"
          description="Choose a theme for your dashboard."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((item) => {
              const selected = theme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onThemeChange?.(item.id)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    selected
                      ? 'border-accent-blue bg-accent-blue/10'
                      : 'border-glass-border bg-dark-700/35 hover:bg-glass-hover'
                  }`}
                  aria-pressed={selected}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-100">{item.name}</p>
                      <p className="text-xs text-dark-400 mt-1">{item.description}</p>
                    </div>
                    {selected && <CheckCircle2 size={16} className="text-accent-blue flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    {item.swatches.map((color) => (
                      <span
                        key={color}
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsCard>

        {/* Data Management */}
        <SettingsCard
          icon={Briefcase}
          title="Data Management"
          description="Manage your application data."
        >
          <div className="flex items-center gap-3">
            {isConfigured && (
              <button
                onClick={migrateLocalData}
                disabled={migrating}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-sm font-medium text-accent-purple hover:bg-accent-purple/20 transition-all disabled:opacity-50"
              >
                {migrating ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                {migrating ? 'Migrating...' : 'Migrate Local to Supabase'}
              </button>
            )}
            <button
              onClick={clearAllData}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} />
              Clear Local Data
            </button>
            <button
              onClick={exportData}
              className="flex items-center gap-1.5 px-4 py-2 bg-glass border border-glass-border rounded-xl text-sm font-medium text-dark-200 hover:bg-glass-hover transition-all"
            >
              <Download size={14} />
              Export JSON
            </button>
          </div>
          {migrationResult && (
            <p className={`text-xs mt-3 ${migrationResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {migrationResult.message}
            </p>
          )}
          <p className="text-xs text-dark-400 mt-3">
            Current storage: <span className="text-dark-200 font-medium capitalize">{mode === 'supabase' ? 'Supabase Cloud' : 'Browser localStorage'}</span>
          </p>
        </SettingsCard>

        {/* About */}
        <SettingsCard
          icon={Server}
          title="About"
          description="JobTracker application information."
        >
          <div className="space-y-2">
            <p className="text-sm text-dark-200">JobTracker v2.0.0</p>
            <p className="text-xs text-dark-400">
              A modern job application tracker built with React, Tailwind CSS, and Supabase backend.
            </p>
          </div>
        </SettingsCard>
      </div>
    </motion.div>
  );
}

function SettingsCard({ icon: Icon, title, description, children, accent = 'blue' }) {
  const accentColors = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-accent-purple/10 text-accent-purple',
    green: 'bg-green-500/10 text-green-400',
  };

  return (
    <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2 rounded-xl flex-shrink-0 ${accentColors[accent] || accentColors.blue}`}>
          <Icon size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-dark-100">{title}</h3>
          <p className="text-xs text-dark-400 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
