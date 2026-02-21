import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useScratchStore } from "../store/useScratchStore";
import { STAGE_W, STAGE_H, SPRITE_SIZE } from "../constants/stage";
import SpeechBubble from "./SpeechBubble";
import CatSprite from "./CatSprite";

export default function Stage() {
  const { sprites, isPlaying } = useScratchStore(
    useShallow((s) => ({
      sprites: s.sprites,
      isPlaying: s.isPlaying,
    })),
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl flex-shrink-0"
      style={{
        width: STAGE_W,
        height: STAGE_H,
        background:
          "radial-gradient(ellipse at 25% 25%, #0e2a4a 0%, #0d1117 70%)",
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

      {/* Crosshair center */}
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
          className="absolute"
          style={{
            left: STAGE_W / 2 + sprite.x - SPRITE_SIZE / 2,
            top: STAGE_H / 2 - sprite.y - SPRITE_SIZE / 2,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `rotate(${sprite.rotation}deg)`,
            transition: "left 80ms linear, top 80ms linear",
            zIndex: 5,
          }}
        >
          <SpeechBubble bubble={sprite.speechBubble} />

          {/* Sprite body */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              filter: `drop-shadow(0 0 8px ${sprite.color}88)`,
            }}
          >
            <CatSprite color={sprite.color} />
          </div>

          {/* Name label */}
          <div
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}
          >
            {sprite.name}
          </div>
        </div>
      ))}

      {/* Coordinate overlay (bottom-left) */}
      <div
        className="absolute bottom-2 left-3 font-mono text-xs pointer-events-none"
        style={{ color: "rgba(255,255,255,0.15)", fontSize: 9 }}
      >
        {sprites.map((s) => (
          <div key={s.id}>
            {s.name}: ({Math.round(s.x)}, {Math.round(s.y)})
          </div>
        ))}
      </div>

      {/* Running indicator */}
      {isPlaying && (
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{
            background: "rgba(46, 160, 67, 0.15)",
            border: "1px solid rgba(46,160,67,0.4)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 font-bold" style={{ fontSize: 9 }}>
            RUNNING
          </span>
        </div>
      )}
    </div>
  );
}
