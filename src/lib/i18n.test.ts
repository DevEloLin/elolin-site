import { describe, expect, it } from "vitest";
import { t, getLocaleFromPath, localizePath, type Locale } from "./i18n";

describe("getLocaleFromPath", () => {
  it("/ → en", () => expect(getLocaleFromPath("/")).toBe("en"));
  it("/products → en", () => expect(getLocaleFromPath("/products")).toBe("en"));
  it("/zh → zh", () => expect(getLocaleFromPath("/zh")).toBe("zh"));
  it("/zh/products → zh", () => expect(getLocaleFromPath("/zh/products")).toBe("zh"));
});

describe("localizePath", () => {
  it("en root → /", () => expect(localizePath("/products", "en")).toBe("/products"));
  it("zh adds /zh", () => expect(localizePath("/products", "zh")).toBe("/zh/products"));
  it("zh root → /zh/", () => expect(localizePath("/", "zh")).toBe("/zh/"));
  it("strips existing locale before adding", () =>
    expect(localizePath("/zh/products", "en")).toBe("/products"));
});

describe("t", () => {
  it("returns en value from common.greeting", () => {
    expect(t("common.greeting", "en")).toBe("Hello");
  });
  it("returns zh value", () => {
    expect(t("common.greeting", "zh")).toBe("你好");
  });
  it("falls back to en when zh key missing", () => {
    expect(t("common.onlyEn", "zh")).toBe("only en");
  });
  it("returns key string when both missing — fail loud", () => {
    expect(t("common.nope" as any, "en")).toBe("common.nope");
  });
});
