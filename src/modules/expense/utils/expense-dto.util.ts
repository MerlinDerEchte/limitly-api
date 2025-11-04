import type { Expense } from '../types/expense';
import type { ExpenseDto } from '../types/expense.dto';

export const mapExpenseToExpenseDto = (expense: Expense): ExpenseDto => {
  return {
    id: expense.id,
    userId: expense.userId,
    amount: expense.amount,
    date: expense.date.toISOString(),
    description: expense.description,
  };
};
