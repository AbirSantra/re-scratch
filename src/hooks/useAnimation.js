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

    setPlaying(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const runAllSprites = (signal) =>
      Promise.all(
        store
          .getState()
          .sprites.map((sprite) =>
            executeBlocks(sprite.id, sprite.blocks, store, signal),
          ),
      );

    try {
      let collisionOccurred = true;

      // Keep re-running as long as collisions are happening
      while (collisionOccurred && !controller.signal.aborted) {
        store.getState().setCollisionHandled(false);

        // Create a fresh inner controller for each run so we can
        // abort just this round on collision without stopping everything
        const roundController = new AbortController();

        // If outer stop is pressed, abort the round too
        controller.signal.addEventListener("abort", () =>
          roundController.abort(),
        );

        // Poll for collision and abort the round when it happens
        const collisionPoller = setInterval(() => {
          if (store.getState().collisionHandled) {
            roundController.abort();
          }
        }, 50);

        await runAllSprites(roundController.signal).catch(() => {});
        clearInterval(collisionPoller);

        collisionOccurred = store.getState().collisionHandled;
      }
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
