import React from "react";
import { useDrag } from "react-dnd";
import { DND_TYPES } from "../constants/blocks";
import { GripIcon } from "lucide-react";

export default function SidebarBlock({ def }) {
  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPES.SIDEBAR_BLOCK,
    item: { blockType: def.type, params: { ...def.params } },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className="flex items-center gap-2 rounded-lg p-3 text-white text-sm font-bold cursor-grab active:cursor-grabbing mb-2 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${def.color}, ${def.darkColor})`,
        boxShadow: `0 3px 10px ${def.color}44`,
        opacity: isDragging ? 0.4 : 1,
        userSelect: "none",
      }}
    >
      <span className="opacity-50 text-sm">
        <GripIcon className="size-3" />
      </span>
      <span>{def.template(def.params)}</span>
    </div>
  );
}
