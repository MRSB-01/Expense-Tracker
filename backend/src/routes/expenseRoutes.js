const express = require('express');
const protect = require('../middlewares/authMiddleware');
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getSummary,
    exportExpenses,
} = require('../controllers/expenseController');

const router = express.Router();

router.use(protect);

router.post('/', addExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/summary', getSummary);
router.get('/export', exportExpenses);

module.exports = router;