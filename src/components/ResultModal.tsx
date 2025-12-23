interface ResultModalProps {
  winner: string;
  onAccept: () => void;
  onRespin: () => void;
}

export default function ResultModal({
  winner,
  onAccept,
  onRespin,
}: ResultModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(14px)",
          padding: "36px 40px",
          borderRadius: 22,
          textAlign: "center",
          color: "#fff",
          minWidth: 360,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          ✨ Congratulations
        </h2>

        {/* WINNER NAME */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          {winner}
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {/* RE-SPIN */}
          <button
            onClick={onRespin}
            style={{
              padding: "12px 26px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.6)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Re-spin
          </button>

          {/* CONFIRM */}
          <button
            onClick={onAccept}
            style={{
              padding: "12px 30px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #4caf50, #43a047)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 6px 20px rgba(76,175,80,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 10px 28px rgba(76,175,80,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(76,175,80,0.4)";
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
