# `emails/` — react-email preview entry points

Re-export wrappers consumed by [react-email](https://react.email) for the preview server (`npm run email:dev`). The actual email templates live in `src/lib/email/templates/` so they share the `@/*` alias and Vitest config with the rest of `src/`.

This directory exists because `react-email dev --dir emails` needs a flat directory of `.tsx` files to mount. Wrapping each real template here keeps the source canonical and the preview entry decoupled.

## Files

| File          | Re-exports from                 | Purpose                                                    |
| ------------- | ------------------------------- | ---------------------------------------------------------- |
| `welcome.tsx` | `@/lib/email/templates/welcome` | Welcome email rendered after user signup. Sent via Resend. |

## Two layers, one template

```text
src/lib/email/templates/welcome.tsx   <-- canonical: edit here
emails/welcome.tsx                    <-- preview entry: re-export only
```

When you edit the body of an email, edit the file under `src/lib/email/templates/`. Never paste content into the file in this directory — drift is silent and the preview can disagree with what Resend sends.

## How to use

### Preview locally

```bash
npm run email:dev
# opens http://localhost:3000 (react-email's own dev server)
```

The preview server renders every `.tsx` in this directory using its default export.

### Send via Resend

```ts
// In a server action or route handler:
import { resend } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome";

await resend.emails.send({
  from: "Your App <hello@yourdomain.com>",
  to: user.email,
  subject: "Welcome!",
  react: WelcomeEmail({ name: user.fullName }),
});
```

Requires `RESEND_API_KEY` and `EMAIL_FROM` set in the environment (see `src/env.ts`).

## How to add a new template

1. Create the canonical file: `src/lib/email/templates/<kebab-name>.tsx`. Export a named component and `default`.
2. Create the preview entry here: `emails/<kebab-name>.tsx` with the same one-line re-export as `welcome.tsx`.
3. Update this README's "Files" table.
4. Run `npm run email:dev` and visually verify in light + dark email clients (Gmail, Outlook, Apple Mail) as needed.
5. Wire the template into the send-site (server action, route handler, or background job).

## References

- react-email docs: https://react.email
- Resend docs: https://resend.com/docs
- `src/lib/email/resend.ts` — the Resend client.
- `src/lib/email/templates/` — canonical templates.
- `.env.example` — `RESEND_API_KEY`, `EMAIL_FROM`.
