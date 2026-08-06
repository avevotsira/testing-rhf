This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Form field pattern

Forms follow the current [shadcn/ui react-hook-form pattern](https://ui.shadcn.com/docs/forms/react-hook-form):
a [react-hook-form](https://react-hook-form.com) store as the single source of
truth, **pure input components** that know nothing about the form, and shadcn's
`Field*` components for layout — wiring is explicit via `Controller`.

```
src/components/ui/field.tsx     shadcn field.tsx (Field, FieldLabel, FieldError,
                                FieldDescription, FieldGroup, …) — verbatim clone
src/components/currency-input.tsx   pure input: value/onChange props only
src/lib/currency-input-util.ts      pure helpers: parse / format / typingRegex
src/components/phone-input.tsx      second sample — form value IS the raw string,
                                    so no local raw state / render-sync needed
src/lib/phone-input-util.ts         pure helper: formatPhone
app/page.tsx                        usage example (lifecycle playground)
```

### Usage

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Controller
    control={form.control}
    name="amount"
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
        <CurrencyInput
          id={field.name}
          placeholder="0"
          aria-invalid={fieldState.invalid}
          {...field}
        />
        <FieldDescription>Amount in Khmer Riel.</FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
</form>
```

Unlike the older `FormField`/`FormControl` layer, nothing is injected through
context or `Slot` — `id`, `aria-invalid`, and the `{...field}` wiring
(`value`, `onChange`, `onBlur`, `name`, `ref`) are all visible at the call
site. The input never imports react-hook-form or shadcn.

### Rules for writing a new input component

A pass-through input needs only rules 1 and 6. Rules 2–5 kick in once the
component transforms the value or rejects keystrokes.

1. **Stay a pipe unless you transform.** If the input shows the form value
   as-is, do NOT declare `value`/`onChange` — spread `{...props}` onto
   `<input>` and let `{...field}` flow through untouched (this is what
   shadcn's own `Input` does). Only name `value` and `onChange` when the
   component must convert between them (number ↔ formatted string), like
   `CurrencyInput`. Either way: own no form state, and the form only ever
   receives clean data (`CurrencyInput` always emits an integer, never a
   string or `NaN`).
2. **Display ≠ data.** If the box shows a formatted string ("1,234,567"), keep
   the raw string in local state and derive the display. Parse the raw string
   for `onChange`; never parse the formatted one.
3. **React to external writes** (`form.reset()`, async defaults) with the
   ["adjust state during render"](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
   pattern, not `useEffect`. Guard with a value comparison so your own
   `onChange` echo doesn't clobber in-progress typing.
4. **Reject bad keystrokes by not updating state.** A controlled input snaps
   back to the rendered value automatically; no `preventDefault` needed.
5. **Merge, don't overwrite, aria props.** Append your local error id to any
   `aria-describedby` passed by the caller; OR your local error into
   `aria-invalid`. Render the error `<p>` unconditionally with
   `aria-live="polite"`.
6. **Forward everything else** (`id`, `placeholder`, `ref`, …) onto the real
   `<input>`. Use `type="text"` + `inputMode="numeric"` for numbers —
   `type="number"` fights formatted display and fires `onChange` with empty
   strings for partial input.

Two error channels, two owners: keystroke-level errors (invalid character)
belong to the input and show inline; form-level errors (validation `rules`,
schema) belong to react-hook-form and surface through `<FieldError />`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
