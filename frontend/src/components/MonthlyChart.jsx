import { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ExpenseContext from '../contexts/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyChart = () => {
    const { summary, filters } = useContext(ExpenseContext);

    if (!filters.month) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg font-medium mb-1">Select a Month</p>
                <p className="text-sm text-gray-400 text-center px-4">
                    Choose a month from the filter to see expense breakdown
                </p>
            </div>
        );
    }

    if (!summary || summary.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No expenses for {filters.month}</p>
                <p className="text-sm text-gray-400 mt-1">Add expenses to see the chart</p>
            </div>
        );
    }

    const data = {
        labels: summary.map(s => s._id || 'Uncategorized'),
        datasets: [{
            data: summary.map(s => s.total),
            backgroundColor: [
                '#3B82F6', // blue
                '#10B981', // green
                '#F59E0B', // amber
                '#EF4444', // red
                '#8B5CF6', // purple
                '#EC4899', // pink
                '#06B6D4', // cyan
                '#F97316', // orange
            ].slice(0, summary.length),
            borderWidth: 2,
            borderColor: '#fff',
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        return `${label}: $${value.toFixed(2)}`;
                    }
                }
            }
        }
    };

    return (
        <div className="h-64">
            <Pie data={data} options={options} />
        </div>
    );
};

export default MonthlyChart;