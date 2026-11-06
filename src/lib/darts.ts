/**
 * Spidy Calculator — Darts Calculator Engine
 * Handles 301, 501, and custom darts matches.
 * PDC double-out rules, checkout suggestions, bust checks, and 3-dart averages.
 */

export interface DartThrow {
  multiplier: 1 | 2 | 3;
  segment: number; // 0 to 25 (25 is outer bull, D25 is inner bull)
  score: number;
  label: string;
}

export interface PlayerTurn {
  playerId: string;
  turnIndex: number;
  darts: DartThrow[];
  turnScore: number;
  scoreBefore: number;
  scoreAfter: number;
  isBust: boolean;
  isCheckout: boolean;
}

export interface DartsPlayer {
  id: string;
  name: string;
  scoreRemaining: number;
  legsWon: number;
  setsWon: number;
  dartsThrown: number;
  totalPointsScored: number;
  threeDartAvg: number;
  turns: PlayerTurn[];
}

export interface DartsGameState {
  gameMode: 301 | 501 | number;
  doubleOut: boolean;
  firstToLegs: number;
  players: DartsPlayer[];
  activePlayerIndex: number;
  legNumber: number;
  setNumber: number;
  winnerPlayerId: string | null;
  history: {
    turns: PlayerTurn[];
  };
}

// -------------------------------------------------------------
// Checkout Table for PDC Double-Out (scores 2 to 170)
// -------------------------------------------------------------
export const PDC_CHECKOUTS: Record<number, string[]> = {
  170: ["T20", "T20", "Bull"],
  167: ["T20", "T19", "Bull"],
  164: ["T20", "T18", "Bull"],
  161: ["T20", "T17", "Bull"],
  160: ["T20", "T20", "D20"],
  158: ["T20", "T20", "D19"],
  157: ["T20", "T19", "D20"],
  156: ["T20", "T20", "D18"],
  155: ["T20", "T19", "D19"],
  154: ["T20", "T18", "D20"],
  153: ["T20", "T19", "D18"],
  152: ["T20", "T20", "D16"],
  151: ["T20", "T17", "D20"],
  150: ["T20", "T18", "D18"],
  149: ["T20", "T19", "D16"],
  148: ["T20", "T20", "D14"],
  147: ["T20", "T17", "D18"],
  146: ["T20", "T18", "D16"],
  145: ["T20", "T15", "D20"],
  144: ["T20", "T20", "D12"],
  143: ["T20", "T17", "D16"],
  142: ["T20", "T14", "D20"],
  141: ["T20", "T19", "D12"],
  140: ["T20", "T20", "D10"],
  139: ["T20", "T13", "D20"],
  138: ["T20", "T18", "D12"],
  137: ["T19", "T20", "D10"],
  136: ["T20", "T20", "D8"],
  135: ["T20", "T17", "D12"],
  134: ["T20", "T14", "D16"],
  133: ["T20", "T19", "D8"],
  132: ["Bull", "Bull", "D16"],
  131: ["T20", "T13", "D16"],
  130: ["T20", "T20", "D5"],
  129: ["T19", "T20", "D6"],
  128: ["T18", "T14", "D16"],
  127: ["T20", "T17", "D8"],
  126: ["T19", "T19", "D6"],
  125: ["25", "T20", "D20"],
  124: ["T20", "T16", "D8"],
  123: ["T19", "T16", "D9"],
  122: ["T18", "T20", "D4"],
  121: ["T20", "T15", "D8"],
  120: ["T20", "20", "D20"],
  119: ["T19", "12", "Bull"],
  118: ["T20", "18", "D20"],
  117: ["T20", "17", "D20"],
  116: ["T20", "16", "D20"],
  115: ["T20", "15", "D20"],
  114: ["T20", "14", "D20"],
  113: ["T19", "16", "D20"],
  112: ["T20", "12", "D20"],
  111: ["T20", "19", "D16"],
  110: ["T20", "10", "D20"],
  109: ["T20", "17", "D16"],
  108: ["T20", "16", "D16"],
  107: ["T19", "18", "D16"],
  106: ["T20", "10", "D18"],
  105: ["T20", "13", "D16"],
  104: ["T18", "18", "D16"],
  103: ["T20", "11", "D16"],
  102: ["T20", "10", "D16"],
  101: ["T17", "18", "D16"],
  100: ["T20", "D20"],
  99: ["T19", "10", "D16"],
  98: ["T20", "D19"],
  97: ["T19", "D20"],
  96: ["T20", "D18"],
  95: ["T19", "D19"],
  94: ["T18", "D20"],
  93: ["T19", "D18"],
  92: ["T20", "D16"],
  91: ["T17", "D20"],
  90: ["T20", "D15"],
  89: ["T19", "D16"],
  88: ["T16", "D20"],
  87: ["T17", "D18"],
  86: ["T18", "D16"],
  85: ["T15", "D20"],
  84: ["T20", "D12"],
  83: ["T17", "D16"],
  82: ["Bull", "D16"],
  81: ["T19", "D12"],
  80: ["T20", "D10"],
  79: ["T19", "D11"],
  78: ["T18", "D12"],
  77: ["T19", "D10"],
  76: ["T20", "D8"],
  75: ["T17", "D12"],
  74: ["T14", "D16"],
  73: ["T19", "D8"],
  72: ["T16", "D12"],
  71: ["T13", "D16"],
  70: ["T10", "D20"],
  69: ["T19", "D6"],
  68: ["T20", "D4"],
  67: ["T17", "D8"],
  66: ["T10", "D18"],
  65: ["25", "D20"],
  64: ["T16", "D8"],
  63: ["T13", "D12"],
  62: ["T10", "D16"],
  61: ["T15", "D8"],
  60: ["20", "D20"],
  59: ["19", "D20"],
  58: ["18", "D20"],
  57: ["17", "D20"],
  56: ["16", "D20"],
  55: ["15", "D20"],
  54: ["14", "D20"],
  53: ["13", "D20"],
  52: ["12", "D20"],
  51: ["19", "D16"],
  50: ["Bull"],
  49: ["17", "D16"],
  48: ["16", "D16"],
  47: ["15", "D16"],
  46: ["14", "D16"],
  45: ["13", "D16"],
  44: ["12", "D16"],
  43: ["11", "D16"],
  42: ["10", "D16"],
  41: ["9", "D16"],
  40: ["D20"],
  38: ["D19"],
  36: ["D18"],
  34: ["D17"],
  32: ["D16"],
  30: ["D15"],
  28: ["D14"],
  26: ["D13"],
  24: ["D12"],
  22: ["D11"],
  20: ["D10"],
  18: ["D9"],
  16: ["D8"],
  14: ["D7"],
  12: ["D6"],
  10: ["D5"],
  8: ["D4"],
  6: ["D3"],
  4: ["D2"],
  2: ["D1"],
};

