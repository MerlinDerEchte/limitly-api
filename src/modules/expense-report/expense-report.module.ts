import { Module } from '@nestjs/common';
import { ExpenseModule } from '../expense/expense.module';
import { UserModule } from '../user/user.module';
import { ExpenseReportService } from './expense-report.service';
import { ExpenseReportController } from './expense-report.controller';
import { UserConfigModule } from '../user-config/user-config.module';

@Module({
  imports: [ExpenseModule, UserModule, UserConfigModule],
  providers: [ExpenseReportService],
  controllers: [ExpenseReportController],
})
export class ExpenseReportModule {}
