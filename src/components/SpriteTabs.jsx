import React from "react";
import CatSprite from "./CatSprite";
import { useScratchStore } from "../store/useScratchStore";

export default function SpriteTabs() {
  const sprites = useScratchStore((s) => s.sprites);
  const selectedSpriteId = useScratchStore((s) => s.selectedSpriteId);
  const selectSprite = useScratchStore((s) => s.selectSprite);

  return (
    <div
      className="flex items-end gap-1 px-3 pt-2 border-b overflow-x-auto"
      style={{ background: "#161b22", borderColor: "#21262d", flexShrink: 0 }}
    >
      {sprites.map((sprite) => {
        const isSelected = sprite.id === selectedSpriteId;
        return (
          <button
            key={sprite.id}
            onClick={() => selectSprite(sprite.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-bold transition-all flex-shrink-0"
            style={{
              background: isSelected ? "#0d1117" : "transparent",
              color: isSelected ? "white" : "#6e7681",
              borderTop: `2px solid ${isSelected ? sprite.color : "transparent"}`,
              borderLeft: `1px solid ${isSelected ? "#30363d" : "transparent"}`,
              borderRight: `1px solid ${isSelected ? "#30363d" : "transparent"}`,
              marginBottom: isSelected ? "-1px" : 0,
            }}
          >
            <div style={{ width: 20, height: 20, flexShrink: 0 }}>
              <CatSprite color={sprite.color} />
            </div>
            {sprite.name}
            {sprite.blocks.length > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-white"
                style={{ background: sprite.color, fontSize: 9 }}
              >
                {sprite.blocks.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
