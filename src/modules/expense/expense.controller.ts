import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { UserService } from '../user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
class CreateExpenseDto {
  date: Date;
  amount: number;
  description?: string;
}


@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService, private readonly userService: UserService) { }

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    console.log('Creating expense with data:', createExpenseDto);
    return this.expenseService.create(
      createExpenseDto.date,
      createExpenseDto.amount,
      createExpenseDto.description,
    );
  }

  @Get()
  async findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const auth0Id = req.user.sub; // Auth0 user ID from JWT
    const user = await this.userService.findByAuth0Id(auth0Id);
    return this.expenseService.findOne(id);
  }
}
