export enum Weekday {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
}

export const mapAmericanWeekdayToWeekday = (day: number): Weekday => {
  switch (day) {
    case 0:
      return Weekday.Sunday;
    case 1:
      return Weekday.Monday;
    case 2:
      return Weekday.Tuesday;
    case 3:
      return Weekday.Wednesday;
    case 4:
      return Weekday.Thursday;
    case 5:
      return Weekday.Friday;
    case 6:
      return Weekday.Saturday;
    default:
      throw new Error('Invalid day');
  }
};

export const mapWeekdayToAmericanWeekdayNumber = (day: Weekday): number => {
  switch (day) {
    case Weekday.Sunday:
      return 0;
    case Weekday.Monday:
      return 1;
    case Weekday.Tuesday:
      return 2;
    case Weekday.Wednesday:
      return 3;
    case Weekday.Thursday:
      return 4;
    case Weekday.Friday:
      return 5;
    case Weekday.Saturday:
      return 6;
    default:
      throw new Error('Invalid day');
  }
};
