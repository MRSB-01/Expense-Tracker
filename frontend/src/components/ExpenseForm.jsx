// Frontend: src/components/ExpenseForm.js
import { useState, useContext } from 'react';
import ExpenseContext from '../contexts/ExpenseContext';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/solid';

const ExpenseForm = ({ editingExpense, onCancel }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const [formData, setFormData] = useState(editingExpense || { amount: '', category: '', date: '', description: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingExpense) {
      await updateExpense(editingExpense._id, formData);
      onCancel();
    } else {
      await addExpense(formData);
    }
    setFormData({ amount: '', category: '', date: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="p-2 border rounded" required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
      </div>
      <div className="mt-4 flex justify-end">
        {editingExpense && <button type="button" onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
          {editingExpense ? <PencilIcon className="h-5 w-5 mr-2" /> : <PlusIcon className="h-5 w-5 mr-2" />}
          {editingExpense ? 'Update' : 'Add'} Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;