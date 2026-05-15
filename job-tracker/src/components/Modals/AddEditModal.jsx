import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, UserRound, Link, MapPin, Calendar, FileText, ChevronDown, Check } from 'lucide-react';
import { STATUS_OPTIONS, STATUS_COLOR_MAP } from '../../utils/constants';

const INITIAL_FORM = {
  company: '',
  role: '',
  jobLink: '',
  location: '',
  dateApplied: new Date().toISOString().split('T')[0],
  status: 'Applied',
  notes: '',
};

export default function AddEditModal({ isOpen, onClose, onSubmit, editData }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [statusOpen, setStatusOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const statusRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setForm({
        company: editData.company || '',
        role: editData.role || '',
        jobLink: editData.jobLink || '',
        location: editData.location || '',
        dateApplied: editData.dateApplied || new Date().toISOString().split('T')[0],
        status: editData.status || 'Applied',
        notes: editData.notes || '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editData, isOpen]);

  // Close status dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all duration-200 backdrop-blur-sm';

  const currentStatusColors = STATUS_COLOR_MAP[form.status] || STATUS_COLOR_MAP['Applied'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-dark-800 border border-glass-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
              <h2 className="text-lg font-semibold text-white">
                {editData ? 'Edit Application' : 'Add Application'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-glass transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Company & Role row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                    <Building2 size={12} />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="e.g. Google"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                    <UserRound size={12} />
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Job Link */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <Link size={12} />
                  Job Link
                </label>
                <input
                  type="url"
                  value={form.jobLink}
                  onChange={(e) => handleChange('jobLink', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* Location & Date row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                    <MapPin size={12} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                    <Calendar size={12} />
                    Date Applied *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dateApplied}
                    onChange={(e) => handleChange('dateApplied', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Custom Status Dropdown */}
              <div ref={statusRef}>
                <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <ChevronDown size={12} />
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all duration-200 cursor-pointer"
                >
                  <span
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: currentStatusColors.bg,
                      color: currentStatusColors.text,
                      border: `1px solid ${currentStatusColors.border}`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentStatusColors.dot }}
                    />
                    {form.status}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-dark-400 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {statusOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 mt-1 w-[calc(100%-48px)] bg-dark-700 border border-glass-border rounded-xl shadow-xl overflow-hidden py-1"
                    >
                      {STATUS_OPTIONS.map((opt) => {
                        const colors = STATUS_COLOR_MAP[opt.value];
                        const isActive = form.status === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              handleChange('status', opt.value);
                              setStatusOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-glass-hover transition-colors duration-150 ${
                              isActive ? 'bg-glass' : ''
                            }`}
                          >
                            <span
                              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: colors.bg,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: colors.dot }}
                              />
                              {opt.label}
                            </span>
                            {isActive && <Check size={14} className="text-accent-blue" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <FileText size={12} />
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional notes..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-dark-600 hover:bg-dark-500 border border-glass-border rounded-xl text-sm font-medium text-dark-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 rounded-xl text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editData ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
