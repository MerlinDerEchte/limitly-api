import { UserConfigEntity } from '../types/userConfig.entity';
import type { UserConfig } from '../types/userConfig.type';
import type { UserConfigDTO } from '../types/userConfig.dto';
import { getCurrencyFromString, getStringFromCurrency } from './currency.util';
import { getStringFromWeekday, getWeekdayFromString } from './weekday.util';

export const mapUserConfigToUserConfigEntity = (
  config: UserConfig,
): UserConfigEntity => {
  const entity = new UserConfigEntity();
  entity.id = config.id;
  entity.userId = config.userId;
  entity.expenseLimitByDay = config.expenseLimitByDay;
  entity.currency = config.currency;
  entity.startDayOfWeek = config.startDayOfWeek;
  return entity;
};

export const mapUserConfigEntityToUserConfig = (
  entity: UserConfigEntity,
): UserConfig | null => {
  const currency = getCurrencyFromString(entity.currency);
  const startDayOfWeek = getWeekdayFromString(entity.startDayOfWeek);
  if (currency !== null && startDayOfWeek !== null) {
    // Ensure expenseLimitByDay is a number (TypeORM might return decimal as string)
    const dailyLimit =
      typeof entity.expenseLimitByDay === 'string'
        ? parseFloat(entity.expenseLimitByDay)
        : Number(entity.expenseLimitByDay);

    return {
      id: entity.id,
      userId: entity.userId,
      expenseLimitByDay: dailyLimit,
      currency: currency,
      startDayOfWeek: startDayOfWeek,
    };
  }

  return null;
};

export const mapUserConfigToUserConfigDTO = (
  config: UserConfig,
): UserConfigDTO => {
  const currencyString = getStringFromCurrency(config.currency);
  const startDayOfWeekString = getStringFromWeekday(config.startDayOfWeek);

  return {
    id: config.id,
    userId: config.userId,
    expenseLimitByDay: config.expenseLimitByDay,
    currency: currencyString,
    startDayOfWeek: startDayOfWeekString,
  };
};

export const mapUserConfigDTOToUserConfig = (
  dto: UserConfigDTO,
): UserConfig | null => {
  const currency = getCurrencyFromString(dto.currency);
  const startDayOfWeek = getWeekdayFromString(dto.startDayOfWeek);
  if (currency !== null && startDayOfWeek !== null) {
    // Ensure expenseLimitByDay is a number
    const dailyLimit =
      typeof dto.expenseLimitByDay === 'string'
        ? parseFloat(dto.expenseLimitByDay)
        : Number(dto.expenseLimitByDay);

    return {
      id: dto.id,
      userId: dto.userId,
      expenseLimitByDay: dailyLimit,
      currency: currency,
      startDayOfWeek: startDayOfWeek,
    };
  }
  return null;
};
