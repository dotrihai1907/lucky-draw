import { useRef } from "react";

/**
 * useSpinLogic
 * - Handle random logic
 * - Ensure NO duplicated winners
 */
export function useSpinLogic() {
  // Store indexes that already won
  const usedIndexes = useRef<Set<number>>(new Set());

  /**
   * Spin and return a winner index
   */
  const spin = (totalPlayers: number): number | null => {
    // 1. Get available indexes
    const availableIndexes = Array.from(
      { length: totalPlayers },
      (_, i) => i
    ).filter((i) => !usedIndexes.current.has(i));

    // 2. No one left
    if (availableIndexes.length === 0) return null;

    // 3. Random
    const winnerIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    // 4. Mark as used
    usedIndexes.current.add(winnerIndex);

    return winnerIndex;
  };

  return { spin };
}
