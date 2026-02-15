// expense.service.spec.ts
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { ExpenseService } from './expense.service';
import { ExpenseEntity } from './types/expense.entity';
import { UserConfigService } from '../user-config/user-config.service';
import type { Expense } from './types/expense';
import type { ExpenseCreationBase } from './types/expense-creation-base';
import { mapExpenseEntityToExpense } from './utils/expense-enitity.util';

jest.mock('./utils/expense-enitity.util', () => ({
  mapExpenseEntityToExpense: jest.fn(),
}));

jest.mock('../../utils/date-util', () => ({
  getSevenDaysAgo: jest.fn(),
  getStartDateOfCurrentWeek: jest.fn(),
}));

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repo: jest.Mocked<Repository<ExpenseEntity>>;
  let userConfigService: { findConfigById: jest.Mock };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as any;

  const mockUserConfigService = {
    findConfigById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getRepositoryToken(ExpenseEntity),
          useValue: mockRepo,
        },
        {
          provide: UserConfigService,
          useValue: mockUserConfigService,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    repo = module.get(getRepositoryToken(ExpenseEntity));
    userConfigService = module.get(UserConfigService);
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  it('should create an expense with formatted amount and return mapped expense', async () => {
    const input: ExpenseCreationBase = {
      userId: 'user-1',
      amount: 12.5,
      description: 'Coffee',
      date: new Date('2024-01-01T00:00:00.000Z'),
    };

    const createdEntity: Partial<ExpenseEntity> = {
      userId: input.userId,
      amount: '12.50',
      description: input.description,
      date: input.date,
    };

    const savedEntity: ExpenseEntity = {
      id: 'exp-1',
      userId: input.userId,
      amount: '12.50',
      description: input.description,
      date: input.date,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: null as any,
    };

    const mappedExpense: Expense = {
      id: 'exp-1',
      userId: input.userId,
      amount: 12.5,
      description: input.description,
      date: input.date,
    };

    repo.create.mockReturnValue(createdEntity as ExpenseEntity);
    repo.save.mockResolvedValue(savedEntity);
    (mapExpenseEntityToExpense as jest.Mock).mockReturnValue(mappedExpense);

    const result = await service.create(input);

    expect(repo.create).toHaveBeenCalledWith({
      date: input.date,
      userId: input.userId,
      amount: '12.50',
      description: input.description,
    });
    expect(repo.save).toHaveBeenCalledWith(createdEntity);
    expect(mapExpenseEntityToExpense).toHaveBeenCalledWith(savedEntity);
    expect(result).toEqual(mappedExpense);
  });

  // ---------------------------------------------------------------------------
  // findAllForUser
  // ---------------------------------------------------------------------------
  it('should find all expenses for a user and map them', async () => {
    const userId = 'user-1';
    const entities: ExpenseEntity[] = [
      {
        id: 'exp-1',
        userId,
        amount: '10.00',
        description: 'Test',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null as any,
      },
    ];

    const mapped: Expense[] = [
      {
        id: 'exp-1',
        userId,
        amount: 10,
        description: 'Test',
        date: entities[0].date,
      },
    ];

    repo.find.mockResolvedValue(entities);
    (mapExpenseEntityToExpense as jest.Mock).mockImplementation(
      (entity: ExpenseEntity) => mapped.find((m) => m.id === entity.id),
    );

    const result = await service.findAllForUser(userId);

    expect(repo.find).toHaveBeenCalledWith({ where: { userId } });
    expect(mapExpenseEntityToExpense).toHaveBeenCalledTimes(entities.length);
    expect(result).toEqual(mapped);
  });

  // ---------------------------------------------------------------------------
  // findOne
  // ---------------------------------------------------------------------------
  it('should find one expense by id and user and map it', async () => {
    const userId = 'user-1';
    const id = 'exp-1';

    const entity: ExpenseEntity = {
      id,
      userId,
      amount: '20.00',
      description: 'Groceries',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      user: null as any,
    };

    const mapped: Expense = {
      id,
      userId,
      amount: 20,
      description: 'Groceries',
      date: entity.date,
    };

    repo.findOneBy.mockResolvedValue(entity);
    (mapExpenseEntityToExpense as jest.Mock).mockReturnValue(mapped);

    const result = await service.findOne(id, userId);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id, userId });
    expect(mapExpenseEntityToExpense).toHaveBeenCalledWith(entity);
    expect(result).toEqual(mapped);
  });

  // ---------------------------------------------------------------------------
  // findAllInDateRange
  // ---------------------------------------------------------------------------
  it('should query by date range and map results', async () => {
    const userId = 'user-1';
    const startDate = new Date('2024-01-01T00:00:00.000Z');
    const endDate = new Date('2024-01-07T23:59:59.999Z');

    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const entities: ExpenseEntity[] = [
      {
        id: 'exp-1',
        userId,
        amount: '5.00',
        description: 'Snack',
        date: new Date('2024-01-02T10:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null as any,
      },
    ];

    const mapped: Expense[] = [
      {
        id: 'exp-1',
        userId,
        amount: 5,
        description: 'Snack',
        date: entities[0].date,
      },
    ];

    repo.createQueryBuilder.mockReturnValue(qb as any);
    qb.getMany.mockResolvedValue(entities);
    (mapExpenseEntityToExpense as jest.Mock).mockImplementation(
      (entity: ExpenseEntity) => mapped.find((m) => m.id === entity.id),
    );

    const result = await service.findAllInDateRange(userId, startDate, endDate);

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('expense');
    expect(qb.where).toHaveBeenCalledWith('expense.userId = :userId', {
      userId,
    });
    expect(qb.andWhere).toHaveBeenCalledWith(
      'expense.date BETWEEN :startDate AND :endDate',
      { startDate, endDate },
    );
    expect(result).toEqual(mapped);
  });

  // ---------------------------------------------------------------------------
  // delete
  // ---------------------------------------------------------------------------
  it('should delete an expense successfully', async () => {
    const userId = 'user-1';
    const id = 'exp-1';

    repo.delete.mockResolvedValue({ affected: 1 } as any);

    await service.delete(id, userId);

    expect(repo.delete).toHaveBeenCalledWith({ id, userId });
  });

  it('should throw an error when trying to delete non-existent expense', async () => {
    const userId = 'user-1';
    const id = 'non-existent-expense';

    repo.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.delete(id, userId)).rejects.toThrow(
      'Expense not found or you do not have permission to delete it',
    );

    expect(repo.delete).toHaveBeenCalledWith({ id, userId });
  });
});
