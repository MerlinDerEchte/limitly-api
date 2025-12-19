import { Injectable } from '@nestjs/common';
import { ExpenseService } from '../expense/expense.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ExpenseReportService {
  constructor(
    private readonly userService: UserService,
    private readonly expenseService: ExpenseService,
  ) {}
}
