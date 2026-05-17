/**
 * Generated CHANGELOG flow.
 *
 * Build script (not application code) — uses console.* directly because the
 * pino logger pulls in worker threads and is overkill for a CLI one-shot.
 * That's also why we avoid the `@/` path alias here: tsx runs this file
 * outside the Next bundler, so the alias would not resolve.
 *
 * Flow:
 *   1. Read current branch + upstream
 *   2. git log upstream..HEAD --pretty=format:"- %s (%h) - %an"
 *   3. Bump patch version in package.json
 *   4. Prepend a `## Push [date time] - vX.Y.Z` block under the title
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CHANGELOG_PATH = path.join(process.cwd(), "CHANGELOG.md");

function run() {
  console.warn("Generating changelog for new commits...");

  let currentBranch = "";
  try {
    currentBranch = execSync("git branch --show-current", {
      encoding: "utf-8",
    }).trim();
  } catch {
    console.error("Could not get current branch.");
    process.exit(1);
  }

  let upstream = "";
  try {
    upstream = execSync(`git rev-parse --abbrev-ref ${currentBranch}@{upstream}`, {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
  } catch {
    console.warn(`No upstream branch configured for '${currentBranch}'.`);
    console.warn(`To enable changelog generation, set the upstream branch:`);
    console.warn(`  git push --set-upstream origin ${currentBranch}`);
    process.exit(0);
  }

  const logCommand = `git log ${upstream}..HEAD --pretty=format:"- %s (%h) - %an"`;
  let logOutput = "";

  try {
    logOutput = execSync(logCommand, { encoding: "utf-8" });
  } catch (error) {
    console.error("Error fetching new commits:", error);
    process.exit(1);
  }

  if (!logOutput.trim()) {
    console.warn("No new commits to add to changelog.");
    process.exit(0);
  }

  const packageJsonPath = path.join(process.cwd(), "package.json");
  let version = "0.0.1";

  if (fs.existsSync(packageJsonPath)) {
    const raw = fs.readFileSync(packageJsonPath, "utf-8");
    const pkg = JSON.parse(raw) as Record<string, unknown>;
    const currentVersion = (pkg.version as string) || "0.0.0";
    const parts = currentVersion.split(".").map(Number);
    parts[2] = (parts[2] || 0) + 1;
    version = parts.join(".");
    pkg.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
    console.warn(`Version bumped: ${currentVersion} -> ${version}`);
  }

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0];

  const header = `## Push [${dateStr} ${timeStr}] - v${version}\n\n`;

  let existingContent = "";
  if (fs.existsSync(CHANGELOG_PATH)) {
    existingContent = fs.readFileSync(CHANGELOG_PATH, "utf-8");
  } else {
    existingContent = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n`;
  }

  const titleMarker = `All notable changes to this project will be documented in this file.\n\n`;
  const insertIndex = existingContent.indexOf(titleMarker);

  if (insertIndex !== -1) {
    const splitPos = insertIndex + titleMarker.length;
    existingContent =
      existingContent.slice(0, splitPos) +
      header +
      logOutput +
      "\n\n" +
      existingContent.slice(splitPos);
  } else {
    existingContent =
      `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n` +
      header +
      logOutput +
      "\n\n" +
      existingContent;
  }

  fs.writeFileSync(CHANGELOG_PATH, existingContent);
  console.warn("CHANGELOG.md updated successfully!");
}

run();
