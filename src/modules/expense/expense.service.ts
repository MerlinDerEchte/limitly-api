import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './types/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expensesRepository: Repository<ExpenseEntity>,
  ) {}

  async create(
    date: Date,
    userId: string,
    amount: number,
    description?: string,
  ): Promise<ExpenseEntity> {
    const expenseEntity = this.expensesRepository.create({
      date,
      userId,
      amount,
      description: description || '',
    });
    return this.expensesRepository.save(expenseEntity);
  }

  async findAllForUser(userId: string): Promise<ExpenseEntity[]> {
    return this.expensesRepository.find({ where: { userId } });
  }

  async findOne(id: string, userId: string): Promise<ExpenseEntity | null> {
    return this.expensesRepository.findOneBy({ id, userId });
  }

  async findAllInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseEntity[]> {
    return this.expensesRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }

  async findAllInLastSevenDays(userId: string): Promise<ExpenseEntity[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    return this.findAllInDateRange(userId, startDate, endDate);
  } 
}
