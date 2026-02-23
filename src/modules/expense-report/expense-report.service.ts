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
import { generateDayExpenseReports } from './expense-util';

@Injectable()
export class ExpenseReportService {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly userConfigService: UserConfigService,
  ) {}
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

  async getCurrentWeeksExpenseReport(
    userId: string,
  ): Promise<WeekExpenseReport> {
    const expenses = await this.expenseService.findAllInCurrentWeek(userId);
    const userConfig = await this.userConfigService.findConfigById(userId);
    const weekStartDate = getStartDateOfCurrentWeek(userConfig.startDayOfWeek);
    const weekEndDate = new Date();

    // Ensure daily limit is a number (safety check)
    const dailyLimit = Number(userConfig.expenseLimitByDay);
    const dayExpenseReports = generateDayExpenseReports(
      expenses,
      weekStartDate,
      weekEndDate,
      dailyLimit,
    );

    // Calculate the number of days in the week (from start to end date)
    const daysInWeek =
      Math.floor(
        (weekEndDate.getTime() - weekStartDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    const weeklyLimit = dailyLimit * daysInWeek;

    // Calculate max day expense sum
    const maxDayExpenseSum = dayExpenseReports.reduce(
      (max, dayReport) => Math.max(max, dayReport.totalAmount),
      0,
    );

    // Return just the daily expenses array
    const weekExpenseReport = {
      weekStartDate: weekStartDate.toISOString().split('T')[0],
      weekEndDate: weekEndDate.toISOString().split('T')[0],
      totalAmount: calculateExpenseSum(expenses),
      expenseCount: expenses.length,
      dayExpenseReports: dayExpenseReports,
      weeklyLimit: weeklyLimit,
      balance: weeklyLimit - calculateExpenseSum(expenses),
      maxDayExpenseSum: maxDayExpenseSum,
      dailyLimit: dailyLimit,
    };
    return weekExpenseReport;
  }

  async getDayExpenseReports(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DayExpenseReport[]> {
    const expenses = await this.expenseService.findAllInDateRange(
      userId,
      startDate,
      endDate,
    );
    const userConfig = await this.userConfigService.findConfigById(userId);
    return generateDayExpenseReports(
      expenses,
      startDate,
      endDate,
      userConfig.expenseLimitByDay,
    );
  }

  async getTodaysExpenseReport(userId: string): Promise<DayExpenseReport> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const expenses = await this.expenseService.findAllInDateRange(
      userId,
      startOfDay,
      endOfDay,
    );

    const userConfig = await this.userConfigService.findConfigById(userId);
    const dailyLimit = userConfig ? Number(userConfig.expenseLimitByDay) : 0;
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const todayDateKey = now.toISOString().split('T')[0];

    return {
      date: todayDateKey,
      totalAmount: totalAmount,
      expenseCount: expenses.length,
      expenses: expenses,
      dailyLimit: dailyLimit,
      balance: dailyLimit - totalAmount,
    };
  }

  async;
}

export type DayExpenseReport = {
  date: string; // YYYY-MM-DD format
  totalAmount: number;
  expenseCount: number;
  expenses: Expense[];
  dailyLimit: number;
  balance: number;
};

export type WeekExpenseReport = {
  weekStartDate: string; // YYYY-MM-DD format
  weekEndDate: string; // YYYY-MM-DD format
  totalAmount: number;
  expenseCount: number;
  dayExpenseReports: DayExpenseReport[];
  weeklyLimit: number;
  balance: number;
  maxDayExpenseSum: number;
  dailyLimit: number;
};
