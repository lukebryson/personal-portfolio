import { initReveal } from './reveal';

/**
 * Capability gates shared by every effect module.
 * - reducedMotion: no canvas loop, parallax, tilt, magnet or cursor.
 * - finePointer: cursor/magnetic/tilt effects only on hover-capable devices.
 */
export const gates = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
  finePointer: window.matchMedia('(hover: hover) and (pointer: fine)'),
};

initReveal();
