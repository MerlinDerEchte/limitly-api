import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ExpenseAnalysisService } from './expense-analysis.service';

describe('ExpenseAnalysisService', () => {
  let service: ExpenseAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseAnalysisService],
    }).compile();

    service = module.get<ExpenseAnalysisService>(ExpenseAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
