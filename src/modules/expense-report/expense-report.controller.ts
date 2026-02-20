import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { isDateString } from 'class-validator';
import { type AuthRequest } from '../../modules/authz/types/auth-request';

import { ExpenseReportService } from './expense-report.service';

@Controller('expense-report')
export class ExpenseReportController {
  constructor(private readonly expenseReportService: ExpenseReportService) {}

  @Get()
  async getExpenseReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    // Validate ISO 8601 date strings
    if (!isDateString(startDate)) {
      throw new BadRequestException(
        'startDate must be a valid ISO date string',
      );
    }
    if (!isDateString(endDate)) {
      throw new BadRequestException('endDate must be a valid ISO date string');
    }

    // Optional: validate range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new BadRequestException('startDate cannot be after endDate');
    }

    const startDateAsDate = new Date(startDate);
    const endDateAsDate = new Date(endDate);

    return this.expenseReportService.getExpensesReport(
      user.id,
      startDateAsDate,
      endDateAsDate,
    );
  }

  @Get('/last-seven-days')
  async getLastSevenDaysReport(@Request() req: AuthRequest) {
    const user = req.user;
    return this.expenseReportService.getLastSevenDaysReport(user.id);
  }

  @Get('/current-week')
  async getCurrentWeeksReport(@Request() req: AuthRequest) {
    const user = req.user;
    return this.expenseReportService.getCurrentWeeksReport(user.id);
  }

  @Get('/daily')
  async getDailyExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: AuthRequest,
  ) {
    const user = req.user;
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    // Validate ISO 8601 date strings
    if (!isDateString(startDate)) {
      throw new BadRequestException(
        'startDate must be a valid ISO date string',
      );
    }
    if (!isDateString(endDate)) {
      throw new BadRequestException('endDate must be a valid ISO date string');
    }

    // Optional: validate range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new BadRequestException('startDate cannot be after endDate');
    }

    const startDateAsDate = new Date(startDate);
    const endDateAsDate = new Date(endDate);

    return this.expenseReportService.getDailyExpenses(
      user.id,
      startDateAsDate,
      endDateAsDate,
    );
  }
}
