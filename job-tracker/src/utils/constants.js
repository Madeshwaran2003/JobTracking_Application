export const STATUS_OPTIONS = [
  { value: 'Applied', label: 'Applied', color: 'blue' },
  { value: 'Assessment', label: 'Assessment', color: 'purple' },
  { value: 'Interview', label: 'Interview', color: 'orange' },
  { value: 'HR Round', label: 'HR Round', color: 'yellow' },
  { value: 'Rejected', label: 'Rejected', color: 'red' },
  { value: 'Offer Received', label: 'Offer Received', color: 'green' },
];

export const STATUS_COLOR_MAP = {
  Applied: {
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#60a5fa',
    border: 'rgba(59, 130, 246, 0.3)',
    dot: '#3b82f6',
  },
  Assessment: {
    bg: 'rgba(139, 92, 246, 0.15)',
    text: '#a78bfa',
    border: 'rgba(139, 92, 246, 0.3)',
    dot: '#8b5cf6',
  },
  Interview: {
    bg: 'rgba(245, 158, 11, 0.15)',
    text: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.3)',
    dot: '#f59e0b',
  },
  'HR Round': {
    bg: 'rgba(234, 179, 8, 0.15)',
    text: '#facc15',
    border: 'rgba(234, 179, 8, 0.3)',
    dot: '#eab308',
  },
  Rejected: {
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#f87171',
    border: 'rgba(239, 68, 68, 0.3)',
    dot: '#ef4444',
  },
  'Offer Received': {
    bg: 'rgba(34, 197, 94, 0.15)',
    text: '#4ade80',
    border: 'rgba(34, 197, 94, 0.3)',
    dot: '#22c55e',
  },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company-asc', label: 'Company A-Z' },
  { value: 'company-desc', label: 'Company Z-A' },
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
