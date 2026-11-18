import { describe, it, expect } from 'vitest';
import { getHemisphereFromTimeZone, getSeasonForDate, getThemeForDate, readThemeUrlParams } from './theme.utils';

/** Month is 1-based here, for readability. */
const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

describe('getThemeForDate', () => {
  it.each([
    // Christmas: 1 Dec - 6 Jan
    [day(2026, 11, 30), 'autumn'],
    [day(2026, 12, 1), 'christmas'],
    [day(2026, 12, 25), 'christmas'],
    [day(2027, 1, 6), 'christmas'],
    [day(2027, 1, 7), 'winter'],
    // Halloween: 15 Oct - 1 Nov
    [day(2026, 10, 14), 'autumn'],
    [day(2026, 10, 15), 'halloween'],
    [day(2026, 10, 31), 'halloween'],
    [day(2026, 11, 1), 'halloween'],
    [day(2026, 11, 2), 'autumn'],
    // Easter 2026 (Sunday 5 April): Palm Sunday 29 March - Easter Monday 6 April
    [day(2026, 3, 28), 'spring'],
    [day(2026, 3, 29), 'easter'],
    [day(2026, 4, 5), 'easter'],
    [day(2026, 4, 6), 'easter'],
    [day(2026, 4, 7), 'spring'],
    // Easter 2027 (Sunday 28 March) starts before spring does: 21 March is Palm Sunday
    [day(2027, 3, 19), 'winter'],
    [day(2027, 3, 21), 'easter'],
    // Seasons
    [day(2026, 3, 19), 'winter'],
    [day(2026, 3, 20), 'spring'],
    [day(2026, 6, 20), 'spring'],
    [day(2026, 6, 21), 'summer'],
    [day(2026, 9, 21), 'summer'],
    [day(2026, 9, 22), 'autumn'],
  ])('should return the right theme for %s', (date, expected) => {
    expect(getThemeForDate(date, 'north')).toBe(expected);
  });

  it('should ignore the time of the day', () => {
    expect(getThemeForDate(new Date(2026, 3, 6, 23, 59), 'north')).toBe('easter');
    expect(getThemeForDate(new Date(2026, 2, 29, 0, 0, 1), 'north')).toBe('easter');
  });

  it('should use the opposite seasons in the southern hemisphere', () => {
    expect(getThemeForDate(day(2026, 7, 15), 'south')).toBe('winter');
    expect(getThemeForDate(day(2026, 1, 20), 'south')).toBe('summer');
    expect(getThemeForDate(day(2026, 5, 1), 'south')).toBe('autumn');
    expect(getThemeForDate(day(2026, 10, 1), 'south')).toBe('spring');
  });

  it('should keep the holidays in the southern hemisphere', () => {
    expect(getThemeForDate(day(2026, 12, 24), 'south')).toBe('christmas');
    expect(getThemeForDate(day(2026, 10, 31), 'south')).toBe('halloween');
    expect(getThemeForDate(day(2026, 4, 5), 'south')).toBe('easter');
  });

  it('should default to the northern hemisphere', () => {
    expect(getSeasonForDate(day(2026, 7, 15))).toBe('summer');
  });
});

describe('getHemisphereFromTimeZone', () => {
  it.each([
    ['Europe/Madrid', 'north'],
    ['America/New_York', 'north'],
    ['Asia/Tokyo', 'north'],
    ['Africa/Libreville', 'north'],
    ['Australia/Sydney', 'south'],
    ['Pacific/Auckland', 'south'],
    ['America/Argentina/Buenos_Aires', 'south'],
    ['America/Sao_Paulo', 'south'],
    ['America/Santiago', 'south'],
    ['Africa/Johannesburg', 'south'],
    ['Asia/Jakarta', 'south'],
  ])('%s is in the %s hemisphere', (timeZone, expected) => {
    expect(getHemisphereFromTimeZone(timeZone)).toBe(expected);
  });

  it('should default to north when the time zone is unknown', () => {
    expect(getHemisphereFromTimeZone(undefined)).toBe('north');
    expect(getHemisphereFromTimeZone('UTC')).toBe('north');
  });
});

describe('readThemeUrlParams', () => {
  it('should read the theme, date and hemisphere parameters', () => {
    expect(readThemeUrlParams('?theme=halloween&date=2026-10-31&hemisphere=south')).toEqual({
      theme: 'halloween',
      date: '2026-10-31',
      hemisphere: 'south',
    });
  });

  it('should ignore missing or invalid values', () => {
    expect(readThemeUrlParams('?difficulty=easy&hemisphere=east')).toEqual({ theme: null, date: null, hemisphere: null });
  });
});
