export const BLOCK_TYPES = {
  MOVE: "move",
  TURN: "turn",
  GOTO: "goto",
  REPEAT: "repeat",
  SAY: "say",
  THINK: "think",
};

export const BLOCK_CATEGORIES = {
  MOTION: "motion",
  LOOKS: "looks",
};

export const BLOCK_DEFS = {
  [BLOCK_CATEGORIES.MOTION]: [
    {
      type: BLOCK_TYPES.MOVE,
      label: "Move steps",
      color: "#4C97FF",
      darkColor: "#3373CC",
      params: { steps: 10 },
      template: (p) => `Move ${p.steps} steps`,
    },
    {
      type: BLOCK_TYPES.TURN,
      label: "Turn degrees",
      color: "#4C97FF",
      darkColor: "#3373CC",
      params: { degrees: 15 },
      template: (p) => `Turn ${p.degrees}°`,
    },
    {
      type: BLOCK_TYPES.GOTO,
      label: "Go to x y",
      color: "#4C97FF",
      darkColor: "#3373CC",
      params: { x: 0, y: 0 },
      template: (p) => `Go to x:${p.x} y:${p.y}`,
    },
    {
      type: BLOCK_TYPES.REPEAT,
      label: "Repeat",
      color: "#FFAB19",
      darkColor: "#CC8814",
      params: { times: 10 },
      children: [],
      template: (p) => `Repeat ${p.times} times`,
    },
  ],
  [BLOCK_CATEGORIES.LOOKS]: [
    {
      type: BLOCK_TYPES.SAY,
      label: "Say for seconds",
      color: "#9966FF",
      darkColor: "#7744CC",
      params: { text: "Hello!", secs: 2 },
      template: (p) => `Say "${p.text}" for ${p.secs}s`,
    },
    {
      type: BLOCK_TYPES.THINK,
      label: "Think for seconds",
      color: "#9966FF",
      darkColor: "#7744CC",
      params: { text: "Hmm...", secs: 2 },
      template: (p) => `Think "${p.text}" for ${p.secs}s`,
    },
  ],
};

export const ALL_BLOCK_DEFS = Object.values(BLOCK_DEFS).flat();

export const DND_TYPES = {
  SIDEBAR_BLOCK: "SIDEBAR_BLOCK",
  SCRIPT_BLOCK: "SCRIPT_BLOCK",
};
