import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useScratchStore } from "../store/useScratchStore";
import CatSprite from "./CatSprite";

export default function SpritePanel() {
  const { sprites, selectedSpriteId, selectSprite, addSprite, removeSprite } =
    useScratchStore(
      useShallow((s) => ({
        sprites: s.sprites,
        selectedSpriteId: s.selectedSpriteId,
        selectSprite: s.selectSprite,
        addSprite: s.addSprite,
        removeSprite: s.removeSprite,
      })),
    );

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "#21262d" }}
      >
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#8b949e" }}
        >
          Sprites
        </span>
        <button
          onClick={addSprite}
          className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #238636, #2ea043)",
            color: "white",
            boxShadow: "0 2px 6px rgba(46,160,67,0.4)",
          }}
        >
          + Add
        </button>
      </div>

      {/* Sprite list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {sprites.map((sprite) => {
          const isSelected = sprite.id === selectedSpriteId;
          return (
            <div
              key={sprite.id}
              onClick={() => selectSprite(sprite.id)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all group"
              style={{
                background: isSelected ? `${sprite.color}18` : "transparent",
                border: `1px solid ${isSelected ? sprite.color + "55" : "transparent"}`,
                boxShadow: isSelected ? `0 0 12px ${sprite.color}22` : "none",
              }}
            >
              {/* Mini sprite preview */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{
                  background: sprite.color + "18",
                  border: `1.5px solid ${sprite.color}44`,
                  filter: `drop-shadow(0 0 4px ${sprite.color}55)`,
                }}
              >
                <div style={{ width: 28, height: 28 }}>
                  <CatSprite color={sprite.color} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-semibold truncate"
                  style={{ color: isSelected ? "white" : "#c9d1d9" }}
                >
                  {sprite.name}
                </div>
                <div className="text-xs" style={{ color: "#484f58" }}>
                  {sprite.blocks.length} blocks
                </div>
              </div>

              {/* Remove button */}
              {sprites.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSprite(sprite.id);
                  }}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-base leading-none transition-opacity"
                  style={{ color: "#f85149" }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Hero feature hint */}
      <div
        className="mx-2 mb-2 p-2.5 rounded-xl text-xs"
        style={{
          background: "rgba(46,160,67,0.08)",
          border: "1px solid rgba(46,160,67,0.25)",
          color: "#7ee787",
          lineHeight: 1.5,
        }}
      >
        <span className="font-bold">⚡ Hero Feature</span>
        <br />
        Sprites swap scripts on collision!
      </div>
    </div>
  );
}
