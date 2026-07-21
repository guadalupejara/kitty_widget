'use client';

import React from "react";
import Cat from '../assets/sprites/cat.png';
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const STEP = 10;

function Cats() {
  const [catLocation, setCatLocation] = useState(
    {x: 0,
    y: 0,}
  );

  const moveUp = () => setCatLocation((prev) => ({ ...prev, y: prev.y - STEP }));
  const moveDown = () => setCatLocation((prev) => ({ ...prev, y: prev.y + STEP }));
  const moveLeft = () => setCatLocation((prev) => ({ ...prev, x: prev.x - STEP }));
  const moveRight = () => setCatLocation((prev) => ({ ...prev, x: prev.x + STEP }));

  return (
    <> <div>
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <button
          onClick={moveUp}
          className="w-12 h-12 flex items-center justify-center bg-amber-300 rounded"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={moveLeft}
            className="w-12 h-12 flex items-center justify-center bg-amber-300 rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            onClick={moveDown}
            className="w-12 h-12 flex items-center justify-center bg-amber-300 rounded"
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <button
            onClick={moveRight}
            className="w-12 h-12 flex items-center justify-center bg-amber-300 rounded"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div></>
   
  );
}

export default Cats;