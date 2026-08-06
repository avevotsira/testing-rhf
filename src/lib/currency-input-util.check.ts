// @ts-nocheck -- .ts import extension is required by node --experimental-strip-types
// Self-check: node --experimental-strip-types src/lib/currency-input-util.check.ts
import assert from "node:assert";
import { typingRegex, parseCurrency, formatCurrency } from "./currency-input-util.ts";

assert(typingRegex.test(""));
assert(typingRegex.test("007"));
assert(!typingRegex.test("12a"));
assert(!typingRegex.test("1,234"));

assert.strictEqual(parseCurrency(""), 0);
assert.strictEqual(parseCurrency("garbage"), 0);
assert.strictEqual(parseCurrency("1234567"), 1234567);
assert.strictEqual(parseCurrency("007"), 7);
assert(Number.isInteger(parseCurrency("")));

assert.strictEqual(formatCurrency(""), "");
assert.strictEqual(formatCurrency("1"), "1");
assert.strictEqual(formatCurrency("123"), "123");
assert.strictEqual(formatCurrency("1234"), "1,234");
assert.strictEqual(formatCurrency("1234567"), "1,234,567");
assert.strictEqual(formatCurrency("0071234"), "0,071,234"); // leading zeros survive mid-typing

console.log("currency-input-util: all checks passed");
