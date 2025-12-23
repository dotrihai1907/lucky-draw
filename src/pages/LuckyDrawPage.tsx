import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";

import LuckyWheel from "../components/LuckyWheel";
import ResultModal from "../components/ResultModal";
import { PRIZES } from "../data/prizes";

const ALL_PLAYERS = [
  "Emma",
  "David",
  "Frank",
  "Grace",
  "Helen",
  "Ian",
  "Jack",
  "Kevin",
  "Linda",
];

type WinnerRecord = {
  prizeId: string;
  prizeName: string;
  player: string;
};

/* ===== TIMING CONFIG ===== */
const SPIN_DURATION = 8500;
const SPIN_FADE_OUT_AT = 7500;
const EXTRA_ROUNDS = 9;
/* ========================= */

export default function LuckyDrawPage() {
  /* ===== FIXED PLAYERS ===== */
  const [players] = useState<string[]>(ALL_PLAYERS);

  /* ===== ROTATION ===== */
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  /* ===== PRIZE FLOW ===== */
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [prizeCount, setPrizeCount] = useState(0);

  /* ===== RESULT ===== */
  const [winner, setWinner] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinning, setSpinning] = useState(false);

  /* ===== WINNERS ===== */
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [pendingWinner, setPendingWinner] = useState<WinnerRecord | null>(null);

  const pickedPlayersRef = useRef<Set<string>>(new Set());

  /* ===== BGM ===== */
  const [bgmEnabled, setBgmEnabled] = useState(false);

  const [playBgm, { sound: bgmSound }] = useSound("/sounds/bgm.mp3", {
    volume: 0.1,
    loop: true,
  });

  const [playSpin, { sound: spinSound }] = useSound("/sounds/spin.mp3", {
    volume: 0.4,
  });

  const [playWin] = useSound("/sounds/win.mp3", {
    volume: 0.8,
  });

  const currentPrize = PRIZES[prizeIndex];
  const sliceAngle = 360 / players.length;

  /* ===== BGM EFFECT ===== */
  useEffect(() => {
    if (bgmEnabled) playBgm();
    else bgmSound?.stop();
  }, [bgmEnabled, playBgm, bgmSound]);

  /* ===== CALCULATE WINNER ===== */
  const getWinnerByRotation = (finalRotation: number) => {
    const normalized = ((finalRotation % 360) + 360) % 360;
    const pointerAngle = (360 - normalized) % 360;
    const index = Math.floor(pointerAngle / sliceAngle);
    return players[index];
  };

  /* ===== SPIN ===== */
  const spin = () => {
    if (spinning || !currentPrize) return;

    setSpinning(true);
    setShowResult(false);
    setWinner(null);

    spinSound?.stop();
    spinSound?.volume(0.4);
    playSpin();

    setTimeout(() => {
      spinSound?.fade(0.4, 0, 800);
    }, SPIN_FADE_OUT_AT);

    const nextRotation =
      rotationRef.current + EXTRA_ROUNDS * 360 + Math.random() * 360;

    rotationRef.current = nextRotation;
    setRotation(nextRotation);

    setTimeout(() => {
      let selected = getWinnerByRotation(nextRotation);

      let guard = 0;
      while (pickedPlayersRef.current.has(selected) && guard < 10) {
        selected = players[Math.floor(Math.random() * players.length)];
        guard++;
      }

      pickedPlayersRef.current.add(selected);

      playWin();

      setPendingWinner({
        prizeId: currentPrize.id,
        prizeName: currentPrize.name,
        player: selected,
      });

      setWinner(selected);
      setShowResult(true);
      setSpinning(false);
    }, SPIN_DURATION);
  };

  /* ===== ACCEPT WINNER ===== */
  const handleAcceptWinner = () => {
    setShowResult(false);

    if (!pendingWinner || !currentPrize) return;

    setWinners((prev) => [...prev, pendingWinner]);

    if (prizeCount + 1 === currentPrize.count) {
      setPrizeIndex((p) => p + 1);
      setPrizeCount(0);
    } else {
      setPrizeCount((c) => c + 1);
    }

    setPendingWinner(null);
  };

  /* ===== RE-SPIN ===== */
  const handleRespin = () => {
    setShowResult(false);

    if (pendingWinner) {
      pickedPlayersRef.current.delete(pendingWinner.player);
    }

    setPendingWinner(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "radial-gradient(circle at top, #1f1f1f, #0d0d0d)",
        color: "#fff",
        display: "flex",
        position: "relative",
      }}
    >
      {showResult && <Confetti />}

      {/* 🎵 BGM TOGGLE */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 360,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 100,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          padding: "8px 14px",
          borderRadius: 20,
        }}
      >
        <span style={{ fontSize: 14 }}>🎵 Background Music</span>
        <button
          onClick={() => setBgmEnabled((p) => !p)}
          style={{
            width: 42,
            height: 22,
            borderRadius: 11,
            border: "none",
            background: bgmEnabled ? "#4caf50" : "#555",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: bgmEnabled ? 22 : 2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* LEFT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentPrize && (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h2>🎁 {currentPrize.name}</h2>
            <p style={{ opacity: 0.7 }}>
              {prizeCount + 1} / {currentPrize.count}
            </p>
          </div>
        )}

        <div
          style={{
            width: "min(55vh, 520px)",
            height: "min(55vh, 520px)",
          }}
        >
          <LuckyWheel names={players} rotation={rotation} />
        </div>

        <button
          onClick={spin}
          disabled={spinning || !currentPrize}
          style={{
            marginTop: 20,
            padding: "12px 36px",
            fontSize: 18,
            borderRadius: 14,
            border: "2px solid white",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            opacity: spinning ? 0.5 : 1,
          }}
        >
          SPIN
        </button>
      </div>

      {/* RIGHT */}
      <div
        style={{
          width: 320,
          padding: 20,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3>🏆 Winners</h3>
        {winners.map((w, i) => (
          <div key={i}>
            <strong>{w.prizeName}</strong> – {w.player}
          </div>
        ))}
      </div>

      {showResult && winner && (
        <ResultModal
          winner={winner}
          onAccept={handleAcceptWinner}
          onRespin={handleRespin}
        />
      )}
    </div>
  );
}
