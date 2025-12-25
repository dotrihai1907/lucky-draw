import { GLASS_CARD } from "../constants/colors";

interface WinnerRecord {
  prizeName: string;
  player: string;
}

interface WinnersByPrizeProps {
  winners: WinnerRecord[];
}

export default function WinnersByPrize({ winners }: WinnersByPrizeProps) {
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
      style={{
        width: "20rem",
        padding: "1.25rem",
        ...GLASS_CARD,
        borderRadius: "1.25rem 0 0 1.25rem",
        overflowY: "auto",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-title)", fontSize: "1.375rem" }}>
        🏆 Lucky Persons
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
  );
}
