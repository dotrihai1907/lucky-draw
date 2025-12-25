interface Prize {
  name: string;
  count: number;
}

interface WheelActionProps {
  currentPrize: Prize;
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
        marginTop: "1.5rem",
        padding: "1rem 2.875rem",
        fontSize: "1.125rem",
        fontFamily: "Fredoka, sans-serif",
        letterSpacing: "0.0625rem",
        borderRadius: "1.125rem",
        border: "0.0625rem solid rgba(255,255,255,0.35)",
        background: `linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))`,
        backdropFilter: "blur(0.875rem)",
        color: "#fff",
        cursor: spinning ? "not-allowed" : "pointer",
        boxShadow: `0 0.625rem 1.875rem rgba(0,0,0,0.35), inset 0 0 0 rgba(255,255,255,0.4)`,
        transition: "all 0.25s ease",
        opacity: spinning ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0.875rem 2.5rem rgba(120,180,255,0.45)";
        e.currentTarget.style.transform = "translateY(-0.125rem)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0.625rem 1.875rem rgba(0,0,0,0.35)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {currentPrize ? "SPIN" : "RESTART"}
    </button>
  );
}
