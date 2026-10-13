/**
 * SpendWise API Client Service Layer
 * Connects frontend React components to backend RESTful endpoints
 */

const API_BASE = '/api/transactions';

export const fetchTransactions = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.month) query.append('month', params.month);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page);
  if (params.limit !== undefined) query.append('limit', params.limit);

  const url = `${API_BASE}?${query.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch transactions');
  }
  return data;
};

export const fetchSummary = async (month) => {
  const query = month ? `?month=${month}` : '';
  const response = await fetch(`${API_BASE}/summary${query}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch financial summary');
  }
  return data;
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create transaction');
  }
  return data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update transaction');
  }
  return data;
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete transaction');
  }
  return data;
};

export const seedDemoData = async () => {
  const response = await fetch(`${API_BASE}/seed`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to seed sample data');
  }
  return data;
};
