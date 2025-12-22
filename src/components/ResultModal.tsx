interface ResultModalProps {
  winner: string;
  onClose: () => void;
}

/**
 * Simple result popup
 */
export default function ResultModal({ winner, onClose }: ResultModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          padding: "32px 48px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>🎉 Congratulations!</h2>
        <p
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#ffd54f",
            marginBottom: 24,
          }}
        >
          {winner}
        </p>

        <button
          onClick={onClose}
          style={{
            padding: "10px 28px",
            fontSize: 18,
            borderRadius: 12,
            border: "2px solid white",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
