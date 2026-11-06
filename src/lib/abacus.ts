/**
 * Spidy Calculator — Soroban Abacus Logic Engine
 * Traditional Japanese 1:4 bead soroban (1 bi-quinary upper bead, 4 lower beads).
 * Pure state machine: rod calculation, bead toggling, and number parsing.
 */

export interface SorobanRodState {
  index: number;
  placeValue: number; // e.g. 1, 10, 100, 1000...
  upperBeadDown: boolean; // true = active (value 5)
  lowerBeadsUp: number; // 0..4 = active (value 1 each)
}

export interface SorobanAbacusState {
  rodsCount: number;
  rods: SorobanRodState[];
  totalValue: number;
}

export function createInitialAbacus(rodsCount: number = 7): SorobanAbacusState {
  const rods: SorobanRodState[] = [];
  for (let i = 0; i < rodsCount; i++) {
    const power = rodsCount - 1 - i;
    rods.push({
      index: i,
      placeValue: Math.pow(10, power),
      upperBeadDown: false,
      lowerBeadsUp: 0,
    });
  }
  return {
    rodsCount,
    rods,
    totalValue: 0,
  };
}

export function calculateRodValue(rod: SorobanRodState): number {
  const upper = rod.upperBeadDown ? 5 : 0;
  const lower = rod.lowerBeadsUp;
  return upper + lower;
}

export function calculateAbacusTotal(rods: SorobanRodState[]): number {
  let total = 0;
  for (const rod of rods) {
    total += calculateRodValue(rod) * rod.placeValue;
  }
  return total;
}

export function toggleUpperBead(state: SorobanAbacusState, rodIndex: number): SorobanAbacusState {
  const nextRods = state.rods.map((rod, idx) => {
    if (idx !== rodIndex) return rod;
    return {
      ...rod,
      upperBeadDown: !rod.upperBeadDown,
    };
  });
  return {
    ...state,
    rods: nextRods,
    totalValue: calculateAbacusTotal(nextRods),
  };
}

export function setLowerBeads(
  state: SorobanAbacusState,
  rodIndex: number,
  targetActiveCount: number,
): SorobanAbacusState {
  const cleanCount = Math.max(0, Math.min(4, Math.round(targetActiveCount)));
  const nextRods = state.rods.map((rod, idx) => {
    if (idx !== rodIndex) return rod;
    return {
      ...rod,
      lowerBeadsUp: rod.lowerBeadsUp === cleanCount ? 0 : cleanCount,
    };
  });
  return {
    ...state,
    rods: nextRods,
    totalValue: calculateAbacusTotal(nextRods),
  };
}

export function setAbacusValue(
  state: SorobanAbacusState,
  targetNumber: number,
): SorobanAbacusState {
  const cleanVal = Math.max(
    0,
    Math.min(Math.pow(10, state.rodsCount) - 1, Math.round(targetNumber)),
  );
  const str = cleanVal.toString().padStart(state.rodsCount, "0");

  const nextRods: SorobanRodState[] = state.rods.map((rod, idx) => {
    const digit = parseInt(str[idx] ?? "0", 10) || 0;
    const upperBeadDown = digit >= 5;
    const lowerBeadsUp = digit % 5;
    return {
      ...rod,
      upperBeadDown,
      lowerBeadsUp,
    };
  });

  return {
    ...state,
    rods: nextRods,
    totalValue: cleanVal,
  };
}

export function resetAbacus(state: SorobanAbacusState): SorobanAbacusState {
  return createInitialAbacus(state.rodsCount);
}
