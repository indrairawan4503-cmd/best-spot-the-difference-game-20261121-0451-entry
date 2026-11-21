// Pointer and keyboard input, converted into logical (1280x720) coordinates and named
// actions. Buttons are hit-tested against the rectangles render.js reports for the
// current screen, so a click on a drawn button does what the button says.
import { FIELD, PANEL } from './config.js';
import { hitZones } from './render.js';

export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_RESTART = 4;
export const ACTION_MENU = 8;
export const ACTION_NEXT = 16;
export const ACTION_LEVEL_1 = 32;
export const ACTION_LEVEL_2 = 64;
export const ACTION_LEVEL_3 = 128;

/**
 * Convert a pointer event on the canvas into logical coordinates, and say which part of
 * the game it landed on: { kind: 'panel', panel, x, y } or { kind: 'button', id } or
 * { kind: 'none' }.
 */
export function locateClick(canvas, state, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * FIELD.width;
  const y = ((event.clientY - rect.top) / rect.height) * FIELD.height;
  for (const zone of hitZones(state)) {
    if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
      return { kind: 'button', id: zone.id };
    }
  }
  if (y >= PANEL.y && y <= PANEL.y + PANEL.height) {
    if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
      return { kind: 'panel', panel: 'left', x: x - PANEL.leftX, y: y - PANEL.y };
    }
    if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
      return { kind: 'panel', panel: 'right', x: x - PANEL.rightX, y: y - PANEL.y };
    }
  }
  return { kind: 'none' };
}

export function createInput(canvas, onPointer) {
  let actions = 0;

  function keyDown(event) {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') actions |= ACTION_CONFIRM;
    else if (key === 'h') actions |= ACTION_HINT;
    else if (key === 'r') actions |= ACTION_RESTART;
    else if (key === 'm' || key === 'escape') actions |= ACTION_MENU;
    else if (key === 'n') actions |= ACTION_NEXT;
    else if (key === '1') actions |= ACTION_LEVEL_1;
    else if (key === '2') actions |= ACTION_LEVEL_2;
    else if (key === '3') actions |= ACTION_LEVEL_3;
  }

  function pointerDown(event) {
    event.preventDefault();
    onPointer(event);
  }

  canvas.addEventListener('pointerdown', pointerDown);
  window.addEventListener('keydown', keyDown);

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
  };
}
