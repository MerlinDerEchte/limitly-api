import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfigEntity } from './types/userConfig.entity';
import { UserConfig } from './types/UserConfig';
import { mapUserConfigEntityToUserConfig } from './utils/mapUserConfig';

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
    return mapUserConfigEntityToUserConfig(entity);
  }

  async saveConfig(config: UserConfig): Promise<UserConfig> {
    const configAsEntity = mapUserConfigEntityToUserConfig(config);
    const savedEntity = await this.userConfigRepository.save(configAsEntity);
    return mapUserConfigEntityToUserConfig(savedEntity);
  }
}
