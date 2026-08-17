'use client';

import Ember from '../assets/sprites/Ember.png';
import { useState, useEffect } from "react";
import { usePerimeterWalk } from './hooks/usePerimeterWalk';

const FRAME_SIZE = 32; // each frame in the sprite sheet is 32x32px
const REST_FRAME = 0;  // frame index 0 = rest (top of the sheet)
const WALK_FRAMES = [1, 2, 3]; // walk A, walk B, walk C
const ANIM_FRAME_DELAY = 150; // ms between leg-cycle frames while walking

function Cats() {
  const { location, facing, movementPhase, spriteTransform } = usePerimeterWalk();
  const [walkFrameIndex, setWalkFrameIndex] = useState(0); // index into WALK_FRAMES

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
    transform: spriteTransform,
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
            left: `calc(50% + ${location.x}px)`,
            top: `calc(50% + ${location.y}px)`,
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