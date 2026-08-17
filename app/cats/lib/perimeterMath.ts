// This is specifically perimeter-walking geometry — pure functions, no React, no state. Fully unit-testable in isolation,
//  which matters since this is the trickiest math in the whole file.
import { mod } from './mathUtils'
import { BOUNDS } from '../constants';


export type CatLocation = {
  x: number;
  y: number;
};

export type Facing = "up" | "down" | "left" | "right";

export type Edge = "top" | "right" | "bottom" | "left";


// perimeter geometry: clockwise loop starting at top-left corner
export const PERIM_WIDTH = BOUNDS.maxX - BOUNDS.minX;
export const PERIM_HEIGHT = BOUNDS.maxY - BOUNDS.minY;
export const PERIM_TOTAL = 2 * PERIM_WIDTH + 2 * PERIM_HEIGHT;

// convert progress along the loop into an {x, y} position
export const getPositionOnPerimeter = (progress: number): CatLocation => {
  const p = mod(progress, PERIM_TOTAL);

  if (p < PERIM_WIDTH) {
    // top edge, left -> right
    return { x: BOUNDS.minX + p, y: BOUNDS.minY };
  } else if (p < PERIM_WIDTH + PERIM_HEIGHT) {
    // right edge, top -> bottom
    const t = p - PERIM_WIDTH;
    return { x: BOUNDS.maxX, y: BOUNDS.minY + t };
  } else if (p < 2 * PERIM_WIDTH + PERIM_HEIGHT) {
    // bottom edge, right -> left
    const t = p - PERIM_WIDTH - PERIM_HEIGHT;
    return { x: BOUNDS.maxX - t, y: BOUNDS.maxY };
  } else {
    // left edge, bottom -> top
    const t = p - 2 * PERIM_WIDTH - PERIM_HEIGHT;
    return { x: BOUNDS.minX, y: BOUNDS.maxY - t };
  }
};

// which edge the cat is currently on, needed to derive facing + sprite transform
export const getCurrentEdge = (progress: number): Edge => {
  const p = mod(progress, PERIM_TOTAL);
  if (p < PERIM_WIDTH) return "top";
  if (p < PERIM_WIDTH + PERIM_HEIGHT) return "right";
  if (p < 2 * PERIM_WIDTH + PERIM_HEIGHT) return "bottom";
  return "left";
};

// facing when moving clockwise, per edge — flipped for counter-clockwise
const CLOCKWISE_FACING: Record<Edge, Facing> = {
  top: "right",
  right: "down",
  bottom: "left",
  left: "up",
};

const OPPOSITE_FACING: Record<Facing, Facing> = {
  right: "left",
  left: "right",
  up: "down",
  down: "up",
};

export const getFacing = (progress: number, direction: 1 | -1): Facing => {
  const edge = getCurrentEdge(progress);
  const clockwiseFacing = CLOCKWISE_FACING[edge];
  return direction === 1 ? clockwiseFacing : OPPOSITE_FACING[clockwiseFacing];
};

// computes the full CSS transform for the sprite: mirror on horizontal edges,
// rotate + conditional mirror on vertical edges so feet stay on the perimeter
// and the head points toward the center of the viewport
export const getSpriteTransform = (progress: number, direction: 1 | -1): string => {
  const edge = getCurrentEdge(progress);

  if (edge === "top" || edge === "bottom") {
    const facing = getFacing(progress, direction);
    return facing === "right" ? "scaleX(-1)" : "scaleX(1)";
  }

  const rotateDeg = edge === "left" ? 90 : -90;
  const needsMirror = direction === -1;
  return needsMirror ? `rotate(${rotateDeg}deg) scaleX(-1)` : `rotate(${rotateDeg}deg)`;
};