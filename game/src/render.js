// Everything the player sees: header with timer, score and the remaining counter, the
// two picture panels with found markers, hint pulse and wrong-click flash, footer
// buttons, and the title / level-complete / game-complete / time-up overlays.
import { FIELD, PANEL, HEADER, FOOTER, PALETTE, FONT, SCORE } from './config.js';
import { LEVELS } from './differences.js';
import { drawSceneWarung, drawScenePasar, drawSceneTeras } from './scenes.js';
import {
  SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL, SCREEN_GAME, SCREEN_TIMEUP,
  currentLevel, remainingCount,
} from './state.js';

const SCENE_DRAW = {
  warung: drawSceneWarung,
  pasar: drawScenePasar,
  teras: drawSceneTeras,
};

export const BUTTONS = {
  hint: { x: 36, y: 608, w: 170, h: 48 },
  restart: { x: 216, y: 608, w: 170, h: 48 },
  menu: { x: 396, y: 608, w: 170, h: 48 },
  play: { x: 490, y: 500, w: 300, h: 60 },
  next: { x: 490, y: 470, w: 300, h: 56 },
  again: { x: 490, y: 470, w: 300, h: 56 },
  retry: { x: 490, y: 470, w: 300, h: 56 },
  overlayMenu: { x: 490, y: 542, w: 300, h: 44 },
};

/** The clickable rectangles on the current screen, for input.js to hit-test. */
export function hitZones(state) {
  const zones = [];
  if (state.screen === SCREEN_TITLE) {
    zones.push({ id: 'play', ...BUTTONS.play });
    for (let i = 0; i < 3; i += 1) {
      zones.push({ id: `level${i + 1}`, x: 150 + i * 340, y: 330, w: 300, h: 120 });
    }
  } else if (state.screen === SCREEN_PLAY) {
    zones.push({ id: 'hint', ...BUTTONS.hint });
    zones.push({ id: 'restart', ...BUTTONS.restart });
    zones.push({ id: 'menu', ...BUTTONS.menu });
  } else if (state.screen === SCREEN_LEVEL) {
    zones.push({ id: 'next', ...BUTTONS.next });
    zones.push({ id: 'menu', ...BUTTONS.overlayMenu });
  } else if (state.screen === SCREEN_GAME) {
    zones.push({ id: 'again', ...BUTTONS.again });
    zones.push({ id: 'menu', ...BUTTONS.overlayMenu });
  } else if (state.screen === SCREEN_TIMEUP) {
    zones.push({ id: 'retry', ...BUTTONS.retry });
    zones.push({ id: 'menu', ...BUTTONS.overlayMenu });
  }
  return zones;
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawButton(ctx, rect, label, sub, enabled = true) {
  ctx.fillStyle = enabled ? PALETTE.button : '#b8a88f';
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 12);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, rect.x, rect.y + rect.h - 8, rect.w, 8, 6);
  ctx.fill();
  ctx.fillStyle = PALETTE.buttonText;
  ctx.font = `bold ${sub ? 20 : 22}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + (sub ? -8 : 0));
  if (sub) {
    ctx.font = `13px ${FONT}`;
    ctx.fillStyle = 'rgba(255,248,236,0.85)';
    ctx.fillText(sub, rect.x + rect.w / 2, rect.y + rect.h / 2 + 16);
  }
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawHeader(ctx, state) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, HEADER.height);
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(0, 0, FIELD.width, 6);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 34px ${FONT}`;
  ctx.fillText('SPOT THE DIFFERENCE', 36, 48);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `17px ${FONT}`;
  const level = currentLevel(state);
  ctx.fillText(`${level.name}  ·  Level ${state.levelIndex + 1} of 3  ·  ${level.subtitle}`, 36, 76);

  // Timer bar.
  const barX = 36;
  const barY = 92;
  const barW = 560;
  const barH = 12;
  ctx.fillStyle = '#e8d3ac';
  rr(ctx, barX, barY, barW, barH, 6);
  ctx.fill();
  const frac = Math.max(0, state.timeLeft / level.time);
  ctx.fillStyle = state.timeLeft <= 30 ? PALETTE.timerLow : PALETTE.timerFull;
  if (frac > 0) {
    rr(ctx, barX, barY, Math.max(12, barW * frac), barH, 6);
    ctx.fill();
  }
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 20px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText(formatTime(state.timeLeft), barX + barW + 16, barY + 11);

  // Score.
  ctx.textAlign = 'right';
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `15px ${FONT}`;
  ctx.fillText('SCORE', 860, 36);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 30px ${FONT}`;
  ctx.fillText(String(state.score), 860, 68);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `13px ${FONT}`;
  ctx.fillText(`BEST ${state.best}`, 860, 92);

  // Remaining counter — the big number the judge looks for.
  const remain = remainingCount(state);
  ctx.fillStyle = PALETTE.found;
  rr(ctx, 900, 18, 150, 76, 14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 40px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(String(remain), 975, 56);
  ctx.font = `bold 15px ${FONT}`;
  ctx.fillText('LEFT TO FIND', 975, 80);

  // Hints pips.
  ctx.textAlign = 'right';
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `15px ${FONT}`;
  ctx.fillText(`HINTS  ${'●'.repeat(state.hintsLeft)}${'○'.repeat(3 - state.hintsLeft)}  (H)`, 1244, 108);
}

function drawPanelFrame(ctx, x, label) {
  ctx.fillStyle = PALETTE.panelShadow;
  rr(ctx, x + 5, PANEL.y + 6, PANEL.width, PANEL.height, 14);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  rr(ctx, x, PANEL.y, PANEL.width, PANEL.height, 14);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelBorder;
  ctx.lineWidth = 3;
  rr(ctx, x, PANEL.y, PANEL.width, PANEL.height, 14);
  ctx.stroke();
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `bold 14px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, x + 4, PANEL.y - 8);
}

