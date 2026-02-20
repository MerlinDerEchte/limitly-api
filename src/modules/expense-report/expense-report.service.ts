import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { calculateExpenseSum } from '../expense/utils/calculateExpenseSum';
import { ExpenseReport } from './expense-report';
import type { Expense } from '../expense/types/expense';
import { createExpenseReportFromExpenses } from '../expense/utils/createExpenseReportFromExpenses';
import {
  getSevenDaysAgo,
  getStartDateOfCurrentWeek,
} from '../../utils/date-util';
import { UserConfigService } from '../user-config/user-config.service';

@Injectable()
export class ExpenseReportService {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly userConfigService: UserConfigService,
  ) { }
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

  async getCurrentWeeksReport(userId: string): Promise<DailyExpense[]> {
    const userConfig = await this.userConfigService.findConfigById(userId);
    const expenses = await this.expenseService.findAllInCurrentWeek(userId);

    // Return just the daily expenses array
    return this.groupExpensesByDay(expenses);
  }


  private groupExpensesByDay(expenses: Expense[]): DailyExpense[] {
    const dailyMap = new Map<string, DailyExpense>();

    expenses.forEach((expense) => {
      const dateKey = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          totalAmount: 0,
          expenseCount: 0,
          expenses: [],
        });
      }

      const dailyExpense = dailyMap.get(dateKey);
      dailyExpense.totalAmount += expense.amount;
      dailyExpense.expenseCount += 1;
      dailyExpense.expenses.push(expense);
    });

    return Array.from(dailyMap.values());
  }
  async getDailyExpenses(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyExpense[]> {
    const expenses = await this.expenseService.findAllInDateRange(
      userId,
      startDate,
      endDate,
    );
    return this.groupExpensesByDay(expenses);
  }
}

export type DailyExpense = {
  date: string; // YYYY-MM-DD format
  totalAmount: number;
  expenseCount: number;
  expenses: Expense[];
};
