// owns walkFrameIndex, runs the animation useEffect, takes movementPhase as an argument, returns currentFrame.
import { useState, useEffect } from 'react';
import { MovementPhase } from './usePerimeterWalk';
import { REST_FRAME, WALK_FRAMES, ANIM_FRAME_DELAY } from '../constants';

export function useWalkAnimation(movementPhase: MovementPhase): number {
  const [walkFrameIndex, setWalkFrameIndex] = useState(0); // index into WALK_FRAMES

  useEffect(() => {
    if (movementPhase !== "walking") return;

    const intervalId = setInterval(() => {
      setWalkFrameIndex((prev) => (prev + 1) % WALK_FRAMES.length);
    }, ANIM_FRAME_DELAY);

    return () => clearInterval(intervalId);
  }, [movementPhase]);

  const currentFrame = movementPhase === "resting" ? REST_FRAME : WALK_FRAMES[walkFrameIndex];

  return currentFrame;
}