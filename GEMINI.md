# GEMINI.md

Read `AGENTS.md` first. This file is a thin adapter only; it is not a second rule source.

Task flow:

1. Classify the task from evidence, not just the prompt wording.
2. Load the required rules from the AGENTS.md task router.
3. Put docs, specs, plans, and generated artifacts in the layer chosen by `.agents/references/artifact-layers.md`.
4. Verify repo-changing work using the AGENTS.md completion contract.

If this file disagrees with AGENTS.md, AGENTS.md wins and this file should be patched.

Prompt context for chat UIs: run `npm run prompt:context` and paste its output before the task prompt.
