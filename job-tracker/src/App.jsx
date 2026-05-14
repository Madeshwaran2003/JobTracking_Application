import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import Layout from './components/Layout/Layout';
import AnalyticsCards from './components/Dashboard/AnalyticsCards';
import ApplicationTable from './components/Dashboard/ApplicationTable';
import EmptyState from './components/Dashboard/EmptyState';
import AddEditModal from './components/Modals/AddEditModal';
import ConfirmDeleteModal from './components/Modals/ConfirmDeleteModal';
import LoadingSpinner from './components/UI/LoadingSpinner';
import SearchBar from './components/UI/SearchBar';
import ToastContainer from './components/UI/Toast';
import { useApplications } from './hooks/useApplications';
import { useToast } from './hooks/useToast';
import { STATUS_OPTIONS, SORT_OPTIONS } from './utils/constants';

export default function App() {
  const {
    applications,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    addApp,
    updateApp,
    deleteApp,
  } = useApplications();

  const { toasts, addToast, removeToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleAdd = async (formData) => {
    try {
      await addApp(formData);
      addToast('Application added successfully!', 'success');
    } catch (err) {
      addToast('Failed to add application.', 'error');
    }
  };

  const handleEdit = async (formData) => {
    if (!editData) return;
    try {
      await updateApp(editData.id, formData);
      addToast('Application updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update application.', 'error');
    }
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApp(deleteTarget.id);
      addToast(`Deleted ${deleteTarget.company || 'application'}`, 'success');
    } catch (err) {
      addToast('Failed to delete application.', 'error');
    }
    setDeleteTarget(null);
  };

  const openEdit = (app) => {
    setEditData(app);
  };

  const openDelete = (app) => {
    setDeleteTarget(app);
  };

  return (
    <Layout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Analytics Cards */}
      <AnalyticsCards stats={stats} />

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4"
      >
        {/* Search */}
        <div className="w-full sm:flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter toggle - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 hover:text-dark-100 hover:bg-glass-hover transition-all"
          >
            <Filter size={14} />
            Filter
          </button>

          {/* Status filter - Desktop */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="hidden sm:block px-3 py-2.5 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 outline-none focus:border-accent-blue/50 hover:bg-glass-hover transition-all appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="All" className="bg-dark-800">All Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-800">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 outline-none focus:border-accent-blue/50 hover:bg-glass-hover transition-all appearance-none cursor-pointer min-w-[140px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-800">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-xs font-medium text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30 transition-shadow whitespace-nowrap"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden flex gap-2 mb-4"
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
          >
            <option value="All" className="bg-dark-800">All Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-800">
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-800">
                {opt.label}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Results count */}
      {applications.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-dark-400">
            Showing <span className="text-dark-200 font-medium">{applications.length}</span>{' '}
            {applications.length === 1 ? 'application' : 'applications'}
            {statusFilter !== 'All' && (
              <span>
                {' '}with status <span className="text-dark-200 font-medium">{statusFilter}</span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-sm">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-glass border border-glass-border rounded-xl text-xs font-medium text-dark-300 hover:text-dark-100 hover:bg-glass-hover transition-all"
          >
            Retry
          </button>
        </div>
      ) : applications.length === 0 && !searchQuery && statusFilter === 'All' ? (
        <EmptyState onAdd={() => setShowAddModal(true)} />
      ) : (
        <ApplicationTable
          applications={applications}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Modals */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        editData={null}
      />

      <AddEditModal
        isOpen={!!editData}
        onClose={() => setEditData(null)}
        onSubmit={handleEdit}
        editData={editData}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        companyName={deleteTarget?.company}
      />
    </Layout>
  );
}
