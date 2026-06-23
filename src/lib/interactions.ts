type TiltCard = HTMLElement & {
  __tiltCleanup?: () => void;
};

type CursorParticle = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  lag: number;
  size: number;
};

function ensureQuantumCursor(): HTMLDivElement {
  let layer = document.getElementById("quantum-cursor") as HTMLDivElement | null;
  if (layer) return layer;

  layer = document.createElement("div");
  layer.id = "quantum-cursor";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = "<span class=\"quantum-cursor__core\"></span>";
  document.body.appendChild(layer);
  return layer;
}

export function setupQuantumCursor(): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = ensureQuantumCursor();
  const particlesEl = layer;
  const particles: CursorParticle[] = [];
  const count = 18;

  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    el.className = "quantum-cursor__particle";
    particlesEl.appendChild(el);
    particles.push({
      el,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      tx: window.innerWidth * 0.5,
      ty: window.innerHeight * 0.5,
      vx: 0,
      vy: 0,
      lag: 0.08 + i * 0.012,
      size: 3 + (i % 5),
    });
    el.style.width = `${3 + (i % 5)}px`;
    el.style.height = `${3 + (i % 5)}px`;
  }

  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.5;
  let active = false;
  let raf = 0;

  const render = () => {
    raf = 0;
    const spread = 0.5;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      if (!p) continue;
      const angle = i * 0.52;
      const radius = 18 + i * 2.8;
      const targetX = pointerX + Math.cos(angle) * radius * (active ? 1 : 0.2);
      const targetY = pointerY + Math.sin(angle) * radius * (active ? 1 : 0.2);
      p.tx += (targetX - p.tx) * p.lag;
      p.ty += (targetY - p.ty) * p.lag;
      p.vx += (p.tx - p.x) * spread;
      p.vy += (p.ty - p.y) * spread;
      p.x += p.vx * 0.16;
      p.y += p.vy * 0.16;
      p.vx *= 0.62;
      p.vy *= 0.62;

      const alpha = active ? 0.15 + (1 - i / particles.length) * 0.55 : 0.08;
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${1 + i * 0.02})`;
      p.el.style.opacity = String(alpha);
      p.el.style.filter = `blur(${Math.max(0, 1.2 - i * 0.05)}px)`;
    }

    const core = layer.querySelector<HTMLElement>(".quantum-cursor__core");
    if (core) {
      core.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%) scale(${active ? 1 : 0.85})`;
      core.style.opacity = active ? "1" : "0.8";
    }

    if (active) {
      raf = window.requestAnimationFrame(render);
    }
  };

  const move = (x: number, y: number) => {
    pointerX = x;
    pointerY = y;
    active = true;
    if (!raf) raf = window.requestAnimationFrame(render);
  };

  const hide = () => {
    active = false;
    if (!raf) raf = window.requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (event) => move(event.clientX, event.clientY), { passive: true });
  window.addEventListener("pointerdown", (event) => move(event.clientX, event.clientY), { passive: true });
  window.addEventListener("blur", hide);
  window.addEventListener("mouseleave", hide);
  render();
}

export function setupTiltCards(root: ParentNode = document): void {
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-visual-card]")) as TiltCard[];
  if (cards.length === 0) return;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (coarse || reduced) return;

  const state = new WeakMap<HTMLElement, { x: number; y: number; raf: number }>();

  const schedule = (card: HTMLElement) => {
    const s = state.get(card);
    if (!s || s.raf) return;
    s.raf = window.requestAnimationFrame(() => {
      s.raf = 0;
      card.style.setProperty("--card-x", `${s.x}px`);
      card.style.setProperty("--card-y", `${s.y}px`);
      card.style.setProperty("--card-tilt-x", `${-s.y / 18}deg`);
      card.style.setProperty("--card-tilt-y", `${s.x / 18}deg`);
    });
  };

  cards.forEach((card) => {
    state.set(card, { x: 0, y: 0, raf: 0 });

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const py = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      const s = state.get(card);
      if (!s) return;
      s.x = (px - 0.5) * 28;
      s.y = (0.5 - py) * 22;
      schedule(card);
    };

    const onLeave = () => {
      const s = state.get(card);
      if (!s) return;
      s.x = 0;
      s.y = 0;
      schedule(card);
    };

    card.addEventListener("pointerenter", onMove as EventListener);
    card.addEventListener("pointermove", onMove as EventListener, { passive: true });
    card.addEventListener("pointerleave", onLeave);
    card.__tiltCleanup = () => {
      card.removeEventListener("pointerenter", onMove as EventListener);
      card.removeEventListener("pointermove", onMove as EventListener);
      card.removeEventListener("pointerleave", onLeave);
    };
  });
}
