import { Weekday } from '../types/weekday.enum';

export const getStringFromWeekday = (weekday: Weekday): string => {
  switch (weekday) {
    case Weekday.Monday:
      return 'Monday';
    case Weekday.Tuesday:
      return 'Tuesday';
    case Weekday.Wednesday:
      return 'Wednesday';
    case Weekday.Thursday:
      return 'Thursday';
    case Weekday.Friday:
      return 'Friday';
    case Weekday.Saturday:
      return 'Saturday';
    case Weekday.Sunday:
      return 'Sunday';
  }
};
export const getWeekdayFromString = (weekdayString: string): Weekday | null => {
  switch (weekdayString) {
    case 'Monday':
      return Weekday.Monday;
    case 'Tuesday':
      return Weekday.Tuesday;
    case 'Wednesday':
      return Weekday.Wednesday;
    case 'Thursday':
      return Weekday.Thursday;
    case 'Friday':
      return Weekday.Friday;
    case 'Saturday':
      return Weekday.Saturday;
    case 'Sunday':
      return Weekday.Sunday;
  }
  return null;
};
