import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { calculateExpenseSum } from '../expense/utils/calculateExpenseSum';
import { ExpenseReport } from './expense-report';
import { createExpenseReportFromExpenses } from '../expense/utils/createExpenseReportFromExpenses';
import { getSevenDaysAgo, getStartDateOfCurrentWeek } from '../../utils/date-util';
import { UserConfigService } from '../user-config/user-config.service';

@Injectable()
export class ExpenseReportService {
  constructor(private readonly expenseService: ExpenseService, private readonly userConfigService: UserConfigService) { }
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
    const now = new Date();
    const sevenDaysAgo = getSevenDaysAgo();
    const expenseReport = createExpenseReportFromExpenses(
      expenses,
      sevenDaysAgo,
      now,
    );
    return expenseReport;
  }

  async getCurrentWeeksReport(userId: string): Promise<ExpenseReport> {
    const userConfig = await this.userConfigService.findConfigById(userId);
    const expenses = await this.expenseService.findAllInCurrentWeek(userId);
    const now = new Date()
    const startOfCurrentWeek = getStartDateOfCurrentWeek(userConfig.startDayOfWeek);
    const expenseReport = createExpenseReportFromExpenses(
      expenses,
      startOfCurrentWeek,
      now
    )
    return expenseReport
  }
}