function drawFoundMarker(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(x, y, r + 7, r + 5, -0.06, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.foundRing;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, r + 11, r + 9, -0.06, 0, Math.PI * 2);
  ctx.stroke();
  // Small check tick on the ring.
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + r - 2, y - r - 8);
  ctx.lineTo(x + r + 6, y - r + 2);
  ctx.lineTo(x + r + 16, y - r - 12);
  ctx.stroke();
  ctx.restore();
}

function drawPanels(ctx, state, time) {
  const level = currentLevel(state);
  const draw = SCENE_DRAW[level.id];
  const modsOff = {};
  const modsOn = {};
  for (const d of level.differences) {
    modsOff[d.id] = false;
    modsOn[d.id] = true;
  }

  drawPanelFrame(ctx, PANEL.leftX, 'ORIGINAL');
  drawPanelFrame(ctx, PANEL.rightX, 'FIND THE DIFFERENCES');

  ctx.save();
  ctx.beginPath();
  rr(ctx, PANEL.leftX, PANEL.y, PANEL.width, PANEL.height, 14);
  ctx.clip();
  ctx.translate(PANEL.leftX, PANEL.y);
  draw(ctx, modsOff);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  rr(ctx, PANEL.rightX, PANEL.y, PANEL.width, PANEL.height, 14);
  ctx.clip();
  ctx.translate(PANEL.rightX, PANEL.y);
  draw(ctx, modsOn);
  ctx.restore();

  // Found markers on both panels.
  for (const diff of level.differences) {
    if (!state.found.has(diff.id)) continue;
    drawFoundMarker(ctx, PANEL.leftX + diff.x, PANEL.y + diff.y, diff.r);
    drawFoundMarker(ctx, PANEL.rightX + diff.x, PANEL.y + diff.y, diff.r);
  }

  // Hint pulse on one unfound difference, on both panels.
  if (state.hintPulse && time < state.hintPulse.until) {
    const pulse = 1 + 0.18 * Math.sin(time * 6);
    const d = state.hintPulse.diff;
    for (const px of [PANEL.leftX, PANEL.rightX]) {
      ctx.save();
      ctx.strokeStyle = PALETTE.hint;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.ellipse(px + d.x, PANEL.y + d.y, (d.r + 10) * pulse, (d.r + 8) * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Wrong-click flash.
  if (state.wrongFlash && time < state.wrongFlash.until) {
    const alpha = (state.wrongFlash.until - time) / 0.6;
    const px = state.wrongFlash.panel === 'left' ? PANEL.leftX : PANEL.rightX;
    const x = px + state.wrongFlash.x;
    const y = PANEL.y + state.wrongFlash.y;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = PALETTE.wrong;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFooter(ctx, state) {
  ctx.fillStyle = PALETTE.page;
  ctx.fillRect(0, FOOTER.y, FIELD.width, FOOTER.height);
  drawButton(ctx, BUTTONS.hint, `HINT  (${state.hintsLeft} left)`, 'costs 50 pts · key H', state.hintsLeft > 0);
  drawButton(ctx, BUTTONS.restart, 'RESTART LEVEL', 'key R');
  drawButton(ctx, BUTTONS.menu, 'MENU', 'key M');
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `14px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText('Click a difference on EITHER picture to circle it.', 1244, 622);
  ctx.fillText('Wrong clicks cost 25 points. Find them all before the clock runs out!', 1244, 646);
  if (state.toast && state.clock < state.toast.until) {
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText(state.toast.text, 600, 692);
  }
}

function dimBackdrop(ctx) {
  ctx.fillStyle = 'rgba(74,44,26,0.45)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
}

function drawCard(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, x + 5, y + 7, w, h, 18);
  ctx.fill();
  ctx.fillStyle = PALETTE.card;
  rr(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelBorder;
  ctx.lineWidth = 3;
  rr(ctx, x, y, w, h, 18);
  ctx.stroke();
}

function drawTitle(ctx, state) {
  dimBackdrop(ctx);
  drawCard(ctx, 110, 60, 1060, 600);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 56px ${FONT}`;
  ctx.fillText('SPOT THE DIFFERENCE', 640, 150);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillText('A cozy morning in Indonesia — three scenes, 29 differences', 640, 192);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `18px ${FONT}`;
  ctx.fillText('Two pictures side by side. Only one hides the changes — click them on either picture.', 640, 224);
  ctx.fillText('Wrong clicks cost points. Hints cost 50. Beat the clock!', 640, 250);

  for (let i = 0; i < 3; i += 1) {
    const level = LEVELS[i];
    const x = 150 + i * 340;
    ctx.fillStyle = i === 0 ? '#fdeeda' : '#fff6e8';
    rr(ctx, x, 330, 300, 120, 14);
    ctx.fill();
    ctx.strokeStyle = PALETTE.panelBorder;
    ctx.lineWidth = 2;
    rr(ctx, x, 330, 300, 120, 14);
    ctx.stroke();
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `bold 21px ${FONT}`;
    ctx.fillText(`${i + 1}. ${level.name}`, x + 150, 372);
    ctx.fillStyle = PALETTE.inkSoft;
    ctx.font = `15px ${FONT}`;
    ctx.fillText(level.subtitle, x + 150, 398);
    ctx.fillText(`${level.differences.length} differences  ·  ${formatTime(level.time)}`, x + 150, 424);
  }

  drawButton(ctx, BUTTONS.play, 'PLAY', 'or press Space · keys 1/2/3 pick a level');
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `15px ${FONT}`;
  ctx.fillText(`Best score: ${state.best}   ·   Original art drawn in code — no photos, no copies`, 640, 596);
}

function drawLevelComplete(ctx, state) {
  dimBackdrop(ctx);
  drawCard(ctx, 390, 130, 500, 420);
  const level = currentLevel(state);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.teal;
  ctx.font = `bold 44px ${FONT}`;
  ctx.fillText('LEVEL COMPLETE!', 640, 210);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillText(`${level.name} — all ${level.differences.length} differences found`, 640, 248);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `19px ${FONT}`;
  ctx.fillText(`Finds: ${level.differences.length} × ${SCORE.find}  =  ${level.differences.length * SCORE.find} pts`, 640, 300);
  ctx.fillText(`Time bonus: ${Math.round(state.timeLeft)}s × ${SCORE.levelBonusPerSecond}  =  ${state.timeBonus} pts`, 640, 332);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillText(`Score: ${state.score}`, 640, 382);
  drawButton(ctx, BUTTONS.next, state.levelIndex + 1 < 3 ? 'NEXT LEVEL' : 'SEE RESULTS', 'or press N');
  drawButton(ctx, BUTTONS.overlayMenu, 'Back to menu', null);
}

function drawGameComplete(ctx, state) {
  dimBackdrop(ctx);
  drawCard(ctx, 390, 130, 500, 420);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 44px ${FONT}`;
  ctx.fillText('YOU FOUND THEM ALL!', 640, 210);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillText('All 3 scenes cleared — 29 differences spotted', 640, 248);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `19px ${FONT}`;
  ctx.fillText('The warung, the market and the terrace thank you.', 640, 300);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 30px ${FONT}`;
  ctx.fillText(`Final score: ${state.score}`, 640, 352);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `18px ${FONT}`;
  ctx.fillText(state.score > state.best ? 'A new best score!' : `Best score: ${state.best}`, 640, 384);
  drawButton(ctx, BUTTONS.again, 'PLAY AGAIN', 'or press Space');
  drawButton(ctx, BUTTONS.overlayMenu, 'Back to menu', null);
}

function drawTimeUp(ctx, state) {
  dimBackdrop(ctx);
  drawCard(ctx, 390, 130, 500, 420);
  const level = currentLevel(state);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.found;
  ctx.font = `bold 44px ${FONT}`;
  ctx.fillText("TIME'S UP!", 640, 210);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 22px ${FONT}`;
  ctx.fillText(`${level.name} — you found ${state.found.size} of ${level.differences.length}`, 640, 248);
  ctx.fillStyle = PALETTE.inkSoft;
  ctx.font = `19px ${FONT}`;
  ctx.fillText('The morning crowd has moved on… try again!', 640, 300);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillText(`Score: ${state.score}`, 640, 352);
  drawButton(ctx, BUTTONS.retry, 'RETRY LEVEL', 'or press R');
  drawButton(ctx, BUTTONS.overlayMenu, 'Back to menu', null);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;

  function draw(state, time) {
    ctx.fillStyle = PALETTE.page;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    if (state.screen === SCREEN_TITLE) {
      drawPanels(ctx, state, time);
      drawHeader(ctx, state);
      drawTitle(ctx, state);
      return;
    }
    drawPanels(ctx, state, time);
    drawHeader(ctx, state);
    drawFooter(ctx, state);
    if (state.screen === SCREEN_LEVEL) drawLevelComplete(ctx, state);
    else if (state.screen === SCREEN_GAME) drawGameComplete(ctx, state);
    else if (state.screen === SCREEN_TIMEUP) drawTimeUp(ctx, state);
  }

  return { draw };
}
