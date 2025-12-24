import { GLASS_CARD } from "../constants/colors";

type WinnerRecord = {
  prizeId: string;
  prizeName: string;
  player: string;
};

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
        width: 320,
        padding: 20,
        ...GLASS_CARD,
        borderRadius: "20px 0 0 20px",
        overflowY: "auto",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-title)", fontSize: 22 }}>
        🏆 Lucky Persons
      </h3>

      {Object.entries(winnersByPrize).map(([prizeName, list]) => (
        <div
          key={prizeName}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
            gap: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>🎁 {prizeName}</div>

          {list.map((w, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
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
