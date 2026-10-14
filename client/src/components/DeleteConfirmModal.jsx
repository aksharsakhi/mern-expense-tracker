import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from './MetricCards';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting = false
}) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--expense-500)' }}>
            <AlertTriangle size={20} />
            <h3 className="modal-title" style={{ color: 'var(--text-primary)' }}>Delete Transaction</h3>
          </div>
          <button className="action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Are you sure you want to permanently delete this transaction? This action cannot be undone.
          </p>

          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600 }}>{transaction.category}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: transaction.type === 'income' ? 'var(--income-500)' : 'var(--expense-500)' }}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
            {transaction.note && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {transaction.note}
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            style={{ background: 'var(--expense-500)', color: 'white' }}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
