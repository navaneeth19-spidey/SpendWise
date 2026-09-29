const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require('../controllers/transactionController');

// Secure all transaction routes with the JWT protection middleware
router.use(protect);

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.get('/summary', getTransactionSummary);
router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;