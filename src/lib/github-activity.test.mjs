import assert from "node:assert/strict";
import test from "node:test";
import { buildContributionWeeks, getContributionLevel, getContributionWindow, parseContributionResponse } from "./github-activity.ts";

test("parses the contribution service JSON response", () => {
  const parsed = parseContributionResponse({
    total: { lastYear: 2 },
    contributions: [
      { date: "2026-10-08", count: 2, level: 4 },
      { date: "2026-10-09", count: 0, level: 3 },
    ],
  });

  assert.equal(parsed?.totalContributions, 2);
  assert.deepEqual(parsed?.days.map((day) => day.date), ["2026-10-08", "2026-10-09"]);
  assert.deepEqual(parsed?.days.map((day) => day.level), [1, 0]);
});

test("maps contribution intensity from daily counts", () => {
  assert.deepEqual([0, 1, 3, 6, 10].map(getContributionLevel), [0, 1, 2, 3, 4]);
});

test("rejects invalid contribution data and calendar dates", () => {
  assert.equal(parseContributionResponse({ total: {}, contributions: [] }), null);
  assert.equal(parseContributionResponse({
    total: { lastYear: 1 },
    contributions: [{ date: "2026-02-30", count: 1, level: 1 }],
  }), null);
  assert.equal(parseContributionResponse({
    total: { lastYear: 1 },
    contributions: [{ date: "2026-10-09", count: -1, level: 0 }],
  }), null);
});

test("builds a Monday-first calendar for the current and previous four months", () => {
  const today = new Date("2026-01-07T12:00:00Z");
  assert.deepEqual(getContributionWindow(today), {
    startDate: "2025-09-01",
    endDate: "2026-01-07",
  });

  const weeks = buildContributionWeeks([
    { date: "2025-08-31", count: 5, level: 4 },
    { date: "2025-09-01", count: 1, level: 1 },
    { date: "2026-01-07", count: 2, level: 2 },
  ], today);
  const cells = weeks.flat();
  const dates = cells.filter((cell) => cell !== null);
  const dateWeek = weeks.find((week) => week.some((cell) => cell?.date === "2026-01-07"));

  assert.equal(cells.length % 7, 0);
  assert.equal(weeks[0]?.[0]?.date, "2025-09-01");
  assert.equal(dateWeek?.[2]?.date, "2026-01-07");
  assert.equal(dates.length, 2);
  assert.equal(dates.some((cell) => cell.date === "2025-08-31"), false);
});