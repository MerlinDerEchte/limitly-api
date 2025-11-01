import { UserConfigEntity } from '../types/userConfig.entity';
import type { UserConfig } from '../types/UserConfig';
import { Currency } from '../types/Currency';
import { Weekday } from '../types/Weekday';

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
): UserConfig => {
  return {
    id: entity.id,
    userId: entity.userId,
    expenseLimitByDay: entity.expenseLimitByDay,
    currency: Object.values(Currency).includes(entity.currency as Currency)
      ? (entity.currency as Currency)
      : Currency.EUR,
    startDayOfWeek: Object.values(Weekday).includes(
      entity.startDayOfWeek as Weekday,
    )
      ? (entity.startDayOfWeek as Weekday)
      : Weekday.Monday,
  };
};
