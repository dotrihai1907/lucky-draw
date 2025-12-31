import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";
import * as XLSX from "xlsx";

import toast from "react-hot-toast";
import EmptyPlayer from "../components/EmptyPlayer";
import EmptyPrize from "../components/EmptyPrize";
import GalaxySparkles from "../components/GalaxySparkles";
import LuckyWheel from "../components/LuckyWheel";
import ResultModal from "../components/ResultModal";
import SettingsButton from "../components/SettingsButton";
import SettingsModal from "../components/SettingsModal";
import Sidebar from "../components/Sidebar";
import SidebarButton from "../components/SidebarButton";
import WheelAction from "../components/WheelAction";
import WheelHeader from "../components/WheelHeader";
import WinnersByPrize from "../components/WinnersByPrize";
import { BG_GRADIENT } from "../constants/colors";
import type { Prize, WinnerRecord } from "../types";
import Lottery from "../components/Lottery";
import { DUMMY_PLAYERS } from "../constants/dummy";

type GameMode = "wheel" | "lottery";

/* ===== TIMING CONFIG ===== */
const SPIN_DURATION = 8500;
const SPIN_FADE_OUT_AT = 7500;
const EXTRA_ROUNDS = 9;

const LOTTERY_DURATION = 7000;
const LOTTERY_FADE_OUT_AT = 6000;

export default function LuckyDrawPage() {
  /* ===== SIDEBAR ===== */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ===== SETTINGS ===== */
  const [showSettings, setShowSettings] = useState(false);

  /* =====  PLAYERS ===== */
  const [players, setPlayers] = useState<string[]>(DUMMY_PLAYERS);

  /* =====  PRIZES ===== */
  const [prizes, setPrizes] = useState<Prize[]>([]);

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
    volume: 0.6,
  });

  const [playDraw, { sound: drawSound }] = useSound("/sounds/draw.mp3", {
    volume: 0.6,
  });

  const [playWin] = useSound("/sounds/win.mp3", {
    volume: 0.8,
  });

  /* ===== MODE GAME ===== */
  const [mode, setMode] = useState<GameMode>("lottery");

  /* ===== RESET KEY ===== */
  const [resetKey, setResetKey] = useState(0);

  const currentPrize = prizes[prizeIndex];

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
          defval: "",
        }) as string[][];

        const names = [
          ...new Set(
            rows
              .slice(1)
              .flat()
              .map((n) => String(n).trim())
              .map((n) => n.replace(/\s+/g, " "))
              .map((n) => n.normalize("NFC"))
              .filter((n) => n.length > 0)
          ),
        ];

        if (names.length === 0) {
          toast.error("No players detected.");
          return;
        }

        // RESET STATE
        toast.success(`Uploaded ${names.length} players.`);

        setPlayers(names);
        setWinners([]);
        setPrizeIndex(0);
        setPrizeCount(0);
        setWinner(null);

        pickedPlayersRef.current.clear();
        setDisabledPlayers(new Set());

        setResetKey((key) => (key % 2 ? key + 1 : key - 1));
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
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    const selected =
      availablePlayers[Math.floor(randomValue * availablePlayers.length)];

    if (mode === "wheel") {
      const winnerIndex = players.indexOf(selected);

      // 3️⃣ Calculate angle to point the arrow at the correct slice
      const sliceAngle = 360 / players.length;
      const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);

      const nextRotation =
        rotationRef.current +
        EXTRA_ROUNDS * 360 +
        targetAngle -
        (rotationRef.current % 360);

      // 4️⃣ Spin
      spinSound?.stop();
      spinSound?.volume(0.6);
      playSpin();

      setTimeout(() => {
        spinSound?.fade(0.6, 0, 800);
      }, SPIN_FADE_OUT_AT);

      rotationRef.current = nextRotation;
      setRotation(nextRotation);

      // 5️⃣ End spin
      setTimeout(() => {
        playWin();

        setPendingWinner({ prizeName: currentPrize.name, player: selected });
        setWinner(selected);
        setShowResult(true);
        setSpinning(false);
      }, SPIN_DURATION);
    } else {
      // 3️⃣ Draw
      drawSound?.stop();
      drawSound?.volume(0.6);
      playDraw();

      setTimeout(() => {
        drawSound?.fade(0.6, 0, 800);
      }, LOTTERY_FADE_OUT_AT);

      // 4️⃣ End draw
      setTimeout(() => {
        playWin();

        setPendingWinner({ prizeName: currentPrize.name, player: selected });
        setWinner(selected);
        setShowResult(true);
        setSpinning(false);
      }, LOTTERY_DURATION);
    }
  };

  /* ===== RESTART ===== */
  const restart = () => {
    setWinners([]);
    setPrizeIndex(0);
    setPrizeCount(0);
    setWinner(null);

    pickedPlayersRef.current.clear();
    setDisabledPlayers(new Set());

    setResetKey((key) => (key % 2 ? key + 1 : key - 1));
  };

  /* ===== ACCEPT WINNER ===== */
  const handleAcceptWinner = () => {
    setShowResult(false);

    if (!pendingWinner || !currentPrize) return;

    // add to winners list
    setWinners((prev) => [...prev, pendingWinner]);

    // 🔑 sync ref + state
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

  /* ===== TOGGLE MODE ===== */
  const handleToggleMode = () => {
    setMode((prev) => (prev === "wheel" ? "lottery" : "wheel"));
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

      <GalaxySparkles count={60} maxSize={3} color="rgba(255,255,255,0.9)" />
      <GalaxySparkles count={28} maxSize={5} color="rgb(223, 243, 255)" />

      <SidebarButton
        spinning={spinning}
        onClick={() => setSidebarOpen((prev) => !prev)}
      />

      {sidebarOpen && (
        <Sidebar
          players={players}
          onUpload={uploadFile}
          disabledPlayers={disabledPlayers}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {!!players.length && !!prizes.length ? (
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

          {mode === "wheel" ? (
            <div
              style={{
                width: "min(55vh, 32.5rem)",
                height: "min(55vh, 32.5rem)",
              }}
            >
              <LuckyWheel
                names={players}
                rotation={rotation}
                disabledNames={disabledPlayers}
                highlightName={showResult ? winner : null}
              />
            </div>
          ) : (
            <Lottery
              disabled={disabledPlayers}
              showResult={showResult}
              spinning={spinning}
              resetKey={resetKey}
              players={players}
              winner={winner}
            />
          )}

          <WheelAction
            spin={spin}
            mode={mode}
            restart={restart}
            spinning={spinning}
            currentPrize={currentPrize}
          />
        </div>
      ) : !players.length ? (
        <EmptyPlayer onClick={() => setSidebarOpen(true)} />
      ) : (
        <EmptyPrize onClick={() => setShowSettings(true)} />
      )}

      <WinnersByPrize winners={winners} />

      <SettingsButton
        spinning={spinning}
        onClick={() => setShowSettings((prev) => !prev)}
      />

      {showResult && winner && (
        <ResultModal
          winner={winner}
          onAccept={handleAcceptWinner}
          onRespin={handleRespin}
        />
      )}

      {showSettings && (
        <SettingsModal
          mode={mode}
          prizes={prizes}
          onRestart={restart}
          setPrizes={setPrizes}
          bgmEnabled={bgmEnabled}
          onToggleMode={handleToggleMode}
          onClose={() => setShowSettings(false)}
          onChangeBgm={() => setBgmEnabled((prev) => !prev)}
        />
      )}
    </div>
  );
}
