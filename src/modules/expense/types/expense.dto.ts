import type { ExpenseCreationBaseDto } from './expense-creation-base.dto';

export type ExpenseDto = ExpenseCreationBaseDto & {
  id: string;
  userId: string;
};
