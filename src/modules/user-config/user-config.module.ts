import { Module } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { UserConfigController } from './user-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfigEntity } from './types/userConfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserConfigEntity])],
  providers: [UserConfigService],
  controllers: [UserConfigController],
  exports: [UserConfigService],
})
export class UserConfigModule {}
