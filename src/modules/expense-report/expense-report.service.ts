import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { calculateExpenseSum } from '../expense/utils/calculateExpenseSum';
import { ExpenseReport } from './expense-report';

@Injectable()
export class ExpenseReportService {
  constructor(private readonly expenseService: ExpenseService) {}
  async getExpensesReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseReport> {
    const expenses = await this.expenseService.findAllInDateRange(
      userId,
      startDate,
      endDate,
    );
    const expenseSum = calculateExpenseSum(expenses);
    return {
      startDate,
      endDate,
      expenses,
      expenseSum,
    };
  }
}
