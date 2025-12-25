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
          backdropFilter: "blur(0.875rem)",
          padding: "2.25rem 2.5rem",
          borderRadius: "1.375rem",
          textAlign: "center",
          color: "#fff",
          minWidth: "22.5rem",
          border: "0.0625rem solid rgba(255,255,255,0.25)",
          boxShadow: "0 1.25rem 3.75rem rgba(0,0,0,0.4)",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
            letterSpacing: "0.03125rem",
          }}
        >
          ✨ Congratulations
        </h2>

        {/* WINNER NAME */}
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "1.75rem",
          }}
        >
          {winner}
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {/* RE-SPIN */}
          <button
            onClick={onRespin}
            style={{
              padding: "0.75rem 1.625rem",
              borderRadius: "0.875rem",
              border: "0.0625rem solid rgba(255,255,255,0.6)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
              fontFamily: "var(--font-body)",
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
              padding: "0.75rem 1.875rem",
              borderRadius: "0.875rem",
              border: "none",
              background: "linear-gradient(135deg, #4caf50, #43a047)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: 600,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 0.375rem 1.25rem rgba(76,175,80,0.4)",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-0.0625rem)";
              e.currentTarget.style.boxShadow =
                "0 0.625rem 1.75rem rgba(76,175,80,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0.375rem 1.25rem rgba(76,175,80,0.4)";
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
