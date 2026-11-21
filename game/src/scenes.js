// The three scenes, drawn entirely in code (Canvas 2D, flat illustration, no images).
// Every scene is drawn twice per frame: the LEFT panel with `mods` all false, the RIGHT
// panel with every difference's `mods` flag true, so the two pictures differ only where the
// difference list says they should. Panel-local coordinates are 560 x 440; every difference
// id below matches its entry in differences.js, placed at the same spot.

// ---- small drawing helpers -------------------------------------------------
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 26 * s, 14 * s);
  ctx.fill();
  ellipse(ctx, x - 18 * s, y + 4 * s, 18 * s, 11 * s);
  ctx.fill();
  ellipse(ctx, x + 18 * s, y + 4 * s, 18 * s, 11 * s);
  ctx.fill();
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 200);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 200);
}

function awning(ctx, y, h, colors, stripeW) {
  for (let x = 0; x < 560; x += stripeW) {
    ctx.fillStyle = colors[Math.floor(x / stripeW) % colors.length];
    ctx.fillRect(x, 0, stripeW, y + h);
  }
  // Scalloped edge.
  for (let x = 0; x < 560; x += stripeW) {
    ctx.fillStyle = colors[Math.floor(x / stripeW) % colors.length];
    ctx.beginPath();
    ctx.arc(x + stripeW / 2, y + h, stripeW / 2, 0, Math.PI);
    ctx.fill();
  }
}

function awningBand(ctx, y, h, colors, stripeW) {
  for (let x = 0; x < 560; x += stripeW) {
    ctx.fillStyle = colors[Math.floor(x / stripeW) % colors.length];
    ctx.fillRect(x, y, stripeW, h);
  }
  for (let x = 0; x < 560; x += stripeW) {
    ctx.fillStyle = colors[Math.floor(x / stripeW) % colors.length];
    ctx.beginPath();
    ctx.arc(x + stripeW / 2, y + h, stripeW / 2, 0, Math.PI);
    ctx.fill();
  }
}

function sleepingCat(ctx, x, y, s, fur, stripe) {
  // A curled-up sleeping cat: body ellipse, head circle, ears, tail curl, stripes.
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = fur;
  ellipse(ctx, 0, 6, 26, 14);
  ctx.fill();
  circle(ctx, -20, -4, 12);
  ctx.fill();
  ctx.fillStyle = fur;
  poly(ctx, [[-30, -12], [-26, -22], [-20, -13]]);
  ctx.fill();
  poly(ctx, [[-18, -14], [-12, -22], [-10, -12]]);
  ctx.fill();
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -4);
  ctx.quadraticCurveTo(2, -12, 12, -6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, 10);
  ctx.quadraticCurveTo(24, 16, 26, 2);
  ctx.stroke();
  ctx.fillStyle = stripe;
  ellipse(ctx, 24, 0, 6, 4);
  ctx.fill();
  ctx.strokeStyle = fur;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(26, 4, 10, Math.PI * 0.1, Math.PI * 1.1);
  ctx.stroke();
  ctx.restore();
}

