import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3, CreditCard } from 'lucide-react';
import { formatCurrency } from './MetricCards';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const CATEGORY_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#eab308'  // Yellow
];

export default function AnalyticsCharts({
  categoryBreakdown = [],
  dailyAnalytics = [],
  paymentMethodDistribution = [],
  theme = 'dark'
}) {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // Doughnut Chart Data (Expenses by Category)
  const doughnutData = {
    labels: categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        data: categoryBreakdown.map((item) => item.total),
        backgroundColor: CATEGORY_COLORS.slice(0, categoryBreakdown.length),
        borderColor: isDark ? '#111622' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDark ? '#f8fafc' : '#0f172a',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
          boxWidth: 12,
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(17, 22, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const item = categoryBreakdown[context.dataIndex];
            const pct = item ? item.percentage : 0;
            return ` ${context.label}: ${formatCurrency(val)} (${pct}%)`;
          }
        }
      }
    },
    cutout: '68%'
  };

  // Bar Chart Data (Daily Trend)
  const barData = {
    labels: dailyAnalytics.map((d) => {
      const parts = d.date.split('-');
      return `${parts[1]}/${parts[2]}`;
    }),
    datasets: [
      {
        label: 'Income',
        data: dailyAnalytics.map((d) => d.income || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderRadius: 4
      },
      {
        label: 'Expense',
        data: dailyAnalytics.map((d) => d.expense || 0),
        backgroundColor: 'rgba(244, 63, 94, 0.75)',
        borderRadius: 4
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: "'JetBrains Mono', monospace", size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          callback: (value) => `₹${value >= 1000 ? value / 1000 + 'k' : value}`
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#f8fafc' : '#0f172a',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  };

  return (
    <section className="charts-grid">
      {/* Daily Cashflow Trend */}
      <div className="glass-card chart-card">
        <div className="card-title-row">
          <h3 className="card-title">
            <BarChart3 size={18} style={{ color: 'var(--primary-500)' }} />
            Daily Cashflow & Spending Velocity
          </h3>
        </div>
        <div className="chart-canvas-container">
          {dailyAnalytics.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No transactions recorded for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Expense Breakdown Donut */}
      <div className="glass-card chart-card">
        <div className="card-title-row">
          <h3 className="card-title">
            <PieChart size={18} style={{ color: 'var(--accent-purple)' }} />
            Expense by Category
          </h3>
        </div>
        <div className="chart-canvas-container">
          {categoryBreakdown.length > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No expense categories to display
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
