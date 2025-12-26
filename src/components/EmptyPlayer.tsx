interface EmptyPlayerProps {
  onClick: () => void;
}

export default function EmptyPlayer(props: EmptyPlayerProps) {
  const { onClick } = props;

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "min(55vh, 32.5rem)",
          height: "min(55vh, 32.5rem)",
          borderRadius: "50%",
          border: "0.0625rem dashed rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(0.75rem)",
          boxShadow: "0 0 1.625rem rgba(255,255,255,0.15) inset",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "1.125rem",
            opacity: 0.8,
            fontWeight: 400,
            marginBottom: "0.625rem",
          }}
        >
          No players loaded
        </p>

        <p
          style={{
            fontSize: "0.875rem",
            opacity: 0.6,
            width: "75%",
          }}
        >
          Please upload player list from menu to start the draw
        </p>

        <button
          onClick={onClick}
          style={{
            marginTop: "1.125rem",
            padding: "0.625rem 1.5rem",
            borderRadius: "0.875rem",
            border: "0.0625rem solid rgba(255,255,255,0.6)",
            background: "transparent",
            color: "#fff",
            fontSize: "0.9375rem",
            cursor: "pointer",
            backdropFilter: "blur(0.625rem)",
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
          Upload Players
        </button>
      </div>
    </div>
  );
}
