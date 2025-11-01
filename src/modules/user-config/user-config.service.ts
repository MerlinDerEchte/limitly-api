import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfigEntity } from './types/userConfig.entity';
import { UserConfig } from './types/userConfig.type';
import {
  mapUserConfigEntityToUserConfig,
  mapUserConfigToUserConfigEntity,
} from './utils/user-config.util';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectRepository(UserConfigEntity)
    private readonly userConfigRepository: Repository<UserConfigEntity>,
  ) {}

  async findConfigById(userId: string): Promise<UserConfig | null> {
    const entity = await this.userConfigRepository.findOne({
      where: { userId },
    });
    if (!entity) {
      return null;
    }
    const userConfig = mapUserConfigEntityToUserConfig(entity);
    return userConfig;
  }

  async saveConfig(config: UserConfig): Promise<UserConfig | null> {
    const configAsEntity = mapUserConfigToUserConfigEntity(config);
    const savedEntity = await this.userConfigRepository.save(configAsEntity);
    return mapUserConfigEntityToUserConfig(savedEntity);
  }
}
