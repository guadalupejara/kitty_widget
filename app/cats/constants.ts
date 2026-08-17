// All the tunable numbers in one place — when you're tweaking "make the cat walk faster," 
// you go to exactly one file, not hunting through logic.

export const BOUNDS = {
  minX: -300,
  maxX: 300,
  minY: -200,
  maxY: 200,
};

export const STEP = 10;

export const BURSTS = {
  short: [2, 3],
  medium: [4, 6],
  long: [7, 10],
};

export const STEP_DELAY = 120;
export const PAUSE_RANGE = [400, 1200];
export const REVERSE_CHANCE = 0.3;