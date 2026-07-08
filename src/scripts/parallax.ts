/**
 * Hero parallax (§4.8) and hero cursor spotlight (§4.4).
 */

export function initParallax(): void {
  const el = document.querySelector<HTMLElement>('[data-parallax]');
  if (!el) return;

  let ticking = false;

  function update(): void {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y < vh) {
      el!.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      el!.style.opacity = String(Math.max(0, 1 - y / (vh * 0.85)));
    } else {
      el!.style.opacity = '0';
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

export function initSpotlight(): void {
  const section = document.querySelector<HTMLElement>('[data-spotlight]');
  const spot = section?.querySelector<HTMLElement>('[data-spot]');
  if (!section || !spot) return;

  let pending = false;
  let px = 0;
  let py = 0;

  section.addEventListener(
    'pointermove',
    (e) => {
      const rect = section.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          spot.style.background = `radial-gradient(600px circle at ${px}px ${py}px, rgba(196, 20, 20, 0.10), transparent 55%)`;
          spot.style.opacity = '1';
        });
      }
    },
    { passive: true },
  );

  section.addEventListener('pointerleave', () => {
    spot.style.opacity = '0';
  });
}
