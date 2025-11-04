import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './types/expense.entity';
import { Expense } from './types/expense';
import { mapExpenseEntityToExpense } from './utils/expense-enitity.util';
import { ExpenseCreationBase } from './types/expense-creation-base';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expensesRepository: Repository<ExpenseEntity>,
  ) {}

  async create(expenseCreationBase: ExpenseCreationBase): Promise<Expense> {
    const expenseEntity = this.expensesRepository.create({
      date: expenseCreationBase.date,
      userId: expenseCreationBase.userId,
      amount: expenseCreationBase.amount,
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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    return this.findAllInDateRange(userId, startDate, endDate);
  }
}
