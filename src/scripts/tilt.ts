/**
 * Contact logo 3D tilt (§4.9): cursor position within the contact section
 * maps to rotateX/Y on the monogram, max ±13° from centre.
 */
export function initTilt(): void {
  const section = document.querySelector<HTMLElement>('[data-contact]');
  const logo = section?.querySelector<HTMLElement>('[data-tilt]');
  if (!section || !logo) return;

  let rect: DOMRect | null = null;
  let pending = false;
  let px = 0;
  let py = 0;

  const apply = () => {
    pending = false;
    logo.style.transform = `rotateY(${px * 26}deg) rotateX(${-py * 26}deg)`;
  };

  section.addEventListener('pointerenter', () => {
    rect = section.getBoundingClientRect();
  });

  section.addEventListener(
    'pointermove',
    (e) => {
      if (!rect) rect = section.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width - 0.5;
      py = (e.clientY - rect.top) / rect.height - 0.5;
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
    },
    { passive: true },
  );

  section.addEventListener('pointerleave', () => {
    rect = null;
    logo.style.transform = '';
  });

  // The cached rect goes stale as the page scrolls past the section.
  window.addEventListener('scroll', () => (rect = null), { passive: true });
}
