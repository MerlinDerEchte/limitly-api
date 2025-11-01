import { Weekday } from '../types/weekday.enum';

export const getStringFromWeekday = (weekday: Weekday): string => {
  switch (weekday) {
    case Weekday.MONDAY:
      return 'Monday';
    case Weekday.TUESDAY:
      return 'Tuesday';
    case Weekday.WEDNESDAY:
      return 'Wednesday';
    case Weekday.THURSDAY:
      return 'Thursday';
    case Weekday.FRIDAY:
      return 'Friday';
    case Weekday.SATURDAY:
      return 'Saturday';
    case Weekday.SUNDAY:
      return 'Sunday';
  }
};
export const getWeekdayFromString = (weekdayString: string): Weekday | null => {
  switch (weekdayString) {
    case 'Monday':
      return Weekday.MONDAY;
    case 'Tuesday':
      return Weekday.TUESDAY;
    case 'Wednesday':
      return Weekday.WEDNESDAY;
    case 'Thursday':
      return Weekday.THURSDAY;
    case 'Friday':
      return Weekday.FRIDAY;
    case 'Saturday':
      return Weekday.SATURDAY;
    case 'Sunday':
      return Weekday.SUNDAY;
  }
  return null;
};
