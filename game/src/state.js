// The game state: which screen, which level, what is found, the clock, the score.
// Pure logic, no drawing: render.js paints whatever this holds.
import { SCORE, HINTS_PER_LEVEL, HINT_PULSE_SECONDS, WRONG_FLASH_SECONDS } from './config.js';
import { LEVELS } from './differences.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL = 'level';
export const SCREEN_GAME = 'game';
export const SCREEN_TIMEUP = 'timeup';

export const EVENT_NONE = 0;
export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_HINT = 4;
export const EVENT_CLEAR = 8;
export const EVENT_TIMEUP = 16;

export function createGameState() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    score: 0,
    levelScore: 0,
    timeLeft: LEVELS[0].time,
    hintsLeft: HINTS_PER_LEVEL,
    hintPulse: null, // { diff, until } — seconds on the game clock
    wrongFlash: null, // { x, y, panel, until }
    toast: null, // { text, until }
    clock: 0,
    best: 0,
    timeBonus: 0,
  };
}

export function currentLevel(state) {
  return LEVELS[state.levelIndex];
}

export function remainingCount(state) {
  return currentLevel(state).differences.length - state.found.size;
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.found = new Set();
  state.timeLeft = LEVELS[index].time;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintPulse = null;
  state.wrongFlash = null;
  state.toast = null;
  state.levelScore = 0;
  state.screen = SCREEN_PLAY;
}

export function startGame(state) {
  state.score = 0;
  startLevel(state, 0);
}

/** Advance the clock; returns EVENT_TIMEUP when the level clock runs out. */
export function tick(state, dt) {
  state.clock += dt;
  if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_TIMEUP;
    return EVENT_TIMEUP;
  }
  return EVENT_NONE;
}

/**
 * A click inside a picture panel, in panel-local coordinates. `panel` is 'left' or
 * 'right'. Returns an event flag; found differences are marked on BOTH panels.
 */
export function clickPanel(state, x, y, panel) {
  if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
  const level = currentLevel(state);
  for (const diff of level.differences) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      state.found.add(diff.id);
      state.score += SCORE.find;
      state.levelScore += SCORE.find;
      state.hintPulse = null;
      state.toast = { text: `Found ${diff.label}! +${SCORE.find}`, until: state.clock + 1.6 };
      if (state.found.size === level.differences.length) {
        state.timeBonus = Math.round(state.timeLeft) * SCORE.levelBonusPerSecond;
        state.score += state.timeBonus;
        state.screen = SCREEN_LEVEL;
        return EVENT_FOUND | EVENT_CLEAR;
      }
      return EVENT_FOUND;
    }
  }
  state.score = Math.max(0, state.score - SCORE.wrongCost);
  state.wrongFlash = { x, y, panel: panel ?? 'left', until: state.clock + WRONG_FLASH_SECONDS };
  state.toast = { text: `Not there! -${SCORE.wrongCost}`, until: state.clock + 1.2 };
  return EVENT_WRONG;
}

/** Spend a hint: pulse one unfound difference for a few seconds. */
export function useHint(state) {
  if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return EVENT_NONE;
  const level = currentLevel(state);
  const unfound = level.differences.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return EVENT_NONE;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - SCORE.hintCost);
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintPulse = { diff: pick, until: state.clock + HINT_PULSE_SECONDS };
  state.toast = { text: `Hint used (-${SCORE.hintCost}) — look at the pulsing ring`, until: state.clock + 1.6 };
  return EVENT_HINT;
}

/** Move on after a cleared level: next level, or the game-complete screen. */
export function nextLevel(state) {
  if (state.levelIndex + 1 >= LEVELS.length) {
    state.screen = SCREEN_GAME;
    return;
  }
  startLevel(state, state.levelIndex + 1);
}

export function toTitle(state) {
  state.screen = SCREEN_TITLE;
  state.found = new Set();
}
