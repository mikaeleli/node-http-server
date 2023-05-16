import { expect, test, describe } from "vitest";
import { complexMath, mathLexer, simpleStringMath } from "./math";

describe(simpleStringMath.name, () => {
  test("simple addition", () => {
    const equation = "1 + 51";
    const result = simpleStringMath(equation);

    expect(result).toBe(52);
  });

  test("simple subtraction", () => {
    const equation = "20 - 3";
    const result = simpleStringMath(equation);

    expect(result).toBe(17);
  });

  test("addition and subtraction", () => {
    const equation = "1 + 20 - 3 + 4";
    const result = simpleStringMath(equation);

    expect(result).toBe(22);
  });

  test("simple multiplication", () => {
    const equation = "2 * 3";
    const result = simpleStringMath(equation);

    expect(result).toBe(6);
  });

  test("simple division", () => {
    const equation = "20 / 2";
    const result = simpleStringMath(equation);

    expect(result).toBe(10);
  });
});

describe(mathLexer.name, () => {
  test("simple addition", () => {
    const equation = "1 + 4";
    const result = mathLexer(equation);

    expect(result).toEqual([
      { type: "number", value: "1" },
      { type: "operator", value: "+" },
      { type: "number", value: "4" },
    ])
  })

  test("simple addition with big numbers", () => {
    const equation = "192 + 418";
    const result = mathLexer(equation);

    expect(result).toEqual([
      { type: "number", value: "192" },
      { type: "operator", value: "+" },
      { type: "number", value: "418" },
    ])
  })

  test("with simple parenthesis", () => {
    const equation = "6 * (2 + 3)";
    const result = mathLexer(equation);

    expect(result).toEqual([
      { type: "number", value: "6" },
      { type: "operator", value: "*" },
      {
        type: "nested",
        nestedTokens: [
          { type: "number", value: "2" },
          { type: "operator", value: "+" },
          { type: "number", value: "3" },
        ],
      },
    ]);
  });

  test("with two parenthesis", () => {
    const equation = "6 * (2 + 3) / (3 - 1)";
    const result = mathLexer(equation);

    expect(result).toEqual(
      [
        { type: "number", value: "6" },
        { type: "operator", value: "*" },
        {
          type: "nested",
          nestedTokens: [
            { type: "number", value: "2" },
            { type: "operator", value: "+" },
            { type: "number", value: "3" },
          ],
        },
        { type: "operator", value: "/" },
        {
          type: "nested",
          nestedTokens: [
            { type: "number", value: "3" },
            { type: "operator", value: "-" },
            { type: "number", value: "1" },
          ]
        }
      ]
    )
  });

  test("with nested parenthesis", () => {
    const equation = "(16 + (22 - 3)) * 3";
    const result = mathLexer(equation);

    expect(result).toEqual([
      {
        type: "nested",
        nestedTokens: [
          { type: "number", value: "16" },
          { type: "operator", value: "+" },
          {
            type: "nested",
            nestedTokens: [
              { type: "number", value: "22" },
              { type: "operator", value: "-" },
              { type: "number", value: "3" },
            ],
          },
        ]
      },
      { type: "operator", value: "*" },
      { type: "number", value: "3" },
    ])
  });
});

describe(complexMath.name, () => {
  test("with simple parenthesis", () => {
    const equation = "(1 + 2) * 3";
    const result = complexMath(equation);

    expect(result).toBe(9);
  });

  test("with more simple parenthesis", () => {
    const equation = "(1 + 2)";
    const result = complexMath(equation);

    expect(result).toBe(3);
  });

  test("should error when parenthesis are not closed", () => {
    const equation = "(1 + 2";
    expect(() => complexMath(equation)).toThrowError(
      "Error: Parenthesis not closed"
    );
  });

  test("with two parenthesis", () => {
    const equation = "(1 + 2) * (3 - 1)";
    const result = complexMath(equation);

    expect(result).toBe(6);
  });

  test("with nested parenthesis", () => {
    const equation = "(16 + (22 - 3)) * 3";
    const result = complexMath(equation);

    expect(result).toBe(105);
  });

  // This test fails due to incorrect order of operations
  // Current implementation supports parenthesis but otherwise will calculate left to right
  test("with multiple parenthesis", () => {
    const equation = "(11 + 22) * 3 + (1 + 2) * 3";
    const result = complexMath(equation);

    expect(result).toBe(108);
  });
});
