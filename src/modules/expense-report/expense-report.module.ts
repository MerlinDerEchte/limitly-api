import { Module } from '@nestjs/common';
import { ExpenseModule } from '../expense/expense.module';
import { UserModule } from '../user/user.module';
import { ExpenseReportService } from './expense-report.service';
import { ExpenseReportController } from './expense-report.controller';

@Module({
  imports: [ExpenseModule, UserModule],
  providers: [ExpenseReportService],
  controllers: [ExpenseReportController],
})
export class ExpenseReportModule {}
