/// <reference types="@cloudflare/workers-types" />

export default {
  async scheduled(_event: ScheduledEvent, env: { PAGES_DEPLOY_HOOK?: string }) {
    if (!env.PAGES_DEPLOY_HOOK) {
      console.warn("PAGES_DEPLOY_HOOK not set");
      return;
    }
    const res = await fetch(env.PAGES_DEPLOY_HOOK, { method: "POST" });
    console.log(`deploy hook → ${res.status}`);
  },
};
