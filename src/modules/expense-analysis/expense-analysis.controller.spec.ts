import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ExpenseAnalysisController } from './expense-analysis.controller';

describe('ExpenseAnalysisController', () => {
  let controller: ExpenseAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseAnalysisController],
    }).compile();

    controller = module.get<ExpenseAnalysisController>(
      ExpenseAnalysisController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
