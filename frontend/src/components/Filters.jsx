// src/components/Filters.jsx
import { useExpense } from '../contexts/ExpenseContext';

export default function Filters() {
    const { filters, setFilters, fetchExpenses, fetchSummary } = useExpense();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };

        setFilters(newFilters);

        // Trigger fetch immediately when month changes
        if (name === 'month') {
            if (value) fetchSummary(value);
            // Reset page to 1 when filtering
            fetchExpenses({ ...newFilters, page: 1 });
        } else {
            fetchExpenses(newFilters);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <input
                type="month"
                name="month"
                value={filters.month || ''}
                onChange={handleChange}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
                type="text"
                name="category"
                value={filters.category || ''}
                onChange={handleChange}
                placeholder="Filter by category..."
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
        </div>
    );
}