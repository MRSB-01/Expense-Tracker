const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');

const addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
    try {
        const expense = new Expense({ ...req.body, user: req.user._id });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getExpenses = async (req, res) => {
    const { month, category, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (month) {
        const [year, mon] = month.split('-');
        query.date = {
            $gte: new Date(`${year}-${mon}-01`),
            $lt: new Date(`${year}-${mon}-01`).setMonth(parseInt(mon)),
        };
    }
    if (category) query.category = category;
    try {
        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Expense.countDocuments(query);
        res.json({ expenses, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    if (req.body.amount && req.body.amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
    try {
        const expense = await Expense.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSummary = async (req, res) => {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Month required' });
    const [year, mon] = month.split('-');
    const match = {
        user: req.user._id,
        date: {
            $gte: new Date(`${year}-${mon}-01`),
            $lt: new Date(`${year}-${mon}-01`).setMonth(parseInt(mon)),
        },
    };
    try {
        const summary = await Expense.aggregate([
            { $match: match },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
        ]);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const exportExpenses = async (req, res) => {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Month required' });
    const [year, mon] = month.split('-');
    const query = {
        user: req.user._id,
        date: {
            $gte: new Date(`${year}-${mon}-01`),
            $lt: new Date(`${year}-${mon}-01`).setMonth(parseInt(mon)),
        },
    };
    try {
        const expenses = await Expense.find(query).sort({ date: -1 });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenses');
        worksheet.columns = [
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Description', key: 'description', width: 30 },
        ];
        worksheet.addRows(expenses);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=expenses_${month}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense, getSummary, exportExpenses };