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
      className="flex flex-col h-full border-r w-80 shrink-0"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-muted)",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--border-muted)" }}
      >
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

      <div className="p-4 pb-0">
        <p className="text-xs text-(--text-muted)">
          Drag blocks to the Script Area to apply
        </p>
      </div>

      {/* Blocks list */}
      <div className="flex-1 overflow-y-auto p-3">
        {BLOCK_DEFS[activeTab].map((def) => (
          <SidebarBlock key={def.type} def={def} />
        ))}
      </div>

      {/* Footer hint */}
      <div className="p-4 flex flex-col">
        <div className="text-xs">
          <p>Built by Abir Santra</p>
        </div>
      </div>
    </div>
  );
}
