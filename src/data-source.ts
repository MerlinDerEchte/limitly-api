import { DataSource } from 'typeorm';
import { ExpenseEntity } from './modules/expense/types/expense.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [ExpenseEntity],
  synchronize: process.env.TYPEORM_SYNC === 'true',
});
