import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ExpenseController } from './expense.controller';

describe('ExpensesController', () => {
  let controller: ExpenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
    }).compile();

    controller = module.get<ExpenseController>(ExpenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
