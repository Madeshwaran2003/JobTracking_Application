import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  LayoutDashboard,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
  { icon: Briefcase, label: 'Applications', page: 'applications' },
  { icon: BarChart3, label: 'Analytics', page: 'analytics' },
  { icon: Settings, label: 'Settings', page: 'settings' },
  { icon: HelpCircle, label: 'Help', page: 'help' },
];

export default function Sidebar({ collapsed, setCollapsed, currentPage, onNavigate }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          fixed lg:relative z-50 h-screen flex flex-col
          bg-dark-800/80 backdrop-blur-xl border-r border-glass-border
          transition-all duration-300
          ${collapsed ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center min-h-16 px-4 border-b border-glass-border">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <ApplyNestLogo compact={collapsed} />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="font-semibold text-dark-100 text-sm leading-tight whitespace-nowrap">APPLYNEST</p>
                  <p className="text-[10px] leading-tight text-dark-300 whitespace-nowrap">Smart Job Tracking</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.page);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setCollapsed(true);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-dark-300 hover:text-dark-100 hover:bg-glass'
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={`flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-dark-400 group-hover:text-dark-200'}`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent-blue rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle - Desktop only */}
        <div className="hidden lg:block px-3 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-glass transition-all duration-200"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function ApplyNestLogo({ compact }) {
  const dots = [
    { cx: 12, cy: 30, fill: 'var(--logo-dot-1)' },
    { cx: 12, cy: 22, fill: 'var(--logo-dot-2)' },
    { cx: 16, cy: 14, fill: 'var(--logo-dot-3)' },
    { cx: 25, cy: 9, fill: 'var(--logo-dot-4)' },
    { cx: 35, cy: 9, fill: 'var(--logo-dot-5)' },
    { cx: 44, cy: 14, fill: 'var(--logo-dot-6)' },
    { cx: 50, cy: 22, fill: 'var(--logo-dot-7)' },
    { cx: 20, cy: 38, fill: 'var(--logo-dot-3)' },
    { cx: 30, cy: 41, fill: 'var(--logo-dot-5)' },
  ];

  return (
    <div
      className={`applynest-logo flex-shrink-0 ${compact ? 'w-10 h-10 p-1.5' : 'w-12 h-12 p-1.5'}`}
      aria-label="ApplyNest logo"
    >
      <svg viewBox="0 0 62 50" role="img" className="w-full h-full">
        <title>ApplyNest</title>
        {dots.map((dot) => (
          <circle key={`${dot.cx}-${dot.cy}`} {...dot} r="5.2" />
        ))}
      </svg>
    </div>
  );
}