// -------------------------------------------------------------
// Core Game Logic
// -------------------------------------------------------------

export function createDartsGame(
  gameMode: 301 | 501 = 501,
  playerNames: string[] = ["Player 1", "Player 2"],
  firstToLegs: number = 3,
): DartsGameState {
  const players: DartsPlayer[] = playerNames.map((name, idx) => ({
    id: `p-${idx + 1}`,
    name: name.trim() || `Player ${idx + 1}`,
    scoreRemaining: gameMode,
    legsWon: 0,
    setsWon: 0,
    dartsThrown: 0,
    totalPointsScored: 0,
    threeDartAvg: 0,
    turns: [],
  }));

  return {
    gameMode,
    doubleOut: true,
    firstToLegs,
    players,
    activePlayerIndex: 0,
    legNumber: 1,
    setNumber: 1,
    winnerPlayerId: null,
    history: { turns: [] },
  };
}

export function parseDart(multiplier: 1 | 2 | 3, segment: number): DartThrow {
  const cleanSeg = Math.max(0, Math.min(25, Math.round(segment)));
  let score = 0;
  let label = "0";

  if (cleanSeg === 0) {
    score = 0;
    label = "Miss";
  } else if (cleanSeg === 25) {
    if (multiplier === 2) {
      score = 50;
      label = "Bull";
    } else {
      score = 25;
      label = "25";
    }
  } else {
    score = cleanSeg * multiplier;
    if (multiplier === 3) label = `T${cleanSeg}`;
    else if (multiplier === 2) label = `D${cleanSeg}`;
    else label = `${cleanSeg}`;
  }

  return { multiplier, segment: cleanSeg, score, label };
}

