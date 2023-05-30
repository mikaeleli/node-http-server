import { describe, expect, test } from "vitest";
import { math } from "./evaluate";

describe(math.name, () => {
  test("16", () => {
    const result = math("16");
    expect(result).toEqual(16);
  });

  test("16 + 16", () => {
    const result = math("16 + 16");
    expect(result).toEqual(32);
  });

  test("12 + 15 - 16", () => {
    const result = math("12 + 15 - 16");
    expect(result).toEqual(11);
  });

  test("12 * 15", () => {
    const result = math("12 * 15");
    expect(result).toEqual(180);
  });

  test("12 * 15 / 3", () => {
    const result = math("12 * 15 / 3");
    expect(result).toEqual(60);
  });

  test("12 * 15 / 3 + 2", () => {
    const result = math("12 * 15 / 3 + 2");
    expect(result).toEqual(62);
  });
});
