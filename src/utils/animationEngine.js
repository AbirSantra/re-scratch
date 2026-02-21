import { STAGE_W, STAGE_H, SPRITE_SIZE } from "../constants/stage";
import { BLOCK_TYPES } from "../constants/blocks";
import { checkCollision, sleep, clamp } from "./helpers";

/**
 * Execute a sprite's block list sequentially.
 * Handles move, turn, goto, repeat, say, think.
 * Detects collisions after each step and triggers hero swap.
 *
 * @param {string}      spriteId
 * @param {object[]}    blocks
 * @param {object}      store    - Zustand store (useScratchStore)
 * @param {AbortSignal} signal
 */
export async function executeBlocks(spriteId, blocks, store, signal) {
  const getSprite = () =>
    store.getState().sprites.find((s) => s.id === spriteId);

  const detectAndHandleCollision = () => {
    if (store.getState().collisionHandled) return false;
    const me = getSprite();
    if (!me) return false;

    for (const other of store.getState().sprites) {
      if (other.id !== spriteId && checkCollision(me, other)) {
        store.getState().swapBlocks(spriteId, other.id);
        return true;
      }
    }
    return false;
  };

  const runOnce = async (blockList) => {
    for (const block of blockList) {
      if (signal.aborted) return true;

      const sprite = getSprite();
      if (!sprite) return true;

      switch (block.type) {
        case BLOCK_TYPES.MOVE: {
          const rad = (sprite.rotation * Math.PI) / 180;
          const dx = Math.cos(rad) * Number(block.params.steps);
          const dy = Math.sin(rad) * Number(block.params.steps);
          store.getState().updateSprite(spriteId, {
            x: clamp(
              sprite.x + dx,
              -STAGE_W / 2 + SPRITE_SIZE / 2,
              STAGE_W / 2 - SPRITE_SIZE / 2,
            ),
            y: clamp(
              sprite.y + dy,
              -STAGE_H / 2 + SPRITE_SIZE / 2,
              STAGE_H / 2 - SPRITE_SIZE / 2,
            ),
          });
          await sleep(100, signal);
          break;
        }

        case BLOCK_TYPES.TURN: {
          store.getState().updateSprite(spriteId, {
            rotation: sprite.rotation + Number(block.params.degrees),
          });
          await sleep(100, signal);
          break;
        }

        case BLOCK_TYPES.GOTO: {
          store.getState().updateSprite(spriteId, {
            x: clamp(
              Number(block.params.x),
              -STAGE_W / 2 + SPRITE_SIZE / 2,
              STAGE_W / 2 - SPRITE_SIZE / 2,
            ),
            y: clamp(
              Number(block.params.y),
              -STAGE_H / 2 + SPRITE_SIZE / 2,
              STAGE_H / 2 - SPRITE_SIZE / 2,
            ),
          });
          await sleep(300, signal);
          break;
        }

        case BLOCK_TYPES.SAY:
        case BLOCK_TYPES.THINK: {
          store.getState().updateSprite(spriteId, {
            speechBubble: { text: block.params.text, type: block.type },
          });
          await sleep(Number(block.params.secs) * 1000, signal);
          store.getState().updateSprite(spriteId, { speechBubble: null });
          break;
        }

        case BLOCK_TYPES.REPEAT: {
          const otherBlocks = blockList.filter((b) => b.id !== block.id);
          for (let i = 0; i < Number(block.params.times); i++) {
            if (signal.aborted) return true;
            // Always read fresh blocks from store in case of a swap
            const freshBlocks = getSprite()?.blocks ?? [];
            const freshOthers = freshBlocks.filter(
              (b) => b.type !== BLOCK_TYPES.REPEAT,
            );
            const interrupted = await runOnce(freshOthers);
            if (interrupted) return true;
          }
          return false;
        }

        default:
          break;
      }

      if (detectAndHandleCollision()) return true;
    }

    return false;
  };

  try {
    await runOnce(blocks);
  } catch (err) {
    if (err.name !== "AbortError") throw err;
  }
}
