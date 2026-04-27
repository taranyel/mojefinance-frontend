import React, { useState, useEffect } from 'react';
import { BUDGET_CATEGORIES } from '../constants/categories';

const BudgetModal = ({ isOpen, onClose, onSave, editingBudget }) => {
    const [formData, setFormData] = useState({ category: '', amount: '', startDate: '' });

    useEffect(() => {
        if (editingBudget) {
            setFormData({
                category: editingBudget.category,
                amount: editingBudget.amount.value,
                startDate: editingBudget.startDate || ''
            });
        } else {
            setFormData({ category: '', amount: '', startDate: '' });
        }
    }, [editingBudget, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, editingBudget?.budgetId);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-budgeting">
                <h3>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            required
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {BUDGET_CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount (CZK)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date (Optional)</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Save Budget
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetModal;