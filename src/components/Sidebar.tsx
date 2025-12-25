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
          width: "20rem",
          height: "100%",
          padding: "1.25rem",
          animation: "slideIn 0.25s ease",
          background: "rgba(255,255,255,0.10)",
          border: "0.0625rem solid rgba(255,255,255,0.22)",
          boxShadow: "0 1.25rem 3.125rem rgba(0,0,0,0.35)",
          backdropFilter: "blur(1.125rem)",
          WebkitBackdropFilter: "blur(1.125rem)",
          borderRadius: "0 1.25rem 1.25rem 0",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-title)", fontSize: "1.375rem" }}>
          🎯 Participants ({players.length})
        </h3>

        <label
          style={{
            display: "block",
            padding: "1rem",
            borderRadius: "1.125rem",
            border: "0.0625rem dashed rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(0.75rem)",
            textAlign: "center",
            cursor: "pointer",
            color: "#fff",
            fontFamily: "Fredoka, sans-serif",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0.5rem 1.5rem rgba(0,0,0,0.15)";
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

          <div style={{ fontSize: "1.125rem", marginBottom: "0.375rem" }}>
            📄 Upload Excel
          </div>
          <div style={{ fontSize: "0.8125rem", opacity: 0.7 }}>
            (.xlsx / .xls)
          </div>
          <div
            style={{
              marginTop: "0.625rem",
              fontSize: "0.75rem",
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
              marginTop: "0.75rem",
              padding: "0.375rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.08)",
              border: "0.0625rem dashed rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: "0.8125rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              fontFamily: "Fredoka, sans-serif",
              opacity: 0.7,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0.5rem 1.5rem rgba(0,0,0,0.15)";
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
            marginTop: "1rem",
            maxHeight: "calc(100vh - 15rem)",
            overflowY: "auto",
            fontSize: "0.875rem",
          }}
        >
          {players.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
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
