import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfigEntity } from './types/userConfig.entity';
import { UserConfig } from './types/userConfig.type';
import {
  mapUserConfigEntityToUserConfig,
  mapUserConfigToUserConfigEntity,
} from './utils/user-config.util';
import { Currency } from './types/currency.enum';
import { getStringFromCurrency } from './utils/currency.util';
import { getStringFromWeekday } from './utils/weekday.util';
import { Weekday } from '../../types/weekday.enum';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectRepository(UserConfigEntity)
    private readonly userConfigRepository: Repository<UserConfigEntity>,
  ) {}

  async createDefaultConfigForUser(userId: string): Promise<UserConfig | null> {
    const defaultCurrencyAsString = getStringFromCurrency(Currency.EUR);
    const startDayOfWeek = getStringFromWeekday(Weekday.MONDAY);
    const defaultConfigAsEntity: Partial<UserConfigEntity> = {
      userId,
      expenseLimitByDay: 30,
      currency: defaultCurrencyAsString,
      startDayOfWeek: startDayOfWeek,
    };
    const savedEntity = await this.userConfigRepository.save(
      defaultConfigAsEntity,
    );
    const savedConfig = mapUserConfigEntityToUserConfig(savedEntity);
    return savedConfig;
  }
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
