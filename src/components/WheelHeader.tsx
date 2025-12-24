interface WheelHeaderProps {
  currentPrize: { id: string; name: string; count: number };
  prizeCount: number;
}

export default function WheelHeader(props: WheelHeaderProps) {
  const { currentPrize, prizeCount } = props;

  return currentPrize ? (
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "var(--font-title)" }}>
        🎁 {currentPrize.name}
      </h2>
      <p style={{ opacity: 0.7 }}>
        {prizeCount + 1} / {currentPrize.count}
      </p>
    </div>
  ) : (
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "var(--font-title)" }}>
        🎊 Lucky Draw Completed
      </h2>
      <p style={{ opacity: 0.7 }}>All prizes have been successfully drawn.</p>
    </div>
  );
}
