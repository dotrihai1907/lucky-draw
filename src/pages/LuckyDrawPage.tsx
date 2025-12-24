import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";
import * as XLSX from "xlsx";

import toast from "react-hot-toast";
import LuckyWheel from "../components/LuckyWheel";
import ResultModal from "../components/ResultModal";
import { BG_GRADIENT, GLASS_CARD } from "../constants/colors";
import { PRIZES } from "../data/prizes";
import Sidebar from "../components/Sidebar";
import WinnersByPrize from "../components/WinnersByPrize";
import EmptyPlayer from "../components/EmptyPlayer";
import WheelAction from "../components/WheelAction";
import WheelHeader from "../components/WheelHeader";
import SidebarButton from "../components/SidebarButton";

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
  "Mia",
  "Nina",
  "Oliver",
  "Paul",
  "Quinn",
  "Rachel",
  "Sam",
  "Tina",
  "Uma",
  "Vera",
  "Walt",
  "Xena",
  "Yara",
  "Zane",
  "Alice",
  "Bob",
  "Cathy",
  "Derek",
  "Eva",
  "Fred",
  "Gina",
  "Harry",
  "Ivy",
  "Jason",
  "Kathy",
  "Liam",
  "Molly",
  "Nate",
  "Olivia",
  "Pete",
  "Queenie",
  "Rob",
  "Sophie",
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
  /* ===== SIDEBAR ===== */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =====  PLAYERS ===== */
  const [players, setPlayers] = useState<string[]>(ALL_PLAYERS);

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
    volume: 0.2,
    loop: true,
  });

  const [playSpin, { sound: spinSound }] = useSound("/sounds/spin.mp3", {
    volume: 0.6,
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

  /* ===== UPLOAD FILE ===== */
  const uploadFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as string[][];

        const names = rows
          .flat()
          .map((n) => String(n).trim())
          .filter(Boolean);

        if (names.length === 0) {
          toast.error("File has not any valid names");
          return;
        }

        // RESET draw state
        toast.success(`Loaded ${names.length} participants!`);

        setPlayers(names);
        setWinners([]);
        setPrizeIndex(0);
        setPrizeCount(0);
        setWinner(null);

        pickedPlayersRef.current.clear();
        setDisabledPlayers(new Set());
      } catch {
        toast.error("Failed to read file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  /* ===== SPIN ===== */
  const spin = () => {
    if (spinning || !currentPrize) return;

    // 1️⃣ Get list of players who haven't won yet
    const availablePlayers = players.filter(
      (p) => !pickedPlayersRef.current.has(p)
    );

    if (availablePlayers.length === 0) return;

    setSpinning(true);
    setShowResult(false);
    setWinner(null);

    // 2️⃣  Select a winner from available players
    const selected =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    const winnerIndex = players.indexOf(selected);

    // 3️⃣ Calculate angle to point the arrow at the correct slice
    const sliceAngle = 360 / players.length;
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);

    const nextRotation =
      rotationRef.current +
      EXTRA_ROUNDS * 360 +
      targetAngle -
      (rotationRef.current % 360);

    // 4️⃣ SPIN
    spinSound?.stop();
    spinSound?.volume(0.6);
    playSpin();

    setTimeout(() => {
      spinSound?.fade(0.6, 0, 800);
    }, SPIN_FADE_OUT_AT);

    rotationRef.current = nextRotation;
    setRotation(nextRotation);

    // 5️⃣ END SPIN
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

  /* ===== RESTART ===== */
  const restart = () => {
    setWinners([]);
    setPrizeIndex(0);
    setPrizeCount(0);
    setWinner(null);

    pickedPlayersRef.current.clear();
    setDisabledPlayers(new Set());
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

      <SidebarButton
        spinning={spinning}
        onClick={() => setSidebarOpen((prev) => !prev)}
      />

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

      {sidebarOpen && (
        <Sidebar
          players={players}
          onUpload={uploadFile}
          disabledPlayers={disabledPlayers}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {players.length ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WheelHeader currentPrize={currentPrize} prizeCount={prizeCount} />

          <div
            style={{ width: "min(55vh, 520px)", height: "min(55vh, 520px)" }}
          >
            <LuckyWheel
              names={players}
              rotation={rotation}
              disabledNames={disabledPlayers}
              highlightName={showResult ? winner : null}
            />
          </div>

          <WheelAction
            spin={spin}
            restart={restart}
            spinning={spinning}
            currentPrize={currentPrize}
          />
        </div>
      ) : (
        <EmptyPlayer />
      )}

      <WinnersByPrize winners={winners} />

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
