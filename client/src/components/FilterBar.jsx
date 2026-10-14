import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investment',
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

export default function FilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  totalResults
}) {
  return (
    <div className="glass-card filter-bar">
      <div className="filter-left">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search notes or category..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type Tabs */}
        <div className="type-tabs">
          <button
            className={`type-tab ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('all')}
          >
            All
          </button>
          <button
            className={`type-tab ${typeFilter === 'income' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('income')}
          >
            Income
          </button>
          <button
            className={`type-tab ${typeFilter === 'expense' ? 'active' : ''}`}
            onClick={() => onTypeFilterChange('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="select-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="select-filter"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {totalResults} {totalResults === 1 ? 'record' : 'records'}
        </span>
      </div>
    </div>
  );
}
