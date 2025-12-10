import { useState, useContext, useEffect } from 'react';
import ExpenseContext from '../contexts/ExpenseContext';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import ExpenseForm from './ExpenseForm';

const ExpenseList = () => {
    const { expenses, deleteExpense, fetchExpenses, pagination, setPagination } = useContext(ExpenseContext);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, [pagination.page]);

    return (
        <div className="mt-8">
            {editing && <ExpenseForm editingExpense={editing} onCancel={() => setEditing(null)} />}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>


                <tbody>
                    {expenses?.length > 0 ? (
                        expenses.map(exp => (
                            <tr key={exp._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{exp.amount.toFixed(2)}</td>
                                <td className="p-4">{exp.category}</td>
                                <td className="p-4">{new Date(exp.date).toLocaleDateString()}</td>
                                <td className="p-4 text-gray-600">{exp.description || '-'}</td>
                                <td className="p-4 flex space-x-3">
                                    <button onClick={() => setEditing(exp)} className="text-blue-600 hover:text-blue-800">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => deleteExpense(exp._id)} className="text-red-600 hover:text-red-800">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                No expenses found. Add one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} className="px-4 py-2 bg-gray-300 rounded">Prev</button>
                <span>Page {pagination.page}</span>
                <button disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} className="px-4 py-2 bg-gray-300 rounded">Next</button>
            </div>
        </div>
    );
};

export default ExpenseList;