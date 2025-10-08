import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
class CreateExpenseDto {
  date: Date;
  amount: number;
  description?: string;
}

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(
      createExpenseDto.date,
      createExpenseDto.amount,
      createExpenseDto.description,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.expenseService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }
}
