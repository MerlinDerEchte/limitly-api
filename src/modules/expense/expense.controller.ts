import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { type AuthRequest } from '../../modules/authz/types/auth-request';
import { ExpenseService } from './expense.service';
import { ExpenseCreationBaseDto } from './types/expense-creation-base.dto';
import { mapExpenseToExpenseDto } from './utils/expense-dto.util';

@ApiTags('expense')
@ApiBearerAuth()
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all expenses for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of expenses' })
  async findAll(@Request() req: AuthRequest) {
    const user = req.user;

    const expenses = await this.expenseService.findAllForUser(user.id);
    return expenses.map((expense) => mapExpenseToExpenseDto(expense));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense details' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const user = req.user;
    const expense = await this.expenseService.findOne(id, user.id);
    return mapExpenseToExpenseDto(expense);
  }
}
