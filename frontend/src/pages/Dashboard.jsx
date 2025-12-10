import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExpense } from '../contexts/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import MonthlyChart from '../components/MonthlyChart';
import ExportButton from '../components/ExportButton';

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const { expenses, filters, fetchExpenses, fetchSummary } = useExpense(); // Added expenses here
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    // Refresh expenses and summary when filters change
    useEffect(() => {
        const refreshData = async () => {
            await fetchExpenses();
            if (filters.month) {
                await fetchSummary(filters.month);
            }
        };
        refreshData();
    }, [filters.month, filters.category]); // Only depend on filter values

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-2xl font-semibold text-gray-600">Loading...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Tracker</h1>
                            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {user?.name || user?.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ExportButton />
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition shadow-sm hover:shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Expense Card */}
                <section className="mb-10">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
                            <p className="text-blue-100 mt-1">Track your expenses quickly and easily</p>
                        </div>
                        <div className="p-6">
                            <ExpenseForm />
                        </div>
                    </div>
                </section>

                {/* Filters + Chart */}
                <section className="grid lg:grid-cols-3 gap-8 mb-10">
                    {/* Filters */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter Expenses
                                </h2>
                                {filters.month && (
                                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                        Filtered by: {filters.month}
                                    </span>
                                )}
                            </div>
                            <Filters />
                        </div>
                    </div>

                    {/* Monthly Chart */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {filters.month ? `${filters.month} Summary` : 'Monthly Summary'}
                                </h2>
                                {!filters.month && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        Select a month
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-6">
                                {filters.month
                                    ? `Expense breakdown for ${filters.month}`
                                    : 'Select a month to view expense breakdown by category'}
                            </p>
                            <div className="h-64">
                                <MonthlyChart />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expense Table */}
                <section>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                {filters.month ? `Expenses — ${filters.month}` : "All Expenses"}
                            </h2>
                            <span className="text-gray-300 text-sm font-medium">
                                Total: {expenses?.length || 0} expense(s)
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <ExpenseList />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}