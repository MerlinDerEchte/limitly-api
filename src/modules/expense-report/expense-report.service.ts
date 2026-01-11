import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { calculateExpenseSum } from '../expense/utils/calculateExpenseSum';
import { ExpenseReport } from './expense-report';
import { createExpenseReportFromExpenses } from '../expense/utils/createExpenseReportFromExpenses';
import { getSevenDaysAgo } from '../../utils/date-util';

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

  async getLastSevenDaysReport(userId: string): Promise<ExpenseReport> {
    const expenses = await this.expenseService.findAllInLastSevenDays(userId);
    const today = new Date();
    const sevenDaysAgo = getSevenDaysAgo();
    const expenseReport = createExpenseReportFromExpenses(
      expenses,
      sevenDaysAgo,
      today,
    );
    return expenseReport;
  }
}
