import { NextResponse } from "next/server";
import { parseContributionResponse, type GitHubActivityPayload } from "../../../lib/github-activity";

export const revalidate = 3600;

const username = "piyushaggarwal1322009-bit";
const profileUrl = `https://github.com/${username}`;
const cacheSeconds = 60 * 60;
let lastKnownGood: GitHubActivityPayload | null = null;

type GitHubProfile = { public_repos: number };
type GitHubRepo = { stargazers_count: number; language: string | null; fork: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchJson(url: string, accept = "application/vnd.github+json"): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": "PiyushPortfolio/1.0", Accept: accept },
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: cacheSeconds },
  });
  if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);
  return response.json() as Promise<unknown>;
}

function parseProfile(value: unknown): GitHubProfile | null {
  if (!isRecord(value) || typeof value.public_repos !== "number") return null;
  return { public_repos: value.public_repos };
}

function parseRepositories(value: unknown): GitHubRepo[] | null {
  if (!Array.isArray(value)) return null;
  const repos: GitHubRepo[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.stargazers_count !== "number" || typeof item.fork !== "boolean") continue;
    repos.push({
      stargazers_count: item.stargazers_count,
      language: typeof item.language === "string" ? item.language : null,
      fork: item.fork,
    });
  }
  return repos;
}

function jsonResponse(payload: GitHubActivityPayload, stale = payload.stale) {
  const response = NextResponse.json({ ...payload, stale });
  response.headers.set("Cache-Control", `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`);
  return response;
}

export async function GET() {
  try {
    const [profileResult, reposResult, contributionsResult] = await Promise.allSettled([
      fetchJson(`https://api.github.com/users/${username}`),
      fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
      fetchJson(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, "application/json"),
    ]);
    const profile = profileResult.status === "fulfilled" ? parseProfile(profileResult.value) : null;
    const repos = reposResult.status === "fulfilled" ? parseRepositories(reposResult.value) : null;
    if (!profile || !repos) {
      if (lastKnownGood) return jsonResponse(lastKnownGood, true);
      throw new Error("GitHub public profile is temporarily unavailable");
    }

    const languageCounts = new Map<string, number>();
    for (const repo of repos) {
      if (!repo.fork && repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
    const topLanguage = [...languageCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    const contributions = contributionsResult.status === "fulfilled"
      ? parseContributionResponse(contributionsResult.value)
      : null;
    const fetchedAt = contributions ? new Date().toISOString() : lastKnownGood?.fetchedAt ?? new Date().toISOString();
    const payload: GitHubActivityPayload = {
      username,
      profileUrl,
      stats: {
        publicRepos: profile.public_repos,
        stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        topLanguage,
        languages: [...languageCounts.keys()].sort((a, b) => a.localeCompare(b)),
      },
      days: contributions?.days ?? lastKnownGood?.days ?? [],
      totalContributions: contributions?.totalContributions ?? lastKnownGood?.totalContributions ?? null,
      fetchedAt,
      contributionDataAvailable: contributions !== null || lastKnownGood?.contributionDataAvailable === true,
      stale: contributions === null,
    };

    if (contributions) lastKnownGood = payload;
    return jsonResponse(payload);
  } catch {
    if (lastKnownGood) return jsonResponse(lastKnownGood, true);
    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
