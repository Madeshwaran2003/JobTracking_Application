import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MapPin, Calendar, ChevronRight } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import { formatDate } from '../../utils/constants';

export default function MobileCardList({ applications, onSelect }) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            onClick={() => onSelect(app)}
            className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-4 shadow-lg active:scale-[0.98] transition-transform duration-150 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-sm font-bold text-accent-blue flex-shrink-0">
                  {(app.company || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-dark-100 truncate">
                      {app.company || '—'}
                    </span>
                    {app.jobLink && (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-400 hover:text-accent-blue transition-colors flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-dark-300 truncate block">{app.role || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <StatusBadge status={app.status} />
                <ChevronRight size={16} className="text-dark-400" />
              </div>
            </div>

            {/* Compact meta row */}
            <div className="flex items-center gap-3 mt-2.5 ml-[52px]">
              {app.location && (
                <span className="inline-flex items-center gap-1 text-[11px] text-dark-400">
                  <MapPin size={10} />
                  {app.location}
                </span>
              )}
              {app.dateApplied && (
                <span className="inline-flex items-center gap-1 text-[11px] text-dark-400">
                  <Calendar size={10} />
                  {formatDate(app.dateApplied)}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {applications.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-dark-400">No applications found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
