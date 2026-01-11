import type { Weekday } from '../types/weekday.enum';
import { mapWeekdayToAmericanWeekdayNumber } from '../types/weekday.enum';

export const getSevenDaysAgo = (): Date => {
  const sevenDaysBefore = new Date();
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
  return sevenDaysBefore;
};

const getDiffToAmericanDay = (day: number, americanDay: number): number => {
  const diffToAmericanDay = day - americanDay;
  if (diffToAmericanDay < 0) {
    return diffToAmericanDay + 7;
  }
  return diffToAmericanDay;
};

export const getStartDateOfCurrentWeek = (startDayOfWeek: Weekday): Date => {
  const now = new Date();

  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayAsAmericanDay = current.getDay();

  const startDayAsAmericanDay =
    mapWeekdayToAmericanWeekdayNumber(startDayOfWeek);

  const diffToAmericanDays = getDiffToAmericanDay(
    todayAsAmericanDay,
    startDayAsAmericanDay,
  );

  current.setDate(current.getDate() - diffToAmericanDays);
  current.setHours(0, 0, 0, 0);

  return current;
};
