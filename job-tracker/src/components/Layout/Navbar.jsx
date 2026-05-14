import { Menu, Bell, User } from 'lucide-react';

export default function Navbar({ onMenuToggle, searchQuery, setSearchQuery }) {
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
          <h1 className="text-base font-semibold text-white">Dashboard</h1>
          <p className="text-xs text-dark-400 hidden sm:block">Track and manage your job applications</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-glass transition-all duration-200">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-blue rounded-full" />
        </button>
        <div className="w-px h-6 bg-glass-border mx-1" />
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-glass transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
        </button>
      </div>
    </header>
  );
}
