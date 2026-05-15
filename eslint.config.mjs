import nextPlugin from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments/configs";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
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
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
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
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
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
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];

export default config;
