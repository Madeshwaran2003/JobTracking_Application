import { LogOut, Menu, User } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Track and manage your job applications' },
  applications: { title: 'Applications', subtitle: 'View and manage all your job applications' },
  analytics: { title: 'Analytics', subtitle: 'Insights and trends from your job search' },
  settings: { title: 'Settings', subtitle: 'Customize your JobTracker experience' },
  help: { title: 'Help', subtitle: 'Learn how to use JobTracker effectively' },
};

export default function Navbar({ onMenuToggle, currentPage, user, onSignOut }) {
  const pageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-glass-border bg-dark-800/50 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-dark-300 hover:text-dark-100 hover:bg-glass transition-all duration-200"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-dark-100">{pageInfo.title}</h1>
          <p className="text-xs text-dark-400 hidden sm:block">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-medium text-dark-100 max-w-[180px] truncate">{user?.email}</p>
          <p className="text-[10px] text-dark-400">Signed in</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-glass border border-glass-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
