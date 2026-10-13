import React from 'react';
import { 
  WalletCards, 
  ArrowDownRight, 
  ArrowUpRight, 
  PiggyBank, 
  Percent 
} from 'lucide-react';

export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export default function MetricCards({ summary = {} }) {
  const {
    totalIncome = 0,
    totalExpense = 0,
    netBalance = 0,
    savingsRate = 0,
    transactionCount = 0,
    incomeCount = 0,
    expenseCount = 0
  } = summary;

  return (
    <section className="metrics-grid">
      {/* Net Balance Card */}
      <div className="glass-card metric-card balance">
        <div className="metric-header">
          <span className="metric-title">Net Balance</span>
          <div className="metric-icon-wrap">
            <WalletCards size={18} />
          </div>
        </div>
        <div className="metric-amount" style={{ color: netBalance >= 0 ? 'var(--text-primary)' : 'var(--expense-500)' }}>
          {formatCurrency(netBalance)}
        </div>
        <div className="metric-subtext">
          <span>{transactionCount} total recorded transactions</span>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="glass-card metric-card income">
        <div className="metric-header">
          <span className="metric-title">Total Income</span>
          <div className="metric-icon-wrap">
            <ArrowUpRight size={18} />
          </div>
        </div>
        <div className="metric-amount" style={{ color: 'var(--income-500)' }}>
          +{formatCurrency(totalIncome)}
        </div>
        <div className="metric-subtext">
          <span style={{ color: 'var(--income-500)', fontWeight: 600 }}>{incomeCount} credits</span>
          <span>deposited this month</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="glass-card metric-card expense">
        <div className="metric-header">
          <span className="metric-title">Total Expenses</span>
          <div className="metric-icon-wrap">
            <ArrowDownRight size={18} />
          </div>
        </div>
        <div className="metric-amount" style={{ color: 'var(--expense-500)' }}>
          -{formatCurrency(totalExpense)}
        </div>
        <div className="metric-subtext">
          <span style={{ color: 'var(--expense-500)', fontWeight: 600 }}>{expenseCount} debits</span>
          <span>spent this month</span>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="glass-card metric-card savings">
        <div className="metric-header">
          <span className="metric-title">Savings Rate</span>
          <div className="metric-icon-wrap">
            <PiggyBank size={18} />
          </div>
        </div>
        <div className="metric-amount" style={{ color: 'var(--accent-amber)' }}>
          {savingsRate}%
        </div>
        <div style={{ marginTop: '0.4rem', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${Math.min(100, Math.max(0, savingsRate))}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #f59e0b, #10b981)',
              borderRadius: '3px',
              transition: 'width 0.5s ease-out'
            }} 
          />
        </div>
      </div>
    </section>
  );
}
