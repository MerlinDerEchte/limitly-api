import type { Weekday } from './weekday.enum';
import type { Currency } from './currency.enum';
export type UserConfig = {
  id: string;
  userId: string;
  expenseLimitByDay: number;
  currency: Currency;
  startDayOfWeek: Weekday;
};
