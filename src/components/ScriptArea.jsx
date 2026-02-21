import React from "react";
import { useDrop } from "react-dnd";
import { DND_TYPES, ALL_BLOCK_DEFS, BLOCK_TYPES } from "../constants/blocks";
import { useScratchStore } from "../store/useScratchStore";
import BlockChip from "./BlockChip";

export default function ScriptArea({ sprite }) {
  const addBlock = useScratchStore((s) => s.addBlock);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DND_TYPES.SIDEBAR_BLOCK],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return; // a nested drop zone already handled it
      const def = ALL_BLOCK_DEFS.find((d) => d.type === item.blockType);
      if (def) {
        addBlock(sprite.id, {
          type: item.blockType,
          params: { ...item.params },
          children: item.blockType === BLOCK_TYPES.REPEAT ? [] : undefined,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isEmpty = sprite.blocks.length === 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d1117" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 border-b"
        style={{ borderColor: "#21262d", background: "#161b22" }}
      >
        <span
          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
          style={{
            background: sprite.color,
            boxShadow: `0 0 6px ${sprite.color}`,
          }}
        />
        <span className="text-xs font-bold text-gray-300 tracking-wide">
          {sprite.name}
          <span className="text-gray-600 font-normal ml-1">— Script</span>
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: "#21262d", color: "#8b949e" }}
        >
          {sprite.blocks.length}{" "}
          {sprite.blocks.length === 1 ? "block" : "blocks"}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={drop}
        className="flex-1 overflow-y-auto p-4 transition-colors pb-16"
        style={{
          background:
            isOver && canDrop ? "rgba(76, 151, 255, 0.06)" : "transparent",
          outline:
            isOver && canDrop ? "2px dashed rgba(76,151,255,0.4)" : "none",
          outlineOffset: -8,
          borderRadius: 8,
        }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pointer-events-none">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "#161b22", border: "1px dashed #30363d" }}
            >
              ⬇
            </div>
            <p className="text-xs text-center" style={{ color: "#484f58" }}>
              Drag blocks from the sidebar
              <br />
              to build {sprite.name}&apos;s script
            </p>
          </div>
        ) : (
          <div>
            {/* Blocks stack visual header */}
            <div
              className="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: "#484f58" }}
            >
              <div className="flex-1 h-px" style={{ background: "#21262d" }} />
              <span>Script</span>
              <div className="flex-1 h-px" style={{ background: "#21262d" }} />
            </div>
            {sprite.blocks.map((block, index) => (
              <BlockChip
                key={block.id}
                block={block}
                index={index}
                spriteId={sprite.id}
              />
            ))}
            {/* Drop hint at bottom */}
            {isOver && canDrop && (
              <div
                className="flex items-center justify-center rounded-xl py-2 text-xs font-bold mt-1.5"
                style={{
                  border: "2px dashed rgba(76,151,255,0.5)",
                  color: "rgba(76,151,255,0.7)",
                }}
              >
                Drop here to add
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
