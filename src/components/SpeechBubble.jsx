import React from "react";

export default function SpeechBubble({ bubble }) {
  if (!bubble) return null;

  const isThink = bubble.type === "think";

  return (
    <div
      className="absolute text-xs font-semibold rounded-2xl bg-white text-gray-800 shadow-xl whitespace-nowrap pointer-events-none"
      style={{
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        maxWidth: 140,
        padding: "6px 10px",
        border: "2px solid #e2e8f0",
        lineHeight: 1.4,
      }}
    >
      {isThink && (
        <span className="block text-center text-base leading-none mb-0.5">
          💭
        </span>
      )}
      <span>{bubble.text}</span>

      {/* Tail */}
      {isThink ? (
        <>
          <div
            className="absolute"
            style={{
              bottom: -6,
              left: "30%",
              width: 8,
              height: 8,
              background: "white",
              borderRadius: "50%",
              border: "2px solid #e2e8f0",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: -12,
              left: "20%",
              width: 5,
              height: 5,
              background: "white",
              borderRadius: "50%",
              border: "2px solid #e2e8f0",
            }}
          />
        </>
      ) : (
        <div
          className="absolute"
          style={{
            bottom: -9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "9px solid #e2e8f0",
          }}
        />
      )}
    </div>
  );
}
