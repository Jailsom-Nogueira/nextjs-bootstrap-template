#!/usr/bin/env node
// Verify .mcp.json (root) and .cursor/mcp.json stay byte-identical.
// Both files are required by different tool conventions:
//   - .mcp.json        — Claude Code, Codex CLI, and the emerging shared root standard.
//   - .cursor/mcp.json — Cursor IDE (https://cursor.com/docs/mcp — "Project Configuration").
// They MUST hold the same server list. This check prevents silent drift.
import { readFileSync } from "node:fs";

const files = [".mcp.json", ".cursor/mcp.json"];
const contents = files.map((file) => {
  try {
    return { file, text: readFileSync(file, "utf8") };
  } catch (error) {
    console.error(`mcp-sync: cannot read ${file} (${error.code ?? error.message})`);
    process.exit(1);
  }
});

const [a, b] = contents;
if (a.text === b.text) {
  console.log(`mcp-sync: ${files.join(" and ")} are in sync.`);
  process.exit(0);
}

console.error("mcp-sync: drift detected between .mcp.json and .cursor/mcp.json.");
console.error("Both files must hold the same MCP server list.");
console.error(
  "Fix by editing the canonical file (.mcp.json) and copying it: `cp .mcp.json .cursor/mcp.json`.",
);

// Print a minimal diff to make the error obvious in CI logs.
const aLines = a.text.split("\n");
const bLines = b.text.split("\n");
const max = Math.max(aLines.length, bLines.length);
for (let i = 0; i < max; i += 1) {
  if (aLines[i] !== bLines[i]) {
    console.error(`line ${i + 1}:`);
    console.error(`  .mcp.json:        ${JSON.stringify(aLines[i] ?? "")}`);
    console.error(`  .cursor/mcp.json: ${JSON.stringify(bLines[i] ?? "")}`);
  }
}

process.exit(1);
