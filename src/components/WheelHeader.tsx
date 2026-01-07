import type { Prize } from "../types";

type WheelHeaderProps = { currentPrize: Prize; prizeCount: number };

export default function WheelHeader(props: WheelHeaderProps) {
  const { currentPrize, prizeCount } = props;

  return currentPrize ? (
    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
      <h2 style={{ fontFamily: "var(--font-body)" }}>🎁 {currentPrize.name}</h2>
      <p style={{ opacity: 0.7 }}>
        {prizeCount + 1} / {currentPrize.count}
      </p>
    </div>
  ) : (
    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
      <h2 style={{ fontFamily: "var(--font-title)" }}>
        🎊 Lucky Draw Completed
      </h2>
      <p style={{ opacity: 0.7 }}>All prizes have been successfully drawn.</p>
    </div>
  );
}
