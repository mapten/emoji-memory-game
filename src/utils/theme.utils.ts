import { Hemisphere, SeasonThemeId, ThemeId } from '../models/theme.model';
import { addDays, getEasterSunday, monthDay, startOfDay } from './date.utils';

/**
 * IANA time zones located in the southern hemisphere.
 * Entries ending with "/" are prefixes (every zone in that area is southern).
 * Time zones are the only location hint browsers give without asking for permission,
 * so they are used to flip the seasons for southern-hemisphere players.
 */
const SOUTHERN_TIME_ZONES = [
  'Australia/', 'Antarctica/', 'America/Argentina/', 'Brazil/', 'Chile/', 'NZ', 'NZ-CHAT',
  // South America
  'America/Buenos_Aires', 'America/Catamarca', 'America/Cordoba', 'America/Jujuy', 'America/Mendoza',
  'America/Santiago', 'America/Punta_Arenas', 'America/Montevideo', 'America/Asuncion', 'America/La_Paz',
  'America/Lima', 'America/Guayaquil', 'America/Sao_Paulo', 'America/Bahia', 'America/Belem',
  'America/Fortaleza', 'America/Recife', 'America/Maceio', 'America/Araguaina', 'America/Campo_Grande',
  'America/Cuiaba', 'America/Porto_Velho', 'America/Rio_Branco', 'America/Eirunepe', 'America/Manaus',
  'America/Noronha', 'America/Santarem', 'America/Porto_Acre',
  // Africa
  'Africa/Johannesburg', 'Africa/Maputo', 'Africa/Harare', 'Africa/Lusaka', 'Africa/Lubumbashi',
  'Africa/Windhoek', 'Africa/Gaborone', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Blantyre',
  'Africa/Luanda', 'Africa/Kinshasa', 'Africa/Dar_es_Salaam', 'Africa/Nairobi', 'Africa/Kigali',
  'Africa/Bujumbura', 'Africa/Brazzaville',
  // Indian Ocean
  'Indian/Antananarivo', 'Indian/Mauritius', 'Indian/Reunion', 'Indian/Mayotte', 'Indian/Comoro',
  'Indian/Chagos', 'Indian/Cocos', 'Indian/Christmas', 'Indian/Kerguelen', 'Indian/Mahe',
  // Asia
  'Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'Asia/Dili',
  // Atlantic
  'Atlantic/St_Helena', 'Atlantic/South_Georgia', 'Atlantic/Stanley',
  // Pacific
  'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Fiji', 'Pacific/Tongatapu', 'Pacific/Apia',
  'Pacific/Efate', 'Pacific/Noumea', 'Pacific/Norfolk', 'Pacific/Rarotonga', 'Pacific/Tahiti',
  'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Pitcairn', 'Pacific/Easter', 'Pacific/Galapagos',
  'Pacific/Niue', 'Pacific/Pago_Pago', 'Pacific/Wallis', 'Pacific/Funafuti', 'Pacific/Fakaofo',
  'Pacific/Guadalcanal', 'Pacific/Port_Moresby', 'Pacific/Bougainville', 'Pacific/Nauru',
];

/**
 * Guesses the hemisphere from an IANA time zone (e.g. "Europe/Madrid", "Australia/Sydney").
 * Defaults to the northern hemisphere when the time zone is unknown.
 */
export const getHemisphereFromTimeZone = (timeZone: string | undefined): Hemisphere => {
  if (!timeZone) return 'north';

  const isSouthern = SOUTHERN_TIME_ZONES.some((zone) =>
    zone.endsWith('/') ? timeZone.startsWith(zone) : timeZone === zone);

  return isSouthern ? 'south' : 'north';
};

/** Hemisphere of the current user, based on the browser time zone. */
export const detectHemisphere = (): Hemisphere => {
  try {
    return getHemisphereFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return 'north';
  }
};

const OPPOSITE_SEASON: Record<SeasonThemeId, SeasonThemeId> = {
  spring: 'autumn',
  summer: 'winter',
  autumn: 'spring',
  winter: 'summer',
};

/**
 * Season for a date, using the (approximate) astronomical boundaries:
 * spring 20 Mar, summer 21 Jun, autumn 22 Sep, winter 21 Dec (northern hemisphere).
 * Southern-hemisphere seasons are the opposite ones.
 */
export const getSeasonForDate = (date: Date, hemisphere: Hemisphere = 'north'): SeasonThemeId => {
  const md = monthDay(date);
  let season: SeasonThemeId;

  if (md >= 320 && md < 621) season = 'spring';
  else if (md >= 621 && md < 922) season = 'summer';
  else if (md >= 922 && md < 1221) season = 'autumn';
  else season = 'winter';

  return hemisphere === 'north' ? season : OPPOSITE_SEASON[season];
};

/** Christmas: 1 December to 6 January (Epiphany), both included. */
export const isChristmas = (date: Date): boolean => {
  const md = monthDay(date);
  return md >= 1201 || md <= 106;
};

/** Halloween: 15 October to 1 November, both included. */
export const isHalloween = (date: Date): boolean => {
  const md = monthDay(date);
  return md >= 1015 && md <= 1101;
};

/** Easter: Palm Sunday (a week before Easter Sunday) to Easter Monday, both included. */
export const isEaster = (date: Date): boolean => {
  const day = startOfDay(date).getTime();
  const easterSunday = getEasterSunday(date.getFullYear());

  return day >= addDays(easterSunday, -7).getTime() && day <= addDays(easterSunday, 1).getTime();
};

/**
 * The theme that should be displayed on a given date.
 * Holidays take precedence over seasons: Christmas > Halloween > Easter > season.
 */
export const getThemeForDate = (date: Date, hemisphere: Hemisphere = 'north'): ThemeId => {
  if (isChristmas(date)) return 'christmas';
  if (isHalloween(date)) return 'halloween';
  if (isEaster(date)) return 'easter';

  return getSeasonForDate(date, hemisphere);
};

export interface ThemeUrlParams {
  /** `?theme=halloween` (or `?theme=auto`) preselects a theme. */
  theme: string | null;
  /** `?date=2026-10-31` pretends today is another day (handy to preview a period). */
  date: string | null;
  /** `?hemisphere=south` overrides the hemisphere detected from the time zone. */
  hemisphere: Hemisphere | null;
}

export const readThemeUrlParams = (search: string): ThemeUrlParams => {
  const params = new URLSearchParams(search);
  const hemisphere = params.get('hemisphere');

  return {
    theme: params.get('theme'),
    date: params.get('date'),
    hemisphere: hemisphere === 'north' || hemisphere === 'south' ? hemisphere : null,
  };
};
