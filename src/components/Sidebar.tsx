import * as XLSX from "xlsx";

interface SidebarProps {
  players: string[];
  onClose: () => void;
  onUpload: (file: File) => void;
  disabledPlayers: Set<string>;
}

const downloadTemplate = () => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Name"],
    ["Emma"],
    ["David"],
    ["Frank"],
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Players");

  XLSX.writeFile(wb, "players_template.xlsx");
};

export default function Sidebar(props: SidebarProps) {
  const { onClose, players, onUpload, disabledPlayers } = props;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 320,
          height: "100%",
          padding: 20,
          animation: "slideIn 0.25s ease",
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "0 20px 20px 0",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-title)", fontSize: 22 }}>
          🎯 Participants ({players.length})
        </h3>

        <label
          style={{
            display: "block",
            padding: "16px",
            borderRadius: 18,
            border: "1px dashed rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            cursor: "pointer",
            color: "#fff",
            fontFamily: "Fredoka, sans-serif",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onUpload(e.target.files[0]);
              }
            }}
          />

          <div style={{ fontSize: 18, marginBottom: 6 }}>📄 Upload Excel</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>(.xlsx / .xls)</div>
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              opacity: 0.7,
              lineHeight: 1.4,
            }}
          >
            Single column named <strong>Name</strong>
          </div>
        </label>

        {!players.length && (
          <button
            onClick={downloadTemplate}
            style={{
              marginTop: 12,
              padding: "6px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px dashed rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              fontFamily: "Fredoka, sans-serif",
              opacity: 0.7,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ⬇ Download template
          </button>
        )}

        <div
          style={{
            marginTop: 16,
            maxHeight: "calc(100vh - 240px)",
            overflowY: "auto",
            fontSize: 14,
          }}
        >
          {players.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                opacity: disabledPlayers.has(p) ? 0.4 : 1,
              }}
            >
              {i + 1}. {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
