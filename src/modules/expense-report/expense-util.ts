import type { Expense } from '../expense/types/expense';
import type { DayExpenseReport } from './expense-report';

export const createEmptyDayExpenseReport = (
  date: string,
  dailyLimit: number = 0,
): DayExpenseReport => ({
  date,
  totalAmount: 0,
  expenseCount: 0,
  expenses: [],
  dailyLimit,
  balance: dailyLimit, // balance = limit - totalAmount (0 when empty)
});

export const addExpenseToDayReport = (
  dayReport: DayExpenseReport,
  expense: Expense,
): DayExpenseReport => {
  const newTotalAmount = dayReport.totalAmount + expense.amount;
  return {
    ...dayReport,
    totalAmount: newTotalAmount,
    expenseCount: dayReport.expenseCount + 1,
    expenses: [...dayReport.expenses, expense],
    balance: dayReport.dailyLimit - newTotalAmount,
  };
};

export function generateDayExpenseReports(
  expenses: Expense[],
  startDate?: Date,
  endDate?: Date,
  dailyLimit: number = 0,
): DayExpenseReport[] {
  const dailyMap = new Map<string, DayExpenseReport>();

  // If startDate and endDate are provided, generate empty reports for all days in range
  if (startDate && endDate) {
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      dailyMap.set(dateKey, createEmptyDayExpenseReport(dateKey, dailyLimit));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Add expenses to the appropriate day reports
  expenses.forEach((expense) => {
    const dateKey = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, createEmptyDayExpenseReport(dateKey, dailyLimit));
    }

    const dayExpenseReport = dailyMap.get(dateKey);
    dailyMap.set(dateKey, addExpenseToDayReport(dayExpenseReport, expense));
  });

  return Array.from(dailyMap.values());
}

export function generateDaysInWeek(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const currentDate = new Date(startDate);

  // Reset time to start of day
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}
