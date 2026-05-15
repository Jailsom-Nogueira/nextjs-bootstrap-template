---
description: Run `npm run prompt:context` and present its output formatted for pasting into a chat UI.
---

Run `npm run prompt:context` and return the raw stdout to the user inside a single fenced code block so they can copy-paste it into ChatGPT/Claude/Gemini web UIs.

After the code block, add a one-line hint:

> Paste the block above into your chat UI as the FIRST message, then attach (or paste) the specific files you want to discuss.

Do not modify, summarize, or truncate the script output. The point is a verbatim snapshot.
