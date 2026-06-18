import { describe, expect, it, beforeEach } from "vitest";
import { setupReveal } from "./motion";

describe("setupReveal", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="reveal" data-reveal>hi</div>
      <div class="reveal" data-reveal>there</div>`;
    // @ts-expect-error stub
    global.IntersectionObserver = class {
      cb: any; constructor(cb: any) { this.cb = cb; }
      observe(el: Element) {
        this.cb([{ isIntersecting: true, target: el }], this);
      }
      unobserve() {}
      disconnect() {}
    };
  });
  it("adds is-revealed class to observed elements", () => {
    setupReveal();
    document.querySelectorAll("[data-reveal]").forEach((el) =>
      expect(el.classList.contains("is-revealed")).toBe(true));
  });
});
