import { useExpense } from '../contexts/ExpenseContext';

const Filters = () => {
    const { filters, setFilters, fetchExpenses, fetchSummary } = useExpense();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = async () => {
        await fetchExpenses();
        if (filters.month) {
            await fetchSummary(filters.month);
        }
    };

    const handleReset = async () => {
        setFilters({ month: '', category: '' });
        await fetchExpenses();
        // You might want to fetch an all-time summary here
        // await fetchSummary();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                    </label>
                    <input
                        type="month"
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        placeholder="e.g., Food, Transport"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Filters;