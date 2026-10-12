const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  seedTransactions
} = require('../controllers/transactionController');

// Summary & Seed routes (must precede /:id)
router.get('/summary', getTransactionSummary);
router.post('/seed', seedTransactions);

// Core CRUD routes
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
