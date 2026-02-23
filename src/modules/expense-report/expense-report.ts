import type { Expense } from '../expense/types/expense';

export type ExpenseReport = {
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
  expenseSum: number;
};

export type CurrentWeekReport = DayExpenseReport[];

export type DayExpenseReport = {
  date: string; // YYYY-MM-DD format
  totalAmount: number;
  expenseCount: number;
  expenses: Expense[];
  dailyLimit: number;
  balance: number;
};

export type WeekExpenseReport = {
  startDate: Date;
  endDate: Date;
  expenseCount: number;
  DayExpenseReports: DayExpenseReport[];
  totalAmount: number;
  weeklyLimit: number;
  balance: number;
  maxDayExpenseSum: number;
  dailyLimit: number;
};

export type FourWeeksExpenseReport = {
  weeks: WeekExpenseReport[];
  totalAmount: number;
};
