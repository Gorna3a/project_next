// Build the 12 PixelCode avatars: procedural 32×32 pixel art, upscaled 4×
// nearest-neighbor to 128×128 PNGs (transparent background).
// Run: node scripts/build-avatars.mjs
// Output: public/avatars/avatar-01.png … avatar-12.png

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 32, H = 32, SCALE = 4;

// ─── tiny pixel buffer ───────────────────────────────────────────────
const buf = () => Array.from({ length: H * W }, () => [0, 0, 0, 0]);
const px = (b, x, y, [r, g, bl, a]) => {
  x |= 0; y |= 0;
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  b[y * W + x] = [r, g, bl, a];
};
const rect = (b, x, y, w, h, c) => { for (let iy = 0; iy < h; iy++) for (let ix = 0; ix < w; ix++) px(b, x + ix, y + iy, c); };
const ellipse = (b, cx, cy, rx, ry, c, fill = true) => {
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    const d = dx * dx + dy * dy;
    if (fill ? d <= 1 : Math.abs(d - 1) < 0.35) px(b, x, y, c);
  }
};
const circle = (b, cx, cy, r, c) => ellipse(b, cx, cy, r, r, c, true);
const lineH = (b, y, x0, x1, c) => { for (let x = x0; x <= x1; x++) px(b, x, y, c); };
const lineV = (b, x, y0, y1, c) => { for (let y = y0; y <= y1; y++) px(b, x, y, c); };

// ─── palette ─────────────────────────────────────────────────────────
const K  = [22, 22, 22, 255];      // ink outline
const W_ = [245, 240, 225, 255];   // warm white
const S  = [216, 216, 208, 255];   // silver
const Sd = [152, 152, 144, 255];   // silver shade
const C  = [95, 205, 228, 255];    // cyan
const P  = [166, 224, 0, 255];     // phosphor
const Pd = [122, 168, 0, 255];     // phosphor dark
const Y  = [255, 230, 0, 255];     // yellow
const O  = [255, 107, 26, 255];    // orange
const Od = [204, 82, 16, 255];     // orange shade
const PU = [198, 166, 255, 255];   // purple
const PUd = [150, 118, 224, 255];  // purple shade
const R  = [255, 85, 85, 255];     // red
const Rd = [188, 44, 44, 255];     // red shade
const PK = [255, 143, 177, 255];   // pink
const PKd = [219, 100, 138, 255];  // pink shade
const V  = [244, 200, 155, 255];   // tan skin
const Vd = [216, 168, 120, 255];   // tan shade
const BR = [138, 90, 43, 255];     // brown
const BK = [58, 57, 54, 255];      // dark grey
const GN = [74, 160, 72, 255];     // frog green
const GNd = [48, 116, 48, 255];    // frog shade
const LM = [146, 250, 60, 255];    // lime alien
const LMd = [96, 196, 30, 255];    // lime shade
const WT = [240, 244, 248, 255];   // ghost white

// block coords are in 32×32 space; eyes default symmetric
const faceEyes = (b, y, xL, xR, c = K) => { px(b, xL, y, c); px(b, xL + 1, y, c); px(b, xR, y, c); px(b, xR + 1, y, c); };

// ─── avatar builders ─────────────────────────────────────────────────
const avatars = [];

// 01 — Bolt (CRT robot, echoes the logo face, silver + cyan)
avatars[0] = () => {
  const b = buf();
  rect(b, 6, 8, 20, 3, K);                    // brow bar
  rect(b, 6, 9, 20, 18, K);                   // outline frame
  rect(b, 7, 10, 18, 16, S);                  // shell
  rect(b, 7, 22, 18, 4, Sd);                  // chin shade
  rect(b, 9, 13, 14, 8, K);                   // visor recess
  rect(b, 11, 16, 3, 3, C); rect(b, 19, 16, 3, 3, C);   // visor LEDs
  rect(b, 14, 25, 4, 2, Sd);                  // grille
  px(b, 16, 3, K); px(b, 16, 4, K); px(b, 16, 5, K); px(b, 16, 6, K); px(b, 16, 7, K); // antenna
  circle(b, 16, 2, 2, R);
  return b;
};

// 02 — Teezy (lime alien, big oval eyes)
avatars[1] = () => {
  const b = buf();
  ellipse(b, 16, 17, 12, 11, K, true);        // outline
  ellipse(b, 16, 17, 10, 9, LM, true);        // head
  ellipse(b, 16, 27, 12, 3, LMd, true);       // neck shade n/a (kept subtle)
  ellipse(b, 11, 16, 3, 5, K, true);          // left eye
  ellipse(b, 21, 16, 3, 5, K, true);          // right eye
  px(b, 10, 13, W_); px(b, 20, 13, W_);       // glints
  lineH(b, 23, 12, 20, K);                    // smile
  px(b, 12, 5, K); px(b, 16, 3, K); px(b, 20, 5, K); // antenna stems
  circle(b, 12, 4, 1, LM); circle(b, 16, 2, 1, LM); circle(b, 20, 4, 1, LM); // tips
  return b;
};

