// becomes short: calls usePerimeterWalk(), calls useWalkAnimation(movementPhase), 
// computes the outer positioning style from x/y, renders the page layout (<h1>, wrapper divs) and <CatSprite>.

'use client';

import Ember from '../assets/sprites/Ember.png';
import { useState, useEffect } from "react";
import { clamp, randomInt, mod } from './lib/mathUtils'

const STEP = 10;

const BOUNDS = {
  minX: -300,
  maxX: 300,
  minY: -200,
  maxY: 200,
};

const BURSTS = {
  short: [2, 3],
  medium: [4, 6],
  long: [7, 10],
};

const STEP_DELAY = 120;
const PAUSE_RANGE = [400, 1200];
const REVERSE_CHANCE = 0.3; // chance to flip direction at the start of each burst

const FRAME_SIZE = 32; // each frame in the sprite sheet is 32x32px
const REST_FRAME = 0;  // frame index 0 = rest (top of the sheet)
const WALK_FRAMES = [1, 2, 3]; // walk A, walk B, walk C
const ANIM_FRAME_DELAY = 150; // ms between leg-cycle frames while walking

type CatLocation = {
  x: number;
  y: number;
};

type Facing = "up" | "down" | "left" | "right";

type MovementPhase = "walking" | "resting";

type PerimeterState = {
  progress: number;   // distance traveled along the perimeter loop
  direction: 1 | -1;  // 1 = clockwise, -1 = counter-clockwise
};

const pickBurstLength = (): number => {
  const types = Object.keys(BURSTS) as Array<keyof typeof BURSTS>;
  const chosenType = types[randomInt(0, types.length - 1)];
  const [min, max] = BURSTS[chosenType];
  return randomInt(min, max);
};

// perimeter geometry: clockwise loop starting at top-left corner
const PERIM_WIDTH = BOUNDS.maxX - BOUNDS.minX;
const PERIM_HEIGHT = BOUNDS.maxY - BOUNDS.minY;
const PERIM_TOTAL = 2 * PERIM_WIDTH + 2 * PERIM_HEIGHT;

// convert progress along the loop into an {x, y} position
const getPositionOnPerimeter = (progress: number): CatLocation => {
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
const getCurrentEdge = (progress: number): "top" | "right" | "bottom" | "left" => {
  const p = mod(progress, PERIM_TOTAL);
  if (p < PERIM_WIDTH) return "top";
  if (p < PERIM_WIDTH + PERIM_HEIGHT) return "right";
  if (p < 2 * PERIM_WIDTH + PERIM_HEIGHT) return "bottom";
  return "left";
};

// facing when moving clockwise, per edge — flipped for counter-clockwise
const CLOCKWISE_FACING: Record<"top" | "right" | "bottom" | "left", Facing> = {
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

const getFacing = (progress: number, direction: 1 | -1): Facing => {
  const edge = getCurrentEdge(progress);
  const clockwiseFacing = CLOCKWISE_FACING[edge];
  return direction === 1 ? clockwiseFacing : OPPOSITE_FACING[clockwiseFacing];
};

// computes the full CSS transform for the sprite: mirror on horizontal edges,
// rotate + conditional mirror on vertical edges so feet stay on the perimeter
// and the head points toward the center of the viewport
const getSpriteTransform = (progress: number, direction: 1 | -1): string => {
  const edge = getCurrentEdge(progress);

  if (edge === "top" || edge === "bottom") {
    const facing = getFacing(progress, direction);
    return facing === "right" ? "scaleX(-1)" : "scaleX(1)";
  }

  const rotateDeg = edge === "left" ? 90 : -90;
  const needsMirror = direction === -1;
  return needsMirror ? `rotate(${rotateDeg}deg) scaleX(-1)` : `rotate(${rotateDeg}deg)`;
};

function Cats() {
  const [perimeterState, setPerimeterState] = useState<PerimeterState>({
    progress: 0,
    direction: 1,
  });
  const [movementPhase, setMovementPhase] = useState<MovementPhase>("resting");
  const [walkFrameIndex, setWalkFrameIndex] = useState(0); // index into WALK_FRAMES

  const catLocation = getPositionOnPerimeter(perimeterState.progress);
  const facing = getFacing(perimeterState.progress, perimeterState.direction);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runBurst = (): void => {
      const stepsRemaining: number = pickBurstLength();

      // chance to reverse direction at the start of a burst
      setPerimeterState((prev) => {
        const shouldReverse = Math.random() < REVERSE_CHANCE;
        return shouldReverse ? { ...prev, direction: prev.direction === 1 ? -1 : 1 } : prev;
      });

      setMovementPhase("walking");

      const takeStep = (stepsLeft: number): void => {
        if (stepsLeft <= 0) {
          setMovementPhase("resting");
          const pauseDuration = randomInt(PAUSE_RANGE[0], PAUSE_RANGE[1]);
          timeoutId = setTimeout(runBurst, pauseDuration);
          return;
        }

        setPerimeterState((prev) => ({
          ...prev,
          progress: mod(prev.progress + STEP * prev.direction, PERIM_TOTAL),
        }));

        timeoutId = setTimeout(() => takeStep(stepsLeft - 1), STEP_DELAY);
      };

      takeStep(stepsRemaining);
    };

    runBurst();

    return () => clearTimeout(timeoutId);
  }, []);

  // separate timer: cycles the leg-animation frame while walking
  useEffect(() => {
    if (movementPhase !== "walking") return;

    const intervalId = setInterval(() => {
      setWalkFrameIndex((prev) => (prev + 1) % WALK_FRAMES.length);
    }, ANIM_FRAME_DELAY);

    return () => clearInterval(intervalId);
  }, [movementPhase]);

  const currentFrame = movementPhase === "resting" ? REST_FRAME : WALK_FRAMES[walkFrameIndex];

  const spriteStyle: React.CSSProperties = {
    width: `${FRAME_SIZE}px`,
    height: `${FRAME_SIZE}px`,
    backgroundImage: `url(${Ember.src})`,
    backgroundPosition: `0px -${currentFrame * FRAME_SIZE}px`,
    backgroundRepeat: "no-repeat",
    imageRendering: "pixelated",
    transform: getSpriteTransform(perimeterState.progress, perimeterState.direction),
  };

  return (
    <>
      <div>
        <h1 className="text-amber-300">Cat Cafe</h1>
        <p>Let's do this!</p>
      </div>
      <div className="relative w-full h-screen">
        <div
          style={{
            position: "absolute",
            left: `calc(50% + ${catLocation.x}px)`,
            top: `calc(50% + ${catLocation.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div style={spriteStyle} aria-label={`Cat facing ${facing}, ${movementPhase}`} role="img" />
        </div>
      </div>
    </>
  );
}

export default Cats;