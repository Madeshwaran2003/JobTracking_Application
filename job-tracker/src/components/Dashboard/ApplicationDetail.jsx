import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  Building2,
  UserRound,
  FileText,
  Clock,
} from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import { formatDate, STATUS_COLOR_MAP } from '../../utils/constants';

export default function ApplicationDetail({ application, onClose, onEdit, onDelete }) {
  if (!application) return null;

  const app = application;
  const colors = STATUS_COLOR_MAP[app.status] || STATUS_COLOR_MAP['Applied'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-[75] w-full max-w-md bg-dark-800 border-l border-glass-border shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-dark-800/90 backdrop-blur-xl border-b border-glass-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-dark-100">Application Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-glass transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Company header card */}
          <div
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 flex items-center justify-center text-xl font-bold text-accent-blue flex-shrink-0">
                {(app.company || '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-dark-100 truncate">{app.company || '—'}</h2>
                <p className="text-sm text-dark-200 truncate">{app.role || '—'}</p>
                <div className="mt-2">
                  <StatusBadge status={app.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Detail fields */}
          <div className="space-y-4">
            <DetailRow
              icon={Building2}
              label="Company"
              value={app.company}
            />
            <DetailRow
              icon={UserRound}
              label="Role"
              value={app.role}
            />
            {app.jobLink && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-glass border border-glass-border flex-shrink-0">
                  <ExternalLink size={14} className="text-dark-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-dark-400 uppercase tracking-wider mb-0.5">Job Link</p>
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-blue hover:underline break-all"
                  >
                    {app.jobLink}
                  </a>
                </div>
              </div>
            )}
            <DetailRow
              icon={MapPin}
              label="Location"
              value={app.location}
            />
            <DetailRow
              icon={Calendar}
              label="Date Applied"
              value={app.dateApplied ? formatDate(app.dateApplied) : null}
            />
            <DetailRow
              icon={Clock}
              label="Status"
              value={app.status}
              isStatus
            />
            {app.notes && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-glass border border-glass-border flex-shrink-0">
                  <FileText size={14} className="text-dark-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-dark-400 uppercase tracking-wider mb-0.5">Notes</p>
                  <p className="text-sm text-dark-200 whitespace-pre-wrap">{app.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-glass-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onEdit(app);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-glass border border-glass-border rounded-xl text-sm font-medium text-dark-200 hover:bg-glass-hover transition-all duration-200"
            >
              <Pencil size={14} />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onDelete(app);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all duration-200"
            >
              <Trash2 size={14} />
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailRow({ icon: Icon, label, value, isStatus }) {
  if (!value && !isStatus) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-glass border border-glass-border flex-shrink-0">
        <Icon size={14} className="text-dark-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-dark-400 uppercase tracking-wider mb-0.5">{label}</p>
        {isStatus ? (
          <StatusBadge status={value} />
        ) : (
          <p className="text-sm text-dark-200">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}
