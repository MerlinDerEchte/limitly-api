import type { ExpenseEntity } from '../types/expense.entity';
import type { Expense } from '../types/expense';

export const mapExpenseEntityToExpense = (entity: ExpenseEntity): Expense => {
  return {
    id: entity.id,
    userId: entity.userId,
    amount: entity.amount,
    description: entity.description,
    date: entity.date,
  };
};
