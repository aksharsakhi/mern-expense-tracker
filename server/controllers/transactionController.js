const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// Helper to construct Date range for a given YYYY-MM
const getMonthDateRange = (monthStr) => {
  if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
    return null;
  }
  const [year, month] = monthStr.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)); // Start of next month
  return { start, end };
};

/**
 * @desc   Get transactions with optional filters (month, category, type, search) and pagination
 * @route  GET /api/transactions
 */
exports.getTransactions = async (req, res, next) => {
  try {
    const { month, type, category, search, sort = 'date_desc', page = 1, limit = 50 } = req.query;
    const query = {};

    // Month filter (e.g. month=2026-10)
    if (month) {
      const range = getMonthDateRange(month);
      if (range) {
        query.date = { $gte: range.start, $lt: range.end };
      }
    }

    // Type filter (income | expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Keyword search in note or category
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ note: searchRegex }, { category: searchRegex }];
    }

    // Sorting options
    let sortOption = { date: -1, createdAt: -1 };
    if (sort === 'date_asc') sortOption = { date: 1, createdAt: 1 };
    if (sort === 'amount_desc') sortOption = { amount: -1 };
    if (sort === 'amount_asc') sortOption = { amount: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) === 0 ? 0 : Math.max(1, parseInt(limit, 10) || 50);

    const totalCount = await Transaction.countDocuments(query);

    let queryExec = Transaction.find(query).sort(sortOption);
    if (limitNum > 0) {
      queryExec = queryExec.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const transactions = await queryExec;

    res.status(200).json({
      success: true,
      count: transactions.length,
      totalCount,
      page: pageNum,
      totalPages: limitNum > 0 ? Math.ceil(totalCount / limitNum) : 1,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single transaction by ID
 * @route  GET /api/transactions/:id
 */
exports.getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid transaction ID format' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new transaction
 * @route  POST /api/transactions
 */
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, paymentMethod, note } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({
        success: false,
        error: 'Amount, type, and category are required fields'
      });
    }

    const transaction = await Transaction.create({
      amount: Number(amount),
      type: type.toLowerCase(),
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
      note: note ? note.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(error);
  }
};

/**
 * @desc   Update an existing transaction
 * @route  PUT /api/transactions/:id
 */
exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid transaction ID format' });
    }

    const updatedData = { ...req.body };
    if (updatedData.amount !== undefined) updatedData.amount = Number(updatedData.amount);
    if (updatedData.type) updatedData.type = updatedData.type.toLowerCase();
    if (updatedData.date) updatedData.date = new Date(updatedData.date);

    const transaction = await Transaction.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(error);
  }
};

/**
 * @desc   Delete transaction by ID
 * @route  DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid transaction ID format' });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      deletedId: id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get comprehensive financial summary via MongoDB Aggregation Pipelines
 * @route  GET /api/transactions/summary
 */
exports.getTransactionSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const matchStage = {};

    let activeMonth = month;
    if (!activeMonth || !/^\d{4}-\d{2}$/.test(activeMonth)) {
      const now = new Date();
      activeMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    const range = getMonthDateRange(activeMonth);
    if (range) {
      matchStage.date = { $gte: range.start, $lt: range.end };
    }

    // Execute Multi-Faceted MongoDB Aggregation Pipeline
    const [summaryResult] = await Transaction.aggregate([
      { $match: matchStage },
      {
        $facet: {
          // 1. Overall Income vs Expense Totals
          totals: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            }
          ],
          // 2. Expenses broken down by Category
          expensesByCategory: [
            { $match: { type: 'expense' } },
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          // 3. Income broken down by Category
          incomeByCategory: [
            { $match: { type: 'income' } },
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          // 4. Daily spending velocity for charting
          dailyTotals: [
            {
              $group: {
                _id: {
                  day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                  type: '$type'
                },
                total: { $sum: '$amount' }
              }
            },
            { $sort: { '_id.day': 1 } }
          ],
          // 5. Payment method distribution
          paymentMethods: [
            {
              $group: {
                _id: '$paymentMethod',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ]
        }
      }
    ]);

    // Parse totals
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    (summaryResult.totals || []).forEach(item => {
      if (item._id === 'income') {
        totalIncome = item.total;
        incomeCount = item.count;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
        expenseCount = item.count;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    // Attach percentages to expenses by category
    const categoryBreakdown = (summaryResult.expensesByCategory || []).map(cat => ({
      category: cat._id,
      total: cat.total,
      count: cat.count,
      percentage: totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
    }));

    // Process daily totals into unified day map
    const dailyMap = {};
    (summaryResult.dailyTotals || []).forEach(item => {
      const day = item._id.day;
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, income: 0, expense: 0 };
      }
      dailyMap[day][item._id.type] = item.total;
    });
    const dailyAnalytics = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      success: true,
      month: activeMonth,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate,
        transactionCount: incomeCount + expenseCount,
        incomeCount,
        expenseCount
      },
      categoryBreakdown,
      incomeCategoryBreakdown: (summaryResult.incomeByCategory || []).map(cat => ({
        category: cat._id,
        total: cat.total,
        count: cat.count
      })),
      dailyAnalytics,
      paymentMethodDistribution: (summaryResult.paymentMethods || []).map(pm => ({
        method: pm._id,
        total: pm.total,
        count: pm.count
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Seed realistic demo transactions for class evaluation
 * @route  POST /api/transactions/seed
 */
exports.seedTransactions = async (req, res, next) => {
  try {
    const { seedSampleData } = require('../seeds/seedData');
    const result = await seedSampleData();
    res.status(200).json({
      success: true,
      message: 'Demo dataset seeded successfully!',
      count: result.length
    });
  } catch (error) {
    next(error);
  }
};
