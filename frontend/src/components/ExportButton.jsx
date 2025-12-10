// src/components/ExportButton.jsx
import { useExpense } from '../contexts/ExpenseContext';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ExportButton() {
    const { filters, exportToExcel } = useExpense();

    const handleExport = () => {
        if (!filters.month) {
            toast.error('Please select a month to export');
            return;
        }
        exportToExcel(filters.month);
        toast.success('Export started!');
    };

    const isDisabled = !filters.month || filters.month === '';

    return (
        <button
            onClick={handleExport}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-md
        ${isDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                }`}
        >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Export</span>
        </button>
    );
}