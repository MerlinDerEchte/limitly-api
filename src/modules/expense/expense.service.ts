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
}
