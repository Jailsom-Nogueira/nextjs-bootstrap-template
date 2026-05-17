# `messages/` — next-intl translation bundles

JSON bundles consumed by [next-intl](https://next-intl.dev) for runtime translation. One file per supported locale, loaded by `src/i18n/request.ts` based on the resolved request locale.

Read `.agents/rules/i18n.md` before editing any string. The runtime locale routing config lives in `src/i18n/routing.ts`.

## Files

| File      | Locale code | Variant                                       | URL prefix                |
| --------- | ----------- | --------------------------------------------- | ------------------------- |
| `en.json` | `en`        | English (en-us). **Default.**                 | none (served at the root) |
| `pt.json` | `pt`        | Portuguese (pt-br). Brazilian.                | `/pt`                     |
| `es.json` | `es`        | Spanish (es-es). Latin-American professional. | `/es`                     |

`localePrefix: "as-needed"` means the default locale (`en`) is served at `/` and the other two are namespaced. See `src/i18n/routing.ts`.

## The non-negotiable rule

**Every translation key must exist in all three bundles, and they must be added in the same commit.** A key present in `en.json` but missing in `pt.json` triggers a next-intl runtime fallback at best, and a missing-translation error at worst. The repo currently relies on disciplined editing, not on tooling, to enforce this — be careful.

If you find a missing key during review, fix the bundle that lacks it before merging. Do not ship the patch with a translation gap.

## Top-level key namespaces

The three bundles share the same top-level structure. Keys are semantic, not positional (no `label1`, `label2`):

| Namespace  | Purpose                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `common`   | Generic short labels reused everywhere: `loading`, `error`, `save`, `cancel`. |
| `nav`      | Navigation entries: `home`, `dashboard`, `admin`, `signIn`, `signOut`.        |
| `header`   | Site header strings: brand, docs, GitHub link.                                |
| `auth`     | Login / signup flow: form labels, button text, error copy.                    |
| `theme`    | Theme toggle UI (light / dark / system).                                      |
| `errors`   | App-level error states.                                                       |
| `home`     | Landing page copy.                                                            |
| `features` | Feature highlight cards on the home page.                                     |
| `stack`    | Stack section on the home page.                                               |
| `footer`   | Footer links and disclaimers.                                                 |
| `admin`    | Admin dashboard surface.                                                      |
| `locale`   | Self-name for each locale (used by the locale switcher).                      |

## How to use a translation

```tsx
// Server Component:
import { getTranslations } from "next-intl/server";
const t = await getTranslations("nav");
return <span>{t("home")}</span>;

// Client Component:
("use client");
import { useTranslations } from "next-intl";
const t = useTranslations("nav");
return <button>{t("home")}</button>;
```

Never hardcode user-facing strings. Never import `Link` / `redirect` / `useRouter` from `next/navigation` inside the localized app tree — use `@/i18n/navigation` instead.

## How to add a new translation key

1. Pick the right namespace. If none fits, create a new top-level namespace and add it to all three bundles.
2. Add the key to `en.json` first.
3. Add the same key to `pt.json` (natural Brazilian Portuguese, not European).
4. Add the same key to `es.json` (professional Latin-American Spanish).
5. Reference the key from the calling component: `useTranslations("namespace")` / `getTranslations("namespace")`.
6. Run `npm run qa` — the typecheck and lint gates will catch missing imports.

## How to add a new locale

1. Add the locale code to `src/i18n/routing.ts` (`locales` array).
2. Create `messages/<code>.json` with the same top-level structure as `en.json`.
3. Update `src/i18n/navigation.ts` types if the locale switcher needs awareness.
4. Add a label under `locale.<code>` in **all** existing bundles.
5. Update `.agents/rules/i18n.md` if your conventions differ from en/pt/es.
6. Run `npm run qa` and `npm run qa:visual` to sweep every route × locale combination.

## References

- next-intl docs: https://next-intl.dev
- `.agents/rules/i18n.md` — the rule sheet (key naming, routing, formatter usage).
- `src/i18n/routing.ts` — locale list, default, prefix strategy.
- `src/i18n/request.ts` — per-request config loader.
- `src/i18n/navigation.ts` — locale-aware `Link`, `redirect`, `useRouter`.
