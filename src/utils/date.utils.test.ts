import { describe, it, expect } from 'vitest';
import { addDays, getEasterSunday, monthDay, parseLocalDate, startOfDay } from './date.utils';

const ymd = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

describe('date utils', () => {
  it.each([
    [2019, '2019-4-21'],
    [2024, '2024-3-31'],
    [2025, '2025-4-20'],
    [2026, '2026-4-5'],
    [2027, '2027-3-28'],
    [2028, '2028-4-16'],
    [2038, '2038-4-25'],
  ])('should compute Easter Sunday of %i', (year, expected) => {
    expect(ymd(getEasterSunday(year))).toBe(expected);
  });

  it('should encode month and day as a sortable number', () => {
    expect(monthDay(new Date(2026, 0, 6))).toBe(106);
    expect(monthDay(new Date(2026, 9, 31))).toBe(1031);
    expect(monthDay(new Date(2026, 11, 1))).toBe(1201);
  });

  it('should add days across month and year boundaries', () => {
    expect(ymd(addDays(new Date(2026, 11, 31), 1))).toBe('2027-1-1');
    expect(ymd(addDays(new Date(2026, 2, 1), -1))).toBe('2026-2-28');
  });

  it('should drop the time of the day', () => {
    expect(startOfDay(new Date(2026, 4, 10, 23, 59)).getHours()).toBe(0);
  });

  it('should parse valid YYYY-MM-DD dates as local dates', () => {
    expect(ymd(parseLocalDate('2026-10-31') as Date)).toBe('2026-10-31');
  });

  it.each([null, undefined, '', 'today', '2026-13-01', '2026-02-30', '31-10-2026'])('should reject %s', (value) => {
    expect(parseLocalDate(value)).toBeNull();
  });
});
