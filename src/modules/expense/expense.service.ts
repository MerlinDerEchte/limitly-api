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
    amount: number,
    description?: string,
  ): Promise<ExpenseEntity> {
    const expenseEntity = this.expensesRepository.create({
      date,
      amount,
      description: description || '',
    });
    return this.expensesRepository.save(expenseEntity);
  }

  async findAll(): Promise<ExpenseEntity[]> {
    return this.expensesRepository.find();
  }

  async findOne(id: string): Promise<ExpenseEntity | null> {
    return this.expensesRepository.findOneBy({ id });
  }
}
