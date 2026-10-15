import React from 'react';
import { 
  Wallet, 
  Calendar, 
  Plus, 
  Database, 
  Sun, 
  Moon, 
  TrendingUp,
  Download,
  Activity
} from 'lucide-react';

export default function Navbar({
  selectedMonth,
  onMonthChange,
  onOpenAddModal,
  onSeedData,
  isSeeding,
  theme,
  onToggleTheme,
  onExportCSV,
  onOpenDeploymentModal
}) {
  return (
    <header className="navbar">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Wallet size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="brand-title">SpendWise</span>
            <span className="brand-badge">MERN Stack</span>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Month Picker */}
        <div className="month-selector" title="Select Month for Financial Analytics">
          <Calendar size={16} style={{ color: 'var(--primary-500)' }} />
          <input
            type="month"
            className="month-input"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          />
        </div>

        {/* Export CSV */}
        <button 
          className="btn btn-secondary" 
          onClick={onExportCSV} 
          title="Export Month Transactions to CSV"
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        {/* Deployment & DevOps Admin */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenDeploymentModal} 
          title="View Live Deployment, Health & Infrastructure Status"
          style={{ borderColor: 'var(--income-border)', color: 'var(--income-500)', background: 'var(--income-bg)' }}
        >
          <Activity size={16} />
          <span>DevOps & Deploy</span>
        </button>

        {/* Demo Seed Data */}
        <button 
          className="btn btn-secondary" 
          onClick={onSeedData} 
          disabled={isSeeding}
          title="Seed realistic sample transactions for evaluation"
        >
          <Database size={16} />
          <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn-icon" 
          onClick={onToggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Add Transaction Button */}
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>
    </header>
  );
}
