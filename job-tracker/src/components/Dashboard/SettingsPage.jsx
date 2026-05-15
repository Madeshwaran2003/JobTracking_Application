import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Moon, Database, CheckCircle2, XCircle,
  Loader2, ExternalLink, Copy, Check, Trash2, Download,
  Server, Shield, Zap, UploadCloud
} from 'lucide-react';
import { isSupabaseConfigured, getSupabase } from '../../lib/supabase';
import { addApplication, getConnectionMode } from '../../services/api';

export default function SettingsPage() {
  const mode = getConnectionMode();
  const isConfigured = isSupabaseConfigured();
  const [testing, setTesting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [migrationResult, setMigrationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

  const copySQL = () => {
    navigator.clipboard.writeText(`-- Job Application Tracker - Supabase Schema

CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  date_applied DATE,
  location TEXT,
  salary TEXT,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(date_applied DESC);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to applications" ON applications
  FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

            {/* Config Values */}
            <div className="space-y-2.5">
              <div>
                <label className="text-xs font-medium text-dark-300 mb-1.5 block">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="text"
                  readOnly
                  value={supabaseUrl || 'Not set'}
                  className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-200 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-dark-300 mb-1.5 block">
                  VITE_SUPABASE_ANON_KEY
                </label>
                <input
                  type="text"
                  readOnly
                  value={supabaseKey ? `${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 8)}` : 'Not set'}
                  className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-200 outline-none font-mono"
                />
              </div>
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

        {/* Setup Guide */}
        {!isConfigured && (
          <SettingsCard
            icon={Database}
            title="Setup Guide — Connect Supabase in 3 Steps"
            description="Follow these steps to connect your app to a real cloud database."
            accent="blue"
          >
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-200">Create a Supabase Project</p>
                  <p className="text-xs text-dark-400 mt-1">
                    Go to{' '}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline inline-flex items-center gap-0.5"
                    >
                      supabase.com/dashboard <ExternalLink size={10} />
                    </a>
                    {' '}and create a new project (free tier). Give it a name like "Job Tracker" and set a database password.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-200">Run the SQL Schema</p>
                  <p className="text-xs text-dark-400 mt-1">
                    In your Supabase dashboard, go to <strong className="text-dark-300">SQL Editor</strong>,
                    paste the schema below, and click <strong className="text-dark-300">Run</strong>. This creates
                    the applications table with proper indexes and security policies.
                  </p>
                  <button
                    onClick={copySQL}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-glass border border-glass-border rounded-lg text-xs font-medium text-dark-200 hover:bg-glass-hover transition-all"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy SQL Schema'}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-200">Add Environment Variables</p>
                  <p className="text-xs text-dark-400 mt-1">
                    In your Supabase dashboard, go to <strong className="text-dark-300">Settings → API</strong>.
                    Copy the <strong className="text-dark-300">Project URL</strong> and <strong className="text-dark-300">anon public</strong> key,
                    then add them to your <code className="text-accent-blue bg-dark-700/50 px-1.5 py-0.5 rounded">.env</code> file:
                  </p>
                  <div className="mt-2 p-3 bg-dark-900 rounded-xl border border-glass-border">
                    <pre className="text-xs text-dark-200 font-mono whitespace-pre-wrap">
{`VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...`}
                    </pre>
                  </div>
                  <p className="text-xs text-dark-400 mt-2">
                    After updating the <code className="text-accent-blue bg-dark-700/50 px-1.5 py-0.5 rounded">.env</code> file,
                    restart the dev server for changes to take effect.
                  </p>
                </div>
              </div>
            </div>
          </SettingsCard>
        )}

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
          icon={Moon}
          title="Appearance"
          description="Customize the look and feel of your dashboard."
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-200">Dark Mode</p>
              <p className="text-xs text-dark-400">Dark theme is enabled by default</p>
            </div>
            <div className="w-10 h-6 bg-accent-blue rounded-full flex items-center px-0.5">
              <div className="w-5 h-5 bg-white rounded-full ml-auto" />
            </div>
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
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-dark-400 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
