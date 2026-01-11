import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './types/expense.entity';
import { UserModule } from '../user/user.module';
import { UserConfigModule } from '../user-config/user-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity]),
    UserModule,
    UserConfigModule,
  ],
  providers: [ExpenseService],
  controllers: [ExpenseController],
  exports: [ExpenseService],
})
export class ExpenseModule {}
