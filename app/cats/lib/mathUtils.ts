// These aren't cat-specific at all; they're generic helpers. Worth keeping separate from cat-specific math 
// since these are the ones most likely to get reused verbatim once FreeRoamCats needs the same utilities.

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const mod = (n: number, m: number): number => ((n % m) + m) % m;