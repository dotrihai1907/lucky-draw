interface SettingsButtonProps {
  spinning: boolean;
  onClick: () => void;
}

export default function SettingsButton(props: SettingsButtonProps) {
  const { spinning, onClick } = props;

  return (
    <button
      onClick={() => {
        if (spinning) return;
        onClick();
      }}
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "1.25rem",
        width: "2.625rem",
        height: "2.625rem",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(0.625rem)",
        color: "#fff",
        fontSize: "1.25rem",
        border: "0.0625rem solid rgba(255,255,255,0.25)",
        boxShadow: "0 0.5rem 1.625rem rgba(0,0,0,0.4)",
        cursor: spinning ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0.5rem 1.5rem rgba(120,180,255,0.35)";
        e.currentTarget.style.scale = "1.02";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.scale = "1";
      }}
    >
      ⚙
    </button>
  );
}
