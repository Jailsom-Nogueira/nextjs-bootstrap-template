import nextPlugin from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments/configs";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";

// Patterns that suggest a hard-coded secret was committed. The selector matches
// any literal whose .value matches one of these regexes. The list is conservative —
// false positives can be silenced by storing the value in `src/env.ts` (the right place).
const SECRET_REGEXES = [
  String.raw`^eyJ[A-Za-z0-9_-]{20,}\..+`, // JWT-shaped (Supabase anon/service keys)
  String.raw`^sk_(live|test)_[A-Za-z0-9]{20,}$`, // Stripe-like secret keys
  String.raw`^xoxb-[A-Za-z0-9-]{10,}$`, // Slack bot tokens
];
const secretLiteralSelector = `Literal[value=/${SECRET_REGEXES.join("|")}/]`;
const secretTemplateSelector = `TemplateElement[value.raw=/${SECRET_REGEXES.join("|")}/]`;

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".agent-cache/**",
      "build/**",
      "dist/**",
      "out/**",
      "next-env.d.ts",
      "src/components/ui/**",
    ],
  },
  ...(Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin]),
  ...(Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]),
  ...(Array.isArray(nextTypescript) ? nextTypescript : [nextTypescript]),
  eslintCommentsPlugin.recommended,
  {
    // Configure the import plugin's resolver to use the TypeScript resolver
    // (bundled with eslint-config-next). Without this, `import/no-cycle` errors
    // out trying to resolve `.ts`/`.tsx` paths and `@/*` aliases.
    settings: {
      "import/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        }),
      ],
    },
  },
  {
    // Type-aware lint rules: apply only to TS/TSX inside the project. JS/MJS config
    // files are excluded from the project service to avoid "file not in project" errors.
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "import/no-cycle": ["error", { maxDepth: 1, ignoreExternal: true }],
    },
  },
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@eslint-community/eslint-comments/no-use": [
        "error",
        { allow: ["eslint-disable-next-line", "eslint-disable-line"] },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*", "../../../*"],
              message: "Use the @/* path alias instead of deep relative imports.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: secretLiteralSelector,
          message:
            "Looks like a committed secret. Move it to env via `src/env.ts` and `.env.local`.",
        },
        {
          selector: secretTemplateSelector,
          message:
            "Looks like a committed secret in a template string. Move it to env via `src/env.ts`.",
        },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["**/*.ts"],
    ignores: ["**/*.test.ts", "**/*.spec.ts", "scripts/**"],
    rules: {
      "max-lines": ["warn", { max: 500, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "vitest.setup.ts",
      "e2e/**/*.ts",
      "scripts/**/*.ts",
      "scripts/**/*.mjs",
      "scripts/**/*.js",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "no-console": "off",
    },
  },
];

export default config;
