# Forms

## Stack

- `react-hook-form` for form state
- `zod` for schema
- `@hookform/resolvers/zod` to glue them
- shadcn `form` component for layout
- Server Actions or Route Handlers receive the parsed payload

## Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});

type FormValues = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "" },
  });

  async function onSubmit(values: FormValues) {
    const res = await myServerAction(values);
    if (!res.ok) form.setError("root", { message: res.error });
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

## Rules

- ALWAYS parse with the SAME zod schema on the server side too. Client validation ≠ trust.
- Server Actions must return a typed `{ ok: true, data } | { ok: false, error }` shape.
- Error messages: human-readable; never expose stack traces.
- Disable submit while pending: `disabled={form.formState.isSubmitting}`.
