import type { Expense } from '../expense/types/expense';

export type ExpenseReport = {
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
  expenseSum: number;
};
