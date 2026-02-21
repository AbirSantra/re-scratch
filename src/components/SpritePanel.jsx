import React from "react";
import { useScratchStore } from "../store/useScratchStore";
import CatSprite from "./CatSprite";
import { ZapIcon } from "lucide-react";

function ControlRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <span className="text-xs flex-2" style={{ color: "#6e7681" }}>
        {label}
      </span>
      <div className="flex-3">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, disabled, min, max, step = 1 }) {
  return (
    <input
      type="number"
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg px-2 py-1 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
      style={{
        background: disabled ? "#0d1117" : "#21262d",
        color: disabled ? "#484f58" : "#c9d1d9",
        border: "1px solid #30363d",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function TextInput({ value, onChange, disabled }) {
  return (
    <input
      type="text"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
      style={{
        background: disabled ? "#0d1117" : "#21262d",
        color: disabled ? "#484f58" : "#c9d1d9",
        border: "1px solid #30363d",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

export default function SpritePanel() {
  const sprites = useScratchStore((s) => s.sprites);
  const selectedSpriteId = useScratchStore((s) => s.selectedSpriteId);
  const updateSprite = useScratchStore((s) => s.updateSprite);
  const isPlaying = useScratchStore((s) => s.isPlaying);

  const sprite = sprites.find((s) => s.id === selectedSpriteId);

  if (!sprite) return null;

  const update = (key) => (value) => updateSprite(sprite.id, { [key]: value });
  const disabled = isPlaying;

  const setupCollisionDemo = () => {
    if (isPlaying) return;
    const [cat1, cat2] = sprites;
    if (!cat1 || !cat2) return;

    const makeId = () =>
      `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    updateSprite(cat1.id, {
      x: -120,
      y: 0,
      rotation: 0,
      blocks: [
        {
          id: makeId(),
          type: "repeat",
          params: { times: 24 },
          children: [
            {
              id: makeId(),
              type: "move",
              params: { steps: 10 },
              children: undefined,
            },
          ],
        },
      ],
    });

    updateSprite(cat2.id, {
      x: 120,
      y: 0,
      rotation: 0,
      blocks: [
        {
          id: makeId(),
          type: "repeat",
          params: { times: 24 },
          children: [
            {
              id: makeId(),
              type: "move",
              params: { steps: -10 },
              children: undefined,
            },
          ],
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-0 overflow-y-auto w-full">
      {/* Sprite preview header */}
      <div
        className="flex items-center gap-3 p-3 border-b"
        style={{ borderColor: "#21262d" }}
      >
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            background: sprite.color + "18",
            border: `1.5px solid ${sprite.color}44`,
          }}
        >
          <div style={{ width: 32, height: 32 }}>
            <CatSprite color={sprite.color} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white truncate">
            {sprite.name}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "#484f58" }}>
            {sprite.blocks.length} blocks
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 p-3">
        <div className="flex gap-4">
          {/* Name */}
          <ControlRow label="Name">
            <TextInput
              value={sprite.name}
              onChange={update("name")}
              disabled={disabled}
            />
          </ControlRow>
          {/* Size */}
          <ControlRow label="Size">
            <NumberInput
              value={sprite.size ?? 100}
              onChange={update("size")}
              disabled={disabled}
              min={10}
              max={500}
              step={10}
            />
          </ControlRow>
        </div>

        {/* X and Y */}
        <div className="flex gap-4">
          <ControlRow label="X">
            <NumberInput
              value={Math.round(sprite.x)}
              onChange={update("x")}
              disabled={disabled}
              step={1}
            />
          </ControlRow>
          <ControlRow label="Y">
            <NumberInput
              value={Math.round(sprite.y)}
              onChange={update("y")}
              disabled={disabled}
              step={1}
            />
          </ControlRow>
        </div>

        <div className="flex gap-4">
          {/* Rotation */}
          <ControlRow label="Rotation">
            <NumberInput
              value={Math.round(sprite.rotation)}
              onChange={update("rotation")}
              disabled={disabled}
              min={-360}
              max={360}
              step={1}
            />
          </ControlRow>

          {/* Show toggle */}
          <ControlRow label="Show">
            <button
              disabled={disabled}
              onClick={() => update("show")(!sprite.show)}
              className="w-full rounded-lg px-2 py-1 text-xs font-bold transition-all"
              style={{
                background: sprite.show
                  ? "rgba(46,160,67,0.15)"
                  : "rgba(248,81,73,0.15)",
                color: sprite.show ? "#7ee787" : "#f85149",
                border: `1px solid ${sprite.show ? "rgba(46,160,67,0.3)" : "rgba(248,81,73,0.3)"}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {sprite.show ? "Visible" : "Hidden"}
            </button>
          </ControlRow>
        </div>

        {/* Disabled hint when playing */}
        {isPlaying && (
          <p className="text-xs text-center" style={{ color: "#484f58" }}>
            Controls locked while playing
          </p>
        )}
      </div>

      {/* Hero feature hint */}
      <div
        className="mx-3 mt-auto mb-3 p-2.5 rounded-xl text-xs flex flex-col gap-2"
        style={{
          background: "rgba(46,160,67,0.08)",
          border: "1px solid rgba(46,160,67,0.25)",
          color: "#7ee787",
          lineHeight: 1.5,
        }}
      >
        <span className="font-bold text-base flex items-center gap-1 mb-1">
          <ZapIcon /> Hero Feature
        </span>
        <p className="">
          Sprites swap scripts on collision! <br /> Click below to automatically
          set up a demo. <br /> Then click Play and watch the magic happen ✨
        </p>
        <button
          onClick={setupCollisionDemo}
          disabled={isPlaying}
          className="w-full mt-2 py-2 rounded-lg text-xs font-bold transition-all"
          style={{
            background: isPlaying
              ? "rgba(46,160,67,0.05)"
              : "rgba(46,160,67,0.15)",
            color: isPlaying ? "#3d6e4a" : "#7ee787",
            border: "1px solid rgba(46,160,67,0.3)",
            cursor: isPlaying ? "not-allowed" : "pointer",
          }}
        >
          Apply Template
        </button>
      </div>
    </div>
  );
}
