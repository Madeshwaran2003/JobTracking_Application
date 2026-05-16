import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Pencil, Trash2, MapPin, Calendar } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import { formatDate } from '../../utils/constants';

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-glass-border">
              {['Company', 'Role', 'Location', 'Date Applied', 'Status', 'Notes', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="sticky top-0 z-10 bg-dark-700/90 backdrop-blur-sm text-left text-[11px] font-semibold text-dark-300 uppercase tracking-wider px-4 py-3.5 first:pl-5 last:pr-5"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {applications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="group hover:bg-glass-hover transition-colors duration-150 border-b border-glass-border/30 last:border-0"
                >
                  <td className="px-4 py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-xs font-bold text-accent-blue flex-shrink-0">
                        {(app.company || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-dark-100 truncate max-w-[160px]">
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
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-dark-200 truncate block max-w-[180px]">
                      {app.role || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {app.location ? (
                      <div className="flex items-center gap-1.5 text-xs text-dark-300">
                        <MapPin size={12} className="flex-shrink-0 text-dark-400" />
                        <span className="truncate max-w-[120px]">{app.location}</span>
                      </div>
                    ) : (
                      <span className="text-dark-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {app.dateApplied ? (
                      <div className="flex items-center gap-1.5 text-xs text-dark-300">
                        <Calendar size={12} className="flex-shrink-0 text-dark-400" />
                        {formatDate(app.dateApplied)}
                      </div>
                    ) : (
                      <span className="text-dark-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs text-dark-400 truncate block max-w-[150px]"
                      title={app.notes}
                    >
                      {app.notes || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 pr-5">
                    <div className="flex items-center justify-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(app)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(app)}
                        className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
