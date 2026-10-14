import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Briefcase, 
  Home, 
  ShoppingCart, 
  Coffee, 
  Bus, 
  Zap, 
  Film, 
  HeartPulse, 
  GraduationCap, 
  CircleDollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from './MetricCards';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Salary':
      return <Briefcase size={14} style={{ color: '#10b981' }} />;
    case 'Freelance':
    case 'Investment':
      return <CircleDollarSign size={14} style={{ color: '#6366f1' }} />;
    case 'Housing':
      return <Home size={14} style={{ color: '#ec4899' }} />;
    case 'Groceries':
    case 'Shopping':
      return <ShoppingCart size={14} style={{ color: '#f59e0b' }} />;
    case 'Food & Dining':
      return <Coffee size={14} style={{ color: '#f43f5e' }} />;
    case 'Transportation':
      return <Bus size={14} style={{ color: '#06b6d4' }} />;
    case 'Utilities':
      return <Zap size={14} style={{ color: '#eab308' }} />;
    case 'Entertainment':
      return <Film size={14} style={{ color: '#8b5cf6' }} />;
    case 'Healthcare':
      return <HeartPulse size={14} style={{ color: '#ef4444' }} />;
    case 'Education':
      return <GraduationCap size={14} style={{ color: '#3b82f6' }} />;
    default:
      return <Layers size={14} style={{ color: '#94a3b8' }} />;
  }
};

export default function TransactionTable({
  transactions = [],
  loading = false,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Loading transactions...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-500)', marginBottom: '1rem' }}>
          <Layers size={28} />
        </div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          No Transactions Found
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.25rem auto' }}>
          There are no records matching your current filter criteria. You can create a new transaction or reset filters.
        </p>
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          Add Your First Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Note / Description</th>
            <th>Method</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th style={{ textAlign: 'center', width: '90px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <tr key={tx._id || tx.id}>
                {/* Date */}
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {formatDate(tx.date)}
                </td>

                {/* Type Badge */}
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
                      color: isIncome ? 'var(--income-500)' : 'var(--expense-500)'
                    }}
                  >
                    {isIncome ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {tx.type}
                  </span>
                </td>

                {/* Category */}
                <td>
                  <span className="tx-category-badge">
                    {getCategoryIcon(tx.category)}
                    {tx.category}
                  </span>
                </td>

                {/* Note */}
                <td style={{ maxWidth: '280px', color: tx.note ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {tx.note || '—'}
                </td>

                {/* Payment Method */}
                <td>
                  <span className="payment-tag">
                    {tx.paymentMethod || 'UPI'}
                  </span>
                </td>

                {/* Amount */}
                <td style={{ textAlign: 'right' }}>
                  <span className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </td>

                {/* Action Buttons */}
                <td>
                  <div className="action-btns" style={{ justifyContent: 'center' }}>
                    <button
                      className="action-btn"
                      title="Edit Transaction"
                      onClick={() => onEditTransaction(tx)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete Transaction"
                      onClick={() => onDeleteTransaction(tx)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
