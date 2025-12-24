interface WheelActionProps {
  currentPrize: { id: string; name: string; count: number };
  spin: () => void;
  restart: () => void;
  spinning: boolean;
}

export default function WheelAction(props: WheelActionProps) {
  const { currentPrize, spin, restart, spinning } = props;

  return (
    <button
      onClick={currentPrize ? spin : restart}
      disabled={spinning}
      style={{
        marginTop: 24,
        padding: "16px 46px",
        fontSize: 18,
        fontFamily: "Fredoka, sans-serif",
        letterSpacing: 1,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.35)",
        background: `linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))`,
        backdropFilter: "blur(14px)",
        color: "#fff",
        cursor: spinning ? "not-allowed" : "pointer",
        boxShadow: `0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 rgba(255,255,255,0.4)`,
        transition: "all 0.25s ease",
        opacity: spinning ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 14px 40px rgba(120,180,255,0.45)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {currentPrize ? "SPIN" : "RESTART"}
    </button>
  );
}
