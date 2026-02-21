import React, { useRef, useState } from "react";
import { useScratchStore } from "../store/useScratchStore";
import { STAGE_W, STAGE_H, SPRITE_SIZE } from "../constants/stage";
import SpeechBubble from "./SpeechBubble";
import CatSprite from "./CatSprite";

export default function Stage() {
  const sprites = useScratchStore((s) => s.sprites);
  const isPlaying = useScratchStore((s) => s.isPlaying);
  const updateSprite = useScratchStore((s) => s.updateSprite);
  const stageRef = useRef(null);
  const draggingRef = useRef(null); // { spriteId, offsetX, offsetY }

  const handleMouseDown = (e, sprite) => {
    if (isPlaying) return;
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    // Calculate offset from sprite center so it doesn't jump on click
    const spriteScreenX = rect.left + STAGE_W / 2 + sprite.x;
    const spriteScreenY = rect.top + STAGE_H / 2 - sprite.y;
    draggingRef.current = {
      spriteId: sprite.id,
      offsetX: e.clientX - spriteScreenX,
      offsetY: e.clientY - spriteScreenY,
    };
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current || !stageRef.current) return;
    const { spriteId, offsetX, offsetY } = draggingRef.current;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - STAGE_W / 2 - offsetX;
    const y = -(e.clientY - rect.top - STAGE_H / 2 - offsetY);
    updateSprite(spriteId, { x, y });
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  return (
    <div
      ref={stageRef}
      className="relative overflow-hidden rounded-2xl flex-shrink-0"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: STAGE_W,
        height: STAGE_H,
        // background:
        //   "radial-gradient(ellipse at 25% 25%, #0e2a4a 0%, #0d1117 70%)",
        boxShadow: "0 0 0 1px #30363d, 0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* Dot grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#4C97FF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Crosshair */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 20,
          height: 20,
        }}
      >
        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Sprites */}
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          onMouseDown={(e) => handleMouseDown(e, sprite)}
          className="absolute"
          style={{
            left: STAGE_W / 2 + sprite.x - SPRITE_SIZE / 2,
            top: STAGE_H / 2 - sprite.y - SPRITE_SIZE / 2,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `rotate(${sprite.rotation}deg) scale(${(sprite.size ?? 100) / 100})`,
            transition: isPlaying
              ? "left 80ms linear, top 80ms linear"
              : "none",
            zIndex: 5,
            cursor: isPlaying ? "default" : "grab",
            userSelect: "none",
            display: sprite.show === false ? "none" : "block",
          }}
        >
          <SpeechBubble bubble={sprite.speechBubble} />
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ filter: `drop-shadow(0 0 8px ${sprite.color}88)` }}
          >
            <CatSprite color={sprite.color} />
          </div>
          <div
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}
          >
            {sprite.name}
          </div>
        </div>
      ))}

      {/* Coordinate overlay */}
      <div
        className="absolute bottom-2 left-3 font-mono pointer-events-none"
        style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}
      >
        {sprites.map((s) => (
          <div key={s.id}>
            {s.name}: ({Math.round(s.x)}, {Math.round(s.y)})
          </div>
        ))}
      </div>

      {/* Status indicator */}
      {isPlaying ? (
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{
            background: "rgba(46,160,67,0.15)",
            border: "1px solid rgba(46,160,67,0.4)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 font-bold" style={{ fontSize: 9 }}>
            RUNNING
          </span>
        </div>
      ) : null}
    </div>
  );
}
