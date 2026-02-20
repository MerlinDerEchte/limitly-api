import type { Expense } from '../expense/types/expense';

export type ExpenseReport = {
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
  expenseSum: number;
};

export type CurrentWeekReport = DailyExpense[];

export type DailyExpense = {
  date: string; // YYYY-MM-DD format
  totalAmount: number;
  expenseCount: number;
  expenses: Expense[];
};
