import { SPRITE_SIZE } from "../constants/stage";

/**
 * Check AABB collision between two sprites.
 */
export function checkCollision(s1, s2) {
  return (
    Math.abs(s1.x - s2.x) < SPRITE_SIZE && Math.abs(s1.y - s2.y) < SPRITE_SIZE
  );
}

/**
 * Promise-based sleep that respects an AbortSignal.
 */
export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/**
 * Clamp a value between min and max.
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
