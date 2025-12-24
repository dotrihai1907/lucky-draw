export default function EmptyPlayer() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* ICON */}
      <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.9 }}>🎯</div>

      {/* TITLE */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 10,
          fontFamily: "Fredoka, sans-serif",
        }}
      >
        No players yet
      </div>

      {/* SUBTEXT */}
      <div
        style={{
          fontSize: 15,
          opacity: 0.75,
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Upload an Excel file from the left menu to start the lucky draw.
      </div>
    </div>
  );
}
