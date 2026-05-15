import { motion } from 'framer-motion';
import { Briefcase, Globe, Moon, Bell, Database, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Google Sheets Connection */}
        <SettingsCard
          icon={Database}
          title="Google Sheets Connection"
          description="Connect your Google Sheet as the backend database for your job applications."
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-dark-300 mb-1.5 block">API URL</label>
              <input
                type="text"
                readOnly
                value={import.meta.env.VITE_API_URL || 'Not configured — using localStorage'}
                className="w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-200 outline-none"
              />
            </div>
            <p className="text-xs text-dark-400">
              {!import.meta.env.VITE_API_URL
                ? 'No API URL configured. Applications are stored in your browser\'s localStorage.'
                : 'Connected to Google Apps Script backend.'}
            </p>
          </div>
        </SettingsCard>

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
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                  localStorage.removeItem('job-tracker-applications');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              Clear All Data
            </button>
            <button
              onClick={() => {
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
              }}
              className="px-4 py-2 bg-glass border border-glass-border rounded-xl text-sm font-medium text-dark-200 hover:bg-glass-hover transition-all"
            >
              Export Data
            </button>
          </div>
        </SettingsCard>

        {/* About */}
        <SettingsCard
          icon={Globe}
          title="About"
          description="JobTracker application information."
        >
          <div className="space-y-2">
            <p className="text-sm text-dark-200">JobTracker v1.0.0</p>
            <p className="text-xs text-dark-400">
              A modern job application tracker built with React, Tailwind CSS, and Google Sheets backend.
            </p>
          </div>
        </SettingsCard>
      </div>
    </motion.div>
  );
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-accent-blue/10 flex-shrink-0">
          <Icon size={16} className="text-accent-blue" />
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
