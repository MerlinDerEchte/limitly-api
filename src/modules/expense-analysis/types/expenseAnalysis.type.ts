import type { Expense } from '@/modules/expense/types/expense';

export type ExpenseAnalysis = {
  startDate: Date;
  endDate: Date;
  totalExpenses: number;
  averageExpensePerDay: number;
  totalExpenseLimit: number;
  expenseLimitPerDay: number;
  totalSavedAmount: number;
  averageSavedPerDay: number;
  expenses: Expense[];
};
