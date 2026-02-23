import { createEmptyDayExpenseReport, addExpenseToDayReport } from './expense-util';

describe('expense-util', () => {
  describe('createEmptyDayExpenseReport', () => {
    it('should create an empty day report with number dailyLimit', () => {
      const result = createEmptyDayExpenseReport('2024-01-01', 50);

      expect(result).toEqual({
        date: '2024-01-01',
        totalAmount: 0,
        expenseCount: 0,
        expenses: [],
        dailyLimit: 50,
        balance: 50,
      });

      // Verify types
      expect(typeof result.dailyLimit).toBe('number');
      expect(typeof result.balance).toBe('number');
    });

    it('should handle string dailyLimit and convert to number', () => {
      const result = createEmptyDayExpenseReport('2024-01-01', 50);

      expect(typeof result.dailyLimit).toBe('number');
      expect(result.dailyLimit).toBe(50);
      expect(typeof result.balance).toBe('number');
      expect(result.balance).toBe(50);
    });

    it('should use default dailyLimit of 0 when not provided', () => {
      const result = createEmptyDayExpenseReport('2024-01-01');

      expect(result.dailyLimit).toBe(0);
      expect(result.balance).toBe(0);
    });
  });

  describe('addExepenseToDayReport', () => {
    it('should add expense and calculate balance correctly', () => {
      const dayReport = createEmptyDayExpenseReport('2024-01-01', 100);
      const expense = {
        id: 'exp-1',
        userId: 'user-1',
        amount: 25,
        description: 'Test expense',
        date: new Date('2024-01-01'),
      };

      const result = addExpenseToDayReport(dayReport, expense);

      expect(result.totalAmount).toBe(25);
      expect(result.expenseCount).toBe(1);
      expect(result.expenses).toHaveLength(1);
      expect(result.balance).toBe(75); // 100 - 25
      expect(typeof result.balance).toBe('number');
    });

    it('should handle multiple expenses and update balance correctly', () => {
      const dayReport = createEmptyDayExpenseReport('2024-01-01', 100);
      const expense1 = {
        id: 'exp-1',
        userId: 'user-1',
        amount: 30,
        description: 'Test expense 1',
        date: new Date('2024-01-01'),
      };

      const expense2 = {
        id: 'exp-2',
        userId: 'user-1',
        amount: 20,
        description: 'Test expense 2',
        date: new Date('2024-01-01'),
      };

      const result1 = addExpenseToDayReport(dayReport, expense1);
      const result2 = addExpenseToDayReport(result1, expense2);

      expect(result2.totalAmount).toBe(50);
      expect(result2.expenseCount).toBe(2);
      expect(result2.expenses).toHaveLength(2);
      expect(result2.balance).toBe(50); // 100 - 50
      expect(typeof result2.balance).toBe('number');
    });
  });
});