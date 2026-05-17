#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { extname } from "node:path";
import { readFileSync } from "node:fs";

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".cjs",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdc",
  ".mjs",
  ".sh",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const TEXT_FILENAMES = new Set([
  ".aider.conf.yml",
  ".mcp.json",
  "AGENTS.md",
  "CLAUDE.md",
  "CONVENTIONS.md",
  "GEMINI.md",
  "README.md",
]);

const DISALLOWED_RANGES = [
  [0x1f000, 0x1faff, "emoji or pictograph"],
  [0x2600, 0x27bf, "decorative symbol or dingbat"],
  [0x2b00, 0x2bff, "decorative arrow or symbol"],
  [0x25a0, 0x25ff, "geometric decorative symbol"],
  [0xfe0f, 0xfe0f, "emoji variation selector"],
];

function isTextFile(file) {
  return TEXT_FILENAMES.has(file) || TEXT_EXTENSIONS.has(extname(file));
}

function classify(char) {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) return undefined;
  return DISALLOWED_RANGES.find(([start, end]) => codePoint >= start && codePoint <= end);
}

function visibleLine(line) {
  return line.length > 180 ? `${line.slice(0, 177)}...` : line;
}

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .filter(isTextFile);

const hits = [];

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const lines = text.split(/\r?\n/);
  for (const [lineIndex, line] of lines.entries()) {
    const chars = Array.from(line);
    for (const [charIndex, char] of chars.entries()) {
      const range = classify(char);
      if (!range) continue;
      const [, , label] = range;
      const hex = char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0") ?? "unknown";
      hits.push({
        file,
        line: lineIndex + 1,
        column: charIndex + 1,
        char,
        hex,
        label,
        text: visibleLine(line),
      });
    }
  }
}

if (hits.length > 0) {
  console.error("text-hygiene: disallowed decorative Unicode symbols found.");
  console.error("Use plain words such as PASS, FAIL, Warning, Good, Bad, directory, or file.");
  for (const hit of hits) {
    console.error(
      `${hit.file}:${hit.line}:${hit.column} U+${hit.hex} (${hit.label}) ${JSON.stringify(hit.char)} :: ${hit.text}`,
    );
  }
  process.exit(1);
}

console.log(
  `text-hygiene: scanned ${files.length} tracked text files; no decorative symbols found.`,
);
