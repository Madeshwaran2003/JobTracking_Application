import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-glass-border flex items-center justify-center backdrop-blur-sm">
          <Briefcase size={40} className="text-accent-blue/60" />
        </div>
        {/* Floating dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent-purple/30 animate-pulse" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-accent-blue/30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-accent-green/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <h3 className="text-lg font-semibold text-dark-100 mb-2">No applications yet</h3>
      <p className="text-sm text-dark-400 text-center max-w-md mb-6">
        Start tracking your job applications by adding your first one. Keep everything organized in one place — from applied to offer received.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-sm font-medium text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30 transition-shadow duration-300"
      >
        Add Your First Application
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
}
