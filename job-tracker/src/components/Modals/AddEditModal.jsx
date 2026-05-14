import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, UserRound, Link, MapPin, Calendar, FileText, ChevronDown } from 'lucide-react';
import { STATUS_OPTIONS } from '../../utils/constants';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-dark-700/50 border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-500 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all duration-200 backdrop-blur-sm';

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

              {/* Status */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-dark-300 mb-1.5">
                  <ChevronDown size={12} />
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-dark-800 text-dark-100">
                      {opt.label}
                    </option>
                  ))}
                </select>
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
                  className="flex-1 px-4 py-2.5 bg-dark-600 hover:bg-dark-500 border border-glass-border rounded-xl text-sm font-medium text-dark-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 rounded-xl text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-200"
                >
                  {editData ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
