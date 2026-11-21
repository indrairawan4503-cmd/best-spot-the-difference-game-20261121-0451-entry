// Every tuning number and colour in one place. The playfield is a fixed 1280x720 logical
// area; the renderer scales it to the window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

// The two picture panels, in logical coordinates. Each scene is drawn in panel-local
// coordinates (560 x 440) and translated into place.
export const PANEL = { width: 560, height: 440, y: 136, leftX: 36, rightX: 684, gapLabelY: 128 };
export const HEADER = { height: 118 };
export const FOOTER = { y: 596, height: 104 };

export const STEP = 1 / 60;

/** Seconds on the clock per level (find counts live in differences.js). */

export const SCORE = {
  find: 100,
  hintCost: 50,
  wrongCost: 25,
  levelBonusPerSecond: 5,
};

export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_SECONDS = 2.5;
export const WRONG_FLASH_SECONDS = 0.6;

export const PALETTE = {
  page: '#f7ead7',
  header: '#fff6e8',
  ink: '#4a2c1a',
  inkSoft: '#7a5a44',
  accent: '#d95f33',
  teal: '#2a7f6f',
  mustard: '#f2b134',
  cream: '#fff8ec',
  panelBorder: '#4a2c1a',
  panelShadow: 'rgba(74,44,26,0.25)',
  found: '#e23b2e',
  foundRing: '#ffffff',
  hint: '#f2b134',
  wrong: '#c62828',
  timerFull: '#2a7f6f',
  timerLow: '#e23b2e',
  button: '#d95f33',
  buttonText: '#fff8ec',
  overlay: 'rgba(74,44,26,0.82)',
  card: '#fff8ec',
};

export const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
export const FONT_DISPLAY = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'warung-spot-difference.best';
