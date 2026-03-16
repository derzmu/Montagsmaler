import { useState, useEffect, useRef } from "react";
import TERMS from "./words.js";

const TIMER_OPTIONS = [15, 30, 60, 90];

const colors = {
  bg: "#0f0f0f", surface: "#1a1a1a", surfaceHigh: "#242424", border: "#2a2a2a",
  accent: "#6c63ff", accentSoft: "#3d3a6e", green: "#22c55e", greenSoft: "#14532d",
  red: "#ef4444", orange: "#f97316", textPrimary: "#f0f0f0", textMuted: "#666", textDim: "#444",
};

function randomTerm(exclude) {
  const pool = TERMS.filter(t => t !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [playerCount, setPlayerCount] = useState(3);
  const [timerDuration, setTimerDuration] = useState(60);
  const [scores, setScores] = useState([]);
  const [term, setTerm] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const intervalRef = useRef(null);
  const f = { fontFamily: "'DM Sans', sans-serif" };

  function startGame() {
    setScores(Array(playerCount).fill(0));
    setScreen("game");
    setTerm(randomTerm(null));
    setRevealed(false);
  }

  function nextTerm() {
    setTerm(t => randomTerm(t));
    setRevealed(false);
    setTimeLeft(null);
    setTimerRunning(false);
    setTimerDone(false);
    setShowStopConfirm(false);
    clearTimeout(intervalRef.current);
  }

  function startTimer() {
    if (timerRunning) return;
    setTimerRunning(true);
    setTimerDone(false);
    setTimeLeft(timerDuration);
  }

  function stopTimer() {
    setTimerRunning(false);
    clearTimeout(intervalRef.current);
    setShowStopConfirm(true);
  }

  function confirmStop() {
    setShowStopConfirm(false);
    setTimeLeft(null);
    setTimerDone(false);
  }

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false);
      setTimerDone(true);
      setShowAlarm(true);
    }
    return () => clearTimeout(intervalRef.current);
  }, [timerRunning, timeLeft]);

  const timerColor = timeLeft <= 10 ? colors.red : timeLeft <= 20 ? colors.orange : colors.green;

  const Btn = ({ label, onClick, disabled, bg, color, border, style }) => (
    <button onClick={onClick} disabled={disabled} style={{ background: bg || colors.accent, color: color || colors.textPrimary, border: border || "none", borderRadius: 12, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, width: "100%", ...f, transition: "opacity .15s", ...(style||{}) }}>{label}</button>
  );

  if (screen === "setup") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100dvh", background: colors.bg, color: colors.textPrimary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 28, ...f }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: colors.textMuted, textTransform: "uppercase", textAlign: "center", marginBottom: 6 }}>Das Zeichenspiel</div>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, textAlign: "center" }}>Montagsmaler</div>
        </div>
        <div style={{ background: colors.surface, borderRadius: 18, padding: 22, width: "100%", maxWidth: 360, border: `1px solid ${colors.border}` }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 2 }}>Spieler</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[2,3,4,5,6,7,8].map(n => (
                <button key={n} onClick={() => setPlayerCount(n)} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${playerCount===n ? colors.accent : colors.border}`, cursor: "pointer", fontSize: 16, fontWeight: 700, background: playerCount===n ? colors.accentSoft : colors.surfaceHigh, color: playerCount===n ? "#fff" : colors.textMuted, ...f }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 2 }}>Timer</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {TIMER_OPTIONS.map(s => (
                <button key={s} onClick={() => setTimerDuration(s)} style={{ padding: "11px 0", borderRadius: 10, border: `1px solid ${timerDuration===s ? colors.accent : colors.border}`, cursor: "pointer", fontSize: 14, fontWeight: 700, background: timerDuration===s ? colors.accentSoft : colors.surfaceHigh, color: timerDuration===s ? "#fff" : colors.textMuted, ...f }}>
                  {s}s
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <Btn label="Spiel starten" onClick={startGame} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100dvh", background: colors.bg, color: colors.textPrimary, display: "flex", flexDirection: "column", padding: "16px 16px 24px", gap: 10, boxSizing: "border-box", ...f }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.textMuted, letterSpacing: 2, textTransform: "uppercase", textAlign: "center", paddingBottom: 2 }}>Montagsmaler</div>

        {showAlarm && (
          <div onClick={() => setShowAlarm(false)}
            style={{ position: "fixed", inset: 0, background: colors.red, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, zIndex: 100, cursor: "pointer" }}>
            <div style={{ fontSize: 80 }}>⏰</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>Zeit!</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Tippen zum Schließen</div>
          </div>
        )}

        <div onClick={() => { if (term && !revealed) setRevealed(true); }}
          style={{ background: colors.surface, borderRadius: 18, minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center", cursor: revealed ? "default" : "pointer", padding: 24, border: `1px solid ${colors.border}` }}>
          {revealed ? (
            <div style={{ fontSize: 36, fontWeight: 900, textAlign: "center", letterSpacing: -0.5, lineHeight: 1.2 }}>{term}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 36 }}>👆</div>
              <div style={{ fontSize: 14, color: colors.textMuted }}>Tippen zum Aufdecken</div>
            </div>
          )}
        </div>

        <div style={{ background: colors.surface, borderRadius: 16, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 46, fontWeight: 900, minWidth: 72, color: timerDone ? colors.red : timeLeft !== null ? timerColor : colors.textPrimary, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {timeLeft !== null ? timeLeft : timerDuration}
            <span style={{ fontSize: 14, color: colors.textMuted, marginLeft: 2, fontWeight: 600 }}>s</span>
          </div>
          <div style={{ flex: 1 }}>
            {timerRunning
              ? <Btn label="Stop" onClick={stopTimer} bg={colors.surfaceHigh} color={colors.textMuted} border={`1px solid ${colors.border}`} />
              : <Btn label={timerDone ? "Nochmal" : "Start"} onClick={startTimer} bg={colors.greenSoft} color={colors.green} border={`1px solid #166534`} />}
          </div>
        </div>

        {showStopConfirm && (
          <div style={{ background: colors.surfaceHigh, borderRadius: 16, padding: "16px 18px", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Punkte schon eingetragen?</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={confirmStop} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: colors.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", ...f }}>Ja, weiter</button>
              <button onClick={() => setShowStopConfirm(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textMuted, fontWeight: 700, fontSize: 14, cursor: "pointer", ...f }}>Abbrechen</button>
            </div>
          </div>
        )}

        <Btn label="Neuer Begriff" onClick={nextTerm} bg={colors.surfaceHigh} color={colors.textPrimary} border={`1px solid ${colors.border}`} />

        <div style={{ background: colors.surface, borderRadius: 16, padding: 16, flex: 1, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Punkte</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {scores.map((s, i) => (
              <div key={i} style={{ background: colors.surfaceHigh, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${colors.border}` }}>
                <div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 2 }}>Spieler {i+1}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{s}</div>
                </div>
                <button onClick={() => setScores(sc => sc.map((v,j) => j===i ? v+1 : v))}
                  style={{ background: colors.accentSoft, border: `1px solid ${colors.accent}`, borderRadius: 9, width: 34, height: 34, fontSize: 18, color: colors.accent, cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", ...f }}>+</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setScreen("setup")} style={{ background: "transparent", color: colors.textDim, border: "none", padding: "6px 0", fontSize: 13, cursor: "pointer", ...f }}>
          Neu einrichten
        </button>
      </div>
    </>
  );
}
