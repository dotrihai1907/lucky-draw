import seedrandom from "seedrandom";
import { type PrizeKey, PRIZE_CONFIG } from "../constants/prizes";

export function usePrizeDraw(seed: string) {
  const rng = seedrandom(seed);

  const drawPrize = (players: string[], prize: PrizeKey) => {
    const count = PRIZE_CONFIG[prize];

    if (players.length < count) {
      throw new Error("Not enough players");
    }

    const pool = [...players];
    const winners: string[] = [];

    for (let i = 0; i < count; i++) {
      const index = Math.floor(rng() * pool.length);
      winners.push(pool[index]);
      pool.splice(index, 1);
    }

    return {
      winners,
      remainingPlayers: pool,
    };
  };

  return { drawPrize };
}
