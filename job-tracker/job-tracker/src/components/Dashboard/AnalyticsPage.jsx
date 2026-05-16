import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import { STATUS_OPTIONS, STATUS_COLOR_MAP } from '../../utils/constants';

export default function AnalyticsPage({ stats, applications }) {
  const total = stats.total || 0;

  const statusCounts = STATUS_OPTIONS.map((opt) => {
    const count = applications.filter((app) => app.status === opt.value).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { ...opt, count, percentage };
  });

  const responseRate = total > 0
    ? Math.round(((stats.interviews + stats.offers) / total) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: stats.total, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/15' },
          { label: 'Response Rate', value: `${responseRate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/15' },
          { label: 'Interviews', value: stats.interviews, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          { label: 'Offers', value: stats.offers, icon: PieChart, color: 'text-green-400', bg: 'bg-green-500/15' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-dark-400">{card.label}</p>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-dark-100 mb-4">Status Breakdown</h3>
        <div className="space-y-3">
          {statusCounts.map((item) => {
            const colors = STATUS_COLOR_MAP[item.value];
            return (
              <div key={item.value} className="flex items-center gap-3">
                <div className="w-28 flex-shrink-0">
                  <StatusBadge status={item.value} />
                </div>
                <div className="flex-1 h-2.5 bg-dark-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.dot }}
                  />
                </div>
                <span className="text-xs font-medium text-dark-300 w-16 text-right">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-6">
        <h3 className="text-sm font-semibold text-dark-100 mb-4">Recent Applications</h3>
        <div className="space-y-2">
          {applications.slice(0, 5).map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-glass-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold text-accent-blue">
                  {(app.company || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-100">{app.company}</p>
                  <p className="text-xs text-dark-400">{app.role}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-sm text-dark-400 text-center py-6">No applications yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
