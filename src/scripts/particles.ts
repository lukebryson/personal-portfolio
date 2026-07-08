/**
 * Hero particle network (build-brief §4.1).
 * 54 drifting points in normalized coords, pair lines under 155px,
 * ~15% red particles, cursor-proximity lines under 190px.
 * Loop pauses when the hero is off-screen or the tab is hidden.
 * Reduced motion: a single static frame, no animation.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  red: boolean;
}

const COUNT = 54;
const LINK_DIST = 155;
const MOUSE_DIST = 190;

export function initParticles(
  canvas: HTMLCanvasElement,
  reducedMotion: MediaQueryList,
): void {
  const ctx = canvas.getContext('2d');
  const host = canvas.parentElement;
  if (!ctx || !host) return;

  let width = 0;
  let height = 0;
  let inView = true;
  let rafId = 0;

  const mouse = { x: 0, y: 0, active: false };

  const particles: Particle[] = Array.from({ length: COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    red: Math.random() < 0.15,
  }));

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = host!.clientWidth;
    height = host!.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(): void {
    ctx!.clearRect(0, 0, width, height);

    // Pair connections
    for (let i = 0; i < COUNT; i++) {
      const a = particles[i]!;
      const ax = a.x * width;
      const ay = a.y * height;

      for (let j = i + 1; j < COUNT; j++) {
        const b = particles[j]!;
        const dx = ax - b.x * width;
        const dy = ay - b.y * height;
        const d = Math.hypot(dx, dy);
        if (d >= LINK_DIST) continue;

        const alpha = (1 - d / LINK_DIST) * 0.18;
        ctx!.strokeStyle =
          a.red || b.red
            ? `rgba(196, 20, 20, ${alpha * 1.15})`
            : `rgba(200, 200, 212, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(ax, ay);
        ctx!.lineTo(b.x * width, b.y * height);
        ctx!.stroke();
      }

      // Cursor-proximity lines
      if (mouse.active) {
        const d = Math.hypot(ax - mouse.x, ay - mouse.y);
        if (d < MOUSE_DIST) {
          const alpha = (1 - d / MOUSE_DIST) * 0.32;
          ctx!.strokeStyle = `rgba(224, 51, 47, ${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(ax, ay);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }
    }

    // Dots
    for (const p of particles) {
      ctx!.fillStyle = p.red
        ? 'rgba(224, 51, 47, 0.9)'
        : 'rgba(220, 220, 232, 0.6)';
      ctx!.beginPath();
      ctx!.arc(p.x * width, p.y * height, p.red ? 2.4 : 1.5, 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function step(): void {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x <= 0 || p.x >= 1) p.vx *= -1;
      if (p.y <= 0 || p.y >= 1) p.vy *= -1;
    }
  }

  const running = () => inView && !document.hidden && !reducedMotion.matches;

  function loop(): void {
    if (!running()) {
      rafId = 0;
      return;
    }
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function wake(): void {
    if (rafId === 0 && running()) rafId = requestAnimationFrame(loop);
    // Reduced motion keeps a static frame in place of the animation.
    if (reducedMotion.matches) draw();
  }

  host.addEventListener(
    'pointermove',
    (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    },
    { passive: true },
  );
  host.addEventListener('pointerleave', () => (mouse.active = false));

  new ResizeObserver(() => {
    resize();
    if (!running()) draw();
  }).observe(host);

  new IntersectionObserver((entries) => {
    inView = entries[0]?.isIntersecting ?? true;
    wake();
  }).observe(canvas);

  document.addEventListener('visibilitychange', wake);
  reducedMotion.addEventListener('change', wake);

  resize();
  wake();
  if (reducedMotion.matches) draw();
}
