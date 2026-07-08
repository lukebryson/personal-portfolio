/**
 * Custom cursor (§4.10): instant dot + lagging ring (lerp 0.18/frame).
 * Ring grows and recolours over interactive elements. Created only on
 * fine-pointer devices without reduced motion; the native cursor stays.
 */

const INTERACTIVE = 'a, button, [data-magnetic], [data-magnet]';

export function initCursor(): void {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  let x = 0;
  let y = 0;
  let ringX = 0;
  let ringY = 0;
  let visible = false;
  let rafId = 0;

  function frame(): void {
    ringX += (x - ringX) * 0.18;
    ringY += (y - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        ringX = x;
        ringY = y;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (e) => {
    if ((e.target as Element).closest(INTERACTIVE)) {
      ring.classList.add('is-hovering');
    }
  });

  document.addEventListener('pointerout', (e) => {
    if ((e.target as Element).closest(INTERACTIVE)) {
      ring.classList.remove('is-hovering');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (rafId === 0) {
      rafId = requestAnimationFrame(frame);
    }
  });

  rafId = requestAnimationFrame(frame);
}
