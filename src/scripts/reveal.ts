/**
 * Scroll reveal via IntersectionObserver.
 * Hidden state lives in CSS under `html.js [data-reveal]`; this module adds
 * `.revealed` and applies the per-element stagger from `data-delay` (ms).
 */
export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (els.length === 0) return;

  const showAll = () => els.forEach((el) => el.classList.add('revealed'));

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
  );

  for (const el of els) {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    io.observe(el);
  }
}
