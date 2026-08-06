"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CurrencyInput } from "@/src/components/currency-input";
import { PhoneInput } from "@/src/components/phone-input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";

const messages = {
  common: {
    currency_invalid_khr: "Digits only — KHR amounts have no decimals",
    phone_invalid_kh: "Digits only, max 10",
  },
};

type Entry = { t: string; msg: string };

export default function Playground() {
  const form = useForm({ defaultValues: { amount: 0, phone: "" } });
  const [log, setLog] = useState<Entry[]>([]);
  const push = (msg: string) =>
    setLog((l) =>
      [{ t: new Date().toLocaleTimeString(), msg }, ...l].slice(0, 15),
    );

  // Every write into the form store lands here — keystrokes and resets alike.
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => push(`store -> ${JSON.stringify(values)}`),
      }),
    [form],
  );

  const amount = useWatch({ control: form.control, name: "amount" });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <main className="mx-auto max-w-xl p-8 font-sans flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          CurrencyInput lifecycle playground
        </h1>

        <form
          onSubmit={form.handleSubmit((data) =>
            push(
              `submit -> ${JSON.stringify(data)} (typeof amount: ${typeof data.amount})`,
            ),
          )}
        >
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="amount"
              rules={{
                validate: (v) => v <= 10_000_000 || "Max 10,000,000 KHR",
              }}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="phone"
              rules={{
                validate: (v) =>
                  v === "" || v.length >= 8 || "Enter at least 8 digits",
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <PhoneInput
                    id={field.name}
                    placeholder="12 345 678"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldDescription>Cambodian mobile number.</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded border px-3 py-1 text-sm"
              >
                Submit
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1 text-sm"
                onClick={() => {
                  push("reset() -> 0");
                  form.reset();
                }}
              >
                reset()
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1 text-sm"
                onClick={() => {
                  push("async defaults in 800ms…");
                  setTimeout(() => {
                    push("reset({ amount: 1234567, phone: '12345678' })");
                    form.reset({ amount: 1234567, phone: "12345678" });
                  }, 800);
                }}
              >
                async defaults
              </button>
            </div>
          </FieldGroup>
        </form>

        <div className="rounded border p-4 text-sm">
          <p>
            form value:{" "}
            <code className="font-mono">{JSON.stringify(amount)}</code> (typeof{" "}
            <code className="font-mono">{typeof amount}</code>)
          </p>
        </div>

        <div className="rounded border p-4 text-sm">
          <p className="mb-2 font-medium">event log (newest first)</p>
          <ul className="font-mono text-xs flex flex-col gap-1">
            {log.map((e, i) => (
              <li key={i}>
                {e.t} {e.msg}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </NextIntlClientProvider>
  );
}
