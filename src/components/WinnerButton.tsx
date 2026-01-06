type WinnerButtonProps = { spinning: boolean; onClick: () => void };

export default function WinnerButton(props: WinnerButtonProps) {
  const { spinning, onClick } = props;

  return (
    <button
      onClick={() => {
        if (spinning) return;
        onClick();
      }}
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        width: "2.625rem",
        height: "2.625rem",
        borderRadius: "0.875rem",
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(0.625rem)",
        border: "0.0625rem solid rgba(255,255,255,0.25)",
        color: "#fff",
        fontSize: "1.25rem",
        cursor: spinning ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        zIndex: 120,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1.2rem 3rem #120C09, 0 0 1.6rem #C2954F";
        e.currentTarget.style.scale = "1.02";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.scale = "1";
      }}
    >
      🏆
    </button>
  );
}
