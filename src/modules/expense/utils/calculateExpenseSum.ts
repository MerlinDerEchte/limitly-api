import type { Expense } from '../types/expense';

export const calculateExpenseSum = (expenses: Expense[]): number => {
  const expenseSum = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return expenseSum;
};
