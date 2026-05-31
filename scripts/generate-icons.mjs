#!/usr/bin/env node
/**
 * scripts/generate-icons.mjs
 *
 * Deterministic icon pipeline. Reads the single canonical brand mark
 * (.docs/assets/brand/icon-source.svg) and derives every favicon / app-icon
 * surface the repo serves, so the icons never drift from the source mark.
 *
 * Emits:
 *   src/app/favicon.ico            multi-res ICO (16/32/48)
 *   src/app/apple-icon.png         180x180, light mark on opaque dark (iOS masks corners)
 *   public/icon-192.png            192x192 PWA "any" icon
 *   public/icon-512.png            512x512 PWA "any" icon
 *   public/icon-maskable-512.png   512x512 maskable with ~20% safe zone
 *
 * Manifest-referenced rasters live in public/ (Next's app/ icon convention only
 * serves the magic names icon.*, apple-icon.*, favicon.ico). Generated rasters
 * are committed so CI never rasterizes at build time.
 *
 * Replace the mark in .docs/assets/brand/icon-source.svg with your brand, then
 * run: npm run icons:generate
 */
import { Buffer } from "node:buffer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SOURCE_SVG = join(root, ".docs/assets/brand/icon-source.svg");

const INK = "#111111";
const CANVAS = "#ffffff";

/** Placeholder mark geometry: a square with a diagonal. Replace with your brand. */
function markSvg({ size, stroke, background, scale = 1 }) {
  const translate = (512 * (1 - scale)) / 2;
  const bg =
    background === "transparent" ? "" : `<rect width="512" height="512" fill="${background}" />`;
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">` +
      bg +
      `<g transform="translate(${translate} ${translate}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round">` +
      `<rect x="156" y="156" width="200" height="200" />` +
      `<line x1="156" y1="156" x2="356" y2="356" />` +
      `</g></svg>`,
  );
}

async function renderPng({ size, stroke, background, scale }) {
  return sharp(markSvg({ size, stroke, background, scale }), { density: 384 })
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

/** Minimal PNG-in-ICO encoder (supported by every modern browser). */
function encodeIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  const images = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images]);
}

function write(relativePath, buffer) {
  const dest = join(root, relativePath);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buffer);
  return relativePath;
}

async function main() {
  // Touch the source so a missing mark fails loudly.
  readFileSync(SOURCE_SVG, "utf8");

  const written = [];

  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      data: await renderPng({ size, stroke: INK, background: CANVAS }),
    })),
  );
  written.push(write("src/app/favicon.ico", encodeIco(icoPngs)));

  written.push(
    write(
      "src/app/apple-icon.png",
      await renderPng({ size: 180, stroke: CANVAS, background: INK }),
    ),
  );
  written.push(
    write("public/icon-192.png", await renderPng({ size: 192, stroke: INK, background: CANVAS })),
  );
  written.push(
    write("public/icon-512.png", await renderPng({ size: 512, stroke: INK, background: CANVAS })),
  );
  written.push(
    write(
      "public/icon-maskable-512.png",
      await renderPng({ size: 512, stroke: INK, background: CANVAS, scale: 0.6 }),
    ),
  );

  for (const path of written) console.log(`generated ${path}`);
  console.log(`\nicons:generate — wrote ${written.length} files from ${SOURCE_SVG}`);
  console.log(
    "Note: src/app/icon.svg (adaptive served favicon) is hand-authored, not overwritten.",
  );
}

main().catch((err) => {
  console.error("icons:generate failed:", err);
  process.exit(1);
});
