// Boot and the one loop: input is read every frame, the clock advances in fixed 1/60 s
// steps, and the renderer paints what is there. The game moves between five screens:
// title, play, level complete, game complete and time up.
//
// ?seed=N fixes the decorative random details. ?shot=start|play|play2|end (with
// &seed=N) stages that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { STEP, BEST_KEY } from './config.js';
import { createRandom } from './random.js';
import {
  createGameState, startGame, startLevel, nextLevel, toTitle, tick, clickPanel,
  useHint, SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL, SCREEN_GAME, SCREEN_TIMEUP,
  EVENT_FOUND, EVENT_WRONG, EVENT_HINT, EVENT_CLEAR, EVENT_TIMEUP,
} from './state.js';
import { createInput, locateClick, ACTION_CONFIRM, ACTION_HINT, ACTION_RESTART, ACTION_MENU, ACTION_NEXT, ACTION_LEVEL_1, ACTION_LEVEL_2, ACTION_LEVEL_3 } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { playFound, playWrong, playHint, playLevelClear } from './audio.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);
void createRandom(seed);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const state = createGameState();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

state.best = readBest();

function announce(message) {
  status.textContent = message;
}

function handleEvents(events) {
  if (events & EVENT_FOUND) playFound();
  if (events & EVENT_WRONG) playWrong();
  if (events & EVENT_HINT) playHint();
  if (events & EVENT_CLEAR) playLevelClear();
}

function runShot(name) {
  stageShot(name, state);
  let painted = 0;
  function paint() {
    renderer.draw(state, state.clock);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, (event) => {
    const hit = locateClick(canvas, state, event);
    if (hit.kind === 'panel') {
      handleEvents(clickPanel(state, hit.x, hit.y, hit.panel));
    } else if (hit.kind === 'button') {
      handleButton(hit.id);
    }
  });
  let accumulator = 0;
  let last = performance.now();

  function handleButton(id) {
    if (id === 'play' || id === 'again') {
      startGame(state);
      announce('Playing. Find all the differences before the clock runs out.');
    } else if (id === 'level1' || id === 'level2' || id === 'level3') {
      state.score = 0;
      startLevel(state, Number(id.slice(-1)) - 1);
      announce('Playing.');
    } else if (id === 'hint') {
      handleEvents(useHint(state));
    } else if (id === 'restart' || id === 'retry') {
      startLevel(state, state.levelIndex);
      announce('Level restarted.');
    } else if (id === 'menu') {
      toTitle(state);
      announce('Menu.');
    } else if (id === 'next') {
      nextLevel(state);
      announce(state.screen === SCREEN_GAME ? 'Game complete.' : 'Playing.');
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (!actions) return;
    if (actions & ACTION_CONFIRM) {
      if (state.screen === SCREEN_TITLE) {
        startGame(state);
        announce('Playing.');
      } else if (state.screen === SCREEN_LEVEL) {
        nextLevel(state);
      } else if (state.screen === SCREEN_GAME) {
        startGame(state);
      } else if (state.screen === SCREEN_TIMEUP) {
        startLevel(state, state.levelIndex);
      }
    }
    if (actions & ACTION_HINT) handleEvents(useHint(state));
    if (actions & ACTION_RESTART && state.screen === SCREEN_PLAY) startLevel(state, state.levelIndex);
    if (actions & ACTION_MENU) toTitle(state);
    if (actions & ACTION_NEXT && state.screen === SCREEN_LEVEL) nextLevel(state);
    if (actions & ACTION_LEVEL_1 && state.screen === SCREEN_TITLE) { state.score = 0; startLevel(state, 0); }
    if (actions & ACTION_LEVEL_2 && state.screen === SCREEN_TITLE) { state.score = 0; startLevel(state, 1); }
    if (actions & ACTION_LEVEL_3 && state.screen === SCREEN_TITLE) { state.score = 0; startLevel(state, 2); }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    while (accumulator >= STEP) {
      const events = tick(state, STEP);
      if (events & EVENT_TIMEUP) {
        playWrong();
        announce("Time's up.");
      }
      accumulator -= STEP;
    }
    if (state.screen === SCREEN_GAME && state.score > state.best) {
      state.best = state.score;
      saveBest(state.best);
    }
    renderer.draw(state, state.clock);
  }

  document.addEventListener('visibilitychange', () => {
    // A hidden tab simply stops the loop's clock from advancing far; nothing is lost.
    if (document.hidden) last = performance.now();
  });

  announce('Spot the Difference. Press Space or click Play to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
