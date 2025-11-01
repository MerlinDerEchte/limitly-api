import { Module } from '@nestjs/common';
import { ExpenseAnalysisService } from './expense-analysis.service';
import { ExpenseAnalysisController } from './expense-analysis.controller';

@Module({
  controllers: [ExpenseAnalysisController],
  providers: [ExpenseAnalysisService],
})
export class ExpenseAnalysisModule { }
