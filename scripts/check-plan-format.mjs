#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function trackedFiles() {
  return execFileSync("git", ["ls-files", "-z", ".plans"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

const files = trackedFiles();
const failures = [];
const allowedMarkdown = new Set([".plans/README.md"]);
const planHtmlFiles = files.filter((file) => file.startsWith(".plans/") && file.endsWith(".html"));

for (const file of files) {
  if (file.endsWith(".md") && !allowedMarkdown.has(file)) {
    failures.push(`${file}: plans must be standalone .html files, not Markdown.`);
  }
}

if (!files.includes(".plans/templates/plan.html")) {
  failures.push(".plans/templates/plan.html is required as the canonical plan template.");
}

if (files.includes(".plans/templates/plan.md")) {
  failures.push(".plans/templates/plan.md must not be tracked; plan templates use HTML/CSS.");
}

for (const file of planHtmlFiles) {
  const html = readFileSync(file, "utf8");

  if (!html.includes("data-plan-document")) {
    failures.push(`${file}: missing data-plan-document marker on the html element.`);
  }

  if (!html.includes('data-plan-design-system="plan-document-system"')) {
    failures.push(`${file}: missing plan-document-system design-system marker.`);
  }

  if (!/<style[\s>]/i.test(html)) {
    failures.push(`${file}: plans must include embedded CSS in a <style> block.`);
  }

  if (/<link\b[^>]*rel=["']stylesheet["']/i.test(html)) {
    failures.push(`${file}: plans must be self-contained; external stylesheets are not allowed.`);
  }

  if (/href=["'][^"']*(globals\.css|tailwind\.css)["']/i.test(html)) {
    failures.push(`${file}: plan design must not link to app or Tailwind stylesheets.`);
  }
}

if (failures.length > 0) {
  process.stderr.write("plan-format: failed\n");
  for (const failure of failures) {
    process.stderr.write(`- ${failure}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `plan-format: scanned ${files.length} tracked .plans files; ${planHtmlFiles.length} HTML plan file(s) valid.\n`,
);
