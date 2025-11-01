export type Expense = {
  id: string;
  userId: string;
  amount: number;
  description?: string;
  date: Date;
};
