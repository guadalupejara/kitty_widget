'use client';

import Cat from '../assets/sprites/cat.png';
import Image from "next/image";
import { useState, useEffect } from "react";

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

type CatLocation = {
  x: number;
  y: number;
};

type Direction = "up" | "down" | "left" | "right";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickBurstLength = (): number => {
  const types = Object.keys(BURSTS) as Array<keyof typeof BURSTS>;
  const chosenType = types[randomInt(0, types.length - 1)];
  const [min, max] = BURSTS[chosenType];
  return randomInt(min, max);
};

const pickDirection = (): Direction => {
  const directions: Direction[] = ["up", "down", "left", "right"];
  return directions[randomInt(0, 3)];
};

function Cats() {
  const [catLocation, setCatLocation] = useState<CatLocation>({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runBurst = (): void => {
      const direction: Direction = pickDirection();
      const stepsRemaining: number = pickBurstLength();

      const takeStep = (stepsLeft: number): void => {
        if (stepsLeft <= 0) {
          const pauseDuration = randomInt(PAUSE_RANGE[0], PAUSE_RANGE[1]);
          timeoutId = setTimeout(runBurst, pauseDuration);
          return;
        }

        setCatLocation((prev: CatLocation): CatLocation => {
          switch (direction) {
            case "up":
              return { ...prev, y: clamp(prev.y - STEP, BOUNDS.minY, BOUNDS.maxY) };
            case "down":
              return { ...prev, y: clamp(prev.y + STEP, BOUNDS.minY, BOUNDS.maxY) };
            case "left":
              return { ...prev, x: clamp(prev.x - STEP, BOUNDS.minX, BOUNDS.maxX) };
            case "right":
              return { ...prev, x: clamp(prev.x + STEP, BOUNDS.minX, BOUNDS.maxX) };
            default:
              return prev;
          }
        });

        timeoutId = setTimeout(() => takeStep(stepsLeft - 1), STEP_DELAY);
      };

      takeStep(stepsRemaining);
    };

    runBurst();

    return () => clearTimeout(timeoutId);
  }, []);

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
          <Image src={Cat} alt="Cat" />
        </div>
      </div>
    </>
  );
}

export default Cats;