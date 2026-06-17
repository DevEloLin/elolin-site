import { describe, expect, it } from "vitest";
import { filterReposForSite } from "./fetch-github";

const mk = (name: string, extra: Partial<any> = {}) => ({
  id: 1, name, full_name: `DevEloLin/${name}`,
  description: "", language: "Rust", stargazers_count: 0, forks_count: 0,
  fork: extra.fork ?? false, archived: extra.archived ?? false,
  topics: [], homepage: null, html_url: `https://github.com/DevEloLin/${name}`,
  pushed_at: "2026-01-01T00:00:00Z",
  owner: { login: "DevEloLin", name: "Elo lin", email: "x@x.com" },
});

describe("filterReposForSite", () => {
  it("excludes the profile readme repo", () => {
    const out = filterReposForSite([mk("DevEloLin"), mk("evoclaw")]);
    expect(out.map((r) => r.name)).toEqual(["evoclaw"]);
  });
  it("excludes forks", () => {
    const out = filterReposForSite([mk("forked", { fork: true }), mk("evoclaw")]);
    expect(out.map((r) => r.name)).toEqual(["evoclaw"]);
  });
  it("excludes archived", () => {
    const out = filterReposForSite([mk("old", { archived: true }), mk("evoclaw")]);
    expect(out.map((r) => r.name)).toEqual(["evoclaw"]);
  });
  it("sorts by pushedAt desc, then stars desc", () => {
    const a = mk("a"); a.pushed_at = "2025-01-01T00:00:00Z"; a.stargazers_count = 100;
    const b = mk("b"); b.pushed_at = "2026-01-01T00:00:00Z"; b.stargazers_count = 1;
    const out = filterReposForSite([a, b]);
    expect(out.map((r) => r.name)).toEqual(["b", "a"]);
  });
});
