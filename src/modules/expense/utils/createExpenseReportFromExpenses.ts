import type { ExpenseReport } from '../../expense-report/expense-report';
import type { Expense } from '../types/expense';
import { calculateExpenseSum } from './calculateExpenseSum';

export const createExpenseReportFromExpenses = (
  expenses: Expense[],
  startDate: Date,
  endDate: Date,
): ExpenseReport => {
  const expenseSum = calculateExpenseSum(expenses);
  const expenseReport: ExpenseReport = {
    startDate,
    endDate,
    expenses,
    expenseSum,
  };

  return expenseReport;
};
