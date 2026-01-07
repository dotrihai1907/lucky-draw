import type { WinnerRecord } from "../types";

type WinnersByPrizeProps = {
  open: boolean;
  onClose: () => void;
  winners: WinnerRecord[];
};

export default function WinnersByPrize(props: WinnersByPrizeProps) {
  const { winners, open, onClose } = props;

  const winnersByPrize = winners.reduce<Record<string, WinnerRecord[]>>(
    (acc, w) => {
      acc[w.prizeName] = acc[w.prizeName] || [];
      acc[w.prizeName].push(w);
      return acc;
    },
    {}
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "20rem",
          padding: "1.25rem",
          borderRadius: "1.25rem 0 0 1.25rem",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s ease",
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          background: "rgba(255,255,255,0.10)",
          border: "0.0625rem solid rgba(255,255,255,0.22)",
          boxShadow: "0 1.25rem 3.125rem rgba(0,0,0,0.35)",
          backdropFilter: "blur(1.125rem)",
          WebkitBackdropFilter: "blur(1.125rem)",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-title)", fontSize: "1.375rem" }}>
          🏆 Lucky Winners
        </h3>

        {Object.entries(winnersByPrize).map(([prizeName, list]) => (
          <div
            key={prizeName}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "1.25rem",
              gap: "1rem",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>
              🎁 {prizeName}
            </div>

            {list.map((w, i) => (
              <div
                key={i}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.35)",
                }}
              >
                {i + 1}. {w.player}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