export function getCheckoutSuggestion(score: number): string[] | null {
  if (score < 2 || score > 170) return null;
  return PDC_CHECKOUTS[score] ?? null;
}

export function playTurn(
  state: DartsGameState,
  darts: DartThrow[],
): { nextState: DartsGameState; turn: PlayerTurn } {
  if (state.winnerPlayerId) {
    throw new Error("Game is already finished.");
  }

  const player = state.players[state.activePlayerIndex] ?? state.players[0];
  if (!player) {
    throw new Error("No active player found.");
  }
  const scoreBefore = player.scoreRemaining;

  let currentScore = scoreBefore;
  let isBust = false;
  let isCheckout = false;
  let pointsCounted = 0;
  let dartsUsed = 0;

  for (const dart of darts) {
    dartsUsed++;
    const nextScore = currentScore - dart.score;

    if (state.doubleOut) {
      if (nextScore === 0) {
        // Must finish on a double (or Bullseye which is D25)
        if (dart.multiplier === 2) {
          currentScore = 0;
          isCheckout = true;
          pointsCounted += dart.score;
          break;
        } else {
          isBust = true;
          break;
        }
      } else if (nextScore < 2) {
        // Remaining 1 or negative is impossible to finish on a double
        isBust = true;
        break;
      } else {
        currentScore = nextScore;
        pointsCounted += dart.score;
      }
    } else {
      if (nextScore === 0) {
        currentScore = 0;
        isCheckout = true;
        pointsCounted += dart.score;
        break;
      } else if (nextScore < 0) {
        isBust = true;
        break;
      } else {
        currentScore = nextScore;
        pointsCounted += dart.score;
      }
    }
  }

  const scoreAfter = isBust ? scoreBefore : currentScore;
  const turnScore = isBust ? 0 : pointsCounted;

  const turn: PlayerTurn = {
    playerId: player.id,
    turnIndex: player.turns.length + 1,
    darts: darts.slice(0, dartsUsed),
    turnScore,
    scoreBefore,
    scoreAfter,
    isBust,
    isCheckout,
  };

  const updatedTotalPoints = player.totalPointsScored + turnScore;
  const updatedDartsThrown = player.dartsThrown + dartsUsed;
  const updatedAvg = updatedDartsThrown > 0 ? (updatedTotalPoints / updatedDartsThrown) * 3 : 0;

  let legsWon = player.legsWon;
  let winnerPlayerId = state.winnerPlayerId;

  if (isCheckout) {
    legsWon += 1;
    if (legsWon >= state.firstToLegs) {
      winnerPlayerId = player.id;
    }
  }

  const updatedPlayer: DartsPlayer = {
    ...player,
    scoreRemaining: isCheckout ? state.gameMode : scoreAfter,
    legsWon,
    dartsThrown: updatedDartsThrown,
    totalPointsScored: updatedTotalPoints,
    threeDartAvg: Number(updatedAvg.toFixed(2)),
    turns: [...player.turns, turn],
  };

  const updatedPlayers = state.players.map((p, idx) =>
    idx === state.activePlayerIndex ? updatedPlayer : p,
  );

  let nextActiveIndex = (state.activePlayerIndex + 1) % state.players.length;
  let nextLegNumber = state.legNumber;

  let finalPlayers = updatedPlayers;
  if (isCheckout && !winnerPlayerId) {
    // Reset scores for all players in new leg
    finalPlayers = updatedPlayers.map((p) => ({
      ...p,
      scoreRemaining: state.gameMode,
    }));
    nextLegNumber += 1;
    nextActiveIndex = state.legNumber % state.players.length;
  }

  const nextState: DartsGameState = {
    ...state,
    players: finalPlayers,
    activePlayerIndex: winnerPlayerId ? state.activePlayerIndex : nextActiveIndex,
    legNumber: nextLegNumber,
    winnerPlayerId,
    history: {
      turns: [...state.history.turns, turn],
    },
  };

  return { nextState, turn };
}
