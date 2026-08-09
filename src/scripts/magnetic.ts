/**
 * Magnetic hover effects (§4.2-4.3).
 * - [data-magnetic] cards: translate ±8px + rotateX/Y ±6° toward the cursor,
 *   cursor-tracking radial glow, accent border/shadow via .is-active.
 * - [data-magnet] buttons: soft translate toward the cursor, strength ~5px.
 * Only initialised on fine-pointer devices without reduced motion; handlers
 * also re-check the reduced-motion gate live.
 */

const ENTER_TRANSITION =
  'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
const LEAVE_TRANSITION =
  'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease, box-shadow 0.4s ease';

export function initMagnetic(reducedMotion: MediaQueryList): void {
  for (const card of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    const glow = card.querySelector<HTMLElement>('[data-cardglow]');
    let rect: DOMRect | null = null;
    let pending = false;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      pending = false;
      card.style.transform = `translate(${(px - 0.5) * 16}px, ${(py - 0.5) * 16}px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg)`;
      if (glow) {
        glow.style.background = `radial-gradient(280px circle at ${px * 100}% ${py * 100}%, rgba(196, 20, 20, 0.20), transparent 62%)`;
        glow.style.opacity = '1';
      }
    };

    card.addEventListener('pointerenter', () => {
      if (reducedMotion.matches) return;
      rect = card.getBoundingClientRect();
      card.style.transition = ENTER_TRANSITION;
      card.classList.add('is-active');
    });

    card.addEventListener(
      'pointermove',
      (e) => {
        if (reducedMotion.matches || !rect) return;
        px = (e.clientX - rect.left) / rect.width;
        py = (e.clientY - rect.top) / rect.height;
        if (!pending) {
          pending = true;
          requestAnimationFrame(apply);
        }
      },
      { passive: true },
    );

    card.addEventListener('pointerleave', () => {
      rect = null;
      card.style.transition = LEAVE_TRANSITION;
      card.style.transform = '';
      card.classList.remove('is-active');
      if (glow) glow.style.opacity = '0';
    });
  }

  for (const btn of document.querySelectorAll<HTMLElement>('[data-magnet]')) {
    let rect: DOMRect | null = null;
    let pending = false;
    let dx = 0;
    let dy = 0;

    const apply = () => {
      pending = false;
      btn.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
    };

    btn.addEventListener('pointerenter', () => {
      if (reducedMotion.matches) return;
      rect = btn.getBoundingClientRect();
      btn.style.transition = 'transform 0.1s ease-out';
    });

    btn.addEventListener(
      'pointermove',
      (e) => {
        if (reducedMotion.matches || !rect) return;
        dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        if (!pending) {
          pending = true;
          requestAnimationFrame(apply);
        }
      },
      { passive: true },
    );

    btn.addEventListener('pointerleave', () => {
      rect = null;
      btn.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
      btn.style.transform = '';
    });
  }
}
