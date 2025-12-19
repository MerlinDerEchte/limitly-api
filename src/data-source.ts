import { DataSource } from 'typeorm';
import { ExpenseEntity } from './modules/expense/types/expense.entity';
import { User } from './modules/user/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [ExpenseEntity, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.TYPEORM_SYNC === 'true',
});
