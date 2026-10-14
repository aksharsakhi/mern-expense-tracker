import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Housing',
  'Groceries',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other'
];

const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
  'Other'
];

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    note: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Groceries',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        note: initialData.note || ''
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: 'Groceries',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        note: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button className="action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '0.65rem 1rem', background: 'var(--expense-bg)', border: '1px solid var(--expense-border)', color: 'var(--expense-500)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {/* Type Switcher */}
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: formData.type === 'expense' ? 'var(--expense-500)' : 'var(--border-subtle)',
                    background: formData.type === 'expense' ? 'var(--expense-bg)' : 'var(--bg-primary)',
                    color: formData.type === 'expense' ? 'var(--expense-500)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: formData.type === 'income' ? 'var(--income-500)' : 'var(--border-subtle)',
                    background: formData.type === 'income' ? 'var(--income-bg)' : 'var(--bg-primary)',
                    color: formData.type === 'income' ? 'var(--income-500)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount and Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  className="form-input"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Category and Payment Method */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note */}
            <div className="form-group">
              <label className="form-label">Description / Note (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="What was this transaction for?"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={16} />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
