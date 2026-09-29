const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// Secure all transaction routes with the JWT protection middleware
router.use(protect);

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;