import { initReveal } from './reveal';
import { initNavScroll } from './navScroll';
import { initParticles } from './particles';
import { initParallax, initSpotlight } from './parallax';
import { initMagnetic } from './magnetic';

/**
 * Capability gates shared by every effect module.
 * - reducedMotion: no canvas loop, parallax, tilt, magnet or cursor.
 * - finePointer: cursor/magnetic/tilt effects only on hover-capable devices.
 */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

initReveal();
initNavScroll();

const canvas = document.querySelector<HTMLCanvasElement>('[data-particles]');
if (canvas) initParticles(canvas, reducedMotion);

if (!reducedMotion.matches) initParallax();
if (!reducedMotion.matches && finePointer.matches) {
  initSpotlight();
  initMagnetic(reducedMotion);
}
