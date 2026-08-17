// This hook uses perimeterMath.ts and mathUtils.ts internally but doesn't contain any of that math itself.
import { useState, useEffect } from 'react';
import { randomInt, mod } from '../lib/mathUtils';
import {
  getPositionOnPerimeter,
  getFacing,
  getSpriteTransform,
  PERIM_TOTAL,
  CatLocation,
  Facing,
} from '../lib/perimeterMath';
import { STEP, BURSTS, STEP_DELAY, PAUSE_RANGE, REVERSE_CHANCE } from '../constants';


export type MovementPhase = "walking" | "resting";

type PerimeterState = {
  progress: number;   // distance traveled along the perimeter loop
  direction: 1 | -1;  // 1 = clockwise, -1 = counter-clockwise
};

type UsePerimeterWalkResult = {
  location: CatLocation;
  facing: Facing;
  movementPhase: MovementPhase;
  spriteTransform: string;
};

const pickBurstLength = (): number => {
  const types = Object.keys(BURSTS) as Array<keyof typeof BURSTS>;
  const chosenType = types[randomInt(0, types.length - 1)];
  const [min, max] = BURSTS[chosenType];
  return randomInt(min, max);
};

export function usePerimeterWalk(): UsePerimeterWalkResult {
  const [perimeterState, setPerimeterState] = useState<PerimeterState>({
    progress: 0,
    direction: 1,
  });
  const [movementPhase, setMovementPhase] = useState<MovementPhase>("resting");

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

  const location = getPositionOnPerimeter(perimeterState.progress);
  const facing = getFacing(perimeterState.progress, perimeterState.direction);
  const spriteTransform = getSpriteTransform(perimeterState.progress, perimeterState.direction);

  return { location, facing, movementPhase, spriteTransform };
}