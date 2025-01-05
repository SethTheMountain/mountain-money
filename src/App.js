import React, { useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [filter, setFilter] = useState({ category: '', date: '' });
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category || !newExpense.date) return;
    setExpenses([...expenses, { ...newExpense, amount: parseFloat(newExpense.amount), isEditing: false }]);
    setNewExpense({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
  };

  const getFilteredExpenses = () => {
    return expenses.filter((expense) => {
      return (
        (filter.category ? expense.category.toLowerCase().includes(filter.category.toLowerCase()) : true) &&
        (filter.date ? expense.date === filter.date : true)
      );
    });
  };

  const calculateTotal = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const toggleEdit = (index) => {
    setExpenses(expenses.map((expense, i) =>
      i === index ? { ...expense, isEditing: !expense.isEditing } : expense
    ));
  };

  const handleEditChange = (index, field, value) => {
    setExpenses(expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: field === 'amount' && value ? parseFloat(value) : value } : expense
    ));
  };

  const saveEdit = (index) => {
    setExpenses(expenses.map((expense, i) =>
      i === index ? { ...expense, isEditing: false } : expense
    ));
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const removeAllExpenses = () => {
    setExpenses([]);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Expense Tracker</h1>
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      <div className="expense-form">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newExpense.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newExpense.category}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleInputChange}
        />
        <div className="button-group">
          <button className="add" onClick={addExpense}>Add Expense</button>
          <button className="remove-all" onClick={removeAllExpenses}>Remove All</button>
        </div>
      </div>

      <div className="filters">
        <h3>Filter Expenses</h3>
        <input
          type="text"
          placeholder="Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      <div className="expense-list">
        <h3>Expenses</h3>
        {getFilteredExpenses().length > 0 ? (
          <ul>
            {getFilteredExpenses().map((expense, index) => (
              <li key={index}>
                {expense.isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => handleEditChange(index, 'description', e.target.value)}
                    />
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => handleEditChange(index, 'amount', e.target.value)}
                    />
                    <input
                      type="text"
                      value={expense.category}
                      onChange={(e) => handleEditChange(index, 'category', e.target.value)}
                    />
                    <input
                      type="date"
                      value={expense.date}
                      onChange={(e) => handleEditChange(index, 'date', e.target.value)}
                    />
                    <div className="button-group">
                      <button className="save" onClick={() => saveEdit(index)}>Save</button>
                      <button className="cancel" onClick={() => toggleEdit(index)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span>
                      {expense.description} - ${expense.amount.toFixed(2)} - {expense.category} - {expense.date}
                    </span>
                    <div className="buttons-container">
                      <button className="edit" onClick={() => toggleEdit(index)}>Edit</button>
                      <button className="remove" onClick={() => removeExpense(index)}>Remove</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses to display</p>
        )}
      </div>

      <h3>Total: ${calculateTotal().toFixed(2)}</h3>
    </div>
  );
}

export default App;
