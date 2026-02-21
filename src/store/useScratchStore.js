import { create } from "zustand";
import { INITIAL_SPRITES, SPRITE_COLORS } from "../constants/stage";

// ── Recursive block tree helpers ───────────────────────────────────────────

const makeId = () =>
  `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Deep-clone a block (so children arrays are not shared references)
const cloneBlock = (block) => ({
  ...block,
  children: block.children ? block.children.map(cloneBlock) : undefined,
});

// Map over a block list recursively, returning a new list
const mapBlocks = (blocks, fn) =>
  blocks.map((block) => {
    const mapped = fn(block);
    if (mapped.children) {
      return { ...mapped, children: mapBlocks(mapped.children, fn) };
    }
    return mapped;
  });

// Filter a block list recursively
const filterBlocks = (blocks, predicate) =>
  blocks
    .filter(predicate)
    .map((block) =>
      block.children
        ? { ...block, children: filterBlocks(block.children, predicate) }
        : block,
    );

// Add a block as a child of a specific parent block id
const addChildToBlock = (blocks, parentId, newBlock) =>
  blocks.map((block) => {
    if (block.id === parentId) {
      return { ...block, children: [...(block.children ?? []), newBlock] };
    }
    if (block.children) {
      return {
        ...block,
        children: addChildToBlock(block.children, parentId, newBlock),
      };
    }
    return block;
  });

// Reorder within a specific parent's children (or top-level if parentId is null)
const reorderInParent = (blocks, parentId, fromIndex, toIndex) => {
  if (parentId === null) {
    const next = [...blocks];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  }
  return blocks.map((block) => {
    if (block.id === parentId && block.children) {
      const next = [...block.children];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...block, children: next };
    }
    if (block.children) {
      return {
        ...block,
        children: reorderInParent(block.children, parentId, fromIndex, toIndex),
      };
    }
    return block;
  });
};

export const useScratchStore = create((set, get) => ({
  sprites: INITIAL_SPRITES,
  selectedSpriteId: INITIAL_SPRITES[0].id,
  isPlaying: false,
  collisionHandled: false,

  // ── Sprite management ──────────────────────────────────────────────────────

  selectSprite: (id) => set({ selectedSpriteId: id }),

  addSprite: () => {
    const count = get().sprites.length;
    const newSprite = {
      id: `sprite-${Date.now()}`,
      name: `Cat ${count + 1}`,
      x: Math.random() * 160 - 80,
      y: Math.random() * 80 - 40,
      rotation: 0,
      blocks: [],
      speechBubble: null,
      color: SPRITE_COLORS[count % SPRITE_COLORS.length],
    };
    set((state) => ({
      sprites: [...state.sprites, newSprite],
      selectedSpriteId: newSprite.id,
    }));
  },

  removeSprite: (id) =>
    set((state) => {
      const remaining = state.sprites.filter((s) => s.id !== id);
      return {
        sprites: remaining,
        selectedSpriteId:
          state.selectedSpriteId === id
            ? (remaining[0]?.id ?? null)
            : state.selectedSpriteId,
      };
    }),

  updateSprite: (id, patch) =>
    set((state) => ({
      sprites: state.sprites.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),

  // ── Block management ───────────────────────────────────────────────────────

  // Add a block to the top-level script
  addBlock: (spriteId, block) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: [...s.blocks, { ...cloneBlock(block), id: makeId() }],
            }
          : s,
      ),
    })),

  // Add a block inside a repeat block's children
  addBlockToRepeat: (spriteId, parentBlockId, block) =>
    set((state) => ({
      sprites: state.sprites.map((s) => {
        if (s.id !== spriteId) return s;
        const newBlock = { ...cloneBlock(block), id: makeId() };
        return {
          ...s,
          blocks: addChildToBlock(s.blocks, parentBlockId, newBlock),
        };
      }),
    })),

  // Remove a block anywhere in the tree
  removeBlock: (spriteId, blockId) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? { ...s, blocks: filterBlocks(s.blocks, (b) => b.id !== blockId) }
          : s,
      ),
    })),

  // Reorder blocks — parentId null means top-level, otherwise inside that repeat
  reorderBlock: (spriteId, parentId, fromIndex, toIndex) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: reorderInParent(s.blocks, parentId, fromIndex, toIndex),
            }
          : s,
      ),
    })),

  // Update a param on any block in the tree
  updateBlockParam: (spriteId, blockId, paramKey, value) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: mapBlocks(s.blocks, (b) =>
                b.id === blockId
                  ? { ...b, params: { ...b.params, [paramKey]: value } }
                  : b,
              ),
            }
          : s,
      ),
    })),

  // ── Hero feature ───────────────────────────────────────────────────────────

  swapBlocks: (id1, id2) =>
    set((state) => {
      const s1 = state.sprites.find((s) => s.id === id1);
      const s2 = state.sprites.find((s) => s.id === id2);
      if (!s1 || !s2) return {};
      return {
        sprites: state.sprites.map((s) => {
          if (s.id === id1) return { ...s, blocks: s2.blocks };
          if (s.id === id2) return { ...s, blocks: s1.blocks };
          return s;
        }),
        collisionHandled: true,
      };
    }),

  // ── Playback ───────────────────────────────────────────────────────────────

  setPlaying: (v) => set({ isPlaying: v, collisionHandled: false }),

  setCollisionHandled: (v) => set({ collisionHandled: v }),

  resetPositions: () =>
    set((state) => ({
      sprites: state.sprites.map((s, i) => ({
        ...s,
        x: i % 2 === 0 ? -120 + i * 40 : 120 - i * 40,
        y: 0,
        rotation: 0,
        speechBubble: null,
      })),
      collisionHandled: false,
      isPlaying: false,
    })),
}));
