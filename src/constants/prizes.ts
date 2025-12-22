export type PrizeKey = "consolation" | "third" | "second" | "special";

export const PRIZE_ORDER: PrizeKey[] = [
  "consolation",
  "third",
  "second",
  "special",
];

export const PRIZE_CONFIG: Record<PrizeKey, number> = {
  consolation: 4,
  third: 3,
  second: 2,
  special: 1,
};

export const PRIZE_LABEL: Record<PrizeKey, string> = {
  consolation: "Consolation Prize",
  third: "Third Prize",
  second: "Second Prize",
  special: "🎉 Special Prize",
};
