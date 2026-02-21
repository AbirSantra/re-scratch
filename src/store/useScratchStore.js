import { create } from "zustand";
import { INITIAL_SPRITES, SPRITE_COLORS } from "../constants/stage";

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

  addBlock: (spriteId, block) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: [
                ...s.blocks,
                {
                  ...block,
                  id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                },
              ],
            }
          : s,
      ),
    })),

  insertBlock: (spriteId, block, atIndex) =>
    set((state) => ({
      sprites: state.sprites.map((s) => {
        if (s.id !== spriteId) return s;
        const newBlock = {
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        };
        const blocks = [...s.blocks];
        blocks.splice(atIndex, 0, newBlock);
        return { ...s, blocks };
      }),
    })),

  removeBlock: (spriteId, blockId) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) }
          : s,
      ),
    })),

  reorderBlock: (spriteId, fromIndex, toIndex) =>
    set((state) => ({
      sprites: state.sprites.map((s) => {
        if (s.id !== spriteId) return s;
        const blocks = [...s.blocks];
        const [moved] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, moved);
        return { ...s, blocks };
      }),
    })),

  updateBlockParam: (spriteId, blockId, paramKey, value) =>
    set((state) => ({
      sprites: state.sprites.map((s) =>
        s.id === spriteId
          ? {
              ...s,
              blocks: s.blocks.map((b) =>
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
