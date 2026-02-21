import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DND_TYPES, ALL_BLOCK_DEFS, BLOCK_TYPES } from "../constants/blocks";
import { useScratchStore } from "../store/useScratchStore";

const BLOCK_COLORS = {
  move: { bg: "#4C97FF", dark: "#2b6cb0" },
  turn: { bg: "#4C97FF", dark: "#2b6cb0" },
  goto: { bg: "#4C97FF", dark: "#2b6cb0" },
  repeat: { bg: "#FFAB19", dark: "#b27200" },
  say: { bg: "#9966FF", dark: "#6b3fa0" },
  think: { bg: "#9966FF", dark: "#6b3fa0" },
};

function ParamInput({ value, onChange, type = "number" }) {
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

function BlockLabel({ block, onChange }) {
  return (
    <>
      {block.type === "move" && (
        <>
          <span>Move</span>
          <ParamInput value={block.params.steps} onChange={onChange("steps")} />
          <span>steps</span>
        </>
      )}
      {block.type === "turn" && (
        <>
          <span>Turn</span>
          <ParamInput
            value={block.params.degrees}
            onChange={onChange("degrees")}
          />
          <span>°</span>
        </>
      )}
      {block.type === "goto" && (
        <>
          <span>Go to x:</span>
          <ParamInput value={block.params.x} onChange={onChange("x")} />
          <span>y:</span>
          <ParamInput value={block.params.y} onChange={onChange("y")} />
        </>
      )}
      {block.type === "repeat" && (
        <>
          <span>Repeat</span>
          <ParamInput value={block.params.times} onChange={onChange("times")} />
          <span>times</span>
        </>
      )}
      {block.type === "say" && (
        <>
          <span>Say</span>
          <ParamInput
            value={block.params.text}
            onChange={onChange("text")}
            type="text"
          />
          <span>for</span>
          <ParamInput value={block.params.secs} onChange={onChange("secs")} />
          <span>s</span>
        </>
      )}
      {block.type === "think" && (
        <>
          <span>Think</span>
          <ParamInput
            value={block.params.text}
            onChange={onChange("text")}
            type="text"
          />
          <span>for</span>
          <ParamInput value={block.params.secs} onChange={onChange("secs")} />
          <span>s</span>
        </>
      )}
    </>
  );
}

// ── Inner drop zone for repeat's children ─────────────────────────────────
function RepeatDropZone({ block, spriteId }) {
  const addBlockToRepeat = useScratchStore((s) => s.addBlockToRepeat);
  const reorderBlock = useScratchStore((s) => s.reorderBlock);

  const [{ isOver }, drop] = useDrop({
    accept: [DND_TYPES.SIDEBAR_BLOCK, DND_TYPES.SCRIPT_BLOCK],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return; // let child handle it
      if (item.blockType) {
        // From sidebar
        const def = ALL_BLOCK_DEFS.find((d) => d.type === item.blockType);
        if (def && item.blockType !== BLOCK_TYPES.REPEAT) {
          addBlockToRepeat(spriteId, block.id, {
            type: item.blockType,
            params: { ...item.params },
            children: def.children ? [] : undefined,
          });
        }
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  const children = block.children ?? [];

  return (
    <div
      ref={drop}
      className="ml-4 my-1 min-h-10 rounded-lg transition-colors"
      style={{
        background: isOver ? "rgba(255,171,25,0.12)" : "rgba(0,0,0,0.15)",
        border: `1.5px dashed ${isOver ? "#FFAB19" : "rgba(255,171,25,0.3)"}`,
        padding: "4px 6px",
      }}
    >
      {children.length === 0 ? (
        <div
          className="flex items-center justify-center text-xs py-1"
          style={{ color: "rgba(255,171,25,0.5)" }}
        >
          drop blocks here
        </div>
      ) : (
        children.map((child, idx) => (
          <BlockChip
            key={child.id}
            block={child}
            index={idx}
            spriteId={spriteId}
            parentId={block.id}
          />
        ))
      )}
    </div>
  );
}

// ── Main BlockChip ─────────────────────────────────────────────────────────
export default function BlockChip({ block, index, spriteId, parentId = null }) {
  const ref = useRef(null);
  const removeBlock = useScratchStore((s) => s.removeBlock);
  const updateBlockParam = useScratchStore((s) => s.updateBlockParam);
  const reorderBlock = useScratchStore((s) => s.reorderBlock);

  const colors = BLOCK_COLORS[block.type] || { bg: "#888", dark: "#555" };
  const isRepeat = block.type === BLOCK_TYPES.REPEAT;

  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPES.SCRIPT_BLOCK,
    item: { id: block.id, index, spriteId, parentId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DND_TYPES.SCRIPT_BLOCK,
    hover(item) {
      if (!ref.current) return;
      if (item.id === block.id) return;
      if (item.parentId !== parentId) return; // only reorder within same list
      if (item.index === index) return;
      reorderBlock(spriteId, parentId, item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  // Repeat blocks are drop targets only for reordering, not for sidebar drops
  if (!isRepeat) drag(drop(ref));
  else drag(ref);

  const change = (key) => (val) =>
    updateBlockParam(spriteId, block.id, key, val);

  if (isRepeat) {
    // ── C-shaped repeat block ──────────────────────────────────────────────
    return (
      <div
        ref={ref}
        className="select-none mb-2"
        style={{ opacity: isDragging ? 0.35 : 1 }}
      >
        {/* Top bar */}
        <div
          className="flex items-center gap-1 rounded-t-xl px-3 py-2 text-white text-xs font-bold group"
          style={{
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.dark})`,
            boxShadow: `0 2px 8px ${colors.bg}55`,
            cursor: "grab",
          }}
        >
          <span className="opacity-40 mr-0.5 text-base leading-none">⠿</span>
          <BlockLabel block={block} onChange={change} />
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

        {/* Inner drop zone — the C body */}
        <div
          style={{
            borderLeft: `4px solid ${colors.bg}`,
            marginLeft: 12,
          }}
        >
          <RepeatDropZone block={block} spriteId={spriteId} />
        </div>

        {/* Bottom cap */}
        <div
          className="rounded-b-xl px-3 py-1.5"
          style={{
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.dark})`,
            width: "40%",
            minWidth: 80,
          }}
        />
      </div>
    );
  }

  // ── Regular flat block ─────────────────────────────────────────────────────
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
      <span className="opacity-40 mr-0.5 text-base leading-none">⠿</span>
      <BlockLabel block={block} onChange={change} />
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