// ---- Scene 1: Warung Kopi Pagi ---------------------------------------------
export function drawSceneWarung(ctx, mods) {
  sky(ctx, '#ffd9a0', '#fff3d6');
  if (!mods.sun) {
    ctx.fillStyle = '#f2b134';
    circle(ctx, 492, 52, 26);
    ctx.fill();
    ctx.strokeStyle = '#f2b134';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(492 + Math.cos(a) * 32, 52 + Math.sin(a) * 32);
      ctx.lineTo(492 + Math.cos(a) * 40, 52 + Math.sin(a) * 40);
      ctx.stroke();
    }
  }
  cloud(ctx, 110, 60, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 300, 40, 0.8, 'rgba(255,255,255,0.8)');
  cloud(ctx, 420, 110, 0.7, 'rgba(255,255,255,0.85)');

  // Distant rooftops.
  ctx.fillStyle = '#e07856';
  poly(ctx, [[0, 185], [70, 150], [140, 185]]);
  ctx.fill();
  ctx.fillStyle = '#d95f33';
  poly(ctx, [[120, 185], [210, 145], [300, 185]]);
  ctx.fill();
  ctx.fillStyle = '#e07856';
  poly(ctx, [[420, 185], [500, 155], [560, 185]]);
  ctx.fill();

  // Back wall.
  ctx.fillStyle = '#f3e2c2';
  ctx.fillRect(0, 185, 560, 145);
  ctx.fillStyle = '#e8d3ac';
  ctx.fillRect(0, 318, 560, 12);

  // Ground (before foreground objects, so wheels and bench legs sit on it).
  ctx.fillStyle = '#e8d3ac';
  ctx.fillRect(0, 408, 560, 32);
  ctx.fillStyle = '#d9bf92';
  for (let x = 10; x < 560; x += 46) {
    ctx.beginPath();
    ctx.arc(x, 424, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stall sign.
  ctx.fillStyle = '#6b4226';
  rr(ctx, 56, 128, 144, 44, 8);
  ctx.fill();
  ctx.fillStyle = '#fff3d6';
  ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mods.sign ? 'KOPI MANIS' : 'KOPI PAGI', 128, 151);

  // Hanging lamp.
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 84);
  ctx.lineTo(300, 100);
  ctx.stroke();
  if (!mods.lamp) {
    const glow = ctx.createRadialGradient(300, 118, 4, 300, 118, 34);
    glow.addColorStop(0, 'rgba(242,177,52,0.55)');
    glow.addColorStop(1, 'rgba(242,177,52,0)');
    ctx.fillStyle = glow;
    circle(ctx, 300, 118, 34);
    ctx.fill();
  }
  ctx.fillStyle = '#2a7f6f';
  poly(ctx, [[284, 100], [316, 100], [310, 116], [290, 116]]);
  ctx.fill();
  ctx.fillStyle = mods.lamp ? '#b8a88f' : '#ffe08a';
  circle(ctx, 300, 120, 7);
  ctx.fill();

  // Awning over the stall.
  awning(ctx, 52, 30, ['#d95f33', '#fff6e8'], 56);
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(0, 0, 4, 96);
  ctx.fillRect(556, 0, 4, 96);

  // Counter.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 30, 300, 500, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(44, 326, 472, 114);
  ctx.fillStyle = '#a9713f';
  for (let x = 60; x < 520; x += 42) ctx.fillRect(x, 330, 6, 106);
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(44, 326, 472, 6);

  // Brass coffee pot.
  ctx.fillStyle = '#c98f2e';
  ellipse(ctx, 122, 296, 26, 10);
  ctx.fill();
  ctx.fillStyle = '#e0aa3e';
  rr(ctx, 98, 252, 48, 46, 8);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  rr(ctx, 112, 240, 20, 12, 5);
  ctx.fill();
  ctx.strokeStyle = '#c98f2e';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(146, 262);
  ctx.quadraticCurveTo(164, 266, 158, 284);
  ctx.stroke();
  // Steam wisps.
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(116, 234);
  ctx.quadraticCurveTo(110, 222, 118, 210);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(130, 234);
  ctx.quadraticCurveTo(136, 222, 128, 212);
  ctx.stroke();

  // Coffee cup on the counter.
  if (!mods.cup) {
    ctx.fillStyle = '#fff8ec';
    ellipse(ctx, 232, 298, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#2a7f6f';
    rr(ctx, 214, 272, 36, 26, 4);
    ctx.fill();
    ctx.strokeStyle = '#2a7f6f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(252, 284, 8, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = '#4a2c1a';
    ellipse(ctx, 232, 274, 14, 3);
    ctx.fill();
  }

  // Krupuk jar.
  ctx.fillStyle = 'rgba(255,248,236,0.85)';
  rr(ctx, 360, 232, 44, 62, 8);
  ctx.fill();
  ctx.strokeStyle = '#b8a88f';
  ctx.lineWidth = 2;
  rr(ctx, 360, 232, 44, 62, 8);
  ctx.stroke();
  ctx.fillStyle = '#f2b134';
  const krupukTop = mods.krupuk ? 272 : 240;
  for (let i = 0; i < 5; i += 1) {
    ellipse(ctx, 368 + (i % 3) * 12, krupukTop + Math.floor(i / 3) * 12, 9, 7);
    ctx.fill();
  }
  ctx.fillStyle = '#d95f33';
  rr(ctx, 362, 228, 40, 10, 4);
  ctx.fill();

  // Potted plant on the counter.
  ctx.fillStyle = '#d95f33';
  poly(ctx, [[512, 268], [540, 268], [536, 296], [516, 296]]);
  ctx.fill();
  ctx.fillStyle = '#2a7f6f';
  ellipse(ctx, 526, 252, 8, 18);
  ctx.fill();
  ellipse(ctx, 514, 258, 8, 14);
  ctx.fill();
  ellipse(ctx, 538, 258, 8, 14);
  ctx.fill();

  // Bench with the sleeping cat.
  ctx.fillStyle = '#8a5a30';
  rr(ctx, 428, 356, 116, 12, 4);
  ctx.fill();
  ctx.fillRect(438, 368, 8, 40);
  ctx.fillRect(526, 368, 8, 40);
  if (!mods.cat) sleepingCat(ctx, 478, 348, 1, '#e8a04c', '#c97e2e');

  // Bicycle, front wheel left.
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 4;
  circle(ctx, 66, 404, 22);
  ctx.stroke();
  circle(ctx, 128, 404, 22);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(66, 404);
  ctx.lineTo(96, 372);
  ctx.lineTo(128, 404);
  ctx.lineTo(112, 404);
  ctx.lineTo(96, 372);
  ctx.lineTo(84, 372);
  ctx.moveTo(96, 372);
  ctx.lineTo(96, 356);
  ctx.moveTo(84, 356);
  ctx.lineTo(108, 356);
  ctx.stroke();
  // Basket with a loaf of bread.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 84, 372, 34, 18, 3);
  ctx.fill();
  if (!mods.basket) {
    ctx.fillStyle = '#e8b25a';
    ellipse(ctx, 101, 370, 14, 7);
    ctx.fill();
    ctx.strokeStyle = '#c98f2e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(92, 368);
    ctx.lineTo(110, 368);
    ctx.stroke();
  }
}

