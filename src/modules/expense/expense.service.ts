import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './types/expense.entity';
import { Expense } from './types/expense';
import { mapExpenseEntityToExpense } from './utils/expense-enitity.util';
import { ExpenseCreationBase } from './types/expense-creation-base';
import {
  getSevenDaysAgo,
  getStartDateOfCurrentWeek,
} from '../../utils/date-util';
import { UserConfigService } from '../user-config/user-config.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expensesRepository: Repository<ExpenseEntity>,
    private userConfigService: UserConfigService,
  ) {}

  async create(expenseCreationBase: ExpenseCreationBase): Promise<Expense> {
    const expenseEntity = this.expensesRepository.create({
      date: expenseCreationBase.date,
      userId: expenseCreationBase.userId,
      amount: expenseCreationBase.amount.toFixed(2),
      description: expenseCreationBase.description,
    });

    const savedExpenseEntity =
      await this.expensesRepository.save(expenseEntity);
    const savedExpense = mapExpenseEntityToExpense(savedExpenseEntity);
    return savedExpense;
  }

  async findAllForUser(userId: string): Promise<Expense[]> {
    const expenseEntites = await this.expensesRepository.find({
      where: { userId },
    });
    return expenseEntites.map((entity) => mapExpenseEntityToExpense(entity));
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expenseEntity = await this.expensesRepository.findOneBy({
      id,
      userId,
    });
    return mapExpenseEntityToExpense(expenseEntity);
  }

  async findAllInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Expense[]> {
    const expenseEntities = await this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return expenseEntities.map((entity) => mapExpenseEntityToExpense(entity));
  }

  async findAllInLastSevenDays(userId: string): Promise<Expense[]> {
    const today = new Date();
    const sevenDaysAgo = getSevenDaysAgo();
    return this.findAllInDateRange(userId, sevenDaysAgo, today);
  }

  async findAllInCurrentWeek(userId: string): Promise<Expense[]> {
    const now = new Date();
    const userConfig = await this.userConfigService.findConfigById(userId);
    const startOfCurrentWeek = getStartDateOfCurrentWeek(
      userConfig.startDayOfWeek,
    );
    return this.findAllInDateRange(userId, startOfCurrentWeek, now);
  }

  async update(
    id: string,
    userId: string,
    updateData: Partial<ExpenseCreationBase>,
  ): Promise<Expense> {
    const expenseEntity = await this.expensesRepository.findOneBy({
      id,
      userId,
    });

    if (!expenseEntity) {
      throw new Error('Expense not found');
    }

    // Update the entity with new data
    if (updateData.date !== undefined) {
      expenseEntity.date = updateData.date;
    }
    if (updateData.amount !== undefined) {
      expenseEntity.amount = updateData.amount.toFixed(2);
    }
    if (updateData.description !== undefined) {
      expenseEntity.description = updateData.description;
    }

    const updatedExpenseEntity = await this.expensesRepository.save(
      expenseEntity,
    );
    return mapExpenseEntityToExpense(updatedExpenseEntity);
  }
}
