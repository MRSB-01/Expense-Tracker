import { createContext, useState, useContext } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();

    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState([]);
    const [filters, setFilters] = useState({ month: '', category: '' });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchExpenses = async () => {
        if (!user) return;
        const params = new URLSearchParams(filters);
        params.append('page', pagination.page);
        params.append('limit', pagination.limit);

        const { data } = await api.get(`/expenses?${params.toString()}`);
        setExpenses(data.expenses || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
    };

    const fetchSummary = async (month) => {
        if (!month) return;
        const { data } = await api.get(`/expenses/summary?month=${month}`);
        setSummary(data);
    };

    const addExpense = async (expense) => {
        const { data } = await api.post('/expenses', expense);
        setExpenses(prev => [data, ...prev]);
    };

    const updateExpense = async (id, updated) => {
        const { data } = await api.put(`/expenses/${id}`, updated);
        setExpenses(prev => prev.map(exp => exp._id === id ? data : exp));
    };

    const deleteExpense = async (id) => {
        await api.delete(`/expenses/${id}`);
        setExpenses(prev => prev.filter(exp => exp._id !== id));
    };


    const exportToExcel = async (month) => {
        if (!month) {
            toast.error('Please select a month first');
            return;
        }

        try {
            const response = await api.get(`/expenses/export?month=${month}`, {
                responseType: 'blob',
            });


            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `expenses_${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success('Excel exported successfully!');
        } catch (err) {
            toast.error('Failed to export Excel');
            console.error(err);
        }
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            summary,
            filters,
            setFilters,
            pagination,
            setPagination,
            fetchExpenses,
            fetchSummary,
            addExpense,
            updateExpense,
            deleteExpense,
            exportToExcel
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export default ExpenseContext;