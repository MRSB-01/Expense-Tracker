import { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ExpenseContext from '../contexts/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyChart = () => {
    const { summary } = useContext(ExpenseContext);

    const data = {
        labels: summary.map(s => s._id),
        datasets: [{
            data: summary.map(s => s.total),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
    };

    return <div className="mt-8"><Pie data={data} /></div>;
};

export default MonthlyChart;