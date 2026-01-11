import e from 'express';
import type { Expense } from '../types/expense';
import { calculateExpenseSum } from './calculateExpenseSum';

describe('calculateExpenseSum', () => {
  const expense1: Expense = {
    date: new Date(),
    amount: 20.3,
    userId: 'user1',
    id: 'expense1',
  };

  const expense2: Expense = {
    date: new Date(),
    amount: 0.8,
    userId: 'user1',
    id: 'expense2',
  };
  const expense3: Expense = {
    date: new Date(),
    amount: 15.2,
    userId: 'user1',
    id: 'expense3',
  };
  it('should return 0 for no expenses', () => {
    const expenses = [];
    const sum = calculateExpenseSum(expenses);
    expect(sum).toBe(0);
  });

  it('should return the correct expense Sum for some expenses', () => {
    const sum = calculateExpenseSum([expense1, expense2, expense3]);
    expect(sum).toBe(36.3);
  });

  it('should correctly sum expense1 + expense2', () => {
    const sum = calculateExpenseSum([expense1, expense2]);
    expect(sum).toBe(21.1);
  });

  it('should correctly sum expense1 + expense3', () => {
    const sum = calculateExpenseSum([expense1, expense3]);
    expect(sum).toBe(35.5);
  });

  it('should correctly sum expense2 + expense3', () => {
    const sum = calculateExpenseSum([expense2, expense3]);
    expect(sum).toBe(16.0);
  });
});
