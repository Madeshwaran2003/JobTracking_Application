import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from '../services/api';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadApplications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadApplications]);

  const handleAdd = useCallback(async (application) => {
    const newApp = await addApplication(application);
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  }, []);

  const handleUpdate = useCallback(async (id, updates) => {
    const updated = await updateApplication(id, updates);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
    return updated;
  }, []);

  const handleDelete = useCallback(async (id) => {
    await deleteApplication(id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...applications];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          (app.company || '').toLowerCase().includes(query) ||
          (app.role || '').toLowerCase().includes(query) ||
          (app.location || '').toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0);
        case 'oldest':
          return new Date(a.dateApplied || 0) - new Date(b.dateApplied || 0);
        case 'company-asc':
          return (a.company || '').localeCompare(b.company || '');
        case 'company-desc':
          return (b.company || '').localeCompare(a.company || '');
        default:
          return 0;
      }
    });

    return result;
  }, [applications, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(
      (app) => app.status === 'Interview' || app.status === 'HR Round'
    ).length;
    const rejected = applications.filter((app) => app.status === 'Rejected').length;
    const offers = applications.filter((app) => app.status === 'Offer Received').length;
    return { total, interviews, rejected, offers };
  }, [applications]);

  return {
    applications: filteredAndSorted,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    addApp: handleAdd,
    updateApp: handleUpdate,
    deleteApp: handleDelete,
    refresh: loadApplications,
  };
}
