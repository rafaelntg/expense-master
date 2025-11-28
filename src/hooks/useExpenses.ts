import { useState, useEffect, useMemo } from 'react';
import { Expense, Category } from '@/types/expense';
import { isSameMonth } from 'date-fns';

const STORAGE_KEY = 'expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((expense: Expense) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt),
      }));
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchesMonth = isSameMonth(new Date(expense.date), selectedMonth);
      return matchesCategory && matchesMonth;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedCategory, selectedMonth]);

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    addExpense,
    deleteExpense,
  };
}
