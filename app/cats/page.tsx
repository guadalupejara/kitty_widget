'use client';

import Ember from '../assets/sprites/Ember.png';
import { usePerimeterWalk } from './hooks/usePerimeterWalk';
import { FRAME_SIZE } from './constants';
import { useWalkAnimation } from './hooks/useWalkAnimation';

function Cats() {
  const { location, facing, movementPhase, spriteTransform } = usePerimeterWalk();
  const currentFrame = useWalkAnimation(movementPhase);

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