import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { type AuthRequest } from '@/modules/authz/types/auth-request';
import { ExpenseService } from './expense.service';
import { UserService } from '../user/user.service';
class CreateExpenseDto {
  date: Date;
  amount: number;
  description?: string;
}
@Controller('expense')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    return this.expenseService.create(
      createExpenseDto.date,
      user.id,
      createExpenseDto.amount,
      createExpenseDto.description,
    );
  }

  @Get()
  async findAll(@Request() req: AuthRequest) {
    const user = req.user;
    return this.expenseService.findAllForUser(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const user = req.user;
    return this.expenseService.findOne(id, user.id);
  }
}
