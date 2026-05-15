import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300 group-focus-within:text-accent-blue transition-colors"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by company, role, or location..."
        className="w-full pl-9 pr-9 py-2.5 bg-glass border border-glass-border rounded-xl text-sm text-dark-100 placeholder-dark-400 outline-none focus:border-accent-blue/50 focus:bg-glass-hover transition-all duration-200 backdrop-blur-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
