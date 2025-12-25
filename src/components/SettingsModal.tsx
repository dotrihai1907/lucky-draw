import { useMemo, useState } from "react";

interface Prize {
  name: string;
  count: number;
}

interface SettingModalProps {
  onClose: () => void;
  bgmEnabled: boolean;
  onChangeBgm: () => void;
  onRestart: () => void;
  prizes: Prize[];
  setPrizes: React.Dispatch<React.SetStateAction<Prize[]>>;
}

export default function SettingModal({
  onClose,
  bgmEnabled,
  onChangeBgm,
  prizes,
  setPrizes,
  onRestart,
}: SettingModalProps) {
  const [newPrize, setNewPrize] = useState({ name: "", count: "" });

  const disabled = useMemo(
    () => !newPrize.name.trim() || Number(newPrize.count) <= 0,
    [newPrize.count, newPrize.name]
  );

  const addPrize = () => {
    if (disabled) return;
    setPrizes((prev) => [
      ...prev,
      { name: newPrize.name, count: Number(newPrize.count) },
    ]);
    setNewPrize({ name: "", count: "" });
    onRestart();
  };

  const removePrize = (idx: number) => {
    setPrizes(prizes.filter((_, i) => i !== idx));
    onRestart();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(0.875rem)",
          padding: "2.25rem 2.5rem",
          borderRadius: "1.375rem",
          color: "#fff",
          minWidth: "22.5rem",
          border: "0.0625rem solid rgba(255,255,255,0.25)",
          boxShadow: "0 1.25rem 3.75rem rgba(0,0,0,0.4)",
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
            letterSpacing: "0.03125rem",
            textAlign: "center",
          }}
        >
          ⚙ Settings
        </h2>

        {/* TOGGLE BGM */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "1.0625rem", marginBottom: "0.625rem" }}>
            🎵 Background Music
          </h3>

          <button
            onClick={onChangeBgm}
            style={{
              width: "2.875rem",
              height: "1.5rem",
              borderRadius: "1.875rem",
              background: bgmEnabled ? "#4caf50" : "#555",
              border: "none",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "0.1875rem",
                left: bgmEnabled ? "1.5rem" : "0.1875rem",
                width: "1.125rem",
                height: "1.125rem",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s ease",
              }}
            />
          </button>
        </div>

        {/* PRIZE LIST */}
        <h3 style={{ fontSize: "1.0625rem", marginBottom: "0.75rem" }}>
          🎁 Prize Settings
        </h3>

        <p
          style={{
            fontSize: "0.8125rem",
            opacity: 0.75,
            marginBottom: "1.25rem",
            fontStyle: "italic",
          }}
        >
          Prizes will be drawn in order from top to bottom.
        </p>

        {prizes.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span>
              {i + 1}. {p.name}
            </span>

            <div>
              <span>x{p.count}</span>
              <button
                onClick={() => removePrize(i)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "1.25rem",
                  fontSize: "1rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {/* ADD NEW */}
        <div style={{ marginTop: "0.875rem" }}>
          <input
            placeholder="Prize name"
            value={newPrize.name}
            onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
            style={{
              width: "100%",
              padding: "0.625rem 0.75rem",
              marginBottom: "0.5rem",
              borderRadius: "0.625rem",
              border: "0.0625rem solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontFamily: "var(--font-body)",
            }}
          />

          <input
            type="number"
            placeholder="Quantity"
            min={1}
            value={newPrize.count}
            onChange={(e) =>
              setNewPrize({ ...newPrize, count: e.target.value })
            }
            style={{
              width: "100%",
              padding: "0.625rem 0.75rem",
              marginBottom: "0.625rem",
              borderRadius: "0.625rem",
              border: "0.0625rem solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontFamily: "var(--font-body)",
            }}
          />

          <button
            disabled={disabled}
            onClick={addPrize}
            style={{
              width: "100%",
              padding: "0.625rem",
              borderRadius: "0.625rem",
              marginTop: "0.3125rem",
              background: disabled
                ? "rgba(255,255,255,0.18)"
                : "linear-gradient(135deg, #4caf50, #43a047)",
              opacity: disabled ? 0.45 : 1,
              border: "none",
              color: "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              fontFamily: "var(--font-body)",
            }}
          >
            Add Prize
          </button>
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          style={{
            marginTop: "0.9375rem",
            width: "100%",
            padding: "0.625rem",
            borderRadius: "0.625rem",
            background: "rgba(255,255,255,0.15)",
            border: "0.0625rem solid rgba(255,255,255,0.25)",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
