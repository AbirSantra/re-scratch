import React from "react";
import { useScratchStore } from "../store/useScratchStore";
import Sidebar from "./Sidebar";
import ScriptArea from "./ScriptArea";
import Stage from "./Stage";
import SpritePanel from "./SpritePanel";
import Header from "./Header";
import SpriteTabs from "./SpriteTabs";

export default function ScratchEditor() {
  const sprites = useScratchStore((s) => s.sprites);
  const selectedSpriteId = useScratchStore((s) => s.selectedSpriteId);
  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        fontFamily: "'DM Mono', 'Fira Code', 'Cascadia Code', monospace",
        color: "var(--text-primary)",
      }}
    >
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Block palette */}
        <Sidebar />

        {/* Center: Tabs + Script area */}
        <div
          className="flex-1 flex flex-col overflow-hidden border-r"
          style={{ borderColor: "var(--bg-tertiary)", minWidth: 280 }}
        >
          <SpriteTabs />
          {selectedSprite ? (
            <ScriptArea sprite={selectedSprite} />
          ) : (
            <div
              className="flex items-center justify-center h-full text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Select a sprite to edit its script
            </div>
          )}
        </div>

        {/* Right: Stage + Sprite panel */}
        <div
          className="flex flex-col overflow-hidden w-fit"
          style={{ flexShrink: 0 }}
        >
          <div className="p-4 flex justify-center items-center">
            <Stage />
          </div>
          <div
            className="flex flex-1 gap-0 border-t px-4 py-3 overflow-hidden"
            style={{ borderColor: "var(--bg-tertiary)" }}
          >
            <SpritePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
