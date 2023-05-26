import { describe, expect, test } from "vitest";
import { MathParser } from "./parser";

const parser = new MathParser();

describe(MathParser.name, () => {
  describe("Addition & subtraction", () => {
    test("16", () => {
      const result = parser.parse("16");
      expect(result).toEqual({
        type: "number",
        value: 16,
      });
    });

    test("16 + 16", () => {
      const result = parser.parse("16 + 16");
      expect(result).toEqual({
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "number",
          value: 16,
        },
        right: {
          type: "number",
          value: 16,
        },
      });
    });

    test("12 + 15 - 16", () => {
      const result = parser.parse("12 + 15 - 16");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 12,
          },
          operator: "+",
          right: {
            type: "number",
            value: 15,
          },
        },
        operator: "-",
        right: {
          type: "number",
          value: 16,
        },
      });
    });
  });

  describe("Multipication & division", () => {
    test("12 * 15", () => {
      const result = parser.parse("12 * 15");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "number",
          value: 12,
        },
        operator: "*",
        right: {
          type: "number",
          value: 15,
        },
      });
    });

    test("12 * 15 / 16", () => {
      const result = parser.parse("12 * 15 / 16");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 12,
          },
          operator: "*",
          right: {
            type: "number",
            value: 15,
          },
        },
        operator: "/",
        right: {
          type: "number",
          value: 16,
        },
      });
    });
  });

  describe("addition and multiplication", () => {
    test.skip("12 + 16 * 15 / 16", () => {
      const result = parser.parse("12 + 16 * 15 / 16");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "number",
          value: 12,
        },
        operator: "+",
        right: {
          type: "BinaryExpression",
          left: {
            type: "BinaryExpression",
            left: {
              type: "number",
              value: 16,
            },
            operator: "*",
            right: {
              type: "number",
              value: 15,
            },
          },
          operator: "/",
          right: {
            type: "number",
            value: 16,
          },
        },
      });
    });

    test("1 * 2 + 3 / 16", () => {
      const result = parser.parse("1 * 2 + 3 / 16");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 1,
          },
          operator: "*",
          right: {
            type: "number",
            value: 2,
          },
        },
        operator: "+",
        right: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 3,
          },
          operator: "/",
          right: {
            type: "number",
            value: 16,
          },
        },
      });
    });
  });

  describe("parenthesis", () => {
    test("(1 + 2) * 3", () => {
      const result = parser.parse("(1 + 2) * 3");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 1,
          },
          operator: "+",
          right: {
            type: "number",
            value: 2,
          },
        },
        operator: "*",
        right: {
          type: "number",
          value: 3,
        },
      });
    });

    test("1 * (2 + 3)", () => {
      const result = parser.parse("1 * (2 + 3)");
      expect(result).toEqual({
        type: "BinaryExpression",
        left: {
          type: "number",
          value: 1,
        },
        operator: "*",
        right: {
          type: "BinaryExpression",
          left: {
            type: "number",
            value: 2,
          },
          operator: "+",
          right: {
            type: "number",
            value: 3,
          },
        },
      });
    });
  });
});
