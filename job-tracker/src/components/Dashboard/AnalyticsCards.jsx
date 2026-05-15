import { motion } from 'framer-motion';
import { Briefcase, Users, XCircle, Trophy } from 'lucide-react';

const CARDS = [
  {
    key: 'total',
    label: 'Total Applications',
    icon: Briefcase,
    gradient: 'from-blue-500/20 to-blue-600/5',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    valueColor: 'text-blue-300',
    borderColor: 'border-blue-500/20',
  },
  {
    key: 'interviews',
    label: 'Interviews',
    icon: Users,
    gradient: 'from-amber-500/20 to-amber-600/5',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-300',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    icon: XCircle,
    gradient: 'from-red-500/20 to-red-600/5',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    valueColor: 'text-red-300',
    borderColor: 'border-red-500/20',
  },
  {
    key: 'offers',
    label: 'Offers',
    icon: Trophy,
    gradient: 'from-green-500/20 to-green-600/5',
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-400',
    valueColor: 'text-green-300',
    borderColor: 'border-green-500/20',
  },
];

export default function AnalyticsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {CARDS.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -2, scale: 1.02 }}
          className={`
            relative overflow-hidden rounded-2xl p-4 lg:p-5
            bg-glass border ${card.borderColor}
            backdrop-blur-xl shadow-lg
            bg-gradient-to-br ${card.gradient}
            transition-shadow duration-300 hover:shadow-xl
          `}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 mb-1">{card.label}</p>
              <p className={`text-2xl lg:text-3xl font-bold ${card.valueColor}`}>
                {stats[card.key] ?? 0}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
              <card.icon size={20} className={card.iconColor} />
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{
            background: card.key === 'total' ? '#3b82f6' :
                        card.key === 'interviews' ? '#f59e0b' :
                        card.key === 'rejected' ? '#ef4444' : '#22c55e'
          }} />
        </motion.div>
      ))}
    </div>
  );
}