// 03 — Slum (phosphor slime blob)
avatars[2] = () => {
  const b = buf();
  ellipse(b, 16, 18, 13, 11, K, true);
  ellipse(b, 16, 19, 11, 9, P, true);
  px(b, 10, 26, K); px(b, 14, 28, K); px(b, 18, 28, K); px(b, 22, 26, K);
  rect(b, 8, 24, 16, 4, P);                   // flattened melty bottom
  rect(b, 8, 27, 16, 1, Pd);
  px(b, 12, 16, K); px(b, 13, 16, K); px(b, 19, 16, K); px(b, 20, 16, K); // eyes
  lineH(b, 21, 12, 20, K);                    // wide smile
  px(b, 11, 13, W_); px(b, 13, 12, W_);       // shine
  return b;
};

// 04 — Nyo (purple ninja cat)
avatars[3] = () => {
  const b = buf();
  // ears
  rect(b, 7, 2, 5, 6, K); rect(b, 20, 2, 5, 6, K);
  rect(b, 8, 3, 3, 4, PU); rect(b, 21, 3, 3, 4, PU);
  ellipse(b, 16, 18, 12, 11, K, true);
  ellipse(b, 16, 18, 10, 9, PU, true);
  rect(b, 7, 15, 18, 6, PUd);                 // mask band
  rect(b, 14, 15, 4, 6, PUd);
  px(b, 11, 18, Y); px(b, 12, 18, Y); px(b, 20, 18, Y); px(b, 21, 18, Y); // slit eyes
  px(b, 16, 22, K); px(b, 15, 23, K); px(b, 17, 23, K); // nose + mouth
  return b;
};

// 05 — Froggo (relaxed frog)
avatars[4] = () => {
  const b = buf();
  circle(b, 9, 7, 4, K); circle(b, 23, 7, 4, K); // eye bumps outline
  circle(b, 9, 7, 3, GN); circle(b, 23, 7, 3, GN);
  ellipse(b, 16, 19, 13, 10, K, true);
  ellipse(b, 16, 19, 11, 8, GN, true);
  px(b, 8, 6, W_); px(b, 10, 6, W_); px(b, 22, 6, W_); px(b, 24, 6, W_); // eye whites
  px(b, 9, 6, K); px(b, 23, 6, K);               // pupils
  lineH(b, 22, 8, 24, K);                        // big flat smile
  px(b, 5, 19, PKd); px(b, 26, 19, PKd);         // cheeks
  return b;
};

// 06 — Wraith (little white ghost)
avatars[5] = () => {
  const b = buf();
  rect(b, 7, 12, 18, 14, K);                    // body outline sides
  ellipse(b, 16, 12, 9, 9, K, true);            // dome outline
  rect(b, 8, 13, 16, 13, WT);
  ellipse(b, 16, 12, 8, 8, WT, true);
  // wavy bottom edge (3 humps)
  px(b, 8, 26, WT); px(b, 10, 25, WT); px(b, 11, 26, WT); px(b, 13, 25, WT);
  px(b, 15, 26, WT); px(b, 17, 25, WT); px(b, 19, 26, WT); px(b, 21, 25, WT);
  px(b, 23, 26, WT);
  ellipse(b, 12, 14, 2, 3, K, true); ellipse(b, 20, 14, 2, 3, K, true); // eyes
  circle(b, 16, 20, 2, K);                      // "o" mouth
  return b;
};

// 07 — Skullbit (bone-white skull coder)
avatars[6] = () => {
  const b = buf();
  ellipse(b, 16, 14, 11, 10, K, true);
  ellipse(b, 16, 14, 9, 8, W_, true);           // cranium
  rect(b, 9, 16, 14, 8, K);                     // jaw outline
  rect(b, 10, 17, 12, 6, W_);                   // jaw
  ellipse(b, 12, 13, 3, 3, K, true);            // sockets
  ellipse(b, 20, 13, 3, 3, K, true);
  rect(b, 15, 17, 2, 2, K);                     // nose
  lineV(b, 12, 20, 22, K); lineV(b, 16, 20, 22, K); lineV(b, 20, 20, 22, K); // teeth
  return b;
};

// 08 — Inky (orange octopus wizard)
avatars[7] = () => {
  const b = buf();
  // hat
  rect(b, 12, 1, 2, 4, K);                      // stem
  rect(b, 8, 8, 16, 3, K);                      // brim
  rect(b, 10, 9, 12, 1, PU);
  rect(b, 4, 11, 24, 8, K);
  rect(b, 5, 12, 22, 6, PU);                    // hat cone
  rect(b, 12, 12, 2, 2, Y); rect(b, 17, 14, 2, 2, Y); // hat stars
  // head
  ellipse(b, 16, 22, 10, 7, K, true);
  ellipse(b, 16, 22, 8, 5, O, true);
  px(b, 13, 21, K); px(b, 14, 21, K); px(b, 18, 21, K); px(b, 19, 21, K); // eyes
  lineH(b, 24, 13, 19, K);                      // smile
  return b;
};

