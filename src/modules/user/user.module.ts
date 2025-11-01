import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserConfigModule } from '../user-config/user-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserConfigModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
