// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseModule } from './modules/expense/expense.module';
import { AuthzModule } from './modules/authz/authz.module';
import { UserModule } from './modules/user/user.module';
import { ExpenseAnalysisModule } from './modules/expense-analysis/expense-analysis.module';
import { ExpenseAnalysisService } from './modules/expense-analysis/expense-analysis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5433', 10),
      username: process.env.DB_USER || 'your_db_user',
      password: process.env.DB_PASS || 'your_db_password',
      database: process.env.DB_NAME || 'your_db_name',
      autoLoadEntities: true,
      synchronize: true, // Note: Set to false in production
    }),
    UserModule,
    ExpenseModule,
    AuthzModule,
    ExpenseAnalysisModule,
  ],
  providers: [AppService, ExpenseAnalysisService],
})
export class AppModule {}
