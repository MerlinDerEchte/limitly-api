import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { type AuthRequest } from '../../modules/authz/types/auth-request';
import { ExpenseService } from './expense.service';
import { ExpenseCreationBaseDto } from './types/expense-creation-base.dto';
import { ExpenseUpdateDto } from './types/expense-update.dto';
import { type ExpenseCreationBase } from './types/expense-creation-base';
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
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to retrieve',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOperation({ summary: 'Get a specific expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense details' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const user = req.user;
    const expense = await this.expenseService.findOne(id, user.id);
    return mapExpenseToExpenseDto(expense);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to update',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOperation({ summary: 'Update an existing expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseUpdateDto,
  })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized to update this expense',
  })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: ExpenseUpdateDto,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;

    const updateData: Partial<ExpenseCreationBase> = {};
    if (updateExpenseDto.date !== undefined) {
      updateData.date = new Date(updateExpenseDto.date);
    }
    if (updateExpenseDto.amount !== undefined) {
      updateData.amount = updateExpenseDto.amount;
    }
    if (updateExpenseDto.description !== undefined) {
      updateData.description = updateExpenseDto.description;
    }

    const updatedExpense = await this.expenseService.update(
      id,
      user.id,
      updateData,
    );
    return mapExpenseToExpenseDto(updatedExpense);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to delete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({ status: 204, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized to delete this expense',
  })
  async delete(@Param('id') id: string, @Request() req: AuthRequest) {
    const user = req.user;
    await this.expenseService.delete(id, user.id);
    // Return 204 No Content for successful deletion
    return null;
  }
}
