// Hand-in entrypoint for "best spot-the-difference game" (Node 22, stdlib only).
//
// What this game is: a cozy spot-the-difference game set in a morning market —
// a warung kopi, a pasar pagi, breakfast on the terrace. The playable game is the
// static files in game/ (index.html plus its modules, no libraries, no network),
// and screenshots/ holds four PNG renders of it (the first by name is the cover).
//
// What this file does, in order:
//   1. Checks game/ and screenshots/ are really there next to this file — a
//      missing folder is a broken hand-in, so fail loudly instead of handing
//      in an empty shell.
//   2. Copies game/ and screenshots/ into the output directory
//      (MAKEFUN_OUTPUT_DIR outside the grader, /output inside it).
//   3. Writes dossier.json there with the vendored make.fun library — the
//      summary the judge reads — using the scorer's own caps, so this program
//      refuses exactly where the scorer would refuse.
//   4. Prints one short line saying what was copied, so a local run shows
//      the hand-in actually happened.
//
// Run it locally with:  MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the game with:  node serve.ts, then http://localhost:8080

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The scorer's caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the rest refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of
// game files in all, or a path under game/ over 1000 bytes. (game/ counts
// beside /output's own 1000-entry cap, with screenshots/ and dossier.json.)
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message) {
  throw new Error(`main.ts: ${message}`);
}

// Count every file under a directory, recursively, for the summary line.
function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    total += statSync(path).isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

// A hand-in with no game or no screenshots is not a hand-in: stop here with
// a message that says which folder is missing, instead of copying nothing.
function requireSourceDir(name) {
  const path = join(here, name);
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    fail(`missing ${name}/ next to main.ts — expected a ${name} folder in ${here}`);
  }
  return path;
}

function copySourceDir(name, dest) {
  const src = requireSourceDir(name);
  cpSync(src, dest, { recursive: true });
  return countFiles(src);
}

function writeDossier() {
  writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, DOSSIER_CAPS));
}

mkdirSync(outDir, { recursive: true });
const gameFiles = copySourceDir('game', join(outDir, 'game'));
const shotFiles = copySourceDir('screenshots', join(outDir, 'screenshots'));
writeDossier();
console.log(
  `handed in ${gameFiles} game file(s) and ${shotFiles} screenshot(s) to ${outDir} (dossier.json written)`,
);
