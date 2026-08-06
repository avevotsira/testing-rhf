// @ts-nocheck -- .ts import extension is required by node --experimental-strip-types
// Self-check: node --experimental-strip-types src/lib/phone-input-util.check.ts
import assert from "node:assert";
import { formatPhone } from "./phone-input-util.ts";

assert.strictEqual(formatPhone(""), "");
assert.strictEqual(formatPhone("12"), "12");
assert.strictEqual(formatPhone("123"), "123");
assert.strictEqual(formatPhone("1234"), "123 4");
assert.strictEqual(formatPhone("12345678"), "123 456 78");
assert.strictEqual(formatPhone("123456789"), "123 456 789");

console.log("phone-input-util: all checks passed");
