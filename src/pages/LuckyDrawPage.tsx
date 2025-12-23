import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";

import LuckyWheel from "../components/LuckyWheel";
import ResultModal from "../components/ResultModal";
import { PRIZES } from "../data/prizes";
import { BG_GRADIENT, GLASS_CARD } from "../constants/colors";

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
  const [disabledPlayers, setDisabledPlayers] = useState<Set<string>>(
    new Set()
  );

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

  /* ===== BGM EFFECT ===== */
  useEffect(() => {
    if (bgmEnabled) playBgm();
    else bgmSound?.stop();
  }, [bgmEnabled, playBgm, bgmSound]);

  /* ===== SPIN ===== */
  const spin = () => {
    if (spinning || !currentPrize) return;

    // 1️⃣ Lấy danh sách người CHƯA trúng
    const availablePlayers = players.filter(
      (p) => !pickedPlayersRef.current.has(p)
    );

    if (availablePlayers.length === 0) return;

    setSpinning(true);
    setShowResult(false);
    setWinner(null);

    // 2️⃣ CHỌN WINNER TRƯỚC (CHUẨN)
    const selected =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    const winnerIndex = players.indexOf(selected);

    // 3️⃣ TÍNH GÓC để mũi tên CHỈ ĐÚNG ô đó
    const sliceAngle = 360 / players.length;
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);

    const nextRotation =
      rotationRef.current +
      EXTRA_ROUNDS * 360 +
      targetAngle -
      (rotationRef.current % 360);

    // 4️⃣ QUAY
    spinSound?.stop();
    spinSound?.volume(0.4);
    playSpin();

    setTimeout(() => {
      spinSound?.fade(0.4, 0, 800);
    }, SPIN_FADE_OUT_AT);

    rotationRef.current = nextRotation;
    setRotation(nextRotation);

    // 5️⃣ KẾT THÚC
    setTimeout(() => {
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

    // add to winners list
    setWinners((prev) => [...prev, pendingWinner]);

    // 🔑 SYNC REF + STATE
    pickedPlayersRef.current.add(pendingWinner.player);
    setDisabledPlayers(new Set(pickedPlayersRef.current));

    // prize flow
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
      setDisabledPlayers(new Set(pickedPlayersRef.current));
    }

    setPendingWinner(null);
  };

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
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: BG_GRADIENT,
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
          padding: "8px 14px",
          ...GLASS_CARD,
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
            cursor: "pointer",
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
            <h2
              style={{
                fontFamily: "var(--font-title)",
              }}
            >
              🎁 {currentPrize.name}
            </h2>
            <p style={{ opacity: 0.7 }}>
              {prizeCount + 1} / {currentPrize.count}
            </p>
          </div>
        )}

        <div style={{ width: "min(55vh, 520px)", height: "min(55vh, 520px)" }}>
          <LuckyWheel
            names={players}
            rotation={rotation}
            disabledNames={disabledPlayers}
            highlightName={showResult ? winner : null}
          />
        </div>

        <button
          onClick={spin}
          disabled={spinning || !currentPrize}
          style={{
            marginTop: 24,
            padding: "16px 46px",
            fontSize: 18,
            fontFamily: "Fredoka, sans-serif",
            letterSpacing: 1,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.35)",
            background: `linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))`,
            backdropFilter: "blur(14px)",
            color: "#fff",
            cursor: spinning ? "not-allowed" : "pointer",
            boxShadow: `0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 rgba(255,255,255,0.4)`,
            transition: "all 0.25s ease",
            opacity: spinning ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 14px 40px rgba(120,180,255,0.45)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          SPIN
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ width: 320, padding: 20, ...GLASS_CARD }}>
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
