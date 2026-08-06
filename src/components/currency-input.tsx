"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import {
  typingRegex,
  parseCurrency,
  formatCurrency,
} from "../lib/currency-input-util";

type CurrencyInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value: number;
  onChange: (value: number) => void;
};

export function CurrencyInput({
  value,
  onChange,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: CurrencyInputProps) {
  const t = useTranslations("common");
  const errorId = React.useId();

  // Two representations: `raw` (digit string) drives the display,
  // `value` (number) is what the owner of this component holds.
  const [raw, setRaw] = React.useState(value ? String(value) : "");
  const [error, setError] = React.useState(false);

  // "Adjust state during render" — value changed externally (reset, async
  // defaults). The parseCurrency guard skips the echo of our own onChange,
  // so an in-progress "007" isn't clobbered back to "7".
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== parseCurrency(raw)) {
      setRaw(value ? String(value) : "");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/,/g, "");

    console.log("handleChange", e);
    if (!typingRegex.test(digits)) {
      setError(true);
      return; // no setRaw -> React restores the controlled value; the bad char never lands
    }
    setError(false);
    setRaw(digits);
    onChange(parseCurrency(digits));
  }

  return (
    <div>
      <InputGroup>
        <InputGroupInput
          {...props}
          type="text"
          inputMode="numeric"
          value={formatCurrency(raw)}
          onChange={handleChange}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={[ariaDescribedBy, errorId]
            .filter(Boolean)
            .join(" ")}
        />
        <InputGroupAddon>KHR</InputGroupAddon>
      </InputGroup>
      {/* Always rendered so aria-live announces the message when it appears */}
      <p id={errorId} aria-live="polite" className="text-sm text-red-600">
        {error ? t("currency_invalid_khr") : null}
      </p>
    </div>
  );
}

