import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { useFormatAmount } from '../hooks';
import { BUDGET_CATEGORIES } from '../constants/categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashCan, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import '../styles/Budgeting.css';

// Helper function to safely calculate and format the date range
const getBudgetPeriod = (startDateStr) => {
    if (!startDateStr) return 'No date set';

    const start = new Date(startDateStr);
    const end = new Date(start);

    // Target the next month
    const expectedMonth = (start.getMonth() + 1) % 12;
    end.setMonth(start.getMonth() + 1);

    // JS Rollover protection (e.g., Jan 31 -> Mar 3). Clamp to end of Feb.
    if (end.getMonth() !== expectedMonth) {
        end.setDate(0);
    }

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
};

const Budgeting = () => {
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        startDate: ''
    });

    const formatAmount = useFormatAmount();
    const fetchedRef = useRef(false);

    const loadBudgets = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchBudgets();
            setBudgets(data || []);
        } catch (err) {
            console.error("Failed to load budgets", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        loadBudgets();
    }, [loadBudgets]);

    const handleOpenModal = (budget = null) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                category: budget.category,
                amount: budget.amount.value,
                startDate: budget.startDate || ''
            });
        } else {
            setEditingBudget(null);
            setFormData({ category: '', amount: '', startDate: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalStartDate = formData.startDate;
        if (!finalStartDate) {
            const now = new Date();
            finalStartDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        }

        const budgetData = {
            category: formData.category,
            amount: { value: parseFloat(formData.amount), currency: 'CZK' },
            startDate: finalStartDate,
            ...(editingBudget && { budgetId: editingBudget.budgetId })
        };

        const payload = {
            budget: budgetData
        };

        try {
            if (editingBudget) {
                await updateBudget(payload);
            } else {
                await createBudget(payload);
            }
            setIsModalOpen(false);

            fetchedRef.current = false;
            loadBudgets();
        } catch (err) {
            console.error("Payload error:", err);
            alert("Error saving budget. Check console for details.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await deleteBudget(id);
                loadBudgets();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    // Trust the backend for the global warning banner
    const exceededBudgets = budgets.filter(b => b.budgetStatus === 'EXCEEDED');

    // --- NEW: Sort budgets so EXCEEDED ones appear first ---
    const sortedBudgets = [...budgets].sort((a, b) => {
        if (a.budgetStatus === 'EXCEEDED' && b.budgetStatus !== 'EXCEEDED') return -1;
        if (a.budgetStatus !== 'EXCEEDED' && b.budgetStatus === 'EXCEEDED') return 1;
        return 0;
    });

    return (
        <div className="budgeting-container">
            <div className="budgeting-header" style={{ justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <FontAwesomeIcon icon={faPlus} /> New Budget
                </button>
            </div>

            {isLoading ? (
                <div className="loading-message">Loading budgets...</div>
            ) : (
                <>
                    {/* Global Alert Banner */}
                    {exceededBudgets.length > 0 && (
                        <div className="budget-alerts-banner">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <div>
                                <strong>Warning:</strong> You have exceeded your budget in {exceededBudgets.length} categor{exceededBudgets.length === 1 ? 'y' : 'ies'}:{' '}
                                {exceededBudgets.map(b => BUDGET_CATEGORIES.find(c => c.value === b.category)?.label || b.category).join(', ')}.
                            </div>
                        </div>
                    )}

                    <div className="budget-grid">
                        {/* --- NEW: Mapping over sortedBudgets instead of budgets --- */}
                        {sortedBudgets.map(budget => {
                            const limit = parseFloat(budget.amount?.value || 0);
                            const spent = parseFloat(budget.spentAmount?.value || 0);

                            const percent = limit > 0 ? Math.min((Math.abs(spent) / Math.abs(limit)) * 100, 100) : 0;
                            const isExceeded = budget.budgetStatus === 'EXCEEDED';

                            return (
                                <div key={budget.budgetId} className={`budget-card ${isExceeded ? 'exceeded' : ''}`}>
                                    <div className="budget-card-top">
                                        <div>
                                            <div className="budget-cat-label">
                                                {BUDGET_CATEGORIES.find(c => c.value === budget.category)?.label || budget.category}
                                            </div>
                                            <div className="budget-dates">
                                                {getBudgetPeriod(budget.startDate)}
                                            </div>
                                        </div>
                                        <div className="budget-actions">
                                            <button onClick={() => handleOpenModal(budget)}><FontAwesomeIcon icon={faPen} /></button>
                                            <button onClick={() => handleDelete(budget.budgetId)}><FontAwesomeIcon icon={faTrashCan} /></button>
                                        </div>
                                    </div>

                                    <div className="budget-amounts">
                                        <span className={`spent ${isExceeded ? 'text-red' : ''}`}>
                                            {formatAmount(budget.spentAmount)}
                                        </span>
                                        <span className="limit">of {formatAmount(budget.amount)}</span>
                                    </div>

                                    <div className="progress-container">
                                        <div className="progress-bar" style={{ width: `${percent}%` }}></div>
                                    </div>

                                    {isExceeded && (
                                        <div className="exceeded-tag">
                                            <FontAwesomeIcon icon={faTriangleExclamation} /> Over budget
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-budgeting">
                        <h3>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
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
                                    onChange={e => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Save Budget
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budgeting;