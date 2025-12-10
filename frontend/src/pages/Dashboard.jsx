// src/pages/Dashboard.jsx
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
    const { filters, fetchExpenses } = useExpense();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    // Refresh expenses when filters change
    useEffect(() => {
        fetchExpenses();
    }, [filters, fetchExpenses]);

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Tracker</h1>
                        <div className="flex items-center gap-3">
                            <ExportButton />
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition shadow-sm"
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
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                Filter Expenses
                            </h2>
                            <Filters />
                        </div>
                    </div>

                    {/* Monthly Chart */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {filters.month ? (
                                    <span className="text-blue-600">{filters.month}</span>
                                ) : (
                                    "Monthly Summary"
                                )}
                            </h2>
                            <div className="h-64 sm:h-80">
                                <MonthlyChart />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expense Table */}
                <section>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">
                                {filters.month ? `Expenses — ${filters.month}` : "All Expenses"}
                            </h2>
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