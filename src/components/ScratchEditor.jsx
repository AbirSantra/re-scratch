import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useScratchStore } from "../store/useScratchStore";
import Sidebar from "./Sidebar";
import ScriptArea from "./ScriptArea";
import Stage from "./Stage";
import SpritePanel from "./SpritePanel";
import Header from "./Header";

export default function ScratchEditor() {
  const { sprites, selectedSpriteId } = useScratchStore(
    useShallow((s) => ({
      sprites: s.sprites,
      selectedSpriteId: s.selectedSpriteId,
    })),
  );

  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: "#0d1117",
        fontFamily: "'DM Mono', 'Fira Code', 'Cascadia Code', monospace",
        color: "#c9d1d9",
      }}
    >
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Block palette */}
        <Sidebar />

        {/* Center: Script area for selected sprite */}
        <div
          className="flex-1 overflow-hidden border-r"
          style={{ borderColor: "#21262d", minWidth: 280 }}
        >
          {selectedSprite ? (
            <ScriptArea sprite={selectedSprite} />
          ) : (
            <div
              className="flex items-center justify-center h-full text-sm"
              style={{ color: "#484f58" }}
            >
              Select a sprite to edit its script
            </div>
          )}
        </div>

        {/* Right: Stage + Sprite panel */}
        <div
          className="flex flex-col gap-0 overflow-hidden"
          style={{ flexShrink: 0 }}
        >
          {/* Stage */}
          <div className="p-4 pb-2">
            <Stage />
          </div>

          {/* Sprites + panel row */}
          <div
            className="flex flex-1 w-full gap-0 border-t px-4 py-3 overflow-hidden"
            style={{ borderColor: "#21262d" }}
          >
            <SpritePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
