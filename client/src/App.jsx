import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import AnalyticsCharts from './components/AnalyticsCharts';
import FilterBar from './components/FilterBar';
import TransactionTable from './components/TransactionTable';
import TransactionFormModal from './components/TransactionFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DeploymentStatusModal from './components/DeploymentStatusModal';
import { 
  fetchTransactions, 
  fetchSummary, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  seedDemoData 
} from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('spendwise_theme') || 'dark';
  });

  // Active Month (default to October 2026 for evaluation)
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  // Summary and Transactions state
  const [summaryData, setSummaryData] = useState({
    summary: {},
    categoryBreakdown: [],
    dailyAnalytics: [],
    paymentMethodDistribution: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendwise_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load summary and transactions
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, txRes] = await Promise.all([
        fetchSummary(selectedMonth),
        fetchTransactions({
          month: selectedMonth,
          type: typeFilter,
          category: categoryFilter,
          search,
          sort: sortBy,
          limit: 100
        })
      ]);

      setSummaryData({
        summary: sumRes.summary || {},
        categoryBreakdown: sumRes.categoryBreakdown || [],
        dailyAnalytics: sumRes.dailyAnalytics || [],
        paymentMethodDistribution: sumRes.paymentMethodDistribution || []
      });
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast(err.message || 'Failed to load records', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, typeFilter, categoryFilter, search, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, formData);
        showToast('Transaction updated successfully');
      } else {
        await createTransaction(formData);
        showToast('Transaction recorded successfully');
      }
      setIsFormModalOpen(false);
      setEditingTransaction(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTransaction._id);
      showToast('Transaction deleted');
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed sample transactions
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await seedDemoData();
      showToast(res.message || 'Sample evaluation data loaded');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Export transactions to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Note'];
    const rows = transactions.map((tx) => [
      new Date(tx.date).toISOString().split('T')[0],
      tx.type,
      `"${tx.category}"`,
      tx.amount,
      `"${tx.paymentMethod}"`,
      `"${(tx.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SpendWise_Transactions_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${transactions.length} transactions as CSV`);
  };

  return (
    <>
      <Navbar
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsFormModalOpen(true);
        }}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExportCSV={handleExportCSV}
        onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
      />

      <main className="app-container">
        {/* Metric Cards (Balance, Income, Expense, Savings Rate) */}
        <MetricCards summary={summaryData.summary} />

        {/* Analytics & Data Visualization Charts */}
        <AnalyticsCharts
          categoryBreakdown={summaryData.categoryBreakdown}
          dailyAnalytics={summaryData.dailyAnalytics}
          paymentMethodDistribution={summaryData.paymentMethodDistribution}
          theme={theme}
        />

        {/* Filters and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          totalResults={transactions.length}
        />

        {/* Transaction History Table */}
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onEditTransaction={(tx) => {
            setEditingTransaction(tx);
            setIsFormModalOpen(true);
          }}
          onDeleteTransaction={(tx) => {
            setDeletingTransaction(tx);
            setIsDeleteModalOpen(true);
          }}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsFormModalOpen(true);
          }}
        />
      </main>

      {/* Add / Edit Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTransaction(null);
        }}
        onConfirm={handleDeleteConfirm}
        transaction={deletingTransaction}
        isDeleting={isDeleting}
      />

      {/* Deployment & Infrastructure Admin Status Modal */}
      <DeploymentStatusModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} style={{ color: 'var(--income-500)' }} />
          ) : (
            <AlertCircle size={18} style={{ color: 'var(--expense-500)' }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
