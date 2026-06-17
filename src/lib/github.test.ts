import { describe, expect, it } from "vitest";
import {
  GhRepoRawSchema, ProjectSchema, sanitizeRepo, categorize, hasAiTag,
} from "./github";

const FIXTURE = {
  id: 1, name: "evoclaw", full_name: "DevEloLin/evoclaw",
  description: "Self-evolving AI agent", language: "Rust",
  stargazers_count: 1, forks_count: 0, fork: false, archived: false,
  topics: ["ai", "agent", "rust"],
  homepage: "https://evoclaw.com",
  html_url: "https://github.com/DevEloLin/evoclaw",
  pushed_at: "2026-06-01T00:00:00Z",
  owner: { login: "DevEloLin", name: "Elo lin", email: "should-never-leak@x.com" },
};

describe("GhRepoRawSchema", () => {
  it("parses a realistic GitHub repo payload", () => {
    expect(() => GhRepoRawSchema.parse(FIXTURE)).not.toThrow();
  });
  it("rejects when html_url is missing", () => {
    const bad = { ...FIXTURE, html_url: undefined };
    expect(() => GhRepoRawSchema.parse(bad)).toThrow();
  });
});

describe("sanitizeRepo", () => {
  it("strips owner.name and owner.email — privacy guardrail", () => {
    const out = sanitizeRepo(GhRepoRawSchema.parse(FIXTURE));
    expect(out.owner).toEqual({ login: "DevEloLin" });
    expect(JSON.stringify(out)).not.toMatch(/Elo lin/);
    expect(JSON.stringify(out)).not.toMatch(/should-never-leak/);
  });
  it("output passes ProjectSchema", () => {
    const out = sanitizeRepo(GhRepoRawSchema.parse(FIXTURE));
    expect(() => ProjectSchema.parse(out)).not.toThrow();
  });
});

describe("categorize", () => {
  it("evoclaw is a product", () =>
    expect(categorize({ name: "evoclaw", topics: [] } as any)).toBe("product"));
  it("kinmate-site is a product", () =>
    expect(categorize({ name: "kinmate-site", topics: [] } as any)).toBe("product"));
  it("skill-* is a skill", () =>
    expect(categorize({ name: "skill-xiaoshuo", topics: [] } as any)).toBe("skill"));
  it("*-mcp is a skill", () =>
    expect(categorize({ name: "atlassian-rovo-agent-mcp", topics: [] } as any)).toBe("skill"));
  it("*-site is a site", () =>
    expect(categorize({ name: "EvoClawSite", topics: [] } as any)).toBe("site"));
  it("topic `product` overrides naming", () =>
    expect(categorize({ name: "anything", topics: ["product"] } as any)).toBe("product"));
  it("fallback is tool", () =>
    expect(categorize({ name: "GitFlowGraph", topics: [] } as any)).toBe("tool"));
});

describe("hasAiTag", () => {
  it("topic `ai` flips it true", () =>
    expect(hasAiTag({ name: "anything", topics: ["ai"] } as any)).toBe(true));
  it("topic `mcp` flips it true", () =>
    expect(hasAiTag({ name: "anything", topics: ["mcp"] } as any)).toBe(true));
  it("name evoclaw flips it true", () =>
    expect(hasAiTag({ name: "evoclaw", topics: [] } as any)).toBe(true));
  it("name *-mcp flips it true", () =>
    expect(hasAiTag({ name: "atlassian-rovo-agent-mcp", topics: [] } as any)).toBe(true));
  it("plain Rust tool is false", () =>
    expect(hasAiTag({ name: "GitFlowGraph", topics: [] } as any)).toBe(false));
});
