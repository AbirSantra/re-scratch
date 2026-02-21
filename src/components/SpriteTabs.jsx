import React from "react";
import CatSprite from "./CatSprite";
import { useScratchStore } from "../store/useScratchStore";
import { PlusIcon, XIcon } from "lucide-react";

export default function SpriteTabs() {
  const sprites = useScratchStore((s) => s.sprites);
  const selectedSpriteId = useScratchStore((s) => s.selectedSpriteId);
  const selectSprite = useScratchStore((s) => s.selectSprite);
  const addSprite = useScratchStore((s) => s.addSprite);
  const removeSprite = useScratchStore((s) => s.removeSprite);

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
            className="flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-bold transition-all flex-shrink-0 group"
            style={{
              background: isSelected ? "#0d1117" : "transparent",
              color: isSelected ? "white" : "#6e7681",
              borderTop: `2px solid ${isSelected ? sprite.color : "#30363d"}`,
              borderLeft: `1px solid #30363d`,
              borderRight: `1px solid #30363d`,
              marginBottom: isSelected ? "-1px" : 0,
            }}
          >
            <div className="w-4 h-4 rounded-full shrink-0">
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
            {/* Remove button — only show if more than one sprite exists */}
            {sprites.length > 1 && (
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity  flex items-center justify-center size-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSprite(sprite.id);
                }}
              >
                <XIcon />
              </span>
            )}
          </button>
        );
      })}

      {/* Add sprite button */}
      <button
        onClick={addSprite}
        className="flex items-center gap-2 px-2 py-2 text-xs font-bold transition-all shrink-0"
        style={{
          background: "transparent",
          color: "#6e7681",
        }}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
