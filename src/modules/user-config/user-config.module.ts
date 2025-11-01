import { Module } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { UserConfigController } from './user-config.controller';

@Module({
  providers: [UserConfigService],
  controllers: [UserConfigController],
})
export class UserConfigModule {}
