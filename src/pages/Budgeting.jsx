import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { useFormatAmount } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BudgetAlertBanner from '../components/BudgetAlertBanner';
import BudgetCard from '../components/BudgetCard';
import BudgetModal from '../components/BudgetModal';

import '../styles/Budgeting.css';

const Budgeting = () => {
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

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
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    const handleSaveBudget = async (formData, budgetId) => {
        let finalStartDate = formData.startDate;
        if (!finalStartDate) {
            const now = new Date();
            finalStartDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        }

        const budgetData = {
            category: formData.category,
            amount: { value: parseFloat(formData.amount), currency: 'CZK' },
            startDate: finalStartDate,
            ...(budgetId && { budgetId })
        };

        try {
            if (budgetId) {
                await updateBudget({ budget: budgetData });
            } else {
                await createBudget({ budget: budgetData });
            }
            handleCloseModal();
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

    const exceededBudgets = budgets.filter(b => b.budgetStatus === 'EXCEEDED');

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
                    <BudgetAlertBanner exceededBudgets={exceededBudgets} />

                    <div className="budget-grid">
                        {sortedBudgets.map(budget => (
                            <BudgetCard
                                key={budget.budgetId}
                                budget={budget}
                                formatAmount={formatAmount}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </>
            )}

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBudget}
                editingBudget={editingBudget}
            />
        </div>
    );
};

export default Budgeting;