import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpenseEntity } from './types/expense.entity';
import { ExpenseService } from './expense.service';
import { UserConfigService } from '../user-config/user-config.service';

describe('ExpenseService', () => {
  let service: ExpenseService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserConfigService = {
    getConfigForUser: jest.fn(),
  };

  beforeEach(async () => {
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
