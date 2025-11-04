import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { type AuthRequest } from '../../modules/authz/types/auth-request';
import { ExpenseService } from './expense.service';
import { ExpenseCreationBaseDto } from './types/expense-creation-base.dto';
import { mapExpenseToExpenseDto } from './utils/expense-dto.util';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(
    @Body() createExpenseDto: ExpenseCreationBaseDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    const expenseCreationBase = {
      date: new Date(createExpenseDto.date),
      userId: user.id,
      amount: createExpenseDto.amount,
      description: createExpenseDto.description,
    };
    const createdExpense =
      await this.expenseService.create(expenseCreationBase);
    return mapExpenseToExpenseDto(createdExpense);
  }

  @Get()
  async findAll(@Request() req: AuthRequest) {
    const user = req.user;

    const expenses = await this.expenseService.findAllForUser(user.id);
    return expenses.map((expense) => mapExpenseToExpenseDto(expense));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const user = req.user;
    const expense = await this.expenseService.findOne(id, user.id);
    return mapExpenseToExpenseDto(expense);
  }
}
