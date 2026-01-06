import type { GameMode, Prize } from "../types";

type WheelActionProps = {
  currentPrize: Prize;
  spin: () => void;
  restart: () => void;
  spinning: boolean;
  mode: GameMode;
};

export default function WheelAction(props: WheelActionProps) {
  const { currentPrize, spin, restart, spinning, mode } = props;

  return (
    <button
      onClick={currentPrize ? spin : restart}
      disabled={spinning}
      style={{
        marginTop: "1.5rem",
        padding: "1rem 2.875rem",
        fontSize: "1.125rem",
        fontFamily: "var(--font-title)",
        letterSpacing: "0.0625rem",
        borderRadius: "1.125rem",
        border: "0.0625rem solid rgba(255,255,255,0.25)",
        background: "linear-gradient(180deg,#2B1F18,#120C09)",
        backdropFilter: "blur(0.875rem)",
        color: "#fff",
        cursor: spinning ? "not-allowed" : "pointer",
        boxShadow: spinning
          ? "inset 0 0 1.2rem #1E1410"
          : " 0 0.8rem 2.2rem #120C09, inset 0 0 .9rem #2B1F18",
        transition: "all 0.25s ease",
        opacity: spinning ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1.2rem 3rem #120C09, 0 0 1.6rem #C2954F";
        e.currentTarget.style.transform = "translateY(-0.125rem)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0.8rem 2.2rem #120C09, inset 0 0 .9rem #2B1F18";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {currentPrize ? (mode === "wheel" ? "SPIN" : "DRAW") : "RESTART"}
    </button>
  );
}
