import React from "react";
import { useState } from "react";
import { BLOCK_DEFS, BLOCK_CATEGORIES } from "../constants/blocks";
import SidebarBlock from "./SidebarBlock";

const TABS = [
  { key: BLOCK_CATEGORIES.MOTION, label: "Motion", accent: "#4C97FF" },
  { key: BLOCK_CATEGORIES.LOOKS, label: "Looks", accent: "#9966FF" },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(BLOCK_CATEGORIES.MOTION);

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        width: 210,
        background: "#161b22",
        borderColor: "#30363d",
        flexShrink: 0,
      }}
    >
      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: "#30363d" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{
              color: activeTab === tab.key ? tab.accent : "#6e7681",
              borderBottom:
                activeTab === tab.key
                  ? `2px solid ${tab.accent}`
                  : "2px solid transparent",
              background: "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category label */}
      <div
        className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: TABS.find((t) => t.key === activeTab)?.accent }}
      >
        {activeTab === BLOCK_CATEGORIES.MOTION ? "🏃 Motion" : "👁 Looks"}
      </div>

      {/* Blocks list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {BLOCK_DEFS[activeTab].map((def) => (
          <SidebarBlock key={def.type} def={def} />
        ))}
      </div>

      {/* Footer hint */}
      <div
        className="px-3 py-3 text-xs text-center border-t"
        style={{ color: "#484f58", borderColor: "#21262d" }}
      >
        Drag blocks to script →
      </div>
    </div>
  );
}
