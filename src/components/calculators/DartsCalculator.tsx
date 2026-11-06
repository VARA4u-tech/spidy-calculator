import { useState, useEffect } from "react";
import {
  createDartsGame,
  parseDart,
  playTurn,
  getCheckoutSuggestion,
  type DartsGameState,
  type DartThrow,
} from "@/lib/darts";
import { playClickSound } from "@/lib/sounds";
import { Target, Trophy, RotateCcw, AlertTriangle, Users } from "lucide-react";

export interface DartsCalculatorProps {
  activeMode?: "501" | "301" | undefined;
}

export function DartsCalculator({ activeMode }: DartsCalculatorProps = {}) {
  const targetScore = activeMode === "301" ? 301 : 501;
  const [game, setGame] = useState<DartsGameState>(() =>
    createDartsGame(targetScore, ["Spidy", "Goblin"], 3),
  );
  const [selectedMultiplier, setSelectedMultiplier] = useState<1 | 2 | 3>(1);
  const [currentTurnDarts, setCurrentTurnDarts] = useState<DartThrow[]>([]);
  const [directPointsInput, setDirectPointsInput] = useState<string>("");

  useEffect(() => {
    if (activeMode && (activeMode === "301" || activeMode === "501")) {
      const newTarget = Number(activeMode) as 301 | 501;
      if (game.gameMode !== newTarget) {
        setGame(createDartsGame(newTarget, ["Spidy", "Goblin"], 3));
        setCurrentTurnDarts([]);
      }
    }
  }, [activeMode, game.gameMode]);

  const activePlayer = game.players[game.activePlayerIndex] ?? game.players[0];
  const checkoutTips = activePlayer ? getCheckoutSuggestion(activePlayer.scoreRemaining) : null;

  const handleDartClick = (segment: number) => {
    if (currentTurnDarts.length >= 3 || game.winnerPlayerId) return;
    playClickSound();
    const dart = parseDart(selectedMultiplier, segment);
    const updated = [...currentTurnDarts, dart];
    setCurrentTurnDarts(updated);
    setSelectedMultiplier(1); // Reset to single

    // If 3 darts thrown, submit turn
    if (updated.length === 3) {
      submitTurn(updated);
    }
  };

  const submitTurn = (darts: DartThrow[]) => {
    try {
      const { nextState, turn } = playTurn(game, darts);
      setGame(nextState);
      setCurrentTurnDarts([]);
      if (turn.isBust) {
        // play alert sound or indication
      }
    } catch {
      // ignore
    }
  };

  const handleDirectScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseInt(directPointsInput, 10);
    if (isNaN(score) || score < 0 || score > 180) return;
    playClickSound();

    // Approximate into a turn with a single custom scored throw
    const dart: DartThrow = {
      multiplier: 1,
      segment: score,
      score,
      label: `${score}`,
    };
    submitTurn([dart]);
    setDirectPointsInput("");
  };

  const handleResetGame = (mode: 301 | 501 = 501) => {
    playClickSound();
    setGame(
      createDartsGame(
        mode,
        game.players.map((p) => p.name),
        game.firstToLegs,
      ),
    );
    setCurrentTurnDarts([]);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Game Mode Header */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--ink)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-ink bg-hero-red shadow-[2px_2px_0_0_var(--ink)] text-paper">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-comic text-2xl font-bold text-ink leading-tight">
              {game.gameMode} DARTS SCORER
            </h2>
            <p className="font-mono text-xs text-ink/70">
              PDC DOUBLE-OUT RULES · FIRST TO {game.firstToLegs} LEGS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleResetGame(501)}
            className={`rounded-xl border-2 border-ink px-3 py-1.5 font-comic text-xs font-bold ${
              game.gameMode === 501
                ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)]"
                : "bg-paper text-ink"
            }`}
          >
            501 GAME
          </button>
          <button
            type="button"
            onClick={() => handleResetGame(301)}
            className={`rounded-xl border-2 border-ink px-3 py-1.5 font-comic text-xs font-bold ${
              game.gameMode === 301
                ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)]"
                : "bg-paper text-ink"
            }`}
          >
            301 GAME
          </button>
          <button
            type="button"
            onClick={() => handleResetGame(game.gameMode as 301 | 501)}
            className="flex items-center gap-1 rounded-xl border-2 border-ink bg-hero-red px-3 py-1.5 font-comic text-xs font-bold text-paper shadow-[2px_2px_0_0_var(--ink)]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> RESET
          </button>
        </div>
      </div>

      {/* Winner Banner */}
      {game.winnerPlayerId && (
        <div className="rounded-2xl border-4 border-ink bg-mustard p-6 text-center shadow-[8px_8px_0_0_var(--ink)] animate-bounce">
          <Trophy className="mx-auto h-12 w-12 text-ink mb-2" />
          <h3 className="font-comic text-3xl font-black text-ink">
            {game.players.find((p) => p.id === game.winnerPlayerId)?.name.toUpperCase()} WINS THE
            MATCH!
          </h3>
          <p className="font-body text-sm font-bold text-ink/80 mt-1">
            Championship finish achieved on a double!
          </p>
        </div>
      )}

      {/* Scoreboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {game.players.map((p, idx) => {
          const isActive = idx === game.activePlayerIndex;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border-4 border-ink p-4 transition-all ${
                isActive
                  ? "bg-hero-blue text-paper shadow-[6px_6px_0_0_var(--ink)] -translate-y-1"
                  : "bg-paper text-ink shadow-[3px_3px_0_0_var(--ink)] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-ink/20 pb-2">
                <span className="font-comic text-sm font-bold truncate">{p.name}</span>
                {isActive && (
                  <span className="rounded-md border border-ink bg-mustard px-1.5 py-0.5 font-comic text-[9px] font-bold text-ink uppercase">
                    AT OCHE
                  </span>
                )}
              </div>

              {/* Large Remaining Score */}
              <div className="my-3 text-center">
                <div className="font-comic text-5xl font-black tracking-tight">
                  {p.scoreRemaining}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                  REMAINING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t-2 border-ink/20 pt-2 font-mono text-xs">
                <div>
                  <span className="text-[10px] opacity-75">3-DART AVG</span>
                  <div className="font-bold">{p.threeDartAvg.toFixed(1)}</div>
                </div>
                <div>
                  <span className="text-[10px] opacity-75">LEGS WON</span>
                  <div className="font-bold">
                    {p.legsWon} / {game.firstToLegs}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Tips Box for Active Player */}
      {checkoutTips && !game.winnerPlayerId && (
        <div className="rounded-xl border-3 border-ink bg-emerald-600 p-4 text-paper shadow-[4px_4px_0_0_var(--ink)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-comic text-sm font-bold uppercase tracking-wider">
              CHECKOUT FINISH PATH:
            </span>
            <div className="flex gap-2">
              {checkoutTips.map((tip, i) => (
                <span
                  key={i}
                  className="rounded-lg border-2 border-ink bg-paper px-2.5 py-1 font-comic text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
          <span className="hidden sm:inline font-mono text-xs text-paper/80">
            Double-Out required
          </span>
        </div>
      )}

      {/* Throw Input Section */}
      {!game.winnerPlayerId && (
        <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-5">
          {/* Current Turn Status */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-3">
            <div className="font-comic text-lg font-bold text-ink">
              {(activePlayer?.name ?? "PLAYER").toUpperCase()}'S TURN (DART{" "}
              {currentTurnDarts.length + 1} OF 3)
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ink/70">Darts in turn:</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex h-8 w-12 items-center justify-center rounded-lg border-2 border-ink bg-parchment font-comic text-xs font-bold text-ink"
                  >
                    {currentTurnDarts[i]?.label || "—"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multiplier Toggles */}
          <div className="flex gap-2">
            {(
              [
                { mul: 1, label: "SINGLE (1×)", color: "bg-paper text-ink" },
                { mul: 2, label: "DOUBLE (2×)", color: "bg-hero-blue text-paper" },
                { mul: 3, label: "TRIPLE (3×)", color: "bg-hero-red text-paper" },
              ] as const
            ).map((m) => (
              <button
                key={m.mul}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedMultiplier(m.mul);
                }}
                className={`flex-1 rounded-xl border-3 border-ink py-2 font-comic text-xs sm:text-sm font-bold shadow-[2px_2px_0_0_var(--ink)] transition-all ${
                  selectedMultiplier === m.mul
                    ? `${m.color} -translate-y-0.5 shadow-[4px_4px_0_0_var(--ink)]`
                    : "bg-parchment text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Segments Keypad (1 to 20 + Bull + Miss) */}
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => handleDartClick(seg)}
                className="h-12 rounded-xl border-2 border-ink bg-parchment font-comic text-base font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard active:translate-y-0.5"
              >
                {selectedMultiplier === 3 ? `T${seg}` : selectedMultiplier === 2 ? `D${seg}` : seg}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleDartClick(25)}
              className="h-12 rounded-xl border-2 border-ink bg-hero-red font-comic text-xs sm:text-sm font-bold text-paper shadow-[2px_2px_0_0_var(--ink)] active:translate-y-0.5"
            >
              {selectedMultiplier === 2 ? "BULL (50)" : "25"}
            </button>

            <button
              type="button"
              onClick={() => handleDartClick(0)}
              className="h-12 rounded-xl border-2 border-ink bg-ink/20 font-comic text-xs sm:text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] active:translate-y-0.5"
            >
              MISS (0)
            </button>
          </div>

          {/* Direct 3-Dart Turn Score Quick Entry */}
          <div className="border-t-2 border-dashed border-ink/20 pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-comic text-xs font-bold text-ink uppercase">
              OR ENTER FULL TURN SCORE (0 - 180):
            </span>
            <form onSubmit={handleDirectScoreSubmit} className="flex gap-2">
              <input
                type="number"
                min="0"
                max="180"
                placeholder="e.g. 100"
                value={directPointsInput}
                onChange={(e) => setDirectPointsInput(e.target.value)}
                className="w-28 rounded-xl border-2 border-ink bg-parchment px-3 py-1 font-mono text-sm font-bold text-ink"
              />
              <button
                type="submit"
                className="rounded-xl border-2 border-ink bg-mustard px-4 py-1 font-comic text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
