import { Weekday } from '../types/weekday.enum';
import {
  getSevenDaysAgo,
  getDiffToAmericanDay,
  getStartDateOfCurrentWeek,
} from './date-util';

describe('getSevenDaysAgo', () => {
  const fixedNow = new Date('2024-05-15T12:34:56.789Z');

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.setSystemTime(fixedNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns a date exactly 7 days before the current date', () => {
    const result = getSevenDaysAgo();

    const expected = new Date('2024-05-08T12:34:56.789Z');

    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('preserves the time of day when subtracting 7 days', () => {
    const result = getSevenDaysAgo();

    expect(result.getUTCHours()).toBe(fixedNow.getUTCHours());
    expect(result.getUTCMinutes()).toBe(fixedNow.getUTCMinutes());
    expect(result.getUTCSeconds()).toBe(fixedNow.getUTCSeconds());
    expect(result.getUTCMilliseconds()).toBe(fixedNow.getUTCMilliseconds());
  });

  it('handles month boundaries correctly', () => {
    const endOfMonth = new Date('2024-03-02T10:00:00.000Z');
    jest.setSystemTime(endOfMonth);

    const result = getSevenDaysAgo();
    const expected = new Date('2024-02-24T10:00:00.000Z');

    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it('correctly subtracts 7 days when today is the first of the month', () => {
    // Example: March 1 → subtract 7 days → February 23
    const firstOfMonth = new Date('2024-03-01T09:00:00.000Z');
    jest.setSystemTime(firstOfMonth);

    const result = getSevenDaysAgo();
    const expected = new Date('2024-02-23T09:00:00.000Z');

    expect(result.toISOString()).toBe(expected.toISOString());
  });
});

describe('getDiffToAmericanDay', () => {
  it('returns 0 when day and americanDay are the same', () => {
    expect(getDiffToAmericanDay(3, 3)).toBe(0);
  });

  it('returns positive difference when day > americanDay', () => {
    // Example: Thursday (4) - Tuesday (2) = 2
    expect(getDiffToAmericanDay(4, 2)).toBe(2);
  });

  it('wraps correctly when day < americanDay', () => {
    // Example: Monday (1) - Thursday (4) = -3 + 7 = 4
    expect(getDiffToAmericanDay(1, 4)).toBe(4);
  });

  it('correctly handles full week wrap-around', () => {
    // Sunday (0) - Saturday (6) = -6 + 7 = 1
    expect(getDiffToAmericanDay(0, 6)).toBe(1);
  });

  it('returns correct values for all day combinations', () => {
    // brute force 0–6 for both inputs
    for (let day = 0; day < 7; day++) {
      for (let americanDay = 0; americanDay < 7; americanDay++) {
        const raw = day - americanDay;
        const expected = raw < 0 ? raw + 7 : raw;

        expect(getDiffToAmericanDay(day, americanDay)).toBe(expected);
      }
    }
  });
});

describe('getStartDateOfCurrentWeek', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const expectYMDHMS = (
    date: Date,
    {
      year,
      month, // 0-based (0 = January)
      day,
      hours = 0,
      minutes = 0,
      seconds = 0,
      ms = 0,
    }: {
      year: number;
      month: number;
      day: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
      ms?: number;
    },
  ) => {
    expect(date.getFullYear()).toBe(year);
    expect(date.getMonth()).toBe(month);
    expect(date.getDate()).toBe(day);
    expect(date.getHours()).toBe(hours);
    expect(date.getMinutes()).toBe(minutes);
    expect(date.getSeconds()).toBe(seconds);
    expect(date.getMilliseconds()).toBe(ms);
  };

  it('returns the Monday of the current week when Monday is the start day', () => {
    // 2024-05-15 is a Wednesday
    const now = new Date('2024-05-15T12:34:56.789Z');
    jest.setSystemTime(now);

    const result = getStartDateOfCurrentWeek(Weekday.MONDAY);

    // Week starting Monday → Monday 2024-05-13
    expectYMDHMS(result, {
      year: 2024,
      month: 4, // May
      day: 13,
    });
  });

  it('returns the Sunday of the current week when Sunday is the start day', () => {
    // 2024-05-15 is a Wednesday
    const now = new Date('2024-05-15T12:34:56.789Z');
    jest.setSystemTime(now);

    const result = getStartDateOfCurrentWeek(Weekday.SUNDAY);

    // Week starting Sunday → Sunday 2024-05-12
    expectYMDHMS(result, {
      year: 2024,
      month: 4, // May
      day: 12,
    });
  });

  it('zeroes out the time to midnight', () => {
    const now = new Date('2024-05-15T23:59:59.999Z');
    jest.setSystemTime(now);

    const result = getStartDateOfCurrentWeek(Weekday.MONDAY);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('handles crossing a month boundary correctly', () => {
    // 2024-04-02 is a Tuesday
    const now = new Date('2024-04-02T10:00:00.000Z');
    jest.setSystemTime(now);

    const result = getStartDateOfCurrentWeek(Weekday.MONDAY);

    // Week starting Monday → Monday 2024-04-01
    expectYMDHMS(result, {
      year: 2024,
      month: 3, // April
      day: 1,
    });
  });

  it('handles crossing a year boundary correctly', () => {
    // 2025-01-01 is a Wednesday
    const now = new Date('2025-01-01T08:00:00.000Z');
    jest.setSystemTime(now);

    const result = getStartDateOfCurrentWeek(Weekday.MONDAY);

    // Week starting Monday → Monday 2024-12-30
    expectYMDHMS(result, {
      year: 2024,
      month: 11, // December
      day: 30,
    });
  });
});
