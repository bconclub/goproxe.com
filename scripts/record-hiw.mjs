/**
 * Record the three HowItWorks card visualizations as MP4 files.
 *
 * Approach:
 *   1. Open the local dev server at http://localhost:3002
 *   2. Scroll the HowItWorks section into view, hold steady
 *   3. Record the full page as WebM via Playwright's `recordVideo`
 *   4. Read the bounding box of each `.hiw-card-vis-wrap` from the DOM
 *   5. Use ffmpeg to crop each card region out of the page video and
 *      re-encode as H.264 MP4 (small + universally supported)
 *
 * Output:
 *   public/how-it-works/01-capture.mp4
 *   public/how-it-works/02-memory.mp4
 *   public/how-it-works/03-reactivate.mp4
 */

import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'how-it-works');
const TMP_DIR = join(ROOT, '.video-tmp');

const URL = 'http://localhost:3002';
const VIEWPORT = { width: 1400, height: 900 };
/** One full loop of the longest card is ~6.5s; capture a little extra. */
const HOLD_SECONDS = 8;

/* ─── setup dirs ─── */
mkdirSync(OUT_DIR, { recursive: true });
if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true, force: true });
mkdirSync(TMP_DIR, { recursive: true });

console.log('Launching headless Chromium …');
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,                 // crisp recordings
  recordVideo: { dir: TMP_DIR, size: VIEWPORT },
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
/* Let HMR + lazy chunks settle */
await page.waitForTimeout(1500);

/* Scroll to HowItWorks and wait for animations to start */
await page.evaluate(() => {
  const sec = document.querySelector('.hiw-section');
  sec?.scrollIntoView({ block: 'start', behavior: 'instant' });
});
await page.waitForTimeout(400); // give layout + reveal time
/* Scroll a tiny bit so all 3 cards are fully on-screen */
await page.evaluate(() => window.scrollBy(0, 220));
await page.waitForTimeout(400);

/* Read each card's bounding box (CSS pixels) */
const boxes = await page.evaluate(() => {
  const wraps = document.querySelectorAll('.hiw-card-vis-wrap');
  return Array.from(wraps).map(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
});
console.log('Card boxes (CSS px):', boxes);

if (boxes.length !== 3) {
  throw new Error(`Expected 3 cards, found ${boxes.length}`);
}

/* Hold while animations run */
console.log(`Recording ${HOLD_SECONDS}s …`);
await page.waitForTimeout(HOLD_SECONDS * 1000);

const videoPath = await page.video().path();
await ctx.close();
await browser.close();
console.log('Raw page video at:', videoPath);

/* Find the .webm written to TMP_DIR (path() might return undefined on some
   versions of Playwright until the context closes) */
const webm = readdirSync(TMP_DIR).find(f => f.endsWith('.webm'));
if (!webm) throw new Error('No .webm produced by Playwright.');
const inFile = join(TMP_DIR, webm);

/* deviceScaleFactor=2 means the WebM frames are 2x CSS px wide.
   Multiply crop boxes by the device scale. */
const SCALE = 2;
const names = ['01-capture', '02-memory', '03-reactivate'];

for (let i = 0; i < 3; i++) {
  const b = boxes[i];
  const x = Math.max(0, Math.round(b.x * SCALE));
  const y = Math.max(0, Math.round(b.y * SCALE));
  const w = Math.round(b.w * SCALE) & ~1; // even (H.264 requires)
  const h = Math.round(b.h * SCALE) & ~1;
  const out = join(OUT_DIR, `${names[i]}.mp4`);
  console.log(`Encoding ${names[i]} -> ${out}  (crop ${w}x${h}@${x},${y})`);

  const r = spawnSync(
    'ffmpeg',
    [
      '-y', '-loglevel', 'error',
      '-i', inFile,
      '-vf', `crop=${w}:${h}:${x}:${y}`,
      '-c:v', 'libx264',
      '-preset', 'slower',
      '-crf', '20',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an',
      out,
    ],
    { stdio: 'inherit' }
  );
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${names[i]}`);
}

rmSync(TMP_DIR, { recursive: true, force: true });
console.log('Done. Files saved under public/how-it-works/');
