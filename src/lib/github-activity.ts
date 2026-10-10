export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubActivityPayload = {
  username: string;
  profileUrl: string;
  stats: {
    publicRepos: number;
    stars: number;
    topLanguage: string | null;
    languages: string[];
  };
  days: ContributionDay[];
  totalContributions: number | null;
  fetchedAt: string;
  contributionDataAvailable: boolean;
  stale: boolean;
};

export type CalendarCell = ContributionDay | null;

export type ContributionWindow = {
  startDate: string;
  endDate: string;
};

export function getContributionLevel(count: number): ContributionDay["level"] {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseContributionResponse(value: unknown): {
  days: ContributionDay[];
  totalContributions: number;
} | null {
  if (!isRecord(value) || !Array.isArray(value.contributions) || !isRecord(value.total)) return null;

  const days: ContributionDay[] = [];
  for (const item of value.contributions) {
    if (!isRecord(item) || !isValidDate(item.date)) continue;
    if (!Number.isInteger(item.count) || typeof item.count !== "number" || item.count < 0) continue;
    days.push({ date: item.date, count: item.count, level: getContributionLevel(item.count) });
  }

  if (days.length === 0) return null;

  const total = value.total.lastYear;
  return {
    days: days.sort((a, b) => a.date.localeCompare(b.date)),
    totalContributions: typeof total === "number" && Number.isInteger(total) && total >= 0
      ? total
      : days.reduce((sum, day) => sum + day.count, 0),
  };
}

export function buildContributionWeeks(
  days: ContributionDay[],
  today = new Date(),
  monthCount = 5,
): CalendarCell[][] {
  const { startDate, endDate } = getContributionWindow(today, monthCount);
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  const dayMap = new Map(days.map((day) => [day.date, day]));
  const cells: CalendarCell[] = [];
  const mondayOffset = (start.getUTCDay() + 6) % 7;
  for (let index = 0; index < mondayOffset; index += 1) cells.push(null);

  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    cells.push(dayMap.get(cursor.toISOString().slice(0, 10)) ?? null);
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}

export function getContributionWindow(today = new Date(), monthCount = 5): ContributionWindow {
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - monthCount + 1, 1));
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}