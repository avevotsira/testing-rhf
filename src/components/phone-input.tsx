"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { typingRegex } from "../lib/currency-input-util";
import { formatPhone } from "../lib/phone-input-util";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  value: string;
  onChange: (value: string) => void;
};

// Second sample of the README form-field pattern. Contrast with CurrencyInput:
// the form value IS the raw digit string, so there is no local `raw` state and
// no adjust-during-render sync — the display is derived from `value` directly,
// and external resets just work.
export function PhoneInput({
  value,
  onChange,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: PhoneInputProps) {
  const t = useTranslations("common");
  const errorId = React.useId();
  const [error, setError] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/ /g, "");
    if (!typingRegex.test(digits) || digits.length > 10) {
      setError(true);
      return; // no state/form write -> controlled input snaps back, bad char never lands
    }
    setError(false);
    onChange(digits);
  }

  return (
    <div>
      <InputGroup>
        <InputGroupAddon>+855</InputGroupAddon>
        <InputGroupInput
          {...props}
          type="text"
          inputMode="numeric"
          value={formatPhone(value)}
          onChange={handleChange}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={[ariaDescribedBy, errorId]
            .filter(Boolean)
            .join(" ")}
        />
      </InputGroup>
      {/* Always rendered so aria-live announces the message when it appears */}
      <p id={errorId} aria-live="polite" className="text-sm text-red-600">
        {error ? t("phone_invalid_kh") : null}
      </p>
    </div>
  );
}
