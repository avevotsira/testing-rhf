"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { CurrencyInput } from "@/src/components/currency-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

const messages = {
  common: {
    currency_invalid_khr: "Digits only — KHR amounts have no decimals",
  },
};

type Entry = { t: string; msg: string };

export default function Playground() {
  const form = useForm({ defaultValues: { amount: 0 } });
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              push(
                `submit -> ${JSON.stringify(data)} (typeof amount: ${typeof data.amount})`,
              ),
            )}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="amount"
              rules={{
                validate: (v) => v <= 10_000_000 || "Max 10,000,000 KHR",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Amount in Khmer Riel.</FormDescription>
                  <FormMessage />
                </FormItem>
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
                    push("reset({ amount: 1234567 })");
                    form.reset({ amount: 1234567 });
                  }, 800);
                }}
              >
                async defaults
              </button>
            </div>
          </form>
        </Form>

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