// ---- Scene 2: Pasar Pagi ---------------------------------------------------
export function drawScenePasar(ctx, mods) {
  sky(ctx, '#ffe3b0', '#fff6dc');
  cloud(ctx, 90, 48, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 330, 70, 0.8, 'rgba(255,255,255,0.85)');
  cloud(ctx, 480, 36, 0.7, 'rgba(255,255,255,0.8)');

  // Rooftops and the bird on one.
  ctx.fillStyle = '#d95f33';
  poly(ctx, [[0, 150], [90, 118], [180, 150]]);
  ctx.fill();
  ctx.fillStyle = '#e07856';
  poly(ctx, [[380, 150], [470, 112], [560, 150]]);
  ctx.fill();
  if (!mods.bird) {
    ctx.fillStyle = '#4a2c1a';
    ellipse(ctx, 470, 52, 10, 7);
    ctx.fill();
    circle(ctx, 478, 44, 5);
    ctx.fill();
    poly(ctx, [[482, 40], [486, 36], [484, 42]]);
    ctx.fill();
    ctx.strokeStyle = '#4a2c1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(462, 58);
    ctx.lineTo(460, 66);
    ctx.moveTo(466, 58);
    ctx.lineTo(466, 66);
    ctx.stroke();
  }

  // Big market umbrella in the middle (colour is a difference).
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(200, 62);
  ctx.lineTo(200, 150);
  ctx.stroke();
  const umb = mods.umbrella ? '#2a7f6f' : '#d95f33';
  ctx.fillStyle = umb;
  ctx.beginPath();
  ctx.moveTo(120, 96);
  ctx.quadraticCurveTo(200, 30, 280, 96);
  ctx.quadraticCurveTo(240, 78, 200, 84);
  ctx.quadraticCurveTo(160, 78, 120, 96);
  ctx.fill();
  ctx.fillStyle = '#fff6e8';
  ctx.beginPath();
  ctx.moveTo(160, 88);
  ctx.quadraticCurveTo(200, 40, 240, 88);
  ctx.quadraticCurveTo(220, 76, 200, 80);
  ctx.quadraticCurveTo(180, 76, 160, 88);
  ctx.fill();

  // Stall awnings left and right.
  awningBand(ctx, 118, 26, ['#d95f33', '#fff6e8'], 40);
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(0, 118, 4, 60);
  ctx.fillRect(556, 118, 4, 60);

  // Hanging bananas.
  if (!mods.bananas) {
    ctx.strokeStyle = '#6b4226';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(88, 144);
    ctx.lineTo(88, 158);
    ctx.stroke();
    ctx.fillStyle = '#f2c94c';
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(80 + i * 8, 172, 5, 14, (i - 1) * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Market tables.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 24, 292, 512, 22, 6);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(38, 314, 484, 126);
  ctx.fillStyle = '#a9713f';
  for (let x = 54; x < 520; x += 42) ctx.fillRect(x, 318, 6, 118);

  // Vendor behind the table.
  ctx.fillStyle = '#f2b134';
  rr(ctx, 246, 168, 72, 124, 18);
  ctx.fill();
  ctx.fillStyle = '#f6c98a';
  circle(ctx, 282, 128, 26);
  ctx.fill();
  if (!mods.hat) {
    ctx.fillStyle = '#2a7f6f';
    ctx.beginPath();
    ctx.arc(282, 122, 26, Math.PI, 0);
    ctx.fill();
    rr(ctx, 250, 118, 64, 8, 4);
    ctx.fill();
  }
  ctx.fillStyle = '#4a2c1a';
  circle(ctx, 273, 126, 3);
  ctx.fill();
  circle(ctx, 291, 126, 3);
  ctx.fill();
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(282, 136, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Oranges basket.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 122, 292, 56, 26, 6);
  ctx.fill();
  const oranges = mods.oranges ? 2 : 7;
  ctx.fillStyle = '#f28c1e';
  const orangeSpots = [[132, 288], [148, 282], [164, 288], [140, 274], [156, 272], [172, 280], [150, 264]];
  for (let i = 0; i < oranges; i += 1) {
    circle(ctx, orangeSpots[i][0], orangeSpots[i][1], 9);
    ctx.fill();
  }
  ctx.fillStyle = '#2a7f6f';
  ellipse(ctx, 150, 262, 6, 3);
  ctx.fill();

  // Chili basket (red vs green chilies).
  ctx.fillStyle = '#a9713f';
  rr(ctx, 210, 312, 56, 24, 6);
  ctx.fill();
  ctx.fillStyle = mods.chilies ? '#3f9e4d' : '#e23b2e';
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(222 + (i % 3) * 14, 306 + Math.floor(i / 3) * 8, 5, 9, (i % 2 ? -0.4 : 0.4), 0, Math.PI * 2);
    ctx.fill();
  }

  // Weighing scale.
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(330, 262);
  ctx.lineTo(330, 296);
  ctx.moveTo(306, 296);
  ctx.lineTo(354, 296);
  ctx.stroke();
  ctx.fillStyle = '#c98f2e';
  circle(ctx, 330, 258, 5);
  ctx.fill();
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(330, 262);
  ctx.lineTo(312, 282);
  ctx.moveTo(330, 262);
  ctx.lineTo(348, 282);
  ctx.stroke();
  ctx.fillStyle = '#8a5a30';
  ellipse(ctx, 312, 286, 12, 4);
  ctx.fill();
  ellipse(ctx, 348, 286, 12, 4);
  ctx.fill();
  ctx.fillStyle = '#e23b2e';
  circle(ctx, 312, 280, 5);
  ctx.fill();
  if (!mods.scale) {
    ctx.fillStyle = '#6b7280';
    circle(ctx, 348, 280, 5);
    ctx.fill();
  }

  // Price chalkboard.
  ctx.fillStyle = '#2b3a42';
  rr(ctx, 388, 232, 60, 40, 6);
  ctx.fill();
  ctx.strokeStyle = '#a9713f';
  ctx.lineWidth = 3;
  rr(ctx, 388, 232, 60, 40, 6);
  ctx.stroke();
  ctx.fillStyle = '#fff6e8';
  ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mods.price ? '7K' : '5K', 418, 253);

  // Crates with the market cat.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 30, 368, 64, 40, 4);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(30, 384, 64, 4);
  ctx.fillRect(58, 368, 4, 40);
  if (!mods.cat) sleepingCat(ctx, 66, 360, 0.9, '#7a7a7a', '#5a5a5a');

  // Rooster pecking at the ground.
  if (!mods.rooster) {
    ctx.fillStyle = '#fff8ec';
    ellipse(ctx, 498, 384, 16, 12);
    ctx.fill();
    circle(ctx, 514, 370, 8);
    ctx.fill();
    ctx.fillStyle = '#e23b2e';
    poly(ctx, [[512, 362], [518, 354], [520, 362]]);
    ctx.fill();
    ctx.fillStyle = '#f2b134';
    poly(ctx, [[522, 370], [528, 372], [522, 374]]);
    ctx.fill();
    ctx.strokeStyle = '#e23b2e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(508, 394);
    ctx.lineTo(506, 402);
    ctx.moveTo(512, 394);
    ctx.lineTo(514, 402);
    ctx.stroke();
  }

  // Ground with scattered leaves.
  ctx.fillStyle = '#e8d3ac';
  ctx.fillRect(0, 408, 560, 32);
  ctx.fillStyle = '#2a7f6f';
  ellipse(ctx, 200, 424, 7, 3);
  ctx.fill();
  ellipse(ctx, 340, 420, 7, 3);
  ctx.fill();
  ellipse(ctx, 460, 428, 7, 3);
  ctx.fill();
}

