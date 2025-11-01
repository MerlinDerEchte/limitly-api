import type { Weekday } from './Weekday';
import type { Currency } from './Currency';
export type UserConfig = {
  id: string;
  userId: string;
  expenseLimitByDay: number;
  currency: Currency;
  startDayOfWeek: Weekday;
};
