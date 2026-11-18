/** Returns a copy of the date at local midnight, so only the calendar day is compared. */
export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * Encodes the month and day of a date as a sortable number (e.g. 31 October -> 1031),
 * which makes yearly ranges easy to express and compare.
 */
export const monthDay = (date: Date): number => (date.getMonth() + 1) * 100 + date.getDate();

/**
 * Easter Sunday (Gregorian calendar) for the given year, using the anonymous
 * Meeus/Jones/Butcher algorithm.
 */
export const getEasterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};

/**
 * Parses a `YYYY-MM-DD` string as a local date. Returns `null` when the string is not a valid date.
 */
export const parseLocalDate = (value: string | null | undefined): Date | null => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);

  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};
