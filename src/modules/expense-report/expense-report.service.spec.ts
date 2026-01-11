import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ExpenseReportService } from './expense-report.service';
import { ExpenseService } from '../expense/expense.service';
import { UserConfigService } from '../user-config/user-config.service';
import type { ExpenseReport } from './expense-report';
import type { Expense } from '../expense/types/expense';
import { calculateExpenseSum } from '../expense/utils/calculateExpenseSum';
import { createExpenseReportFromExpenses } from '../expense/utils/createExpenseReportFromExpenses';
import {
  getSevenDaysAgo,
  getStartDateOfCurrentWeek,
} from '../../utils/date-util';

// ---- MOCK external util modules ----
jest.mock('../expense/utils/calculateExpenseSum', () => ({
  calculateExpenseSum: jest.fn(),
}));

jest.mock('../expense/utils/createExpenseReportFromExpenses', () => ({
  createExpenseReportFromExpenses: jest.fn(),
}));

jest.mock('../../utils/date-util', () => ({
  getSevenDaysAgo: jest.fn(),
  getStartDateOfCurrentWeek: jest.fn(),
}));

describe('ExpenseReportService', () => {
  let service: ExpenseReportService;
  let expenseService: {
    findAllInDateRange: jest.Mock;
    findAllInLastSevenDays: jest.Mock;
    findAllInCurrentWeek: jest.Mock;
  };
  let userConfigService: { findConfigById: jest.Mock };

  const mockExpenseService = {
    findAllInDateRange: jest.fn(),
    findAllInLastSevenDays: jest.fn(),
    findAllInCurrentWeek: jest.fn(),
  };

  const mockUserConfigService = {
    findConfigById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportService,
        {
          provide: ExpenseService,
          useValue: mockExpenseService,
        },
        {
          provide: UserConfigService,
          useValue: mockUserConfigService,
        },
      ],
    }).compile();

    service = module.get<ExpenseReportService>(ExpenseReportService);
    expenseService = module.get(ExpenseService);
    userConfigService = module.get(UserConfigService);
  });

  // ---------------------------------------------------------------------------
  // getExpensesReport
  // ---------------------------------------------------------------------------
  it('should get expenses in range, sum them, and return an ExpenseReport', async () => {
    const userId = 'user-1';
    const startDate = new Date('2024-01-01T00:00:00.000Z');
    const endDate = new Date('2024-01-10T00:00:00.000Z');

    const expenses: Expense[] = [
      { id: 'e1', userId, amount: 10, description: 'A', date: startDate },
      { id: 'e2', userId, amount: 20, description: 'B', date: endDate },
    ];

    const expenseSum = 30;

    expenseService.findAllInDateRange.mockResolvedValue(expenses);
    (calculateExpenseSum as jest.Mock).mockReturnValue(expenseSum);

    const result = await service.getExpensesReport(userId, startDate, endDate);

    expect(expenseService.findAllInDateRange).toHaveBeenCalledWith(
      userId,
      startDate,
      endDate,
    );
    expect(calculateExpenseSum).toHaveBeenCalledWith(expenses);

    const expected: ExpenseReport = {
      startDate,
      endDate,
      expenses,
      expenseSum,
    };
    expect(result).toEqual(expected);
  });

  // ---------------------------------------------------------------------------
  // getLastSevenDaysReport
  // ---------------------------------------------------------------------------
  it('should build last-seven-days report using expenseService and date utils', async () => {
    const userId = 'user-1';
    const now = new Date('2024-02-10T12:00:00.000Z');
    const sevenDaysAgo = new Date('2024-02-03T12:00:00.000Z');

    jest.useFakeTimers().setSystemTime(now);

    const expenses: Expense[] = [
      { id: 'e1', userId, amount: 5, description: 'Snack', date: sevenDaysAgo },
    ];

    const mockReport: ExpenseReport = {
      startDate: sevenDaysAgo,
      endDate: now,
      expenses,
      expenseSum: 5,
    };

    expenseService.findAllInLastSevenDays.mockResolvedValue(expenses);
    (getSevenDaysAgo as jest.Mock).mockReturnValue(sevenDaysAgo);
    (createExpenseReportFromExpenses as jest.Mock).mockReturnValue(mockReport);

    const result = await service.getLastSevenDaysReport(userId);

    expect(expenseService.findAllInLastSevenDays).toHaveBeenCalledWith(userId);
    expect(getSevenDaysAgo).toHaveBeenCalled();
    expect(createExpenseReportFromExpenses).toHaveBeenCalledWith(
      expenses,
      sevenDaysAgo,
      now,
    );
    expect(result).toEqual(mockReport);

    jest.useRealTimers();
  });

  // ---------------------------------------------------------------------------
  // getCurrentWeeksReport
  // ---------------------------------------------------------------------------
  it('should build current-week report based on userConfig.startDayOfWeek', async () => {
    const userId = 'user-1';
    const now = new Date('2024-02-10T12:00:00.000Z');
    const startOfWeek = new Date('2024-02-05T00:00:00.000Z');

    jest.useFakeTimers().setSystemTime(now);

    const expenses: Expense[] = [
      { id: 'e1', userId, amount: 15, description: 'Groceries', date: now },
    ];

    const userConfig = { startDayOfWeek: 'MONDAY' as any };

    const mockReport: ExpenseReport = {
      startDate: startOfWeek,
      endDate: now,
      expenses,
      expenseSum: 15,
    };

    userConfigService.findConfigById.mockResolvedValue(userConfig);
    expenseService.findAllInCurrentWeek.mockResolvedValue(expenses);
    (getStartDateOfCurrentWeek as jest.Mock).mockReturnValue(startOfWeek);
    (createExpenseReportFromExpenses as jest.Mock).mockReturnValue(mockReport);

    const result = await service.getCurrentWeeksReport(userId);

    expect(userConfigService.findConfigById).toHaveBeenCalledWith(userId);
    expect(expenseService.findAllInCurrentWeek).toHaveBeenCalledWith(userId);
    expect(getStartDateOfCurrentWeek).toHaveBeenCalledWith(
      userConfig.startDayOfWeek,
    );
    expect(createExpenseReportFromExpenses).toHaveBeenCalledWith(
      expenses,
      startOfWeek,
      now,
    );
    expect(result).toEqual(mockReport);

    jest.useRealTimers();
  });
});
