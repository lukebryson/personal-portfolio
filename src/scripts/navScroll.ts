/**
 * Nav scroll state (§4.6), active-section highlighting, and the
 * fixed scroll progress bar (§4.7). One rAF-coalesced scroll handler.
 */
export function initNavScroll(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  let ticking = false;

  function update(): void {
    ticking = false;
    const y = window.scrollY;

    nav?.classList.toggle('scrolled', y > 40);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
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
  update();

  // Active section link
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-navlink]');
  const sections = Array.from(links)
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((s): s is HTMLElement => s !== null);

  if (sections.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          link.classList.toggle('active', link.hash === `#${entry.target.id}`);
        }
      }
    },
    { threshold: 0.4 },
  );
  sections.forEach((s) => io.observe(s));
}