// ---- Scene 3: Sarapan di Teras ---------------------------------------------
export function drawSceneTeras(ctx, mods) {
  // Warm interior wall.
  ctx.fillStyle = '#f6e3c0';
  ctx.fillRect(0, 0, 560, 440);
  ctx.fillStyle = '#e8d3ac';
  ctx.fillRect(0, 300, 560, 6);

  // Window with curtain (open vs drawn).
  ctx.fillStyle = '#bfe3e8';
  rr(ctx, 226, 20, 108, 96, 8);
  ctx.fill();
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 5;
  rr(ctx, 226, 20, 108, 96, 8);
  ctx.stroke();
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(280, 20);
  ctx.lineTo(280, 116);
  ctx.moveTo(226, 68);
  ctx.lineTo(334, 68);
  ctx.stroke();
  ctx.fillStyle = '#ffd9a0';
  circle(ctx, 312, 44, 12);
  ctx.fill();
  ctx.fillStyle = '#2a7f6f';
  poly(ctx, [[240, 116], [268, 92], [280, 116]]);
  ctx.fill();
  if (mods.curtain) {
    ctx.fillStyle = '#d95f33';
    rr(ctx, 226, 20, 54, 96, 8);
    ctx.fill();
    ctx.fillStyle = '#c24e28';
    for (let y = 24; y < 112; y += 16) ctx.fillRect(240, y, 4, 12);
  } else {
    ctx.fillStyle = '#d95f33';
    rr(ctx, 226, 20, 18, 96, 6);
    ctx.fill();
    rr(ctx, 316, 20, 18, 96, 6);
    ctx.fill();
  }

  // Wall clock (hands move).
  ctx.fillStyle = '#fff8ec';
  circle(ctx, 88, 82, 30);
  ctx.fill();
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 4;
  circle(ctx, 88, 82, 30);
  ctx.stroke();
  ctx.fillStyle = '#4a2c1a';
  circle(ctx, 88, 60, 2);
  ctx.fill();
  circle(ctx, 110, 82, 2);
  ctx.fill();
  circle(ctx, 88, 104, 2);
  ctx.fill();
  circle(ctx, 66, 82, 2);
  ctx.fill();
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(88, 82);
  ctx.lineTo(88, 62);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(88, 82);
  if (mods.clock) ctx.lineTo(104, 92);
  else ctx.lineTo(104, 82);
  ctx.stroke();

  // Wall picture (sun vs moon).
  ctx.fillStyle = '#6b4226';
  rr(ctx, 436, 62, 68, 60, 6);
  ctx.fill();
  ctx.fillStyle = '#ffe9b8';
  rr(ctx, 442, 68, 56, 48, 4);
  ctx.fill();
  if (mods.picture) {
    ctx.fillStyle = '#f2c94c';
    circle(ctx, 484, 84, 8);
    ctx.fill();
    ctx.fillStyle = '#8a5a30';
    poly(ctx, [[446, 116], [462, 100], [478, 116]]);
    ctx.fill();
    poly(ctx, [[470, 116], [488, 98], [498, 116]]);
    ctx.fill();
  } else {
    ctx.fillStyle = '#f2e6b8';
    circle(ctx, 484, 84, 9);
    ctx.fill();
    ctx.fillStyle = '#d9c48f';
    circle(ctx, 481, 82, 2);
    ctx.fill();
    circle(ctx, 487, 87, 2);
    ctx.fill();
    ctx.fillStyle = '#2b3a42';
    poly(ctx, [[446, 116], [462, 104], [478, 116]]);
    ctx.fill();
  }

  // Breakfast table.
  ctx.fillStyle = '#a9713f';
  rr(ctx, 40, 250, 480, 20, 6);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(70, 270, 14, 140);
  ctx.fillRect(476, 270, 14, 140);
  // Tablecloth stripe.
  ctx.fillStyle = '#d95f33';
  ctx.fillRect(40, 250, 480, 6);
  ctx.fillStyle = '#fff6e8';
  for (let x = 60; x < 520; x += 40) ctx.fillRect(x, 250, 12, 6);

  // Teapot (lid on vs off).
  ctx.fillStyle = '#2a7f6f';
  ellipse(ctx, 180, 238, 30, 16);
  ctx.fill();
  rr(ctx, 152, 210, 56, 30, 10);
  ctx.fill();
  ctx.strokeStyle = '#2a7f6f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(152, 222);
  ctx.quadraticCurveTo(132, 226, 138, 240);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(208, 222);
  ctx.quadraticCurveTo(224, 216, 222, 206);
  ctx.stroke();
  if (!mods.teapot) {
    ctx.fillStyle = '#1f6a5c';
    ellipse(ctx, 180, 210, 18, 6);
    ctx.fill();
    ctx.fillStyle = '#f2b134';
    circle(ctx, 180, 206, 4);
    ctx.fill();
  }

  // Steaming cup.
  ctx.fillStyle = '#fff8ec';
  ellipse(ctx, 300, 240, 20, 5);
  ctx.fill();
  ctx.fillStyle = '#d95f33';
  rr(ctx, 284, 216, 32, 24, 4);
  ctx.fill();
  ctx.strokeStyle = '#d95f33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(318, 226, 7, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (!mods.steam) {
    ctx.strokeStyle = 'rgba(122,90,68,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(294, 210);
    ctx.quadraticCurveTo(290, 200, 296, 192);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(306, 210);
    ctx.quadraticCurveTo(310, 200, 304, 192);
    ctx.stroke();
  }

  // Toast with jam (spread vs plain).
  ctx.fillStyle = '#e8b25a';
  rr(ctx, 238, 286, 34, 30, 6);
  ctx.fill();
  ctx.fillStyle = '#f6d488';
  rr(ctx, 242, 290, 26, 22, 4);
  ctx.fill();
  if (!mods.toast) {
    ctx.fillStyle = '#c0392b';
    rr(ctx, 246, 294, 18, 12, 3);
    ctx.fill();
  }

  // Boiled eggs (two vs one).
  ctx.fillStyle = '#fff8ec';
  ellipse(ctx, 350, 312, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#f6e3c0';
  ellipse(ctx, 342, 302, 9, 12);
  ctx.fill();
  if (!mods.eggs) {
    ellipse(ctx, 360, 302, 9, 12);
    ctx.fill();
  }

  // Newspaper (front page vs flipped back).
  ctx.save();
  ctx.translate(420, 320);
  ctx.rotate(mods.paper ? 0.12 : -0.06);
  ctx.fillStyle = '#fffdf6';
  rr(ctx, -34, -20, 68, 40, 3);
  ctx.fill();
  ctx.strokeStyle = '#d9c48f';
  ctx.lineWidth = 1;
  rr(ctx, -34, -20, 68, 40, 3);
  ctx.stroke();
  if (mods.paper) {
    ctx.fillStyle = '#7a5a44';
    for (let y = -6; y < 16; y += 6) ctx.fillRect(-28, y, 56, 2);
  } else {
    ctx.fillStyle = '#4a2c1a';
    ctx.fillRect(-28, -16, 56, 7);
    ctx.fillStyle = '#7a5a44';
    for (let y = -4; y < 16; y += 6) ctx.fillRect(-28, y, 56, 2);
  }
  ctx.restore();

  // Flower vase (red vs yellow blooms).
  ctx.fillStyle = '#2a7f6f';
  rr(ctx, 112, 286, 16, 30, 4);
  ctx.fill();
  ctx.strokeStyle = '#2a7f6f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 286);
  ctx.lineTo(116, 268);
  ctx.moveTo(120, 286);
  ctx.lineTo(124, 266);
  ctx.stroke();
  ctx.fillStyle = mods.flowers ? '#f2b134' : '#e23b2e';
  circle(ctx, 115, 264, 7);
  ctx.fill();
  circle(ctx, 125, 262, 7);
  ctx.fill();
  circle(ctx, 120, 256, 6);
  ctx.fill();

  // Sugar bowl (cubes vs empty).
  ctx.fillStyle = '#fff8ec';
  ellipse(ctx, 390, 272, 16, 8);
  ctx.fill();
  if (!mods.sugar) {
    ctx.fillStyle = '#f6e3c0';
    rr(ctx, 382, 260, 8, 8, 2);
    ctx.fill();
    rr(ctx, 392, 260, 8, 8, 2);
    ctx.fill();
    rr(ctx, 387, 253, 8, 8, 2);
    ctx.fill();
  }

  // Spoon on the table.
  if (!mods.spoon) {
    ctx.fillStyle = '#b8b8b8';
    ellipse(ctx, 212, 340, 5, 9);
    ctx.fill();
    ctx.fillRect(210, 348, 4, 18);
  }

  // Cat under the table, tail out (or tucked away).
  ctx.fillStyle = '#e8a04c';
  ellipse(ctx, 500, 392, 26, 14);
  ctx.fill();
  if (!mods.cat) {
    ctx.strokeStyle = '#e8a04c';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(524, 392);
    ctx.quadraticCurveTo(540, 380, 534, 366);
    ctx.stroke();
  }

  // Floor.
  ctx.fillStyle = '#d9bf92';
  ctx.fillRect(0, 410, 560, 30);
  ctx.fillStyle = '#c9ab7c';
  for (let x = 0; x < 560; x += 70) ctx.fillRect(x, 410, 2, 30);
}
