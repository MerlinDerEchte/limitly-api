export enum Weekday {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export const mapAmericanWeekdayToWeekday = (day: number): Weekday => {
  switch (day) {
    case 0:
      return Weekday.SUNDAY;
    case 1:
      return Weekday.MONDAY;
    case 2:
      return Weekday.TUESDAY;
    case 3:
      return Weekday.WEDNESDAY;
    case 4:
      return Weekday.THURSDAY;
    case 5:
      return Weekday.FRIDAY;
    case 6:
      return Weekday.SATURDAY;
    default:
      throw new Error('Invalid day');
  }
};

export const mapWeekdayToAmericanWeekdayNumber = (day: Weekday): number => {
  switch (day) {
    case Weekday.SUNDAY:
      return 0;
    case Weekday.MONDAY:
      return 1;
    case Weekday.TUESDAY:
      return 2;
    case Weekday.WEDNESDAY:
      return 3;
    case Weekday.THURSDAY:
      return 4;
    case Weekday.FRIDAY:
      return 5;
    case Weekday.SATURDAY:
      return 6;
    default:
      throw new Error('Invalid day');
  }
};
