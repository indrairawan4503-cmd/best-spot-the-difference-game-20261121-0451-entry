// The deterministic screenshot scenes behind ?shot=start|play|play2|end. Each one sets
// the game state to a fixed, reachable position — a real mid-game frame, never a
// mock-up — so the same seed always gives the same frame.
import { createGameState, startLevel, SCREEN_LEVEL } from './state.js';
import { LEVELS } from './differences.js';

/**
 * Set `state` to the named scene and return the screen it shows. `play` is level 1
 * mid-hunt with three differences already circled and four still to find; `play2` is
 * level 2 mid-hunt with a hint pulsing; `end` is level 1 cleared.
 */
export function stageShot(name, state) {
  if (name === 'play') {
    startLevel(state, 0);
    state.found = new Set(['sun', 'cup', 'lamp']);
    state.score = 300;
    state.levelScore = 300;
    state.timeLeft = 107;
    state.clock = 43;
    state.toast = { text: 'Found the hanging lamp! +100', until: state.clock + 0.8 };
    return;
  }
  if (name === 'play2') {
    startLevel(state, 1);
    state.score = 1150;
    state.levelScore = 400;
    state.found = new Set(['hat', 'oranges', 'bird', 'scale']);
    state.timeLeft = 83;
    state.hintsLeft = 2;
    state.clock = 37;
    const diff = LEVELS[1].differences.find((d) => d.id === 'rooster');
    state.hintPulse = { diff, until: state.clock + 1.8 };
    state.toast = { text: 'Hint used (-50) — look at the pulsing ring', until: state.clock + 0.6 };
    return;
  }
  if (name === 'end') {
    startLevel(state, 0);
    state.found = new Set(LEVELS[0].differences.map((d) => d.id));
    state.timeLeft = 64;
    state.timeBonus = 64 * 5;
    state.score = 700 + state.timeBonus;
    state.levelScore = 700;
    state.screen = SCREEN_LEVEL;
    return;
  }
  // start (and anything else): the title screen over level 1.
  const fresh = createGameState();
  state.screen = fresh.screen;
  state.levelIndex = 0;
  state.found = new Set();
  state.score = 0;
  state.levelScore = 0;
  state.timeLeft = LEVELS[0].time;
  state.hintsLeft = 3;
  state.hintPulse = null;
  state.wrongFlash = null;
  state.toast = null;
  state.clock = 0;
  state.best = fresh.best;
}
