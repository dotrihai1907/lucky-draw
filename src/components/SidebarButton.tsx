interface SidebarButtonProps {
  spinning: boolean;
  onClick: () => void;
}

export default function SidebarButton(props: SidebarButtonProps) {
  const { spinning, onClick } = props;

  return (
    <button
      onClick={() => {
        if (spinning) return;
        onClick();
      }}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        width: 42,
        height: 42,
        borderRadius: 14,
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#fff",
        fontSize: 20,
        cursor: spinning ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        zIndex: 120,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        e.currentTarget.style.scale = "1.02";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.scale = "1";
      }}
    >
      ☰
    </button>
  );
}
