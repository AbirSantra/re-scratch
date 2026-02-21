import { useRef, useCallback } from "react";
import { useScratchStore } from "../store/useScratchStore";
import { executeBlocks } from "../utils/animationEngine";

export function useAnimation() {
  const abortRef = useRef(null);
  const store = useScratchStore;

  const isPlaying = useScratchStore((s) => s.isPlaying);
  const setPlaying = useScratchStore((s) => s.setPlaying);

  const play = useCallback(async () => {
    if (isPlaying) return;

    const runAllSprites = (signal) =>
      Promise.all(
        store
          .getState()
          .sprites.map((sprite) =>
            executeBlocks(sprite.id, sprite.blocks, store, signal),
          ),
      );

    setPlaying(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await runAllSprites(controller.signal);

      if (store.getState().collisionHandled && !controller.signal.aborted) {
        store.getState().setCollisionHandled(false);
        await runAllSprites(controller.signal);
      }
    } catch (_) {
      // AbortError is expected when the Stop button is pressed
    } finally {
      setPlaying(false);
      store.getState().sprites.forEach((s) => {
        if (s.speechBubble) {
          store.getState().updateSprite(s.id, { speechBubble: null });
        }
      });
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setPlaying(false);
    store.getState().sprites.forEach((s) => {
      store.getState().updateSprite(s.id, { speechBubble: null });
    });
  }, []);

  return { play, stop, isPlaying };
}
