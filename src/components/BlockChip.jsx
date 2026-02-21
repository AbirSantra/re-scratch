import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DND_TYPES } from "../constants/blocks";
import { useShallow } from "zustand/react/shallow";
import { useScratchStore } from "../store/useScratchStore";

const BLOCK_COLORS = {
  move: { bg: "#4C97FF", dark: "#2b6cb0" },
  turn: { bg: "#4C97FF", dark: "#2b6cb0" },
  goto: { bg: "#4C97FF", dark: "#2b6cb0" },
  repeat: { bg: "#FFAB19", dark: "#b27200" },
  say: { bg: "#9966FF", dark: "#6b3fa0" },
  think: { bg: "#9966FF", dark: "#6b3fa0" },
};

function ParamInput({ value, onChange, width = "w-12", type = "number" }) {
  return (
    <input
      className="rounded px-1.5 py-0.5 text-gray-900 font-bold text-xs mx-1 focus:outline-none focus:ring-2 focus:ring-white/50"
      style={{ width: type === "text" ? 80 : 48 }}
      type={type}
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default function BlockChip({ block, index, spriteId }) {
  const ref = useRef(null);
  const { removeBlock, updateBlockParam, reorderBlock } = useScratchStore(
    useShallow((s) => ({
      removeBlock: s.removeBlock,
      updateBlockParam: s.updateBlockParam,
      reorderBlock: s.reorderBlock,
    })),
  );

  const colors = BLOCK_COLORS[block.type] || { bg: "#888", dark: "#555" };

  // ── Drag this block ───────────────────────────────────────────────────────
  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPES.SCRIPT_BLOCK,
    item: { id: block.id, index, spriteId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // ── Drop target: reorder when another script block hovers ─────────────────
  const [{ isOver }, drop] = useDrop({
    accept: DND_TYPES.SCRIPT_BLOCK,
    hover(item) {
      if (!ref.current) return;
      if (item.id === block.id) return;
      if (item.spriteId !== spriteId) return;
      if (item.index === index) return;

      reorderBlock(spriteId, item.index, index);
      item.index = index; // mutate the drag item so hover doesn't fire repeatedly
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  drag(drop(ref));

  const change = (key) => (val) =>
    updateBlockParam(spriteId, block.id, key, val);

  return (
    <div
      ref={ref}
      className="flex items-center gap-1 rounded-xl px-3 py-2 text-white text-xs font-bold select-none mb-1.5 group transition-all"
      style={{
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.dark})`,
        boxShadow: isOver
          ? `0 0 0 2px white, 0 4px 12px ${colors.bg}88`
          : `0 2px 8px ${colors.bg}55`,
        opacity: isDragging ? 0.35 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        transform: isOver ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Drag handle */}
      <span className="opacity-40 mr-0.5 text-base leading-none">⠿</span>

      {/* Block content */}
      {block.type === "move" && (
        <>
          <span>Move</span>
          <ParamInput value={block.params.steps} onChange={change("steps")} />
          <span>steps</span>
        </>
      )}
      {block.type === "turn" && (
        <>
          <span>Turn</span>
          <ParamInput
            value={block.params.degrees}
            onChange={change("degrees")}
          />
          <span>°</span>
        </>
      )}
      {block.type === "goto" && (
        <>
          <span>Go to x:</span>
          <ParamInput value={block.params.x} onChange={change("x")} />
          <span>y:</span>
          <ParamInput value={block.params.y} onChange={change("y")} />
        </>
      )}
      {block.type === "repeat" && (
        <>
          <span>Repeat</span>
          <ParamInput value={block.params.times} onChange={change("times")} />
          <span>times</span>
        </>
      )}
      {block.type === "say" && (
        <>
          <span>Say</span>
          <ParamInput
            value={block.params.text}
            onChange={change("text")}
            type="text"
          />
          <span>for</span>
          <ParamInput value={block.params.secs} onChange={change("secs")} />
          <span>s</span>
        </>
      )}
      {block.type === "think" && (
        <>
          <span>Think</span>
          <ParamInput
            value={block.params.text}
            onChange={change("text")}
            type="text"
          />
          <span>for</span>
          <ParamInput value={block.params.secs} onChange={change("secs")} />
          <span>s</span>
        </>
      )}

      {/* Remove button */}
      <button
        className="ml-auto pl-2 opacity-0 group-hover:opacity-70 hover:!opacity-100 text-white transition-opacity text-sm leading-none"
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(spriteId, block.id);
        }}
      >
        ×
      </button>
    </div>
  );
}
