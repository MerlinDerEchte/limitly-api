export type ExpenseCreationBase = {
  date: Date;
  userId: string;
  amount: number;
  description?: string;
};