// 09 — Quack (yellow duck)
avatars[8] = () => {
  const b = buf();
  ellipse(b, 16, 15, 12, 11, K, true);
  ellipse(b, 16, 15, 10, 9, Y, true);
  px(b, 12, 12, K); px(b, 13, 12, K); px(b, 20, 12, K); px(b, 21, 12, K); // eyes
  rect(b, 8, 17, 16, 5, K);                     // bill outline
  rect(b, 9, 18, 14, 3, O);                     // bill
  lineH(b, 19, 10, 22, Od);
  return b;
};

// 10 — Pompom (pink bunny)
avatars[9] = () => {
  const b = buf();
  // ears
  ellipse(b, 10, 5, 3, 6, K, true); ellipse(b, 22, 5, 3, 6, K, true);
  ellipse(b, 10, 5, 2, 5, PK, true); ellipse(b, 22, 5, 2, 5, PK, true);
  ellipse(b, 10, 6, 1, 3, PKd, true); ellipse(b, 22, 6, 1, 3, PKd, true);
  ellipse(b, 16, 20, 11, 10, K, true);
  ellipse(b, 16, 20, 9, 8, PK, true);
  px(b, 12, 18, K); px(b, 13, 18, K); px(b, 19, 18, K); px(b, 20, 18, K); // eyes
  px(b, 15, 23, PKd); px(b, 16, 23, PKd); px(b, 17, 23, PKd); // nose
  lineH(b, 26, 13, 19, PKd);                    // mouth
  return b;
};

// 11 — Scorch (small red dragon)
avatars[10] = () => {
  const b = buf();
  // horns
  rect(b, 9, 3, 3, 5, K); rect(b, 20, 3, 3, 5, K);
  rect(b, 10, 4, 1, 3, K); rect(b, 21, 4, 1, 3, K); // horn cores stay dark (ink horns)
  ellipse(b, 16, 17, 12, 11, K, true);
  ellipse(b, 16, 17, 10, 9, R, true);
  // cheek spikes
  px(b, 4, 16, Rd); px(b, 3, 15, Rd); px(b, 28, 16, Rd); px(b, 29, 15, Rd);
  // eyes with slit pupils
  rect(b, 10, 13, 4, 3, Y); rect(b, 18, 13, 4, 3, Y);
  lineV(b, 12, 13, 15, K); lineV(b, 20, 13, 15, K);
  // nostrils + smile
  px(b, 13, 21, Rd); px(b, 19, 21, Rd);
  lineH(b, 24, 11, 21, K);
  return b;
};

// 12 — Spore (mushroom kid, red cap)
avatars[11] = () => {
  const b = buf();
  // cap
  ellipse(b, 16, 12, 15, 9, K, true);
  ellipse(b, 16, 12, 13, 7, R, true);
  circle(b, 10, 9, 2, W_); circle(b, 22, 9, 2, W_); circle(b, 16, 6, 1, W_); // spots
  // face
  rect(b, 8, 15, 16, 3, K);                     // cap brim underside
  rect(b, 9, 16, 14, 10, K);
  rect(b, 10, 17, 12, 8, V);                    // face
  px(b, 12, 21, K); px(b, 13, 21, K); px(b, 18, 21, K); px(b, 19, 21, K); // eyes
  lineH(b, 25, 13, 19, K);                      // smile
  px(b, 11, 23, Vd); px(b, 21, 23, Vd);         // freckles
  return b;
};

// ─── minimal PNG encoder (RGBA8) ─────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32Of = (bytes) => {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const out = Buffer.alloc(4 + 4 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  Buffer.from(data).copy(out, 8);
  out.writeUInt32BE(crc32Of(Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)])), 8 + data.length);
  return out;
};
const encodePng = (rgba, w, h) => {
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;    // filter: none
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = rgba[y * w + x];
      const o = y * (1 + w * 4) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6;    // 8-bit, RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const upscale = (b, scale) => {
  const w2 = W * scale, h2 = H * scale;
  const out = new Array(w2 * h2);
  for (let y = 0; y < h2; y++) for (let x = 0; x < w2; x++) {
    out[y * w2 + x] = b[Math.floor(y / scale) * W + Math.floor(x / scale)];
  }
  return encodePng(out, w2, h2);
};

// ─── build ───────────────────────────────────────────────────────────
mkdirSync('public/avatars', { recursive: true });
avatars.forEach((build, i) => {
  try {
    const name = `avatar-${String(i + 1).padStart(2, '0')}.png`;
    writeFileSync(`public/avatars/${name}`, upscale(build(), SCALE));
    console.log('wrote public/avatars/' + name);
  } catch (e) {
    console.error(`avatar ${i + 1} failed:`, e?.message);
    process.exitCode = 1;
  }
});
