import React from "react";
import { useAnimation } from "../hooks/useAnimation";
import { useScratchStore } from "../store/useScratchStore";
import {
  Gamepad2Icon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
} from "lucide-react";

export default function Header() {
  const { play, stop, isPlaying } = useAnimation();
  const resetPositions = useScratchStore((s) => s.resetPositions);

  return (
    <header
      className="flex items-center gap-3 px-5 py-3 border-b flex-shrink-0"
      style={{ background: "#161b22", borderColor: "#21262d" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="">
          <Gamepad2Icon className="size-10" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-base font-bold text-white tracking-tight leading-none">
            ReScratch
          </div>
          <div className="text-xs mt-0.5" style={{ color: "#484f58" }}>
            Visual Code Editor for Scratch
          </div>
        </div>
      </div>

      <div
        className="ml-4 mr-auto h-5 w-px"
        style={{ background: "#21262d" }}
      />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={play}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: isPlaying
              ? "#161b22"
              : "linear-gradient(135deg, #238636, #2ea043)",
            color: isPlaying ? "#3d4f3d" : "white",
            cursor: isPlaying ? "not-allowed" : "pointer",
            border: isPlaying ? "1px solid #21262d" : "none",
            boxShadow: isPlaying ? "none" : "0 3px 10px rgba(46,160,67,0.4)",
          }}
        >
          <span>
            <PlayIcon className="size-4" />
          </span>
          <span>Play All</span>
        </button>

        <button
          onClick={stop}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:brightness-125"
          style={{
            background: "#21262d",
            color: "#f85149",
            border: "1px solid #f8514933",
          }}
        >
          <span>
            <SquareIcon className="size-4" />
          </span>
          <span>Stop</span>
        </button>

        <button
          onClick={resetPositions}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all hover:brightness-125"
          style={{
            background: "#21262d",
            color: "#8b949e",
            border: "1px solid #30363d",
          }}
        >
          <span>
            <RotateCcwIcon className="size-4" />
          </span>
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
